import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import clsx from "clsx";
import Button from "@/components/Base/Button";
import Pagination from "@/components/Base/Pagination";
import { FormInput, FormSelect } from "@/components/Base/Form";
import Lucide from "@/components/Base/Lucide";
import Table from "@/components/Base/Table";
import { useNavigate } from "react-router-dom";
import EditProjectModal from "../ProductList/EditProjectModal"; // Import the new modal component
import { jwtDecode } from "jwt-decode";
import fakerData from "@/utils/faker";
import _ from "lodash";
import Tippy from "@/components/Base/Tippy";
import ViewProjectModal from "../ProductList/ViewProjectModal";

interface Employee {
  _id: string; // Assuming employees have an ID
  name: string; // Employee name
}
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
  members: string[];
  description: string;
  clientType: "New" | "Old";
  createdAt: Date;
  client: {
    _id: string;
    name: string;
  };
  creator: string;

  enterpriseName: string;
}
interface DecodedToken {
  role: string; // Expecting a string role from the JWT token
}
function Main() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [role, setRole] = useState<string>(""); // State to track if the user is admin
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filterType, setFilterType] = useState<string | null>(null); // State to track the filter type
  const [statusFilter, setStatusFilter] = useState<string>(""); // State for status filter
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleStatusFilterChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(event.target.value);
    console.log("Selected Status Filter:", event.target.value); // Debugging output
  };

  // Filter projects based on the selected status
  const filteredProjectss = statusFilter
    ? projects.filter((project) => project.adminStatus === statusFilter)
    : projects;

  const ensureProtocol = (url: string) => {
    // If the URL starts with "http://" or "https://", return it as is
    if (/^https?:\/\//i.test(url)) {
      return url;
    }
    // Otherwise, prepend "http://" to the URL
    return `http://${url}`;
  };

  const statuses = [
    "Pending",
    "Takeoff In Progress",
    "Pending In Progress",
    "Completed",
    "On Hold",
    "Revision",
  ];

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

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/projects`
        );
        const projectData = response.data.data;
        if (Array.isArray(projectData)) {
          // Filter projects with status 'Project Started'
          const filteredProjectss = projectData.filter(
            (project: Project) => project.status === "Project Started"
          );
          setProjects(filteredProjectss);
          setFilteredProjects(filteredProjectss); // Set the filteredProjects initially
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

  // Filter projects based on search query
  useEffect(() => {
    const results = projects.filter((project) =>
      project.projectName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProjects(results);
    setCurrentPage(1); // Reset to first page on search
  }, [searchQuery, projects]);

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

  const totalPages = Math.ceil(filteredProjectss.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  let currentProjects = filteredProjectss;

  if (searchTerm.trim() !== "") {
    currentProjects = currentProjects.filter((project) =>
      project.projectName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  currentProjects = currentProjects.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const endIndex = Math.min(
    startIndex + itemsPerPage,
    filteredProjectss.length
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  const isFieldDisabled = role === "employee";

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
          <div className="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
            <div className="relative w-56 text-slate-500">
              <FormSelect
                value={statusFilter}
                onChange={handleStatusFilterChange}
                className="!box w-56"
              >
                <option value="">All Statuses</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </FormSelect>
            </div>
          </div>
          <div className="hidden mx-auto md:block text-slate-500">
            Showing {startIndex + 1} to {endIndex} of {filteredProjectss.length}{" "}
            entries
          </div>
          <div className="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
            <div className="relative w-56 text-slate-500">
              <FormInput
                type="text"
                className="w-56 pr-10 !box"
                placeholder="Search by project title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Lucide
                icon="Search"
                className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
              />
            </div>
          </div>
        </div>
        <div className="col-span-12 overflow-auto intro-y lg:overflow-visible">
          <div className="overflow-x-auto">
            <Table className="border-spacing-y-[10px] border-separate -mt-2 w-full">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th className="border-b-0 whitespace-nowrap">
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
                  {(role === "admin" ||
                    role === "employee" ||
                    role === "management") && (
                    <Table.Th className="text-center border-b-0 whitespace-nowrap">
                      {role === "admin" ? "Ops Due Date" : "Due Date"}
                    </Table.Th>
                  )}

                  <Table.Th className="text-center border-b-0 whitespace-nowrap">
                    Status
                  </Table.Th>
                  {(role === "admin" || role === "employee") && (
                    <Table.Th className="text-center border-b-0 whitespace-nowrap">
                      Status (Cloned)
                    </Table.Th>
                  )}

                  {(role === "admin" ||
                    role === "employee" ||
                    role === "management") && (
                    <Table.Th className="text-center border-b-0 whitespace-nowrap">
                      Joined Members
                    </Table.Th>
                  )}
                  <Table.Th className="text-center border-b-0 whitespace-nowrap">
                    Project (admin) Link
                  </Table.Th>
                  {(role === "admin" ||
                    role === "employee" ||
                    role === "management") && (
                    <Table.Th className="text-center border-b-0 whitespace-nowrap">
                      Estimator Link
                    </Table.Th>
                  )}
                  {/* Conditionally render Template column */}
                  {(role === "admin" ||
                    role === "employee" ||
                    role === "management") && (
                    <Table.Th className="text-center border-b-0 whitespace-nowrap">
                      Template
                    </Table.Th>
                  )}
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
                    {(role === "admin" ||
                      role === "employee" ||
                      role === "management") && (
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
                    {(role === "admin" || role === "employee") && (
                      <Table.Td className="text-center">
                        <select
                          value={project.adminStatus}
                          onChange={(e) =>
                            handleAdminStatusChange(e, project._id)
                          }
                          className="form-select !box"
                          disabled={isFieldDisabled}
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </Table.Td>
                    )}
                    {(role === "admin" ||
                      role === "employee" ||
                      role === "management") && (
                      <Table.Td className="text-center max-w-[60px]">
                        <div className="relative flex">
                          <FormSelect className="!box w-56">
                            {getMemberNames(project.members).map(
                              (name, index) => (
                                <option key={index} value={name}>
                                  {name}
                                </option>
                              )
                            )}
                          </FormSelect>
                        </div>
                      </Table.Td>
                    )}
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
                      {project.estimatorLink
                        ? (role === "admin" ||
                            role === "employee" ||
                            role === "management") && (
                            <a
                              href={ensureProtocol(project.estimatorLink)}
                              className="underline text-blue-500 hover:text-blue-700"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Estimator Link
                            </a>
                          )
                        : " - "}
                    </Table.Td>
                    {/* Conditionally render Template field */}
                    {(role === "admin" ||
                      role === "employee" ||
                      role === "management") && (
                      <Table.Td className="text-center">
                        {project.template}
                      </Table.Td>
                    )}
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
                        {(role === "superadmin" || role === "management") && (
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

          <div className="flex flex-col items-center mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
      {/* BEGIN: Pagination */}
      <div className="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap">
        <Pagination className="w-full sm:w-auto sm:mr-auto">
          <Pagination.Link onClick={() => setCurrentPage(1)}>
            <Lucide icon="ChevronsLeft" className="w-4 h-4" />
          </Pagination.Link>
          <Pagination.Link
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            <Lucide icon="ChevronLeft" className="w-4 h-4" />
          </Pagination.Link>
          {Array.from({ length: totalPages }, (_, index) => (
            <Pagination.Link
              key={index}
              active={index + 1 === currentPage}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </Pagination.Link>
          ))}
          <Pagination.Link
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
          >
            <Lucide icon="ChevronRight" className="w-4 h-4" />
          </Pagination.Link>
          <Pagination.Link onClick={() => setCurrentPage(totalPages)}>
            <Lucide icon="ChevronsRight" className="w-4 h-4" />
          </Pagination.Link>
        </Pagination>
        <FormSelect
          className="w-20 mt-3 !box sm:mt-0"
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
          value={itemsPerPage}
        >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="35">35</option>
          <option value="50">50</option>
        </FormSelect>
      </div>
      {/* END: Pagination */}

      <EditProjectModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        project={selectedProject}
        onInputChange={handleInputChange}
        onUpdate={handleUpdate}
        role={role}
        employees={employees}
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
