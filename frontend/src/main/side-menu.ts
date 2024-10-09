import { type Menu } from "@/stores/menuSlice";

const menu: Array<Menu | "divider"> = [
  {
    icon: "Home",
    title: "Dashboard",
    subMenu: [
      {
        icon: "Activity",
        pathname: "/",
        title: "Overview 1",
      },
    ],
  },
  {
    icon: "ShoppingBag",
    title: "Projects",
    subMenu: [
     
      {
        icon: "Activity",
        pathname: "/add-product",
        title: "Add Project",
      },
      {
        icon: "Activity",
        pathname: "/products",
        title: "Projects",
        subMenu: [
          
          {
            icon: "Zap",
            pathname: "/project-approved",
            title: "Project Approved",
          },
          {
            icon: "Zap",
            pathname: "/product-list",
            title: "Project List",
          },
          
        ],
        
      },
     
    ],
  },  
  {
    icon: "MessageSquare",
    pathname: "/chat",
    title: "Chat",
  },
  
  {
    icon: "Users",
    pathname: "/clients",
    title: "Clients",
  },
  "divider",
  
  {
    icon: "Users",
    pathname: "/users-layout-2",
    title: "Users",
  },
  
      {
        icon: "Activity",
        pathname: "/profile-overview-3",
        title: "Profile",
      },
  {
    icon: "PanelsTopLeft",
    title: "Pages",
    subMenu: [
      
      
      {
        icon: "Activity",
        pathname: "login",
        title: "Login",
      },
      {
        icon: "Activity",
        pathname: "register",
        title: "Register",
      },
      {
        icon: "Activity",
        pathname: "error-page",
        title: "Error Page",
      },
      {
        icon: "Activity",
        pathname: "/update-profile",
        title: "Update profile",
      },
      
    ],
  },
 
  
];

export default menu;
