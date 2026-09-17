
import {
  AiOutlineClockCircle,
  AiOutlineCheckCircle,
  AiOutlineCalendar,
} from "react-icons/ai";
import { FiFolder } from "react-icons/fi";
import { motion } from "framer-motion";

const StatCards = ({ timesheetData, leaveData, projectData }) => {
  // ----- TOTAL HOURS -----
  const totalMinutes = (timesheetData || [])
    .map((item) => {
      const [h, m, s] = item.TotalTimeSpent?.split(":").map(Number) || [0, 0, 0];
      return (h || 0) * 60 + (m || 0);
    })
    .reduce((a, b) => a + b, 0);

  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  // ----- APPROVAL % -----
  const approvedCount =
    timesheetData?.filter((t) => t.ManagerApproval === "Approved").length || 0;

  const totalEntries = timesheetData?.length || 0;
  const approvalPercentage =
    totalEntries > 0 ? Math.round((approvedCount / totalEntries) * 100) : 0;

  // ----- LEAVES -----
  const leavesTaken = (leaveData || [])
    .filter((l) => l.Status === "Approved")
    .reduce((sum, leave) => sum + (leave.TotalDays || 0), 0);


const activeProjects = Number(projectData) || 0;




  const stats = [
    {
      label: "Total Hours Worked",
      value: `${totalHours}:${remainingMinutes.toString().padStart(2, "0")}`,
      icon: <AiOutlineClockCircle size={28} />,
      color: "text-blue-600",
      numberColor: "text-blue-700",
    },
    {
      label: "% Approved",
      value: `${approvalPercentage}%`,
      icon: <AiOutlineCheckCircle size={28} />,
      color: "text-green-600",
      numberColor: "text-green-700",
    },
    {
      label: "Leaves Taken",
      value: `${leavesTaken} Days`,
      icon: <AiOutlineCalendar size={28} />,
      color: "text-red-600",
      numberColor: "text-red-700",
    },
    {
      label: "Active Projects",
      value: activeProjects,
      icon: <FiFolder size={28} />,
      color: "text-yellow-600",
      numberColor: "text-yellow-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
          className="flex items-center gap-5 bg-white shadow-md border border-gray-200 
                     p-6 rounded-xl cursor-pointer hover:shadow-lg transition-all"
        >
          {/* Icon Circle */}
          <div
            className={`w-12 h-12 rounded-full border ${stat.color} border-opacity-40
                        flex items-center justify-center`}
          >
            <span className={`${stat.color}`}>{stat.icon}</span>
          </div>

          {/* Text Area */}
          <div>
            <h2 className={`text-3xl font-bold ${stat.numberColor}`}>
              {stat.value}
            </h2>
            <p className="text-gray-500 text-sm font-medium mt-1">{stat.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatCards;
