


import {
  FiBarChart2,
  FiMonitor,
  FiUsers,
  FiClock,
  FiBriefcase,
  FiFileText,
} from "react-icons/fi";
import SidebarWrapper from "../../common/SidebarWrapper";

const ManagerSidebar = ({ open, setOpen, darkMode }) => {
  const menuItems = [
    {
      name: "Dashboard",
      icon: <FiBarChart2 size={18} />,
      path: "/manager/dashboard",
    },
    {
      name: "Report",
      icon: <FiMonitor size={18} />,
      path: "/manager/report",
    },
    {
      name: "Team",
      icon: <FiUsers size={18} />,
      path: "/manager/team",
    },
    {
      name: "Time Tracking",
      icon: <FiClock size={18} />,
      path: "/manager/time-tracker",
    },
    {
      name: "Projects",
      icon: <FiBriefcase size={18} />,
      path: "/manager/projects",
    },
    {
        name: "Leave / Attendance",
        icon: <FiFileText size={18} />, 
         path: "/manager/leave",
        }
  ];

  return (
    <SidebarWrapper
  open={open}
  setOpen={setOpen} 
  darkMode={darkMode}
  menuItems={menuItems}
  teamItems={[]}
  title="Manager Panel"
/>

  );
};

export default ManagerSidebar;
