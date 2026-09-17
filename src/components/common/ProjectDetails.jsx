import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import useAxios from "../../hooks/useAxios";

import HeaderImage from "../../assets/HeaderImage.jpg";
import {
  CalendarDaysIcon,
  ClockIcon,
  AdjustmentsHorizontalIcon as HourglassIcon,
} from "@heroicons/react/24/outline";

import MDAvatarGroup from "./MDAvatarGroup";
import FilterableCollapsibleTable from "../HOC/FilterableCollapsibleTable";
import FilterDatePicker from "../common/FilterDatePicker";

const ProjectDetails = () => {
  const { id } = useParams();
  const { data: project, loading, error } = useAxios(`/project/get-project-by-id/${id}`);
  const {
    data: workHistory = [],
    loading: historyLoading,
    error: historyError,
  } = useAxios(`/project/${id}/work-history`, {}, true, [id]);

  const columns = [
    { headerName: "Date", field: "WorkDate" },
    { headerName: "Employee", field: "EmployeeName" },
    { headerName: "Title", field: "WorkTitle" },
    { headerName: "Status", field: "TaskStatus" },
    { headerName: "Approval", field: "ManagerApproval" },
    { headerName: "Time Spent (hrs)", field: "TotalTimeSpent" },
  ];

  const formattedHistory = workHistory.map((entry) => ({
    ...entry,
    EmployeeName: entry.EmployeeName || "N/A",
  }));

  const employeeOptions = useMemo(() => {
    const uniqueNames = [...new Set(formattedHistory.map((h) => h.EmployeeName).filter(Boolean))];
    return uniqueNames.map((name) => ({
      label: name,
      value: name,
    }));
  }, [formattedHistory]);

  const filterMeta = useMemo(
    () => ({
      WorkDate: { type: "date" },
      EmployeeName: { type: "select", options: employeeOptions },
      ManagerApproval: {
        type: "select",
        options: [
          { label: "All", value: "" },
          { label: "Pending", value: "Pending" },
          { label: "Approved", value: "Approved" },
          { label: "Rejected", value: "Rejected" },
        ],
      },
    }),
    [employeeOptions]
  );

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error loading project</div>;
  if (!project) return <div className="text-center text-gray-500">No project found</div>;

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Header Image */}
      <motion.div className="relative w-full h-48 overflow-hidden">
        <motion.img
          src={HeaderImage}
          alt="Project Header"
          className="w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
      </motion.div>

      <div className="p-8">
        {/* Project Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold text-gray-900">
            {project.ProjectName} <span className="text-blue-700">[{project.ProjectCode}]</span>
          </h2>
          <p className="text-gray-600 mt-1">Manager: {project.Manager}</p>
        </motion.div>

        {/* Info Boxes */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { delayChildren: 0.2, staggerChildren: 0.1 },
            },
          }}
        >
          {[
            { icon: CalendarDaysIcon, label: "Project Start", value: project.ProjectStartDate },
            { icon: CalendarDaysIcon, label: "Project End", value: project.ProjectEndDate || "N/A" },
            { icon: HourglassIcon, label: "Status", value: project.CompletionStatus },
            { icon: ClockIcon, label: "Total Members", value: project.Members?.length || 0 },
          ].map(({ icon: Icon, label, value }, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl shadow-sm cursor-pointer transition"
              whileHover={{ scale: 1.03 }}
              variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
            >
              <Icon className="h-6 w-6 text-blue-700" />
              <div>
                <div className="font-semibold text-gray-800">{label}</div>
                <div className="text-gray-600">{value}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Avatar Group */}
        <motion.div
          className="mt-6 flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <MDAvatarGroup
            avatars={
              project.Members?.map((m) => {
                const imageUrl =
                  m.Photo && typeof m.Photo === "string" && m.Photo !== ""
                    ? `${import.meta.env.VITE_BASE_API_URL.replace("/api", "")}/uploads/${m.Photo}`
                    : null;

                return {
                  name: `${m.FirstName} ${m.LastName}`,
                  src: imageUrl,
                  fallback: m.FirstName?.charAt(0).toUpperCase() || "U",
                };
              }) || []
            }
            max={5}
            size="large"
          />
        </motion.div>

        {/* Work History Table */}
        <hr className="my-8 border-gray-200" />
        <motion.h3
          className="font-semibold text-lg text-gray-800 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Work History
        </motion.h3>

        {historyLoading ? (
          <p>Loading work history...</p>
        ) : historyError ? (
          <p className="text-red-500">Failed to load work history</p>
        ) : formattedHistory.length > 0 ? (
          <FilterableCollapsibleTable
            columns={columns}
            data={formattedHistory}
            collapsibleFields={["WorkDetails", "WorkStartTime", "WorkEndTime"]}
            keyField="TimeSheetId"
            filterFields={["WorkDate", "EmployeeName", "ManagerApproval"]}
            filterMeta={filterMeta}
            FormikDateFilter={FilterDatePicker}
          />
        ) : (
          <p className="text-gray-500 italic">No work history data yet.</p>
        )}
      </div>
    </motion.div>
  );
};

export default ProjectDetails;
