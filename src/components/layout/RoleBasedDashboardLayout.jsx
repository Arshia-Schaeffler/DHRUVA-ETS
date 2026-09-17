


import { useState } from "react";
import Navbar from "./Navbar";
import MainContent from "./MainContent";

// Sidebar imports
import AdminSidebar from "./sidebar/AdminSidebar";
import ManagerSidebar from "./sidebar/ManagerSidebar";
import EmployeeSidebar from "./sidebar/EmployeeSidebar";

const RoleBasedDashboardLayout = ({ role }) => {
  const [open, setOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleDrawerToggle = () => setOpen(!open);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Dynamically choose sidebar based on role
  const renderSidebar = () => {
    const commonProps = { open, setOpen, darkMode };

    switch (role) {
      case "Admin":
        return <AdminSidebar {...commonProps} />;
      case "Manager":
        return <ManagerSidebar {...commonProps} />;
      case "User":
        return <EmployeeSidebar {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div className={`flex min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
      {renderSidebar()}
      <div className="flex-1 flex flex-col transition-all duration-300">
        <Navbar
          open={open}
          handleDrawerToggle={handleDrawerToggle}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
        <MainContent open={open} darkMode={darkMode} />
      </div>
    </div>
  );
};

export default RoleBasedDashboardLayout;
