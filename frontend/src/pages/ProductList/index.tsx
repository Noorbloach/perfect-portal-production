import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import clsx from "clsx";
import Button from "@/components/Base/Button";
import Pagination from "@/components/Base/Pagination";
import { FormInput, FormSelect } from "@/components/Base/Form";
import Lucide from "@/components/Base/Lucide";
import Table from "@/components/Base/Table";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import fakerData from "@/utils/faker";
import _ from "lodash";
import Tippy from "@/components/Base/Tippy";

import EditProjectModal from "./EditProjectModal";
import ViewProjectModal from "./ViewProjectModal";

interface Project {
  _id: string;
  projectName: string;
  status:
    | "ETA"
    | "Proposal Sent"
    | "Approved"
    | "Rejected"
    | "Project Started"
    | "Project Rejected";
  adminStatus:
    | "Pending"
    | "Takeoff In Progress"
    | "Pending In Progress"
    | "Completed"
    | "On Hold"
    | "Revision";
  subcategory: "Geoglyphs" | "Stellar" | "Perfect";
  projectType: "Residential" | "Commercial" | "Industrial";
  clientDueDate: Date;
  opsDueDate: Date;
  initialAmount: number;
  totalAmount: number;
  remainingAmount: number;
  clientPermanentNotes: string;
  projectLink: string;
  estimatorLink: string;
  template: string;
  rfiAddendum: string;
  description: string;
  clientType: "New" | "Old";
  createdAt: Date;
  client: {
    _id: string;
    name: string;
  };
  creator: string;
  members: string[];
  enterpriseName: string;
}

interface DecodedToken {
  role: string; // Expecting a string role from the JWT token
}

interface Employee {
  _id: string; // Assuming employees have an ID
  name: string; // Employee name
}

