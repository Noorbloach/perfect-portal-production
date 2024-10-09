import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface User {
  _id: string;
  name: string;
}

interface Message {
  _id?: string; // Add _id for comparison
  sender: string;
  receiver: string;
  message: string;
  timestamp: string;
}

interface DecodedToken {
  userId: string;
}

const Main = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [chatUsers, setChatUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"chats" | "friends">("chats");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Fetch all users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/auth/users`
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Fetch current user ID from token
  useEffect(() => {
    const fetchUserId = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = jwtDecode<DecodedToken>(token);
          setCurrentUserId(decodedToken.userId);
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }
    };
    fetchUserId();
  }, []);

  // Fetch users with chat history
  useEffect(() => {
    if (currentUserId) {
      const fetchChatUsers = async () => {
        try {
          const response = await axios.get(
            `${
              import.meta.env.VITE_REACT_APP_API_BASE_URL
            }/api/chat/users/${currentUserId}`
          );
          setChatUsers(response.data);
        } catch (error) {
          console.error("Error fetching chat users:", error);
        }
      };
      fetchChatUsers();
    }
  }, [currentUserId]);

  // Setup WebSocket connection
  useEffect(() => {
    if (currentUserId) {
      const ws = new WebSocket("ws://localhost:3000");

      ws.onopen = () => {
        console.log("WebSocket connection opened");
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        // Update messages state immediately, avoiding duplicates
        setMessages((prevMessages) => {
          const exists = prevMessages.some(
            (msg) => msg._id === data._id // Check by unique identifier
          );

          if (!exists) {
            return [...prevMessages, data];
          }
          return prevMessages; // Return unchanged state if it exists
        });
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed, attempting to reconnect...");
        // Optional: handle reconnection logic here
      };

      setWs(ws);

      return () => {
        ws.close();
      };
    }
  }, [currentUserId]);

  // Fetch chat history when a user is selected
  useEffect(() => {
    if (selectedUser && currentUserId) {
      const fetchChatHistory = async () => {
        try {
          const response = await axios.get(
            `${
              import.meta.env.VITE_REACT_APP_API_BASE_URL
            }/api/chat/history/${currentUserId}/${selectedUser._id}`
          );
          setMessages(response.data);
        } catch (error) {
          console.error("Error fetching chat history:", error);
        }
      };
      fetchChatHistory();
    }
  }, [selectedUser, currentUserId]);

  // Scroll to the bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!message.trim() || !selectedUser) return;

    const newMessage: Message = {
      sender: currentUserId!,
      receiver: selectedUser._id,
      message,
      timestamp: new Date().toISOString(),
    };

    console.log("Sending message:", newMessage);

    try {
      // Send the message to the server
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/chat/message`,
        newMessage
      );

      const savedMessage = response.data;

      // Update messages state immediately
      setMessages((prevMessages) => {
        const exists = prevMessages.some((msg) => msg._id === savedMessage._id);
        if (!exists) {
          return [...prevMessages, savedMessage];
        }
        return prevMessages;
      });

      // Send the message via WebSocket
      if (ws) {
        ws.send(JSON.stringify(savedMessage));
      }

      // Clear the input field
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Helper function to get the last message for a user
  const getLastMessage = (userId: string) => {
    const lastMessage = messages
      .filter(
        (msg) =>
          (msg.sender === currentUserId && msg.receiver === userId) ||
          (msg.sender === userId && msg.receiver === currentUserId)
      )
      .slice(-1)[0];
    return lastMessage
      ? `${lastMessage.sender === currentUserId ? "You: " : ""}${
          lastMessage.message
        }`
      : "";
  };

  // Filter friends based on search query
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar with Tabs */}
      <div className="w-1/3 max-w-sm border-r border-blue-500 p-4 bg-white shadow-lg overflow-y-auto">
        <div className="flex justify-between mb-4">
          <button
            className={`w-1/2 p-2 text-center border border-blue-500 rounded-md ${
              activeTab === "chats"
                ? "bg-blue-500 text-white font-bold"
                : "bg-white text-blue-500"
            }`}
            onClick={() => setActiveTab("chats")}
          >
            Chats
          </button>
          <button
            className={`w-1/2 p-2 text-center border border-blue-500 rounded-md ${
              activeTab === "friends"
                ? "bg-blue-500 text-white font-bold"
                : "bg-white text-blue-500"
            }`}
            onClick={() => setActiveTab("friends")}
          >
            Friends
          </button>
        </div>

        {activeTab === "chats" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Chats</h2>
            <ul className="list-none p-0">
              {chatUsers.map((user) => (
                <li
                  key={user._id}
                  className={`p-3 border-b border-blue-300 cursor-pointer flex items-center hover:bg-blue-100 rounded-md transition-colors ${
                    selectedUser?._id === user._id
                      ? "bg-blue-500 text-white"
                      : ""
                  }`}
                  onClick={() => setSelectedUser(user)}
                >
                  <div
                    className={`w-10 h-10 rounded-full bg-blue-400 text-white flex items-center justify-center mr-3 text-lg`}
                  >
                    {user.name[0]}
                  </div>
                  <div className="flex-1">
                    <div
                      className={`font-semibold text-lg ${
                        selectedUser?._id === user._id
                          ? "text-white"
                          : "text-black"
                      }`}
                    >
                      {user.name}
                    </div>
                    <div className="text-black-400 text-sm">
                      {getLastMessage(user._id)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === "friends" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Friends</h2>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 border border-blue-300 rounded-md mb-4"
              placeholder="Search friends by name"
            />
            <ul className="list-none p-0">
              {filteredUsers.map((user) => (
                <li
                  key={user._id}
                  className={`p-3 cursor-pointer flex items-center hover:bg-blue-100 rounded-md transition-colors ${
                    selectedUser?._id === user._id
                      ? "bg-blue-500 text-white"
                      : ""
                  } border-b border-blue-300`}
                  onClick={() => setSelectedUser(user)}
                >
                  <div
                    className={`w-10 h-10 rounded-full bg-blue-400 text-white flex items-center justify-center mr-3 text-lg`}
                  >
                    {user.name[0]}
                  </div>
                  <div className="font-semibold">{user.name}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Chat Section */}
      {selectedUser && (
        <div className="w-2/3 p-4 flex flex-col bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-blue-500 p-4 bg-gray-50">
            <h2 className="text-xl font-semibold">{selectedUser.name}</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
            {messages.map((msg, index) => (
              <div
                key={msg._id || index} // Use _id for keys, or index as fallback
                className={`flex ${
                  msg.sender === currentUserId ? "justify-end" : "justify-start"
                } mb-3`}
              >
                <div
                  className={`p-3 rounded-lg max-w-xs ${
                    msg.sender === currentUserId
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                  <p className="text-xs text-white-500">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="border-t border-blue-500 p-4 flex items-center bg-gray-50">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 border border-blue-300 p-2 rounded-l-md"
              placeholder="Type a message"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white p-2 rounded-r-md ml-2 hover:bg-blue-600 transition-colors"
            >
              Send
            </button>
          </div>
          <div className="text-center text-xs text-gray-500 mt-2 italic">
            All chats are end-to-end encrypted
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;

// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";

// interface User {
//   _id: string;
//   name: string;
// }

// interface Message {
//   _id?: string; // Add _id for comparison
//   sender: string;
//   receiver: string;
//   message: string;
//   timestamp: string;
// }

// interface DecodedToken {
//   userId: string;
// }

// const Main = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [chatUsers, setChatUsers] = useState<User[]>([]);
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [message, setMessage] = useState<string>("");
//   const messagesEndRef = useRef<HTMLDivElement | null>(null);
//   const [ws, setWs] = useState<WebSocket | null>(null);
//   const [currentUserId, setCurrentUserId] = useState<string | null>(null);
//   const [activeTab, setActiveTab] = useState<"chats" | "friends">("chats");
//   const [searchQuery, setSearchQuery] = useState<string>("");

//   // Fetch all users from the API
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await axios.get("${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/auth/users");
//         setUsers(response.data);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       }
//     };
//     fetchUsers();
//   }, []);

//   // Fetch current user ID from token
//   useEffect(() => {
//     const fetchUserId = () => {
//       const token = localStorage.getItem("token");
//       if (token) {
//         try {
//           const decodedToken = jwtDecode<DecodedToken>(token);
//           setCurrentUserId(decodedToken.userId);
//         } catch (error) {
//           console.error("Error decoding token:", error);
//         }
//       }
//     };
//     fetchUserId();
//   }, []);

//   // Fetch users with chat history
//   useEffect(() => {
//     if (currentUserId) {
//       const fetchChatUsers = async () => {
//         try {
//           const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/chat/users/${currentUserId}`);
//           setChatUsers(response.data);
//         } catch (error) {
//           console.error("Error fetching chat users:", error);
//         }
//       };
//       fetchChatUsers();
//     }
//   }, [currentUserId]);

//   // Setup WebSocket connection
//   useEffect(() => {
//     if (currentUserId) {
//       const ws = new WebSocket("ws://localhost:3000");

//       ws.onopen = () => {
//         console.log("WebSocket connection opened");
//       };

//       ws.onmessage = (event) => {
//         const data = JSON.parse(event.data);
//         // Update messages state immediately, avoiding duplicates
//         setMessages((prevMessages) => {
//           const exists = prevMessages.some((msg) => msg._id === data._id);
//           if (!exists) {
//             return [...prevMessages, data];
//           }
//           return prevMessages; // Return unchanged state if it exists
//         });
//       };

//       ws.onclose = () => {
//         console.log("WebSocket connection closed, attempting to reconnect...");
//         // Optional: handle reconnection logic here
//       };

//       setWs(ws);
//       return () => {
//         ws.close();
//       };
//     }
//   }, [currentUserId]);

//   // Fetch chat history when a user is selected
//   useEffect(() => {
//     if (selectedUser && currentUserId) {
//       const fetchChatHistory = async () => {
//         try {
//           const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/chat/history/${currentUserId}/${selectedUser._id}`);
//           setMessages(response.data);
//         } catch (error) {
//           console.error("Error fetching chat history:", error);
//         }
//       };
//       fetchChatHistory();
//     }
//   }, [selectedUser, currentUserId]);

//   // Scroll to the bottom when messages update
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // Handle sending a new message
//   const handleSendMessage = async () => {
//     if (!message.trim() || !selectedUser) return;

//     const newMessage: Message = {
//       sender: currentUserId!,
//       receiver: selectedUser._id,
//       message,
//       timestamp: new Date().toISOString(),
//     };

//     console.log("Sending message:", newMessage);

//     try {
//       // Send the message to the server
//       const response = await axios.post("${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/chat/message", newMessage);
//       const savedMessage = response.data;

//       // Update messages state immediately
//       setMessages((prevMessages) => {
//         const exists = prevMessages.some((msg) => msg._id === savedMessage._id);
//         if (!exists) {
//           return [...prevMessages, savedMessage];
//         }
//         return prevMessages;
//       });

//       // Send the message via WebSocket
//       if (ws) {
//         ws.send(JSON.stringify(savedMessage));
//       }

//       // Clear the input field
//       setMessage("");
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   // Helper function to get the last message for a user
//   const getLastMessage = (userId: string) => {
//     const lastMessage = messages
//       .filter(
//         (msg) =>
//           (msg.sender === currentUserId && msg.receiver === userId) ||
//           (msg.sender === userId && msg.receiver === currentUserId)
//       )
//       .slice(-1)[0];
//     return lastMessage
//       ? `${lastMessage.sender === currentUserId ? "You: " : ""}${lastMessage.message}`
//       : "";
//   };

//   // Filter friends based on search query
//   const filteredUsers = users.filter((user) =>
//     user.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar with Tabs */}
//       <div className="w-1/3 max-w-sm border-r border-blue-500 p-4 bg-white shadow-lg overflow-y-auto">
//         <div className="flex justify-between mb-4">
//           <button
//             className={`w-1/2 p-2 text-center border border-blue-500 rounded-md ${
//               activeTab === "chats"
//                 ? "bg-blue-500 text-white font-bold"
//                 : "bg-white text-blue-500"
//             }`}
//             onClick={() => setActiveTab("chats")}
//           >
//             Chats
//           </button>
//           <button
//             className={`w-1/2 p-2 text-center border border-blue-500 rounded-md ${
//               activeTab === "friends"
//                 ? "bg-blue-500 text-white font-bold"
//                 : "bg-white text-blue-500"
//             }`}
//             onClick={() => setActiveTab("friends")}
//           >
//             Friends
//           </button>
//         </div>

//         {activeTab === "chats" && (
//           <div>
//             <h2 className="text-xl font-semibold mb-4">Chats</h2>
//             <ul className="list-none p-0">
//               {chatUsers.map((user) => (
//                 <li
//                   key={user._id}
//                   className={`p-3 border-b border-blue-300 cursor-pointer flex items-center hover:bg-blue-100 rounded-md transition-colors ${
//                     selectedUser?._id === user._id ? "bg-blue-500 text-white" : ""
//                   }`}
//                   onClick={() => setSelectedUser(user)}
//                 >
//                   <div className={`w-10 h-10 rounded-full bg-blue-400 text-white flex items-center justify-center mr-3 text-lg`}>
//                     {user.name[0]}
//                   </div>
//                   <div className="flex-1">
//                     <div className={`font-semibold text-lg ${selectedUser?._id === user._id ? "text-white" : "text-black"}`}>
//                       {user.name}
//                     </div>
//                     <div className="text-black-400 text-sm">
//                       {getLastMessage(user._id)}
//                     </div>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}

//         {activeTab === "friends" && (
//           <div>
//             <h2 className="text-xl font-semibold mb-4">Friends</h2>
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full p-2 border border-blue-300 rounded-md mb-4"
//               placeholder="Search friends by name"
//             />
//             <ul className="list-none p-0">
//               {filteredUsers.map((user) => (
//                 <li
//                   key={user._id}
//                   className={`p-3 cursor-pointer flex items-center hover:bg-blue-100 rounded-md transition-colors ${
//                     selectedUser?._id === user._id ? "bg-blue-500 text-white" : ""
//                   } border-b border-blue-300`}
//                   onClick={() => setSelectedUser(user)}
//                 >
//                   <div className={`w-10 h-10 rounded-full bg-blue-400 text-white flex items-center justify-center mr-3 text-lg`}>
//                     {user.name[0]}
//                   </div>
//                   <div className={`font-semibold ${selectedUser?._id === user._id ? "text-white" : "text-black"}`}>
//                     {user.name}
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </div>

//       {/* Chat Area */}
//       <div className="flex-1 p-4 flex flex-col">
//         <div className="flex-1 overflow-y-auto bg-white border border-blue-500 rounded-md p-4 shadow-lg">
//           <h2 className="text-xl font-semibold mb-4">{selectedUser ? selectedUser.name : "Select a user to chat"}</h2>
//           <div className="flex flex-col space-y-2">
//             {messages.map((msg) => (
//               <div key={msg.timestamp} className={`p-2 rounded-md ${msg.sender === currentUserId ? "bg-blue-500 text-white self-end" : "bg-gray-300 text-black self-start"}`}>
//                 <span>{msg.message}</span>
//                 <span className="text-xs text-gray-500">
//                   {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                 </span>
//               </div>
//             ))}
//             <div ref={messagesEndRef} />
//           </div>
//         </div>
//         <div className="border-t border-blue-500 p-4 flex items-center bg-gray-50">
//           <input
//             type="text"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             onKeyDown={(e) => {
//               if (e.key === 'Enter') {
//                 e.preventDefault(); // Prevent the default behavior (newline)
//                 handleSendMessage(); // Call the function to send the message
//               }
//             }}
//             className="flex-1 border border-blue-300 p-3 rounded-l-md text-lg" // Increased padding for larger input box
//             placeholder="Type a message"
//           />
//           <button
//             onClick={handleSendMessage}
//             className="bg-blue-500 text-white p-3 rounded-r-md ml-2 hover:bg-blue-600 transition-colors transform hover:scale-105" // Added hover effect
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Main;
