import Project from '../models/ProjectModel.js';
import Client from '../models/ClientModel.js';
import User from '../models/UserModel.js';
import { createNotification } from './NotificationController.js';
import mongoose from 'mongoose';

export const createProject = async (req, res) => {
  console.log("Request body:", req.body);
  try {
    const {
      projectName,
      status,
      subcategory,
      projectType,
      clientDueDate,
      opsDueDate,
      initialAmount,
      totalAmount,
      remainingAmount,
      description,
      clientPermanentNotes,
      rfiAddendum,
      clientType,
      estimatorLink,
      projectLink,
      template,
      clientDetails, // Client data if it's a new client
      selectedClientId, // Selected client if it's an old client
      creator,
    } = req.body;

    console.log("Destructured request body:", {
      projectName,
      status,
      subcategory,
      projectType,
      clientDueDate,
      opsDueDate,
      initialAmount,
      totalAmount,
      remainingAmount,
      clientPermanentNotes,
      rfiAddendum,
      description,
      clientType,
      estimatorLink,
      projectLink,
      template,
      clientDetails,
      selectedClientId,
      creator,
    });

    if (!creator) {
      console.log("Creator ID is missing");
      return res.status(400).json({ message: "Creator ID is required" });
    }

    let client;

    if (clientType === "new") {
      if (!clientDetails || !clientDetails.email) {
        console.log("New client details are missing or email is empty");
        return res.status(400).json({
          message: "Client details with email are required for new client",
        });
      }

      // Check if the client already exists
      console.log(
        "Checking for existing client with email:",
        clientDetails.email
      );
      const existingClient = await Client.findOne({
        email: clientDetails.email,
      });
      if (existingClient) {
        console.log("Client already exists with email:", clientDetails.email);
        return res
          .status(400)
          .json({ message: "Client with this email already exists" });
      }

      // Create a new client
      client = new Client(clientDetails);
      console.log("Saving new client:", client);
      await client.save();
      console.log("New client saved:", client);
    } else if (clientType === "old") {
      if (!selectedClientId) {
        console.log("Selected client ID is missing");
        return res.status(400).json({
          message: "Selected client ID is required for existing client",
        });
      }

      console.log("Fetching client with ID:", selectedClientId);
      client = await Client.findById(selectedClientId);
      if (!client) {
        console.log("Client not found with ID:", selectedClientId);
        return res.status(404).json({ message: "Client not found" });
      }
    } else {
      console.log("Invalid client type:", clientType);
      return res.status(400).json({ message: "Invalid client type" });
    }

    // Create the project and link it to the client
    const newProject = new Project({
      projectName,
      status,
      subcategory,
      projectType,
      clientDueDate,
      opsDueDate,
      description,
      initialAmount,
      totalAmount,
      remainingAmount,
      clientPermanentNotes,
      rfiAddendum,
      clientType,
      projectLink,
      estimatorLink,
      template,
      client: client._id,
      creator,
    });

    console.log("Saving new project:", newProject);
    await newProject.save();
    console.log("New project saved:", newProject);

    // Fetch and return the updated project list with the new project at the top
    const projects = await Project.find().sort({ createdAt: -1 });

    // Notify admins
    console.log("Fetching admin users");
    const admins = await User.find({ role: "admin" });
    console.log("Found admins:", admins);
    await Promise.all(
      admins.map((admin) =>
        createNotification(
          admin._id,
          `A new project (${newProject.projectName}) has been created. Click to view.`
        )
      )
    );
    console.log("Notifications sent");

    res.status(201).json({
      message: "Project created successfully",
      data: newProject,
      projects,
    });
  } catch (error) {
    console.error("Error during project creation:", error);
    res
      .status(500)
      .json({ message: "Error creating project", error: error.message });
  }
};