function Main() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [role, setRole] = useState<string>(""); // State to track if the user is admin
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterType, setFilterType] = useState<string | null>(null); // State to track the filter type
  const [statusFilter, setStatusFilter] = useState<string>(""); // State for status filter
  const [employees, setEmployees] = useState<Employee[]>([]);

  const statuses = [
    "Pending",
    "Takeoff In Progress",
    "Pending In Progress",
    "Completed",
    "On Hold",
    "Revision",
  ];
  // const projectTypes = ['Residential', 'Commercial', 'Industrial'];

  // Utility function to ensure URL has a protocol
  const ensureProtocol = (url: string) => {
    // If the URL starts with "http://" or "https://", return it as is
    if (/^https?:\/\//i.test(url)) {
      return url;
    }
    // Otherwise, prepend "http://" to the URL
    return `http://${url}`;
  };

  // Decode JWT to check if the user is an admin
  useEffect(() => {
    const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        setRole(decoded.role); // Set role directly based on decoded token
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_REACT_APP_API_BASE_URL
          }/api/auth/users/role/employee`
        ); // Adjust endpoint as necessary
        console.log(response.data);
        setEmployees(response.data); // Assuming the response contains the employee data
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  // Function to get member names based on member IDs
  const getMemberNames = (memberIds: string[]) => {
    return memberIds.map((memberId) => {
      const employee = employees.find((emp) => emp._id === memberId);
      return employee ? employee.name : memberId; // Return name or ID if not found
    });
  };

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/projects`
        );
        const projectData = response.data.data;
        if (Array.isArray(projectData)) {
          setProjects(projectData);
        } else {
          console.error("Unexpected data format:", projectData);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleDeleteClick = async (projectId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(
          `${
            import.meta.env.VITE_REACT_APP_API_BASE_URL
          }/api/projects/${projectId}`
        );
        // Update the projects state by filtering out the deleted project
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project._id !== projectId)
        );
        alert("Project deleted successfully.");
      } catch (error) {
        console.error("Error deleting project:", error);
        alert("Failed to delete project.");
      }
    }
  };

  const handleStatusFilterChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(event.target.value);
    console.log("Selected Status Filter:", event.target.value); // Debugging output
  };

  // Filter projects based on the selected status
  const filteredProjects = statusFilter
    ? projects.filter((project) => project.adminStatus === statusFilter)
    : projects;

  console.log("Filtered Projects:", filteredProjects);

  useEffect(() => {
    console.log("Projects:", projects); // Debugging output
  }, [projects]);

  const handleAdminStatusChange = async (
    event: ChangeEvent<HTMLSelectElement>,
    projectId: string
  ) => {
    const newAdminStatus = event.target.value as
      | "Pending"
      | "Takeoff In Progress"
      | "Pending In Progress"
      | "Completed"
      | "On Hold"
      | "Revision"; // Type assertion

    try {
      await axios.put(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/api/projects/${projectId}/admin-status`,
        {
          adminStatus: newAdminStatus,
        }
      );

      // Update the project in the state
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project._id === projectId
            ? { ...project, adminStatus: newAdminStatus }
            : project
        )
      );

      alert("Project admin status updated successfully.");
    } catch (error) {
      console.error("Error updating admin status:", error);
      alert("Failed to update admin status.");
    }
  };

  // Function to open the edit modal and fetch project details
  const handleEditClick = async (projectId: string) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/api/projects/${projectId}`
      );
      const projectData = response.data.data;
      setSelectedProject(projectData);
      setEditModalOpen(true);
    } catch (error) {
      console.error("Error fetching project details:", error);
    }
  };

  // Function to open the view modal and fetch project details
  const handleViewClick = async (projectId: string) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/api/projects/${projectId}`
      );
      const projectData = response.data.data;
      setSelectedProject(projectData);
      setViewModalOpen(true);
    } catch (error) {
      console.error("Error fetching project details:", error);
    }
  };

  // Function to handle project update
  const handleUpdate = async () => {
    // This function is called after the project is updated
    const fetchUpdatedProject = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/projects/${
            selectedProject._id
          }`
        );
        setProjects((prevProjects) =>
          prevProjects.map((p) =>
            p._id === selectedProject._id ? selectedProject : p
          )
        );
        setEditModalOpen(false);
      } catch (error) {
        console.error("Error fetching updated project:", error);
      }
    };

    fetchUpdatedProject();
  };

  // Handle input change for the form
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (selectedProject) {
      setSelectedProject({
        ...selectedProject,
        [e.target.name]: e.target.value,
      });
    }
  };

  // Handle search input change
  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle project type filter change
  const handleFilterTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedType = e.target.value;
    setFilterType(selectedType !== "All" ? selectedType : null);
  };
  const isFieldDisabled = role === "employee";

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  let currentProjects = filteredProjects;

  if (searchTerm.trim() !== "") {
    currentProjects = currentProjects.filter((project) =>
      project.projectName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  currentProjects = currentProjects.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const endIndex = Math.min(startIndex + itemsPerPage, filteredProjects.length);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h2 className="mt-10 text-lg font-medium intro-y">Project List</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
          {(role === "superadmin" || role === "management") && (
            <Button
              variant="primary"
              className="mr-2 shadow-md"
              onClick={() => navigate("/add-product")}
            >
              Add New Project
            </Button>
          )}

          <div className="hidden mx-auto md:block text-slate-500">
            Showing {startIndex + 1} to {endIndex} of {filteredProjects.length}{" "}
            entries
          </div>
          <div className="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
            <div className="relative w-56 text-slate-500">
              <FormInput
                type="text"
                className="w-56 pr-10 !box"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchInputChange}
              />
              <Lucide
                icon="Search"
                className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
              />
            </div>
          </div>
          <div className="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-2 md:ml-2">
            {/* <FormSelect
              value={filterType || "All"}
              onChange={handleFilterTypeChange}
              className="w-36 !box"
            >
              <option value="All">All Types</option>
              {projectTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </FormSelect> */}
          </div>
        </div>
        <div className="col-span-12 overflow-auto intro-y lg:overflow-visible">
          <div className="overflow-x-auto">
            {" "}
            {/* Wrapper to allow horizontal scrolling */}
            <Table className="border-spacing-y-[10px] border-separate -mt-2 w-full">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th className=" text-center border-b-0 whitespace-nowrap">
                    Project Title
                  </Table.Th>
                  {(role === "superadmin" || role === "management") && (
                    <Table.Th className="text-center border-b-0 whitespace-nowrap">
                      ClientName
                    </Table.Th>
                  )}
                  {(role === "superadmin" || role === "management") && (
                    <Table.Th className="text-center border-b-0 whitespace-nowrap">
                      Budget
                    </Table.Th>
                  )}
                  {(role === "superadmin" || role === "management") && (
                    <Table.Th className="text-center border-b-0 whitespace-nowrap">
                      Due Date
                    </Table.Th>
                  )}
                  {(role === "admin" || role === "employee") && (
                    <Table.Th className="text-center border-b-0 whitespace-nowrap">
                      {role === "admin" ? "Ops Due Date" : "Due Date"}
                    </Table.Th>
                  )}
                  <Table.Th className="text-center border-b-0 whitespace-nowrap">
                    Status
                  </Table.Th>

                  <Table.Th className="text-center border-b-0 whitespace-nowrap">
                    Project (admin) Link
                  </Table.Th>

                  <Table.Th className="text-center border-b-0 whitespace-nowrap">
                    Actions
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {currentProjects.map((project) => (
                  <Table.Tr key={project._id} className="intro-x bg-white mb-2">
                    {" "}
                    {/* Removed box and shadow classes */}
                    <Table.Td className="text-center">
                      {project.projectName}
                    </Table.Td>
                    {(role === "superadmin" || role === "management") && (
                      <Table.Td className="text-center">
                        {project.client.name}
                      </Table.Td>
                    )}{" "}
                    {/* Added column */}
                    {(role === "superadmin" || role === "management") && (
                      <Table.Td className="text-center">
                        ${project.totalAmount}
                      </Table.Td>
                    )}
                    {(role === "superadmin" || role === "management") && (
                      <Table.Td className="text-center">
                        {new Date(project.clientDueDate).toLocaleDateString()}
                      </Table.Td>
                    )}
                    {(role === "admin" || role === "employee") && (
                      <Table.Td className="text-center">
                        {new Date(project.opsDueDate).toLocaleDateString()}
                      </Table.Td>
                    )}
                    <Table.Td className="text-center">
                      {" "}
                      {role === "admin" && project.status === "Proposal Sent"
                        ? "On Hold"
                        : project.status}
                    </Table.Td>
                    <Table.Td className="text-center">
                      <a
                        href={ensureProtocol(project.projectLink)}
                        className="underline text-blue-500 hover:text-blue-700"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Admin Link
                      </a>
                    </Table.Td>
                    <Table.Td className="text-center">
                      <div className="flex items-center justify-center">
                        <a
                          className="flex items-center mr-3"
                          href="#"
                          onClick={() => handleViewClick(project._id)}
                        >
                          <Lucide icon="Eye" className="w-4 h-4 mr-1" /> View
                        </a>
                        {(role === "superadmin" ||
                          role === "admin" ||
                          role === "management") && (
                          <a
                            className="flex items-center mr-3"
                            href="#"
                            onClick={() => handleEditClick(project._id)}
                          >
                            <Lucide
                              icon="CheckSquare"
                              className="w-4 h-4 mr-1"
                            />{" "}
                            Edit
                          </a>
                        )}
                        {role === "management" && (
                          <a
                            className="flex items-center text-danger"
                            href="#"
                            onClick={() => handleDeleteClick(project._id)}
                          >
                            <Lucide icon="Trash2" className="w-4 h-4 mr-1" />{" "}
                            Delete
                          </a>
                        )}
                      </div>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <Pagination
              className="w-full sm:w-auto sm:mr-auto"
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
            <FormSelect
              className="w-20 mt-3 !box sm:mt-0"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </FormSelect>
          </div>
        </div>
      </div>

      <EditProjectModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        project={selectedProject}
        onInputChange={handleInputChange}
        role={role}
        employees={employees}
        onUpdate={handleUpdate}
      />

      <ViewProjectModal
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        project={selectedProject}
        role={role}
      />
    </>
  );
}

export default Main;
