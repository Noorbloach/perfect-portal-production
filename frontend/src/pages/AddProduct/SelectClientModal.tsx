import { useEffect, useState } from "react";
import axios from "axios";
import Button from "@/components/Base/Button";

interface Client {
  _id: string;
  name: string;
  email: string;
}

interface SelectClientModalProps {
  open: boolean;
  onClose: () => void;
  onClientSelect: (client: Client) => void;
}

const SelectClientModal: React.FC<SelectClientModalProps> = ({
  open,
  onClose,
  onClientSelect,
}) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (open) {
      fetchClients();
    }
  }, [open]);

  useEffect(() => {
    setFilteredClients(
      clients.filter((client) =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, clients]);

  const fetchClients = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/clients`
      );
      setClients(response.data.clients);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  if (!open) return null;

  return (
    <div style={overlayStyles} onClick={onClose}>
      <div style={modalContainerStyles} onClick={(e) => e.stopPropagation()}>
        <div style={modalStyles}>
          <h2 style={headerStyles}>Select Existing Client</h2>
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchInputStyles}
          />
          <ul style={listStyles}>
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <li
                  key={client._id}
                  onClick={() => onClientSelect(client)}
                  style={listItemStyles}
                >
                  {client.name}
                </li>
              ))
            ) : (
              <li style={listItemStyles}>No clients found</li>
            )}
          </ul>
          <Button onClick={onClose} style={buttonStyles}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

// Styles
const overlayStyles = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  zIndex: 1000,
};

const modalContainerStyles = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  zIndex: 1001,
};

const modalStyles = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "15px",
  width: "500px",
  maxWidth: "90%",
  maxHeight: "80vh",
  overflowY: "auto",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

const headerStyles = {
  margin: "0 0 20px",
  fontSize: "1.5rem",
  color: "#333",
  fontWeight: "bold",
};

const searchInputStyles = {
  width: "100%",
  padding: "12px",
  marginBottom: "20px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "1rem",
};

const listStyles = {
  listStyleType: "none",
  padding: 0,
  margin: 0,
};

const listItemStyles = {
  padding: "12px",
  cursor: "pointer",
  borderRadius: "8px",
  border: "1px solid #ddd",
  marginBottom: "10px",
  transition: "background-color 0.3s, box-shadow 0.3s",
  backgroundColor: "#f9f9f9",
  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
};

const listItemHoverStyles = {
  backgroundColor: "#e0e0e0",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
};

const buttonStyles = {
  marginTop: "20px",
};

export default SelectClientModal;
