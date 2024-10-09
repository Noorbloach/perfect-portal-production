import _ from "lodash";
import clsx from "clsx";
import { useRef, useState } from "react";
import fakerData from "@/utils/faker";
import Button from "@/components/Base/Button";
import Pagination from "@/components/Base/Pagination";
import { FormInput, FormSelect } from "@/components/Base/Form";
import TinySlider, { TinySliderElement } from "@/components/Base/TinySlider";
import Lucide from "@/components/Base/Lucide";
import Tippy from "@/components/Base/Tippy";
import Litepicker from "@/components/Base/Litepicker";
import ReportDonutChart from "@/components/ReportDonutChart";
import ReportLineChart from "@/components/ReportLineChart";
import ReportPieChart from "@/components/ReportPieChart";
import ReportDonutChart1 from "@/components/ReportDonutChart1";
import SimpleLineChart1 from "@/components/SimpleLineChart1";
import LeafletMap from "@/components/LeafletMap";
import { Menu } from "@/components/Base/Headless";
import Table from "@/components/Base/Table";
import { useEffect } from "react";
import axios from "axios";

function Main() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [takeoffInProgressCount, setTakeoffInProgressCount] = useState(0);
  const [totalProjectsCount, setTotalProjectsCount] = useState(0);
  const [clientsCount, setClientsCount] = useState(0);
  const [employeesCount, setEmployeesCount] = useState(0);

  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/clients/clients`
        ); // Adjust the endpoint as needed
        setClients(response.data.clients);
      } catch (error) {
        console.error("Error fetching client data:", error);
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsResponse = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/projects`
        );
        const projectsData = projectsResponse.data.data;

        if (Array.isArray(projectsData)) {
          setProjects(projectsData);

          // Calculate the count of projects with adminStatus as "Takeoff In Progress"
          const takeoffInProgressCount = projectsData.filter(
            (project) => project.adminStatus === "Takeoff In Progress"
          ).length;
          setTakeoffInProgressCount(takeoffInProgressCount);

          // Calculate the total number of projects
          const totalProjectsCount = projectsData.length;
          setTotalProjectsCount(totalProjectsCount);
        } else {
          console.error(
            "Unexpected projects response format:",
            projectsResponse.data
          );
          setError("Unexpected projects response format");
        }
      } catch (err) {
        console.error("Projects API call error:", err);
        setError("Failed to fetch projects");
      }
    };

    const fetchClientsCount = async () => {
      try {
        const clientsResponse = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/clients/clients`
        );
        const clientsData = clientsResponse.data.clients;
        console.log(clientsResponse.data);

        if (Array.isArray(clientsData)) {
          setClientsCount(clientsData.length);
        } else {
          console.error(
            "Unexpected clients response format:",
            clientsResponse.data
          );
          setError("Unexpected clients response format");
        }
      } catch (err) {
        console.error("Clients API call error:", err);
        setError("Failed to fetch clients");
      }
    };

    const fetchEmployeesCount = async () => {
      try {
        const usersResponse = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/auth/users`
        );
        const usersData = usersResponse.data;

        if (Array.isArray(usersData)) {
          const employeesCount = usersData.filter(
            (user) => user.role === "employee"
          ).length;
          setEmployeesCount(employeesCount);
        } else {
          console.error(
            "Unexpected users response format:",
            usersResponse.data
          );
          setError("Unexpected users response format");
        }
      } catch (err) {
        console.error("Users API call error:", err);
        setError("Failed to fetch users");
      }
    };

    const fetchAllData = async () => {
      await Promise.all([
        fetchProjects(),
        fetchClientsCount(),
        fetchEmployeesCount(),
      ]);
      setLoading(false);
    };

    fetchAllData();
  }, []);

  const [projectStatusCounts, setProjectStatusCounts] = useState({
    completed: 0,
    takeoffInProgress: 0,
    pending: 0,
    revision: 0,
    onHold: 0,
    pendingInProgress: 0,
  });
  const [totalProjects, setTotalProjects] = useState(0);

  useEffect(() => {
    const fetchProjectStatuses = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/projects`
        );
        const projects = response.data.data;

        // Calculate the count for each status
        const statusCounts = {
          completed: 0,
          takeoffInProgress: 0,
          pending: 0,
          revision: 0,
          onHold: 0,
          pendingInProgress: 0,
        };

        projects.forEach((project) => {
          switch (project.adminStatus) {
            case "Completed":
              statusCounts.completed += 1;
              break;
            case "Takeoff In Progress":
              statusCounts.takeoffInProgress += 1;
              break;
            case "Pending":
              statusCounts.pending += 1;
              break;
            case "Pending In Progress":
              statusCounts.pendingInProgress += 1;
              break;
            case "On Hold":
              statusCounts.onHold += 1;
              break;
            case "Revision":
              statusCounts.revision += 1;
              break;
            default:
              break;
          }
        });

        setProjectStatusCounts(statusCounts);
        setTotalProjects(projects.length);
      } catch (error) {
        console.error("Error fetching project statuses:", error);
      }
    };

    fetchProjectStatuses();
  }, []);

  // Helper function to calculate percentage
  const getPercentage = (count) => {
    return totalProjects === 0 ? 0 : ((count / totalProjects) * 100).toFixed(2);
  };
  const [salesReportFilter, setSalesReportFilter] = useState<string>();
  const importantNotesRef = useRef<TinySliderElement>();
  const prevImportantNotes = () => {
    importantNotesRef.current?.tns.goTo("prev");
  };
  const nextImportantNotes = () => {
    importantNotesRef.current?.tns.goTo("next");
  };

  const [currentMonthBudget, setCurrentMonthBudget] = useState(0);
  const [lastMonthBudget, setLastMonthBudget] = useState(0);
  const [totalBudgetByMonth, setTotalBudgetByMonth] = useState([]);

  // Helper function to get month/year from date
  const getMonthYear = (date) => {
    const d = new Date(date);
    return `${d.getMonth() + 1}-${d.getFullYear()}`;
  };
  useEffect(() => {
    const fetchProjectBudgets = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/projects`
        ); // Replace with actual endpoint
        const projects = response.data.data;

        const budgetByMonth = {};

        projects.forEach((project) => {
          const monthYear = getMonthYear(project.createdAt); // Assuming `createdAt` field exists
          if (!budgetByMonth[monthYear]) {
            budgetByMonth[monthYear] = 0;
          }
          budgetByMonth[monthYear] += project.budget; // Assuming each project has a `budget` field
        });

        // Store budget data grouped by month
        setTotalBudgetByMonth(budgetByMonth);

        const currentMonth = getMonthYear(new Date());
        const lastMonth = getMonthYear(
          new Date(new Date().setMonth(new Date().getMonth() - 1))
        );

        setCurrentMonthBudget(budgetByMonth[currentMonth] || 0);
        setLastMonthBudget(budgetByMonth[lastMonth] || 0);
      } catch (error) {
        console.error("Error fetching project budgets:", error);
      }
    };

    fetchProjectBudgets();
  }, []);

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 2xl:col-span-9">
        <div className="grid grid-cols-12 gap-6">
          {/* BEGIN: General Report */}
          <div className="col-span-12 mt-8">
            <div className="flex items-center h-10 intro-y">
              <h2 className="mr-5 text-lg font-medium truncate">
                General Report
              </h2>
              <a href="" className="flex items-center ml-auto text-primary">
                <Lucide icon="RefreshCcw" className="w-4 h-4 mr-3" /> Reload
                Data
              </a>
            </div>
            <div className="grid grid-cols-12 gap-6 mt-5">
              <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                <div
                  className={clsx([
                    "relative zoom-in",
                    "before:box before:absolute before:inset-x-3 before:mt-3 before:h-full before:bg-slate-50 before:content-['']",
                  ])}
                >
                  <div className="p-5 box">
                    <div className="flex">
                      <Lucide
                        icon="FileText"
                        className="w-[28px] h-[28px] text-primary"
                      />
                      <div className="ml-auto"></div>
                    </div>
                    <div className="mt-6 text-3xl font-medium leading-8">
                      {takeoffInProgressCount}
                    </div>
                    <div className="mt-1 text-base text-slate-500">
                      Running Projects
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                <div
                  className={clsx([
                    "relative zoom-in",
                    "before:box before:absolute before:inset-x-3 before:mt-3 before:h-full before:bg-slate-50 before:content-['']",
                  ])}
                >
                  <div className="p-5 box">
                    <div className="flex">
                      <Lucide
                        icon="FilePlus"
                        className="w-[28px] h-[28px] text-pending"
                      />
                      <div className="ml-auto"></div>
                    </div>
                    <div className="mt-6 text-3xl font-medium leading-8">
                      {clientsCount}
                    </div>
                    <div className="mt-1 text-base text-slate-500">
                      No of Clients
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                <div
                  className={clsx([
                    "relative zoom-in",
                    "before:box before:absolute before:inset-x-3 before:mt-3 before:h-full before:bg-slate-50 before:content-['']",
                  ])}
                >
                  <div className="p-5 box">
                    <div className="flex">
                      <Lucide
                        icon="Layers"
                        className="w-[28px] h-[28px] text-warning"
                      />
                    </div>
                    <div className="mt-6 text-3xl font-medium leading-8">
                      {totalProjectsCount}
                    </div>
                    <div className="mt-1 text-base text-slate-500">
                      Total Projects
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                <div
                  className={clsx([
                    "relative zoom-in",
                    "before:box before:absolute before:inset-x-3 before:mt-3 before:h-full before:bg-slate-50 before:content-['']",
                  ])}
                >
                  <div className="p-5 box">
                    <div className="flex">
                      <Lucide
                        icon="User"
                        className="w-[28px] h-[28px] text-success"
                      />
                    </div>
                    <div className="mt-6 text-3xl font-medium leading-8">
                      {employeesCount}
                    </div>
                    <div className="mt-1 text-base text-slate-500">
                      Employees
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* END: General Report */}
          {/* BEGIN: Sales Report */}

          {/* END: Sales Report */}
          {/* BEGIN: Weekly Top Seller */}
          <div className="col-span-12 mt-8 sm:col-span-6 lg:col-span-12">
            <div className="flex items-center h-10 intro-y">
              <h2 className="mr-5 text-lg font-medium truncate">
                Projects Status
              </h2>
            </div>
            <div className="p-5 mt-5 intro-y box">
              <div className="mt-3">
                <ReportPieChart height={213} />{" "}
                {/* Assuming you already have a pie chart component */}
              </div>
              <div className="mx-auto mt-8 w-52 sm:w-auto">
                <div className="flex items-center">
                  <div className="w-2 h-2 mr-3 rounded-full bg-primary"></div>
                  <span className="truncate">Completed</span>
                  <span className="ml-auto font-medium">
                    {getPercentage(projectStatusCounts.completed)}%
                  </span>
                </div>
                <div className="flex items-center mt-4">
                  <div className="w-2 h-2 mr-3 rounded-full bg-pending"></div>
                  <span className="truncate">Takeoff In Progress</span>
                  <span className="ml-auto font-medium">
                    {getPercentage(projectStatusCounts.takeoffInProgress)}%
                  </span>
                </div>
                <div className="flex items-center mt-4">
                  <div className="w-2 h-2 mr-3 rounded-full bg-warning"></div>
                  <span className="truncate">Pending</span>
                  <span className="ml-auto font-medium">
                    {getPercentage(projectStatusCounts.pending)}%
                  </span>
                </div>
                <div className="flex items-center mt-4">
                  <div className="w-2 h-2 mr-3 rounded-full bg-warning"></div>
                  <span className="truncate">Pending In Progress</span>
                  <span className="ml-auto font-medium">
                    {getPercentage(projectStatusCounts.pendingInProgress)}%
                  </span>
                </div>
                <div className="flex items-center mt-4">
                  <div className="w-2 h-2 mr-3 rounded-full bg-danger"></div>
                  <span className="truncate">On Hold</span>
                  <span className="ml-auto font-medium">
                    {getPercentage(projectStatusCounts.onHold)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* END: Weekly Top Seller */}
        </div>
      </div>
      <div className="col-span-12 2xl:col-span-3">
        <div className="pb-10 -mb-10 2xl:border-l">
          <div className="grid grid-cols-12 2xl:pl-6 gap-x-6 2xl:gap-x-0 gap-y-6">
            {/* BEGIN: Transactions */}
            <div className="col-span-12 mt-3 md:col-span-6 xl:col-span-4 2xl:col-span-12 2xl:mt-8">
              <div className="flex items-center h-10 intro-x">
                <h2 className="mr-5 text-lg font-medium truncate">Clients</h2>
              </div>
              <div className="mt-5">
                {clients.slice(0, 5).map((client, index) => (
                  <div key={index} className="intro-x">
                    <div className="flex items-center px-5 py-3 mb-3 box zoom-in">
                      <div className="flex-none w-10 h-10 overflow-hidden rounded-full image-fit">
                        <img
                          alt="Client Avatar"
                          src={client.avatar || "default-avatar.png"} // Add a default image if needed
                        />
                      </div>
                      <div className="ml-4 mr-auto">
                        <div className="font-medium">{client.name}</div>{" "}
                        {/* Display client name */}
                        <div className="text-slate-500 text-xs mt-0.5">
                          {new Date(client.createdAt).toLocaleDateString()}{" "}
                          {/* Display creation date */}
                        </div>
                      </div>
                      <div
                        className={clsx({
                          "text-success": client.isActive,
                          "text-danger": !client.isActive,
                        })}
                      ></div>
                    </div>
                  </div>
                ))}
                <a
                  href="/clients"
                  className="block w-full py-3 text-center border border-dotted rounded-md intro-x border-slate-400 dark:border-darkmode-300 text-slate-500"
                >
                  View More
                </a>
              </div>
            </div>
            {/* END: Transactions */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
