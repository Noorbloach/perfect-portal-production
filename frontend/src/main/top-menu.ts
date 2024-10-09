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
    icon: "Activity",
    title: "Apps",
    subMenu: [
      {
        icon: "Users",
        title: "Users",
        subMenu: [
          {
            icon: "Zap",
            pathname: "/users-layout-1",
            title: "Layout 1",
          },
          {
            icon: "Zap",
            pathname: "/users-layout-2",
            title: "Layout 2",
          },
          {
            icon: "Zap",
            pathname: "/users-layout-3",
            title: "Layout 3",
          },
        ],
      },
      {
        icon: "Trello",
        title: "Profile",
        subMenu: [
          {
            icon: "Zap",
            pathname: "/profile-overview-1",
            title: "Overview 1",
          },
          {
            icon: "Zap",
            pathname: "/profile-overview-2",
            title: "Overview 2",
          },
          {
            icon: "Zap",
            pathname: "/profile-overview-3",
            title: "Overview 3",
          },
        ],
      },
      {
        icon: "ShoppingBag",
        pathname: "/ecommerce",
        title: "Projects",
        subMenu: [
          {
            icon: "Zap",
            pathname: "/categories",
            title: "Categories",
          },
          {
            icon: "Zap",
            pathname: "/add-product",
            title: "Add Project",
          },
          {
            icon: "Zap",
            pathname: "/product-list",
            title: "Project List",
          },
          {
            icon: "Zap",
            pathname: "/product-grid",
            title: "Project Grid",
          },
          
        ],
      },
      
      
      {
        icon: "MessageSquare",
        pathname: "/chat",
        title: "Chat",
      },
     
      {
        icon: "Calendar",
        pathname: "/calendar",
        title: "Calendar",
      },
      {
        icon: "FilePenLine",
        title: "Crud",
        subMenu: [
          {
            icon: "Zap",
            pathname: "/crud-data-list",
            title: "Data List",
          },
          {
            icon: "Zap",
            pathname: "/crud-form",
            title: "Form",
          },
        ],
      },
    ],
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
      {
        icon: "Activity",
        pathname: "/change-password",
        title: "Change Password",
      },
    ],
  },
  {
    icon: "Inbox",
    title: "Components",
    subMenu: [
      {
        icon: "Activity",
        title: "Table",
        subMenu: [
          {
            icon: "Zap",
            pathname: "/regular-table",
            title: "Regular Table",
          },
          {
            icon: "Zap",
            pathname: "/tabulator",
            title: "Tabulator",
          },
        ],
      },
      {
        icon: "Activity",
        title: "Overlay",
        subMenu: [
          {
            icon: "Zap",
            pathname: "/modal",
            title: "Modal",
          },
          {
            icon: "Zap",
            pathname: "/slideover",
            title: "Slide Over",
          },
          {
            icon: "Zap",
            pathname: "/notification",
            title: "Notification",
          },
        ],
      },
      {
        icon: "Activity",
        pathname: "/tab",
        title: "Tab",
      },
      {
        icon: "Activity",
        pathname: "/accordion",
        title: "Accordion",
      },
      {
        icon: "Activity",
        pathname: "/button",
        title: "Button",
      },
      {
        icon: "Activity",
        pathname: "/alert",
        title: "Alert",
      },
      {
        icon: "Activity",
        pathname: "/progress-bar",
        title: "Progress Bar",
      },
      {
        icon: "Activity",
        pathname: "/tooltip",
        title: "Tooltip",
      },
      {
        icon: "Activity",
        pathname: "/dropdown",
        title: "Dropdown",
      },
      {
        icon: "Activity",
        pathname: "/typography",
        title: "Typography",
      },
      {
        icon: "Activity",
        pathname: "/icon",
        title: "Icon",
      },
      {
        icon: "Activity",
        pathname: "/loading-icon",
        title: "Loading Icon",
      },
    ],
  },
  {
    icon: "PanelLeft",
    title: "Forms",
    subMenu: [
      {
        icon: "Activity",
        pathname: "/regular-form",
        title: "Regular Form",
      },
      {
        icon: "Activity",
        pathname: "/datepicker",
        title: "Datepicker",
      },
      {
        icon: "Activity",
        pathname: "/tom-select",
        title: "Tom Select",
      },
      
      {
        icon: "Activity",
        pathname: "/wysiwyg-editor",
        title: "Wysiwyg Editor",
      },
      {
        icon: "Activity",
        pathname: "/validation",
        title: "Validation",
      },
    ],
  },
  {
    icon: "HardDrive",
    title: "Widgets",
    subMenu: [
      {
        icon: "Activity",
        pathname: "/chart",
        title: "Chart",
      },
      
    ],
  },
];

export default menu;
