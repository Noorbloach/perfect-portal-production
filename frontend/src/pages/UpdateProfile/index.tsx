import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode for decoding the token
import Button from "@/components/Base/Button";
import { FormInput, FormLabel, FormTextarea } from "@/components/Base/Form";
import Lucide from "@/components/Base/Lucide";
import { decode } from "punycode";

function Main() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    role: "",
    address: "",
    phoneNo: "",
    profilePic: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // State to manage edit mode

  // Decode the JWT token and extract the userId
  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token"); // Fetch the token from localStorage (or sessionStorage)
    if (token) {
      const decodedToken = jwtDecode(token); // Decode the token

      return decodedToken.userId; // Extract and return userId
    }
    return null;
  };

  // Fetch user data from the backend
  useEffect(() => {
    const fetchUserData = async () => {
      const userId = getUserIdFromToken(); // Get the userId from the token
      if (!userId) {
        console.error("User is not authenticated");
        return;
      }

      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_REACT_APP_API_BASE_URL
          }/api/auth/user-details/${userId}`
        ); // Fetch user details by userId
        setUserData({
          name: response.data.user.name,
          email: response.data.user.email,
          role: response.data.user.role,
          address: response.data.user.address,
          phoneNo: response.data.user.phoneNo,
          profilePic: response.data.user.profilePic,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };
  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };
  // Enable edit mode for address and phoneNo
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // Update user details
  // Update user details, including the profile image
  const handleUpdateClick = async () => {
    const userId = getUserIdFromToken();
    const formData = new FormData();

    // Append form data
    formData.append("name", userData.name);
    formData.append("phoneNo", userData.phoneNo);
    formData.append("address", userData.address);
    if (selectedImage) {
      formData.append("profileImage", selectedImage); // Append the selected image
    }

    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/api/auth/update-details/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setIsEditing(false); // Disable editing after update
      console.log("User details updated:", response.data);
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };

  return (
    <>
      <div className="flex items-center mt-8 intro-y">
        <h2 className="mr-auto text-lg font-medium">Update Profile</h2>
      </div>
      {console.log(userData.profilePic)}
      <div className="grid grid-cols-12 gap-6">
        {/* BEGIN: Profile Menu */}
        {/* Profile Menu */}
        <div className="flex flex-col-reverse col-span-12 lg:col-span-4 2xl:col-span-3 lg:block">
          <div className="mt-5 intro-y box">
            <div className="relative flex items-center p-5">
              <div className="w-12 h-12 image-fit">
                <img
                  alt="Profile"
                  className="rounded-full"
                  src={`${
                    import.meta.env.VITE_REACT_APP_API_BASE_URL
                  }/uploads/${userData.profilePic || "user.jpg"}`} // Construct full URL
                />
              </div>
              <div className="ml-4 mr-auto">
                <div className="text-base font-medium">{userData.name}</div>
                <div className="text-slate-500">{userData.email}</div>
              </div>
            </div>
            <div className="p-5 border-t border-slate-200/60 dark:border-darkmode-400">
              {userData.role !== "superadmin" && (
                <a className="flex items-center" href="profile-overview-3">
                  <Lucide icon="Activity" className="w-4 h-4 mr-2" /> Personal
                  Information
                </a>
              )}
              {userData.role !== "superadmin" && (
                <a
                  className="flex items-center font-medium text-primary mt-5"
                  href="/update-profile"
                >
                  <Lucide icon="Settings" className="w-4 h-4 mr-2" /> Update
                  Profile
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-8 2xl:col-span-9">
          {/* BEGIN: Display Information */}
          <div className="intro-y box lg:mt-5">
            <div className="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
              <h2 className="mr-auto text-base font-medium">
                Display Information
              </h2>
            </div>
            <div className="p-5">
              <div className="flex flex-col xl:flex-row">
                <div className="flex-1 mt-6 xl:mt-0">
                  <div className="grid grid-cols-12 gap-x-5">
                    <div className="col-span-12 2xl:col-span-6">
                      <div>
                        <FormLabel htmlFor="display-name">
                          Display Name
                        </FormLabel>
                        <FormInput
                          id="display-name"
                          type="text"
                          name="name"
                          value={userData.name}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="mt-3">
                        <FormLabel htmlFor="role">Role</FormLabel>
                        <FormInput
                          id="role"
                          type="text"
                          name="role"
                          value={userData.role}
                          onChange={handleInputChange}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="col-span-12 2xl:col-span-6">
                      <div>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <FormInput
                          id="email"
                          type="email"
                          name="email"
                          value={userData.email}
                          onChange={handleInputChange}
                          disabled
                        />
                      </div>
                      <div className="mt-3">
                        <FormLabel htmlFor="phoneNo">Phone Number</FormLabel>
                        <FormInput
                          id="phoneNo"
                          type="text"
                          name="phoneNo"
                          value={userData.phoneNo}
                          onChange={handleInputChange}
                          disabled={!isEditing} // Enable only in edit mode
                        />
                      </div>
                    </div>
                    <div className="col-span-12">
                      <div className="mt-3">
                        <FormLabel htmlFor="address">Address</FormLabel>
                        <FormTextarea
                          id="address"
                          name="address"
                          value={userData.address}
                          onChange={handleInputChange}
                          disabled={!isEditing} // Enable only in edit mode
                        />
                      </div>
                      <div className="mt-3">
                        <FormLabel htmlFor="profilePic">
                          Profile Image
                        </FormLabel>
                        <FormInput
                          id="profilePic"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Button toggling between Edit and Update */}
                  {!isEditing ? (
                    <Button
                      variant="primary"
                      type="button"
                      className="w-20 mt-3"
                      onClick={handleEditClick}
                    >
                      Edit
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      type="button"
                      className="w-20 mt-3"
                      onClick={handleUpdateClick}
                    >
                      Update
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* END: Display Information */}
        </div>
      </div>
    </>
  );
}

export default Main;
