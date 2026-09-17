

import {
  FiUsers,
  FiBarChart2,
  FiBriefcase,
  FiUser,
  FiLayers,
  FiMonitor,
  FiSettings,
} from "react-icons/fi";
import SidebarWrapper from "../../common/SidebarWrapper";

const AdminSidebar = ({ open, setOpen, darkMode }) => {
  const menuItems = [
    { name: "Dashboard", icon: <FiBarChart2 size={18} />, path: "/admin/dashboard" },
    { name: "Report", icon: <FiMonitor size={18} />, path: "/admin/report" },
    { name: "Employees", icon: <FiUsers size={18} />, path: "/admin/employees" },
    { name: "Customers", icon: <FiUser size={18} />, path: "/admin/customers" },
    { name: "Projects", icon: <FiBriefcase size={18} />, path: "/admin/projects" },
    { name: "Leave", icon: <FiLayers size={18} />, path: "/admin/leave" },

  ];

  const teamItems = [
    { name: "Sales", icon: <FiUser size={16} />, path: "sales" },
    { name: "Project", icon: <FiBriefcase size={16} />, path: "project" },
    { name: "Design", icon: <FiSettings size={16} />, path: "design" },
    { name: "IT", icon: <FiMonitor size={16} />, path: "IT" },
    { name: "Other", icon: <FiLayers size={16} />, path: "other" },
  ];

  return (
   <SidebarWrapper
  open={open}
  setOpen={setOpen} 
  darkMode={darkMode}
  menuItems={menuItems}
  teamItems={teamItems}
  baseTeamPath="/admin/teams"
  title="Admin Panel"
/>

  );
};

export default AdminSidebar;

