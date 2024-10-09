import React, { ChangeEvent } from "react";
import Button from "@/components/Base/Button";
import { FormInput, FormSelect } from "@/components/Base/Form";
import { Project } from "./Main"; // Import the Project type

interface ViewProjectModalProps {
  open: boolean;
  onClose: () => void;
  project: Project | null;
  role: string;
}

const ViewProjectModal: React.FC<ViewProjectModalProps> = ({ open, onClose, project,role }) => {
  if (!open || !project) return null;

  const stripHtmlTags = (html: string) => {
    return html.replace(/<\/?[^>]+(>|$)/g, ""); // Removes all HTML tags
  };

  // Render status options based on the project status
  const renderStatusOptions = () => {
    const options = [
      "ETA", "Proposal Sent", "Approved", "Rejected", "Project Started"
    ];
    
    return options.map(status => (
      <option
        key={status}
        value={status}
        selected={status === project.status}
        disabled
      >
        {status}
      </option>
    ));
  };

  return (
    <>
      <div style={overlayStyles} onClick={onClose}></div>
      <div style={modalContainerStyles}>
        <div style={modalStyles}>
          <h2 style={headingStyles}>View Project</h2>
          <div style={formContainerStyles}>
            {/* Conditionally render content based on the role */}
            {role === "admin" || role === "employee" || role === 'management' ? (
              <>
                {/* Show only project name and description */}
                <div style={formGroupStyles}>
                  <label style={labelStyles}>Project Name:</label>
                  <FormInput
                    name="projectName"
                    value={project.projectName}
                    type="text"
                    style={inputStyles}
                    disabled
                  />
                </div>
                
                
                <div style={formGroupStyles}>
                  <label style={labelStyles}>Client Notes:</label>
                  <textarea
                    name="clientPermanentNotes"
                    value={project.clientPermanentNotes}
                    style={textareaStyles}
                    disabled
                  />
                </div>
                <div style={formGroupStyles}>
                  <label style={labelStyles}>Project Description:</label>
                  <div
                    name="description"
                    dangerouslySetInnerHTML={{ __html: project.description }}
                    style={divStyles}
                    disabled
                  />
                </div>
                <div style={formGroupStyles}>
                  <label style={labelStyles}>RFI Notes:</label>
                  <textarea
                    name="description"
                    value={stripHtmlTags(project.rfiAddendum)}
                    style={textareaStyles}
                    disabled
                  />
                </div>
              </>
            ) : (
              <>
                {/* Render the entire project details for other roles */}
                <div style={formGroupStyles}>
                  <label style={labelStyles}>Project Name:</label>
                  <FormInput
                    name="projectName"
                    value={project.projectName}
                    type="text"
                    style={inputStyles}
                    disabled
                  />
                </div>
                <div style={formGroupStyles}>
                  <label style={labelStyles}>Project Type:</label>
                  <FormInput
                    name="projectName"
                    value={project.projectType}
                    type="text"
                    style={inputStyles}
                    disabled
                  />
                </div>
                <div style={formGroupStyles}>
                  <label style={labelStyles}>Project Sub Category:</label>
                  <FormInput
                    name="projectName"
                    value={project.subcategory}
                    type="text"
                    style={inputStyles}
                    disabled
                  />
                </div>
                <div style={formGroupStyles}>
                  <label style={labelStyles}>Status:</label>
                  <FormInput
                    name="status"
                    value={project.status}
                    type="text"
                    style={inputStyles}
                    disabled
                  />
                </div>
                <div style={formGroupStyles}>
                  <label style={labelStyles}>Initial Amount:</label>
                  <FormInput
                    name="initialAmount"
                    value={project.initialAmount}
                    type="number"
                    style={inputStyles}
                    disabled
                  />
                </div>
                <div style={formGroupStyles}>
                  <label style={labelStyles}>Total Amount:</label>
                  <FormInput
                    name="totalAmount"
                    value={project.totalAmount}
                    type="number"
                    style={inputStyles}
                    disabled
                  />
                </div>
                <div style={formGroupStyles}>
                  <label style={labelStyles}>Remaining Amount:</label>
                  <FormInput
                    name="remainingAmount"
                    value={project.remainingAmount}
                    type="number"
                    style={inputStyles}
                    disabled
                  />
                </div>
                <div style={formGroupStyles}>
                  <label style={labelStyles}>Project Description:</label>
                  <div
                    name="description"
                    style={divStyles}
                    dangerouslySetInnerHTML={{ __html: project.description }}
                    
                    disabled
                  />
                </div>
                <div style={formGroupStyles}>
                  <label style={labelStyles}>RFI Notes:</label>
                  <textarea
                    name="description"
                    value={stripHtmlTags(project.rfiAddendum)}
                    style={textareaStyles}
                    disabled
                  />
                </div>
                <div style={formGroupStyles}>
                  <label style={labelStyles}>Client Due Date:</label>
                  <FormInput
                    name="clientDueDate"
                    value={new Date(project.clientDueDate).toISOString().substring(0, 10)}
                    type="date"
                    style={inputStyles}
                    disabled
                  />
                </div>
                <div style={formGroupStyles}>
                  <label style={labelStyles}>Ops Due Date:</label>
                  <FormInput
                    name="opsDueDate"
                    value={new Date(project.opsDueDate).toISOString().substring(0, 10)}
                    type="date"
                    style={inputStyles}
                    disabled
                  />
                </div>
              </>
            )}
          </div>
          <div style={footerStyles}>
            <Button variant="primary" onClick={onClose} style={buttonStyles}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

const divStyles = {
  border: "1px solid #ccc",
  padding: "10px",
  minHeight: "100px",
  overflowY: "auto",
  backgroundColor: "#f9f9f9",
};


// Styles for overlay, modal container, and modal
const overlayStyles: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 1000,
};

const modalContainerStyles: React.CSSProperties = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
  zIndex: 1001,
};

const modalStyles: React.CSSProperties = {
  backgroundColor: '#fff',
  padding: '30px',
  borderRadius: '10px',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
  width: '800px', // Adjusted width
  maxWidth: '90%',
  maxHeight: '90vh', // Adjusted height and enable scrolling
  overflowY: 'auto', // Enable vertical scrolling
};

const headingStyles: React.CSSProperties = {
  marginBottom: '20px',
  fontSize: '24px',
  fontWeight: '600',
  color: '#333',
};

const formContainerStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
};

const formGroupStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column', // Changed to column for better layout
  gap: '15px',
};

const labelStyles: React.CSSProperties = {
  fontWeight: '500',
  marginBottom: '5px',
};

const inputStyles: React.CSSProperties = {
  padding: '10px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '16px',
};

const selectStyles: React.CSSProperties = {
  padding: '10px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '16px',
};

const textareaStyles: React.CSSProperties = {
  padding: '10px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '16px',
  minHeight: '150px', // Increased vertical height
  width: '100%', // Ensures the textarea is as wide as the modal
  resize: 'none', // Prevent horizontal resizing
};

const footerStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '10px',
  marginTop: '20px',
};

const buttonStyles: React.CSSProperties = {
  padding: '10px 20px',
};

export default ViewProjectModal;