


import { motion } from "framer-motion";
import useAxios from "../../hooks/useAxios";

import StatCards from "../../components/common/StatEmpReport";
import MonthlyHoursApexChart from "../../components/chart/MonthlyHourChart";


import dayjs from "dayjs";
import TopProjectsPie from "../../components/chart/TopProjectsPie";

const EmployeeDashboard = () => {
  // const empId = localStorage.getItem("empId");

  const empId = Number(localStorage.getItem("empId"));

if (!empId) {
  console.error("EmployeeDashboard: empId missing in localStorage");
  return <p className="p-6 text-red-500">Employee ID missing. Please login again.</p>;
}



  // ---- API CALLS ----
  const { data: timesheetData, loading: loadTimesheet } = useAxios(
    `/empTimesheet/get-timesheets?empId=${empId}`
  );

  const { data: leaveData, loading: loadLeave } = useAxios(
    `/employee/leave/my-leaves?empId=${empId}`
  );

  const { data: activeProjectsData, loading: loadActive } = useAxios(
  `/project/get-active-project-count?empId=${empId}`
);

const { data: projectPie } = useAxios(
  `/project/top-projects?empId=${empId}`
);

console.log("Project Pie API:", projectPie);

  

  const loading = loadTimesheet || loadLeave || loadActive;

  if (loading) return <p className="p-6 text-gray-600">Loading dashboard...</p>;

  // ---- DATA CONVERSIONS ----
  const convertToHours = (timeString) => {
    if (!timeString) return 0;
    const [h, m, s] = timeString.split(":").map(Number);
    return h + m / 60 + s / 3600;
  };

  const monthlyData =
    timesheetData?.map((entry) => ({
      day: dayjs(entry.WorkDate).format("DD"),
      hours: convertToHours(entry.TotalTimeSpent),
    })) || [];

 

  // ---- TODAY SUMMARY ----
  const today = dayjs().format("YYYY-MM-DD");

  const todayHours =
    timesheetData
      ?.filter((t) => dayjs(t.WorkDate).format("YYYY-MM-DD") === today)
      ?.reduce((sum, t) => sum + convertToHours(t.TotalTimeSpent), 0) || 0;

  const pendingTimesheets =
    timesheetData?.filter((t) => t.ManagerApproval === "Pending").length || 0;

  
    console.log("empId:", localStorage.getItem("empId"));

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="p-6"
    >
      {/* 1. STAT CARDS */}
      <StatCards
        timesheetData={timesheetData}
        leaveData={leaveData}
         projectData={activeProjectsData?.activeProjects || 0}  
      />

      {/* 2. TODAY SUMMARY */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-xl shadow border"
        >
          <h2 className="text-lg font-semibold mb-2">Today's Overview</h2>
          <p className="text-gray-700">
            <strong>Hours Logged:</strong> {todayHours.toFixed(2)} hrs
          </p>
          <p className="text-gray-700 mt-1">
            <strong>Pending Timesheets:</strong> {pendingTimesheets}
          </p>
        </motion.div>

      </div>

      {/* 3. CHARTS */}
     <motion.div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">

  <motion.div whileHover={{ y: -6, scale: 1.01 }}>
    <MonthlyHoursApexChart data={monthlyData} />
  </motion.div>

  <motion.div whileHover={{ y: -6, scale: 1.01 }}>
    {/* <TopProjectsPie data={projectPie?.data || []} /> */}
    <TopProjectsPie data={projectPie} />

  </motion.div>

</motion.div>

    </motion.div>
  );
};

export default EmployeeDashboard;

