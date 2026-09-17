import { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  UserX,
  CalendarOff,
} from "lucide-react";
import axiosInstance from "../../components/common/AxiosInstance";
import MonthlyOverviewChart from "./Monthly OverviewChart";
import TeamDistribution from "./TeamDistribution";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    idleMembers: 0,
    onLeaveMembers: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats();
  }, []);

  const getDashboardStats = async () => {
    try {
      const res = await axiosInstance.get(
        "/employee/dashboard/stats"
      );

      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (error) {
      console.error("Dashboard API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading Dashboard...</div>;
  }

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-gray-500">
          Welcome back! Here's your team overview
        </p>
      </div>

      {/* ===== STAT CARDS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Total Members */}
        <div className="bg-white rounded-xl shadow-sm p-5 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Total Members</p>
            <h2 className="text-3xl font-bold">{stats.totalMembers}</h2>
            <p className="text-green-600 text-sm">+12% vs last month</p>
          </div>
          <div className="bg-green-100 p-3 rounded-full">
            <Users className="text-green-600" />
          </div>
        </div>

        {/* Active Members */}
        <div className="bg-white rounded-xl shadow-sm p-5 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Active Members</p>
            <h2 className="text-3xl font-bold">{stats.activeMembers}</h2>
            <p className="text-green-600 text-sm">+8% vs last month</p>
          </div>
          <div className="bg-green-100 p-3 rounded-full">
            <UserCheck className="text-green-600" />
          </div>
        </div>

        {/* Idle Members */}
        <div className="bg-white rounded-xl shadow-sm p-5 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Idle Members</p>
            <h2 className="text-3xl font-bold">{stats.idleMembers}</h2>
            <p className="text-red-600 text-sm">-3% vs last month</p>
          </div>
          <div className="bg-yellow-100 p-3 rounded-full">
            <UserX className="text-yellow-600" />
          </div>
        </div>

        {/* On Leave */}
        <div className="bg-white rounded-xl shadow-sm p-5 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">On Leave</p>
            <h2 className="text-3xl font-bold">{stats.onLeaveMembers}</h2>
            <p className="text-green-600 text-sm">+5% vs last month</p>
          </div>
          <div className="bg-red-100 p-3 rounded-full">
            <CalendarOff className="text-red-600" />
          </div>
        </div>
      </div>

      {/* ===== CHART SECTIONS (READY) ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Monthly Overview */}
        <div className="lg:col-span-2">
         
          {/* <div className=" flex items-center justify-center text-gray-400"> */}
           <div className="bg-white rounded-xl p-6 shadow-sm">
             <h2 className="text-lg font-semibold mb-4">
            Monthly Overview
          </h2>
          <MonthlyOverviewChart/>
          </div>
          {/* </div> */}
        </div>

        {/* Team Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">
            Team Distribution
          </h2>
          <div className="h-64 flex items-center justify-center text-gray-400">
             <TeamDistribution />
           
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
