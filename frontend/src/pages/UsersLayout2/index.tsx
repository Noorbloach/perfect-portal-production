// import React, { useEffect, useState, ChangeEvent } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import Button from '@/components/Base/Button';
// import Pagination from '@/components/Base/Pagination';
// import { FormInput, FormSelect } from '@/components/Base/Form';
// import Lucide from '@/components/Base/Lucide';
// import _ from 'lodash';

// interface User {
//   name: string;
//   role: string;
//   email: string;
//   address?: string;
//   phoneNo?: string;
//   profilePic:string;
// }

// const UserModal = ({ user, onClose }: { user: User | null; onClose: () => void }) => {
//   if (!user) return null;

//   return (
//     <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
//       <div className="bg-white p-5 rounded shadow-lg max-w-md w-full">
//         <h3 className="text-lg font-semibold">User Details</h3>
//         <div className="mt-4">
//           <p><strong>Name:</strong> {user.name}</p>
//           <p><strong>Email:</strong> {user.email}</p>
//           <p><strong>Role:</strong> {user.role}</p>
//           <p><strong>Address:</strong> {user.address}</p>
//           <p><strong>Phone No:</strong> {user.phoneNo}</p>
//         </div>
//         <button
//           className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
//           onClick={onClose}
//         >
//           Close
//         </button>
//       </div>
//     </div>
//   );
// };

// function Main() {
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await axios.get<User[]>('${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/auth/users');
//         setUsers(response.data);
//       } catch (error) {
//         console.error('Error fetching users:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   const totalPages = Math.ceil(users.length / itemsPerPage);

//   const handlePageChange = (page: number) => {
//     if (page < 1 || page > totalPages) return;
//     setCurrentPage(page);
//   };

//   const handleItemsPerPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
//     setItemsPerPage(Number(e.target.value));
//     setCurrentPage(1);
//   };

//   const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(e.target.value);
//     setCurrentPage(1);
//   };

//   let filteredUsers = users;
//   if (searchTerm.trim() !== '') {
//     filteredUsers = users.filter(user =>
//       user.name.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }

