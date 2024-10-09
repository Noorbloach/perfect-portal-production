import { useState, Fragment, useEffect } from "react";
import axios from "axios";
import Lucide from "@/components/Base/Lucide";
import Breadcrumb from "@/components/Base/Breadcrumb";
import { FormInput } from "@/components/Base/Form";
import { Menu, Popover } from "@/components/Base/Headless";
import fakerData from "@/utils/faker";
import { Transition } from "@headlessui/react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

interface Notification {
  _id: string;
  message: string;
  read: boolean;
}

function Main() {
  const [searchDropdown, setSearchDropdown] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notificationsLimit, setNotificationsLimit] = useState(5); // Control the number of notifications shown initially
  const [notificationsOpened, setNotificationsOpened] = useState(false);

  const [unreadCount, setUnreadCount] = useState(0);

  const navigate = useNavigate();

  const showSearchDropdown = () => setSearchDropdown(true);
  const hideSearchDropdown = () => setSearchDropdown(false);

  const token = localStorage.getItem("token");
  const [userId, setUserId] = useState<string | null>(null);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    role: "",
    address: "",
    phoneNo: "",
    profilePic: "",
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.userId);
      return decodedToken.userId;
    }
    return null;
  };

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
  useEffect(() => {
    if (userId) {
      const fetchNotifications = async () => {
        try {
          const response = await axios.get<{ data: Notification[] }>(
            `${
              import.meta.env.VITE_REACT_APP_API_BASE_URL
            }/notifications/user/${userId}`
          );
          setNotifications(response.data.data);
          const unread = response.data.data.filter((n) => !n.read).length;
          setUnreadCount(unread);
          setLoadingNotifications(false);
        } catch (err) {
          setError("Failed to load notifications");
          setLoadingNotifications(false);
        }
      };

      fetchNotifications();
    }
  }, [userId]);

  const loadMoreNotifications = () => {
    setNotificationsLimit((prevLimit) => prevLimit + 5); // Increase the limit by 5
  };

  // Handler for Reset Password menu item
  const handleResetPasswordClick = () => {
    navigate("/change-password");
  };

  // Handler for Add Account menu item
  const handleAddAccountClick = () => {
    navigate("/register");
  };

  const handleNotificationClick = async (notification: Notification) => {
    try {
      // Call the API to mark the notification as read
      await axios.put(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/notifications/mark-read/${notification._id}`
      );

      // Update the state to reflect that this notification has been read
      setNotifications((prev) =>
        prev.map((n) => (n._id === notification._id ? { ...n, read: true } : n))
      ); // Mark notification as clicked
      setUnreadCount((prev) => prev - 1);
      // Navigate based on user role
      if (userData.role === "admin") {
        navigate("/product-list");
      } else if (userData.role === "employee") {
        navigate("/project-approved");
      } // Navigate to the desired route
    } catch (error) {
      console.error("Error marking notification as read:", error);
      // You can also set an error state if needed
    }
  };

  // Handler for Profile menu item
  const handleProfileClick = () => {
    navigate("/update-profile");
  };

  return (
    <>
      {/* BEGIN: Top Bar */}
      <div className="h-[67px] z-[51] flex items-center relative border-b border-slate-200">
        {/* BEGIN: Breadcrumb */}
        <Breadcrumb className="hidden mr-auto -intro-x sm:flex">
          <Breadcrumb.Link to="/">Application</Breadcrumb.Link>
          <Breadcrumb.Link to="/" active={true}>
            Dashboard
          </Breadcrumb.Link>
        </Breadcrumb>
        {/* END: Breadcrumb */}
        {/* BEGIN: Search */}

        {/* END: Search */}
        {/* BEGIN: Notifications */}
        {userData.role !== "management" && (
          <Popover className="mr-auto intro-x sm:mr-6">
            <Popover.Button
              className="relative text-slate-600 outline-none block"
              onClick={() => setNotificationsOpened(true)}
            >
              <Lucide icon="Bell" className="w-5 h-5 dark:text-slate-500" />
              {unreadCount > 0 &&
                !notificationsOpened && ( // Only show the red dot if there are unread notifications and notifications are closed
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-danger"></span>
                )}
            </Popover.Button>
            <Popover.Panel className="w-[280px] sm:w-[350px] p-5 mt-2 bg-white shadow-lg rounded-lg border border-slate-200 overflow-hidden">
              <div className="mb-5 font-medium">Notifications</div>
              <div className="max-h-[300px] overflow-y-auto">
                {loadingNotifications ? (
                  <div>Loading...</div>
                ) : error ? (
                  <div className="text-red-500">{error}</div>
                ) : notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification._id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`flex items-center mt-2 p-2 rounded-lg transition-all ${
                        notification.read ? "bg-white" : "bg-gray-100"
                      } hover:bg-blue-100`}
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary/80">
                        <Lucide icon="Bell" className="w-4 h-4" />
                      </div>
                      <div className="ml-3">{notification.message}</div>
                    </div>
                  ))
                ) : (
                  <div>No notifications</div>
                )}
              </div>
            </Popover.Panel>
          </Popover>
        )}
        {/* END: Notifications */}
        {/* BEGIN: Account Menu */}
        <Menu>
          <Menu.Button className="block w-8 h-8 overflow-hidden rounded-full shadow-lg image-fit zoom-in intro-x">
            <img
              alt="Midone Tailwind HTML Admin Template"
              src={`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/uploads/${
                userData.profilePic || "user.jpg"
              }`}
            />
          </Menu.Button>
          <Menu.Items className="w-56 mt-px text-white bg-primary">
            <Menu.Header className="font-normal">
              <div className="font-medium">{userData.name}</div>
              <div className="text-xs text-white/70 mt-0.5 dark:text-slate-500">
                {userData.role}
              </div>
            </Menu.Header>
            <Menu.Divider className="bg-white/[0.08]" />
            <Menu.Item
              className="hover:bg-white/5"
              onClick={handleProfileClick}
            >
              <Lucide icon="User" className="w-4 h-4 mr-2" /> Profile
            </Menu.Item>
            <Menu.Item
              className="hover:bg-white/5"
              onClick={handleAddAccountClick}
            >
              <Lucide icon="FilePenLine" className="w-4 h-4 mr-2" /> Add Account
            </Menu.Item>
            <Menu.Item
              className="hover:bg-white/5"
              onClick={handleResetPasswordClick}
            ></Menu.Item>
            <Menu.Divider className="bg-white/[0.08]" />
            <Menu.Item className="hover:bg-white/5">
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md hover:bg-slate-100 w-full text-left flex"
              >
                <Lucide icon="LogOut" className="w-4 h-4 mr-2" />
                Logout
              </button>
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>
      {/* END: Top Bar */}
    </>
  );
}

export default Main;
