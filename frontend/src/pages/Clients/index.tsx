import React, { useEffect, useState, ChangeEvent } from "react";
import _ from "lodash";
import Button from "@/components/Base/Button";
import Pagination from "@/components/Base/Pagination";
import { FormInput, FormSelect } from "@/components/Base/Form";
import Lucide from "@/components/Base/Lucide";
import axios from "axios"; // For making HTTP requests
import { useNavigate } from "react-router-dom"; // Import useNavigate

interface Client {
  name: string;
  email: string;
  phone: string;
  location: string;
  zipCode: string; // Add zip property
}

function Main() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get<Client[]>(
          `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/clients/clients`
        );
        setClients(response.data.clients);
        setFilteredClients(response.data.clients);
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Function to handle search input change
  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1);

    // Filter clients based on name
    if (value.trim() === "") {
      setFilteredClients(clients); // Reset to all clients if search term is empty
    } else {
      const filtered = clients.filter((client) =>
        client.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredClients(filtered);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const currentClients = _.slice(
    filteredClients,
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <>
      <h2 className="mt-10 text-lg font-medium intro-y">Clients Data</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="flex justify-between items-center col-span-12 mt-2 intro-y">
          <div className="text-slate-500 text-center flex-1">
            Showing {itemsPerPage * (currentPage - 1) + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredClients.length)} of{" "}
            {filteredClients.length} entries
          </div>
          <div className="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-3">
            <div className="relative w-56 text-slate-500">
              <FormInput
                type="text"
                className="w-56 pr-10 !box"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={handleSearchInputChange}
              />
              <Lucide
                icon="Search"
                className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
              />
            </div>
          </div>
        </div>
        {/* BEGIN: Clients Layout */}
        {currentClients.map((client, index) => (
          <div key={index} className="col-span-12 intro-y md:col-span-6">
            <div className="box p-5">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 image-fit">
                  <img
                    alt="Client Avatar"
                    className="rounded-full"
                    src={`src/pages/Clients/612.jpg`} // Updated to new image path
                    onError={(e) =>
                      (e.currentTarget.src = "src/pages/Clients/612.jpg")
                    } // Fallback to new image if needed
                  />
                </div>
                <div className="mt-4 text-center">
                  <a href="#" className="font-medium text-lg">
                    {client.name}
                  </a>
                  <div className="text-slate-500 text-sm mt-1">
                    {client.email}
                  </div>
                  <div className="flex justify-center mt-2 space-x-4">
                    <div className="text-slate-500 text-sm">
                      Phone: {client.phone}
                    </div>
                    <div className="text-slate-500 text-sm">
                      Location: {client.location}
                    </div>
                    <div className="text-slate-500 text-sm">
                      Zip: {client.zipCode} {/* Display zip code */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {/* BEGIN: Pagination */}
        <div className="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap">
          <Pagination className="w-full sm:w-auto sm:mr-auto">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              <Lucide icon="ChevronsLeft" className="w-4 h-4" />
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <Lucide icon="ChevronLeft" className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`${
                  index + 1 === currentPage ? "active" : ""
                } pagination-link`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <Lucide icon="ChevronRight" className="w-4 h-4" />
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              <Lucide icon="ChevronsRight" className="w-4 h-4" />
            </button>
          </Pagination>
          <FormSelect
            className="w-20 mt-3 !box sm:mt-0"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </FormSelect>
        </div>
        {/* END: Pagination */}
      </div>
    </>
  );
}

export default Main;
