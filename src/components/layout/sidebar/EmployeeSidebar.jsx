
import {
  FiBarChart2,
  FiMonitor,
  FiClock,
  FiBriefcase,
  FiFileText,
} from "react-icons/fi";
import SidebarWrapper from "../../common/SidebarWrapper";

const EmployeeSidebar = ({ open,setOpen, darkMode }) => {
  const menuItems = [
    {
      name: "Dashboard",
      icon: <FiBarChart2 size={18} />,
      path: "/user/dashboard",
    },
    {
      name: "Report",
      icon: <FiMonitor size={18} />,
      path: "/user/report",
    },
    {
      name: "Time Tracking",
      icon: <FiClock size={18} />,
      path: "/user/time-tracker",
    },
    {
      name: "Projects",
      icon: <FiBriefcase size={18} />,
      path: "/user/projects",
    },
    {
    name: "Leave / Attendance",
    icon: <FiFileText size={18} />, 
    path: "/user/Leave",
    }
  ];

  return (
   <SidebarWrapper
  open={open}
  setOpen={setOpen} 
  darkMode={darkMode}
  menuItems={menuItems}
  teamItems={[]}
  title="Employee Panel"
/>

  );
};

export default EmployeeSidebar;
