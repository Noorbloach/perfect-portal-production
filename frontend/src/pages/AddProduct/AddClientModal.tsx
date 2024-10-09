import React, { ChangeEvent, useState } from "react";
import Select from "react-select"; // Import react-select
import Button from "@/components/Base/Button";
import { FormInput, FormInline, FormLabel } from "@/components/Base/Form";

const states = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "DC", label: "District of Columbia" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
];



interface AddClientModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (clientData: {
    name: string;
    email: string;
    phone: string;
    zipCode: string;
    location: string;
  }) => void;
}

const AddClientModal: React.FC<AddClientModalProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [zipCode, setZip] = useState(""); // New state for zip code
  const [location, setLocation] = useState(null); // Handle the selected state

  if (!open) return null;

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
    if (input.length <= 10) {
      setPhone(input);
    }
  };

  const handleZipChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
    if (e.target.value) {
      setZip(input);
    }
  };

  const handleSave = () => {
    if (phone.length === 10) {
      onSave({
        name,
        email,
        phone: `+1${phone}`,
        zipCode,
        location: location?.label || "",
      });
      onClose();
    } else {
      alert("Please enter a valid 10-digit phone number.");
    }
  };

  return (
    <>
      <div style={overlayStyles} onClick={onClose}></div>
      <div style={modalContainerStyles}>
        <div style={modalStyles}>
          <h2 style={headingStyles}>Add New Client</h2>
          <div style={formContainerStyles}>
            <FormInline style={formInlineStyles}>
              <FormLabel style={labelStyles}>Name:</FormLabel>
              <FormInput
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyles}
              />
            </FormInline>
            <FormInline style={formInlineStyles}>
              <FormLabel style={labelStyles}>Email:</FormLabel>
              <FormInput
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyles}
              />
            </FormInline>
            <FormInline style={formInlineStyles}>
              <FormLabel style={labelStyles}>Phone:</FormLabel>
              <div style={{ position: "relative", flex: 1 }}>
                <span style={prefixStyles}>+1</span>
                <FormInput
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="Enter phone number"
                  style={inputWithPrefixStyles}
                />
              </div>
            </FormInline>
            
            <FormInline style={formInlineStyles}>
              <FormLabel style={labelStyles}>Location:</FormLabel>
              <div style={{ flex: 1 }}>
                <Select
                  options={states}
                  value={location}
                  onChange={setLocation}
                  placeholder="Select a state"
                  styles={selectStyles} // Apply updated styles
                  isSearchable // Enable search in dropdown
                />
              </div>
            </FormInline>
            <FormInline style={formInlineStyles}>
              <FormLabel style={labelStyles}>Zip Code:</FormLabel>
              <FormInput
                value={zipCode}
                onChange={handleZipChange}
                placeholder="Enter zip code"
                style={inputStyles}
              />
            </FormInline>
            <div style={footerStyles}>
              <Button
                variant="secondary"
                onClick={onClose}
                style={buttonStyles}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                style={buttonStyles}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Styles for AddClientModal
const overlayStyles: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  zIndex: 1000,
};

const modalContainerStyles: React.CSSProperties = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "100%",
  zIndex: 1001,
};

const modalStyles: React.CSSProperties = {
  backgroundColor: "#fff",
  padding: "30px",
  borderRadius: "10px",
  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
  width: "500px",
  maxWidth: "90%",
  overflowY: "auto",
};

const headingStyles: React.CSSProperties = {
  marginBottom: "20px",
  fontSize: "24px",
  fontWeight: "600",
  color: "#333",
};

const formContainerStyles: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
};

const formInlineStyles: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
};

const labelStyles: React.CSSProperties = {
  width: "100px", // Fixed width for labels
  textAlign: "right",
  marginRight: "10px",
};

const inputStyles: React.CSSProperties = {
  flex: 1, // Input takes remaining space
};

const inputWithPrefixStyles: React.CSSProperties = {
  paddingLeft: "30px", // Add padding to accommodate the prefix
  flex: 1, // Input takes remaining space
};

const footerStyles: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  marginTop: "20px",
  gap: "10px",
};

const buttonStyles: React.CSSProperties = {
  padding: "10px 20px",
};

const prefixStyles: React.CSSProperties = {
  position: "absolute",
  left: "10px",
  top: "50%",
  transform: "translateY(-50%)",
  color: "#888",
  pointerEvents: "none",
};

// Styles for react-select
const selectStyles = {
  control: (provided: any) => ({
    ...provided,
    flex: 1,
    minHeight: "38px",
    borderColor: "#ccc",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#888",
    },
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: "#888",
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: "#333",
  }),
  input: (provided: any) => ({
    ...provided,
    width: "100%", // Full width for the search input
    outline: "none", // Remove outline on focus
  }),
  menu: (provided: any) => ({
    ...provided,
    zIndex: 9999,
  }),
  menuList: (provided: any) => ({
    ...provided,
    maxHeight: "200px",
    overflowY: "auto",
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#f0f0f0" : "#fff",
    color: state.isFocused ? "#000" : "#333",
    padding: "10px",
  }),
};

export default AddClientModal;