//   const currentUsers = _.slice(
//     filteredUsers,
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const handleAddNewUser = () => {
//     navigate('/register');
//   };

//   const handleProfileClick = async (userId: string) => {
//     try {
//       const response = await axios.get<User>(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/auth/user/${userId}`);
//       setSelectedUser(response.data);
//       setIsModalOpen(true);
//     } catch (error) {
//       console.error('Error fetching user details:', error);
//     }
//   };

//   return (
//     <>
//       <h2 className="mt-10 text-lg font-medium intro-y">Users Layout</h2>
//       <div className="grid grid-cols-12 gap-6 mt-5">
//         <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
//           <Button
//             variant="primary"
//             className="mr-2 shadow-md"
//             onClick={handleAddNewUser}
//           >
//             Add New User
//           </Button>

//           <div className="hidden mx-auto md:block text-slate-500">
//             Showing{' '}
//             {itemsPerPage * (currentPage - 1) + 1} to{' '}
//             {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of{' '}
//             {filteredUsers.length} entries
//           </div>
//           <div className="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
//             <div className="relative w-56 text-slate-500">
//               <FormInput
//                 type="text"
//                 className="w-56 pr-10 !box"
//                 placeholder="Search..."
//                 value={searchTerm}
//                 onChange={handleSearchInputChange}
//               />
//               <Lucide
//                 icon="Search"
//                 className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
//               />
//             </div>
//           </div>
//         </div>
//         {currentUsers.map((user, index) => (
//           <div key={index} className="col-span-12 intro-y md:col-span-6">
//             <div className="box">
//               <div className="flex flex-col items-center p-5 lg:flex-row">
//                 <div className="w-24 h-24 lg:w-12 lg:h-12 image-fit lg:mr-1">
//                   <img
//                     alt="User Avatar"
//                     className="rounded-full"
//                     src={`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/uploads/${user.profilePic || 'user.jpg'}`} // Updated image path
//                   />
//                 </div>
//                 <div className="mt-3 text-center lg:ml-2 lg:mr-auto lg:text-left lg:mt-0">
//                   <a href="#" className="font-medium">
//                     {user.name}
//                   </a>
//                   <div className="text-slate-500 text-xs mt-0.5">
//                     {user.role}
//                   </div>
//                 </div>
//                 <div className="flex mt-4 lg:mt-0">
//                   <Button variant="outline-secondary" className="px-2 py-1" onClick={() => handleProfileClick(user._id)}>
//                     Profile
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//         <div className="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap">
//           <Pagination
//             className="w-full sm:w-auto sm:mr-auto"
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={handlePageChange}
//           />
//           <FormSelect
//             className="w-20 mt-3 !box sm:mt-0"
//             value={itemsPerPage}
//             onChange={handleItemsPerPageChange}
//           >
//             <option value={10}>10</option>
//             <option value={25}>25</option>
//             <option value={50}>50</option>
//           </FormSelect>
//         </div>
//       </div>

//       {isModalOpen && (
//         <UserModal
//           user={selectedUser}
//           onClose={() => setIsModalOpen(false)}
//         />
//       )}
//     </>
//   );
// }

// export default Main;
import React, { useEffect, useState, ChangeEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Base/Button";
import Pagination from "@/components/Base/Pagination";
import { FormInput, FormSelect } from "@/components/Base/Form";
import Lucide from "@/components/Base/Lucide";
import _ from "lodash";

interface User {
  _id: string; // Assuming you have an id for the user
  name: string;
  role: string;
  email: string;
  address?: string;
  phoneNo?: string;
  profilePic: string;
}

const UserModal = ({
  user,
  onClose,
}: {
  user: User | null;
  onClose: () => void;
}) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
      <div className="bg-white p-5 rounded shadow-lg max-w-md w-full">
        <h3 className="text-lg font-semibold">User Details</h3>
        <div className="mt-4">
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
          <p>
            <strong>Address:</strong> {user.address}
          </p>
          <p>
            <strong>Phone No:</strong> {user.phoneNo}
          </p>
        </div>
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

function Main() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get<User[]>(
          `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/auth/users`
        );
        const employeeUsers = response.data.filter(
          (user) => user.role === "employee"
        ); // Filter for employees
        setUsers(employeeUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const totalPages = Math.ceil(users.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  let filteredUsers = users;
  if (searchTerm.trim() !== "") {
    filteredUsers = users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  const currentUsers = _.slice(
    filteredUsers,
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddNewUser = () => {
    navigate("/register");
  };

  const handleProfileClick = async (userId: string) => {
    try {
      const response = await axios.get<User>(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/auth/user/${userId}`
      );
      setSelectedUser(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  return (
    <>
      <h2 className="mt-10 text-lg font-medium intro-y">Users Layout</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
          <Button
            variant="primary"
            className="mr-2 shadow-md"
            onClick={handleAddNewUser}
          >
            Add New User
          </Button>

          <div className="hidden mx-auto md:block text-slate-500">
            Showing {itemsPerPage * (currentPage - 1) + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of{" "}
            {filteredUsers.length} entries
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
        </div>
        {currentUsers.map((user, index) => (
          <div key={index} className="col-span-12 intro-y md:col-span-6">
            <div className="box">
              <div className="flex flex-col items-center p-5 lg:flex-row">
                <div className="w-24 h-24 lg:w-12 lg:h-12 image-fit lg:mr-1">
                  <img
                    alt="User Avatar"
                    className="rounded-full"
                    src={`${
                      import.meta.env.VITE_REACT_APP_API_BASE_URL
                    }/uploads/${user.profilePic || "user.jpg"}`} // Updated image path
                  />
                </div>
                <div className="mt-3 text-center lg:ml-2 lg:mr-auto lg:text-left lg:mt-0">
                  <a href="#" className="font-medium">
                    {user.name}
                  </a>
                  <div className="text-slate-500 text-xs mt-0.5">
                    {user.role}
                  </div>
                </div>
                <div className="flex mt-4 lg:mt-0">
                  <Button
                    variant="outline-secondary"
                    className="px-2 py-1"
                    onClick={() => handleProfileClick(user._id)}
                  >
                    Profile
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap">
          <Pagination
            className="w-full sm:w-auto sm:mr-auto"
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
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
      </div>

      {isModalOpen && (
        <UserModal user={selectedUser} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}

export default Main;
