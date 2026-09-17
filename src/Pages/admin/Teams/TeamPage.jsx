import React, { useEffect, useState } from "react";
import { UsersIcon, CheckCircleIcon, ClockIcon, XCircleIcon } from "@heroicons/react/24/solid";
import StatCard from "./StatCard";
import { useParams } from "react-router-dom";
import { teamColumns } from "./TeamColumns";
import FilterableCollapsibleTable from "../../../components/HOC/FilterableCollapsibleTable";
import axiosInstance from "../../../components/common/AxiosInstance";

const TeamPage = () => {
  const { team } = useParams(); // sales / it / project
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    idle: 0,
    leave: 0,
  });

  // Fetch team employees
  const fetchTeam = async () => {
    try {
      const res = await axiosInstance.get(`/employee/teams/${team}`);
      const data = res.data || [];

      setEmployees(data);

      // stats calculation
      setStats({
        total: data.length,
        active: data.filter((e) => e.status === "Active").length,
        idle: data.filter((e) => e.status === "Idle").length,
        leave: data.filter((e) => e.status === "On Leave").length,
      });
    } catch (err) {
      console.error("Failed to fetch team", err);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, [team]);

  return (
    <div className="space-y-6">
      {/*  HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {team?.toUpperCase()} Team
          </h1>
          <p className="text-sm text-gray-500">
            Manage and monitor your project team members
          </p>
        </div>

        <p className="text-sm text-gray-400">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      {/*  STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Members"
          value={stats.total}
          icon={<UsersIcon className="h-5 w-5" />}
          accent="blue"
          trend="+12%"
        />
        <StatCard
          title="Active Members"
          value={stats.active}
          icon={<CheckCircleIcon className="h-5 w-5" />}
          accent="green"
          trend="+8%"
        />
        <StatCard
          title="Idle Members"
          value={stats.idle}
          icon={<ClockIcon className="h-5 w-5" />}
          accent="yellow"
          trend="-3%"
        />
        <StatCard
          title="On Leave"
          value={stats.leave}
          icon={<XCircleIcon className="h-5 w-5" />}
          accent="red"
          trend="+5%"
        />
      </div>

      {/* TABLE */}
      <FilterableCollapsibleTable
        data={employees}
        columns={teamColumns}
        filterFields={["name", "status", "designation"]}
        filterMeta={{
          status: {
            type: "select",
            label: "Status",
            options: [
              { label: "Active", value: "Active" },
              { label: "Idle", value: "Idle" },
              { label: "On Leave", value: "On Leave" },
            ],
          },
          designation: {
            label: "Designation",
            placeholder: "Search designation",
          },
        }}
        keyField="id"
        collapsibleFields={[
          "address",
          "experience",
          "skills",
          "projectName",
        ]}
        onAddClick={() => console.log("Add Member")}
      />
    </div>
  );
};

export default TeamPage;
// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axiosInstance from "../../../components/common/AxiosInstance";
// import HeaderTitle from "../../../components/common/HeaderTitle";
// import EmployeeCard from "../../AdminEmp/EmployeeCard";
// // import axiosInstance from "../../services/axiosInstance";
// // import HeaderTitle from "../../components/common/HeaderTitle";
// // import EmployeeCard from "../../components/employee/EmployeeCard";

// const TeamPage = () => {
//   const { team } = useParams(); // sales / it / design
//   const [employees, setEmployees] = useState([]);

//   useEffect(() => {
//     fetchTeam();
//   }, [team]);

//   const fetchTeam = async () => {
//     try {
//       const res = await axiosInstance.get("/employee/all");

//       const filtered = res.data.filter(
//         (emp) =>
//           emp.Department?.toLowerCase() === team.toLowerCase()
//       );

//       setEmployees(filtered);
//     } catch (err) {
//       console.error("Failed to fetch team", err);
//     }
//   };

//   return (
//     <>
//       <HeaderTitle
//         title={`${team.toUpperCase()} Team`}
//         subtitle="Department wise employees"
//       />

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         {employees.map((emp) => (
//           <EmployeeCard key={emp.EmpID} emp={emp} />
//         ))}
//       </div>
//     </>
//   );
// };

// export default TeamPage;
