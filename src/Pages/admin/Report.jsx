import { useEffect, useState } from "react";

import {
  FileText,
  CheckCircle,
  DollarSign,
  AlertTriangle,
} from "lucide-react";
import axiosInstance from "../../components/common/AxiosInstance";
import ProjectTrends from "../../components/common/ProjectTrends";
import TeamPerformance from "../../components/common/TeamPerformance";
import ProjectReportTable from "../../components/common/ProjectReportTable";

const StatCard = ({ title, value, subtitle, icon: Icon, color }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 flex justify-between items-center">
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold mt-1">{value}</h2>
      <p className={`text-sm mt-1 ${color}`}>{subtitle}</p>
    </div>

    <div className={`p-3 rounded-lg ${color.replace("text", "bg")} bg-opacity-10`}>
      <Icon className={`${color}`} size={22} />
    </div>
  </div>
);

const Reports = () => {
  const [stats, setStats] = useState(null);
   const [trendData, setTrendData] = useState(null);

  const fetchStats = async () => {
    try {
      const res = await axiosInstance.get("/project/report-stats");
      setStats(res.data);
    } catch (error) {
      console.error("Stats error:", error);
    }
  };


   const fetchTrends = async () => {
    const res = await axiosInstance.get("/project/project-trends");
    setTrendData(res.data);
  };


  useEffect(() => {
    fetchStats();
    fetchTrends();

  }, []);

  //if (!stats) return null;
    if (!stats || !trendData) return null;

  return (
    <>
    {/* <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"> */}
     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
      <StatCard
        title="Total Projects"
        value={stats.totalProjects}
        subtitle="+12% from last month"
        icon={FileText}
        color="text-green-600"
      />

      <StatCard
        title="Completed"
        value={stats.completedProjects}
        subtitle={`${stats.completionRate}% completion rate`}
        icon={CheckCircle}
        color="text-green-600"
      />

      <StatCard
        title="Total Budget"
        value={`$${(stats.totalBudget / 1000).toFixed(0)}K`}
        subtitle="Allocated this quarter"
        icon={DollarSign}
        color="text-blue-600"
      />

      <StatCard
        title="Overdue"
        value={stats.overdueProjects}
        subtitle="Requires attention"
        icon={AlertTriangle}
        color="text-red-600"
      />
    </div>

     {/* CHART SECTION */}
      <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProjectTrends data={trendData} />
        </div>

        {/* Right side future section (Team Performance etc.) */}
       
          <TeamPerformance />

           </div>

            <ProjectReportTable />
        
     </div>
       </>
  );
};

export default Reports;