// Update a project by ID
// Update a project by ID
export const updateProject = async (req, res) => {
  try {
    const { members } = req.body;
    console.log("Members received for update:", members);

    // Find the project by ID to ensure it exists
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // If members are provided, validate them
    if (members && members.length > 0) {
      const validEmployees = await User.find({ _id: { $in: members }, role: 'employee' });
      if (validEmployees.length !== members.length) {
        return res.status(400).json({ message: 'Some selected members are not valid employees' });
      }

      // Identify new members who are being added to the project
      const existingMembers = project.members || [];
      const newMembers = members.filter(member => !existingMembers.includes(member));

      // Notify new members about their addition to the project
      await Promise.all(
        newMembers.map(async (memberId) => {
          const member = await User.findById(memberId);
          if (member && member.role === 'employee') {
            // Create a notification for the employee
            await createNotification(
              memberId,
              `You have been added to the project: ${project.projectName}. Click to view.`
            );
            console.log(`Notification sent to employee: ${memberId}`);
          }
        })
      );
    }

    // Update the project, even if the members array is empty
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { ...req.body, members: members || [] }, // Use an empty array if members is undefined or null
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({ message: 'Project updated successfully', data: updatedProject });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Error updating project', error: error.message });
  }
};


export const getEmployeeProjects = async (req, res) => {
  try {
    const { employeeId } = req.params;

    // Check if the user exists and has the role of 'employee'
    const employee = await User.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    if (employee.role !== 'employee') {
      return res.status(400).json({ message: 'User is not an employee' });
    }

    // Find projects where the employee is listed in the members array
    const projects = await Project.find({ members: employeeId }).select('projectName description');

    if (projects.length === 0) {
      return res.status(404).json({ message: 'No projects found for this employee' });
    }

    res.status(200).json({ data: projects });
  } catch (error) {
    console.error('Error fetching employee projects:', error.message);
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
};


// Fetch existing clients for selection
export const getClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.status(200).json({ clients });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching clients", error: error.message });
  }
};

// Get all projects
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("client", "name") // Adjust this according to your schema
      .sort({ createdAt: -1 }) // Sort projects by creation date in descending order
      .exec();
    console.log("Sorted projects:", projects); // Log the sorted projects
    res.json({ data: projects });
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects", error });
  }
};

// Get a single project by ID with client details
export const getProjectByID = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "client",
      "name"
    );
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({ data: project });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching project", error: error.message });
  }
};

// Get a single project by ID
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({ data: project });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching project", error: error.message });
  }
};



// Delete a project by ID
export const deleteProject = async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (!deletedProject) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting project", error: error.message });
  }
};

// Controller to update adminStatus
export const updateAdminStatus = async (req, res) => {
  const { projectId } = req.params;
  const { adminStatus } = req.body;

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.adminStatus = adminStatus;
    await project.save();

      res.status(200).json({ message: 'Admin status updated successfully', project });
    } catch (error) {
      res.status(500).json({ message: 'Error updating admin status', error });
    }
  };


  // Controller to count the number of projects by adminStatus for a specific user
export const countUserAdminStatus = async (req, res) => {
  const { userId } = req.params;  // Get the userId from request params

  try {
    // Use MongoDB's aggregation framework to group by adminStatus and count each status
    const statusCounts = await Project.aggregate([
      { $match: { members: new mongoose.Types.ObjectId(userId)
      } },  // Filter projects assigned to this user
      {
        $group: {
          _id: '$adminStatus',  // Group by the adminStatus field
          count: { $sum: 1 }    // Count each occurrence
        }
      }
    ]);

    // Get the total number of projects for this user
    const totalProjects = await Project.countDocuments({ members: new mongoose.Types.ObjectId(userId)
    });

    // Return both the status counts and the total number of projects
    res.status(200).json({
      statusCounts,
      totalProjects,
    });
  } catch (error) {
    console.error('Error counting admin statuses for user:', error);
    res.status(500).json({ message: 'Failed to count admin statuses for the user' });
  }
};

// Controller to get projects with "Approved" status
// Function to strip HTML tags
const stripHtmlTags = (text) => {
  return text.replace(/<[^>]*>?/gm, '');
};

export const getApprovedProjects = async (req, res) => {
  try {
    // Fetch all projects where status is 'Approved'
    let approvedProjects = await Project.find({ status: 'Approved' });

    // Remove HTML tags from the description of each project
    approvedProjects = approvedProjects.map(project => ({
      ...project._doc,  // Spread the existing project fields
      description: stripHtmlTags(project.description)  // Strip HTML tags from description
    }));

    // Return the list of approved projects with cleaned descriptions
    res.status(200).json(approvedProjects);
  } catch (error) {
    console.error('Error fetching approved projects:', error);
    res.status(500).json({ message: 'Error fetching approved projects', error: error.message });
  }
};