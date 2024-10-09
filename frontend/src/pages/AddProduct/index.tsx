import _ from "lodash";
import { useState } from "react";
import fakerData from "@/utils/faker";
import Button from "@/components/Base/Button";
import {
  FormInput,
  FormInline,
  FormSelect,
  FormLabel,
  FormCheck,
  FormHelp,
} from "@/components/Base/Form";
import { ClassicEditor } from "@/components/Base/Ckeditor";
import Lucide from "@/components/Base/Lucide";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import AddClientModal from "./AddClientModal";
import SelectClientModal from "./SelectClientModal";
import { FaSpinner } from "react-icons/fa"; // Spinner icon
import Swal from "sweetalert2"; // SweetAlert2
function Main() {
  const [subcategory, setSubcategory] = useState("");
  const [status, setStatus] = useState("");
  const [clientType, setClientType] = useState("");
  const [editorData, setEditorData] = useState("");
  const [clientDueDate, setClientDueDate] = useState("");
  const [opsDueDate, setOpsDueDate] = useState("");
  const [initialAmount, setInitialAmount] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [remainingAmount, setRemainingAmount] = useState("");
  const [clientPermanentNotes, setClientPermanentNotes] = useState("");
  const [rfiAddendum, setRfiAddendum] = useState("");
  const [projectPlans, setProjectPlans] = useState("");
  const [description, setDescription] = useState("");
  const [projectType, setProjectType] = useState("");
  const [projectName, setProjectName] = useState(""); // Added for Project Name
  const [projectLink, setProjectLink] = useState(""); // Added for Project Link
  const [estimatorLink, setEstimatorLink] = useState(""); // Added for Project Link
  const [template, setTemplate] = useState(""); // Added for Project Link
  const [modalOpen, setModalOpen] = useState(false);
  const [selectClientModalOpen, setSelectClientModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state

  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  console.log(decodedToken);

  // Function to calculate remaining amount
  const calculateRemainingAmount = (initial, total) => {
    const initialAmountNum = parseFloat(initial) || 0;
    const totalAmountNum = parseFloat(total) || 0;
    setRemainingAmount(totalAmountNum - initialAmountNum);
  };

  const handleClientTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = e.target.value;
    setClientType(selectedType);

    if (selectedType === "new") {
      setSelectedClient(null); // Reset selected client
      setModalOpen(true); // Open modal when "New" is selected
    } else if (selectedType === "old") {
      setSelectClientModalOpen(true); // Open SelectClientModal for existing clients
    }
  };

  const handleCloseSelectClientModal = () => {
    setSelectClientModalOpen(false);
    setClientType(""); // Reset clientType when closing SelectClientModal
  };

  const handleClientSelection = (client) => {
    setSelectedClient(client); // Save selected old client
    setClientType("old"); // Set client type to "old" when selecting an existing client
    setSelectClientModalOpen(false);
  };

  const handleSaveClient = async (clientData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/clients/create`,
        clientData
      );
      const newClient = response.data;

      setClientType(""); // Reset clientType to "Select Client Type"
      setModalOpen(false); // Close the modal
      setSelectClientModalOpen(false); // Ensure the select client modal is closed
    } catch (error) {
      console.error("Error saving client:", error);
      Swal.fire("Error", "Error saving client.", "error");
    }
  };

  const handleRemoveSelectedClient = () => {
    setSelectedClient(null); // Remove the selected client
    setClientType(""); // Allow user to select client again
  };

  // Inside your Main component

  const handleSave = async () => {
    setLoading(true);

    const userId = decodedToken.userId;
    if (!userId) {
      console.error("Creator ID is missing");
      setLoading(false);
      return;
    }

    const formattedSubcategory = subcategory || null;
    const formattedProjectType = projectType || null;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/create`,
        {
          creator: userId,
          projectName,
          status,
          subcategory: formattedSubcategory,
          projectType: formattedProjectType,
          clientDueDate,
          opsDueDate,
          description,
          initialAmount,
          totalAmount,
          remainingAmount,
          clientPermanentNotes,
          rfiAddendum,
          projectPlans,
          clientType,
          estimatorLink,
          projectLink,
          template,
          clientDetails: clientType === "new" ? selectedClient : undefined,
          selectedClientId:
            clientType === "old" ? selectedClient?._id : undefined,
        }
      );

      Swal.fire({
        title: "Success",
        text: "Project created successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });

      // Clear form fields
      setProjectName("");
      setStatus("");
      setProjectLink("");
      setSubcategory("");
      setDescription("");
      setProjectType("");
      setClientDueDate("");
      setOpsDueDate("");

      setInitialAmount("");
      setTotalAmount("");
      setRemainingAmount("");
      setClientPermanentNotes("");
      setRfiAddendum("");
      setProjectPlans("");
      setClientType("");
      setSelectedClient(null);
    } catch (error: any) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Unknown error occurred",
        "error"
      );
    }

    setLoading(false);
  };

  // Ensure the `clientType` select field is correctly set up
  <FormSelect
    id="client-type"
    value={clientType}
    onChange={handleClientTypeChange}
  >
    <option value="" disabled>
      Select Client Type
    </option>
    <option value="new">New</option>
    <option value="old">Existing</option>
  </FormSelect>;

  function setRfiInput(value: string): void {
    throw new Error("Function not implemented.");
  }

  return (
    <>
      <div className="flex items-center mt-8 intro-y">
        <h2 className="mr-auto text-lg font-medium">Add Project</h2>
      </div>
      <div className="grid grid-cols-11 pb-20 mt-5 gap-x-6">
        <div className="col-span-11 intro-y 2xl:col-span-9">
          {/* BEGIN: Product Information */}
          <div className="p-5 mt-5 intro-y box">
            <div className="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400">
              <div className="flex items-center pb-5 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400">
                <Lucide icon="ChevronDown" className="w-4 h-4 mr-2" /> Project
                Information
              </div>
              <div className="mt-5">
                <FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Project Name</div>
                        <div className="ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md">
                          Required
                        </div>
                      </div>
                    </div>
                  </FormLabel>
                  <div className="flex-1 w-full mt-3 xl:mt-0">
                    <FormInput
                      id="project-name"
                      type="text"
                      placeholder="Project name"
                      value={projectName}
                      onChange={(e) => {
                        if (e.target.value.length <= 150) {
                          setProjectName(e.target.value);
                        }
                      }}
                    />
                    <FormHelp className="text-right">
                      Maximum character {projectName.length}/150
                    </FormHelp>
                  </div>
                </FormInline>

                <FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Status</div>
                        <div className="ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md">
                          Required
                        </div>
                      </div>
                    </div>
                  </FormLabel>
                  <div className="flex-1 w-full mt-3 xl:mt-0">
                    <FormSelect
                      id="status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="" disabled>
                        Select Status
                      </option>
                      <option value="ETA">ETA</option>
                    </FormSelect>
                  </div>
                </FormInline>
                <FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Subcategory</div>
                      </div>
                    </div>
                  </FormLabel>
                  <div className="flex-1 w-full mt-3 xl:mt-0">
                    <select
                      value={subcategory}
                      onChange={(e) => setSubcategory(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="" disabled>
                        Select Subcategory
                      </option>
                      <option value="geoglyphs">Geoglyphs</option>
                      <option value="stellar">Stellar</option>
                      <option value="perfect">Perfect</option>
                    </select>
                  </div>
                </FormInline>
                {/* New Project Type Dropdown */}
                <FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Project Type</div>
                      </div>
                    </div>
                  </FormLabel>
                  <div className="flex-1 w-full mt-3 xl:mt-0">
                    <FormSelect
                      id="project-type"
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                    >
                      <option value="" disabled>
                        Select Project Type
                      </option>
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="industrial">Industrial</option>
                    </FormSelect>
                  </div>
                </FormInline>

                <FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Client Due Date</div>
                      </div>
                    </div>
                  </FormLabel>
                  <div className="flex-1 w-full mt-3 xl:mt-0">
                    <FormInput
                      id="client-due-date"
                      type="date"
                      value={clientDueDate}
                      onChange={(e) => setClientDueDate(e.target.value)}
                    />
                  </div>
                </FormInline>
                <FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Op’s Due Date</div>
                      </div>
                    </div>
                  </FormLabel>
                  <div className="flex-1 w-full mt-3 xl:mt-0">
                    <FormInput
                      id="ops-due-date"
                      type="date"
                      value={opsDueDate}
                      onChange={(e) => setOpsDueDate(e.target.value)}
                    />
                  </div>
                </FormInline>
                <FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Project Description</div>
                      </div>
                    </div>
                  </FormLabel>
                  <div className="flex-1 w-full mt-3 xl:mt-0">
                    <ClassicEditor
                      value={description}
                      onChange={setDescription}
                    />
                  </div>
                </FormInline>
                <FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Initial Amount</div>
                      </div>
                    </div>
                  </FormLabel>
                  <div className="flex-1 w-full mt-3 xl:mt-0">
                    <FormInput
                      id="initial-amount"
                      type="number"
                      placeholder="Enter initial amount"
                      value={initialAmount}
                      onChange={(e) => {
                        setInitialAmount(e.target.value);
                        calculateRemainingAmount(e.target.value, totalAmount);
                      }}
                    />
                  </div>
                </FormInline>
                <FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Total Amount</div>
                      </div>
                    </div>
                  </FormLabel>
                  <div className="flex-1 w-full mt-3 xl:mt-0">
                    <FormInput
                      id="total-amount"
                      type="number"
                      placeholder="Enter total amount"
                      value={totalAmount}
                      onChange={(e) => {
                        setTotalAmount(e.target.value);
                        calculateRemainingAmount(initialAmount, e.target.value);
                      }}
                    />
                  </div>
                </FormInline>
                <FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Remaining Amount</div>
                      </div>
                    </div>
                  </FormLabel>
                  <div className="flex-1 w-full mt-3 xl:mt-0">
                    <FormInput
                      id="remaining-amount"
                      type="text"
                      placeholder="Remaining amount"
                      value={remainingAmount}
                      readOnly
                    />
                  </div>
                </FormInline>
                <FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">
                          Client Permanent Notes
                        </div>
                      </div>
                    </div>
                  </FormLabel>
                  <div className="flex-1 w-full mt-3 xl:mt-0">
                    <FormInput
                      id="client-permanent-notes"
                      as="textarea"
                      placeholder="Client permanent notes"
                      rows={4}
                      value={clientPermanentNotes}
                      onChange={(e) => setClientPermanentNotes(e.target.value)}
                    />
                  </div>
                </FormInline>
                <FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Project Specific RFI</div>
                      </div>
                    </div>
                  </FormLabel>
                  <div className="flex-1 w-full mt-3 xl:mt-0">
                    <FormInput
                      id="rfiAddendum"
                      as="textarea"
                      placeholder="Enter your RFI here"
                      rows={6} // Increased the number of rows for a larger input box
                      value={rfiAddendum}
                      onChange={(e) => setRfiAddendum(e.target.value)}
                    />
                  </div>
                </FormInline>
              </div>
            </div>
          </div>
          {/* END: Product Information */}

          {/* BEGIN: Product Detail */}
          <div className="p-5 mt-5 intro-y box">
            <div className="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400">
              <div className="flex items-center pb-5 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400">
                <Lucide icon="ChevronDown" className="w-4 h-4 mr-2" /> Project
                Detail
              </div>
              <div className="mt-5">
                <FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Client Type</div>
                        <div className="ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md">
                          Required
                        </div>
                      </div>
                    </div>
                  </FormLabel>
                  <div className="flex-1 w-full mt-3 xl:mt-0">
                    <div className="flex space-x-4">
                      <button
                        onClick={() => {
                          setSelectedClient(null); // Reset selected client
                          setModalOpen(true); // Open modal for New Client
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                      >
                        New Client
                      </button>
                      <button
                        onClick={() => {
                          setSelectedClient(null); // Reset selected client
                          setSelectClientModalOpen(true); // Open SelectClientModal for Existing Client
                        }}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                      >
                        Existing Client
                      </button>
                    </div>
                  </div>
                </FormInline>

                {/* Display selected client name with cross option */}
                {selectedClient && (
                  <div className="mt-5 flex items-center">
                    <span className="text-lg font-medium mr-4">
                      {selectedClient.name}
                    </span>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={handleRemoveSelectedClient}
                    >
                      ✖
                    </button>
                  </div>
                )}

                <FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Project Link</div>
                      </div>
                    </div>
                  </FormLabel>
                  <div className="flex-1 w-full mt-3 xl:mt-0">
                    <FormInput
                      id="project-link"
                      type="text"
                      placeholder="Enter Project Link"
                      value={projectLink}
                      onChange={(e) => setProjectLink(e.target.value)}
                    />
                  </div>
                </FormInline>
              </div>
            </div>
          </div>
          {/* END: Product Detail */}

          <div className="flex flex-col justify-end gap-2 mt-5 md:flex-row">
            <Button
              variant="primary"
              type="button"
              className="w-full py-3 md:w-52"
              onClick={handleSave}
              disabled={loading} // Disable the button while loading
            >
              {loading ? <FaSpinner className="animate-spin" /> : "Save"}
            </Button>
          </div>
        </div>
      </div>
      {/* Client modals */}
      {modalOpen && (
        <AddClientModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveClient}
        />
      )}

      {selectClientModalOpen && (
        <SelectClientModal
          open={selectClientModalOpen}
          onClose={handleCloseSelectClientModal}
          onClientSelect={handleClientSelection}
        />
      )}
    </>
  );
}

export default Main;
