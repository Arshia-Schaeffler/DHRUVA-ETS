import React, { useEffect, useMemo, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import useAxios from "../../hooks/useAxios";
import { useAuth } from "../../context/AuthContext";
import HeaderTitle from "../../components/common/HeaderTitle";
import axiosInstance from "../../components/common/AxiosInstance";
import FilterableCollapsibleTable from "../../components/HOC/FilterableCollapsibleTable";
import FormSelect from "../../components/common/FormSelect";
import FilterDatePicker from "../../components/common/FilterDatePicker";
import { GET_ALL_NORMAL_USERS, GET_ALL_USERS } from "../../utils/Strings";
import { motion } from "framer-motion";
import ApplyLeaveForm from "../../components/common/ApplyLeaveForm";
import Swal from "sweetalert2";

import {
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  GiftIcon,
} from "@heroicons/react/24/outline";


const Leave = () => {
  const { auth } = useAuth();
  const role = auth?.role?.toLowerCase();
  const isManager = role === "manager";
  const isAdmin = role === "admin";
  const empId = auth?.empId;


  // API ENDPOINTS

  const endpoint = useMemo(() => {
    if (isAdmin) return `/employee/leave/all`;
    if (isManager) return `/employee/leave/manager/leaves`;
    return `/employee/leave/my-leaves`;
  }, [isAdmin, isManager]);

  const managerOwnEndpoint = `/employee/leave/my-leaves`;


  // FETCH DATA

  const {
    data: leavesResponse = {},
    refetch: refetchLeaves,
    loading: leavesLoading,
  } = useAxios(endpoint, {}, !!empId, [empId]);

  const {
    data: managerLeavesResponse = {},
    loading: managerLeavesLoading,
  } = useAxios(
    isManager ? managerOwnEndpoint : null,
    {},
    isManager && !!empId,
    [empId]
  );

  const leavesRaw = Array.isArray(leavesResponse)
    ? leavesResponse
    : Array.isArray(leavesResponse?.data)
      ? leavesResponse.data
      : [];

  //const usersQueryUrl = GET_ALL_USERS;
  const department = isAdmin ? "all" : auth?.department || "all";

  // const { data: users = [] } = useAxios(
  //   usersQueryUrl,
  //   { params: { _limit: 200, department } },
  //   isAdmin
  // );
  const { data: usersResponse = [] } = useAxios(
    GET_ALL_USERS,
    {},
    isAdmin
  );

  const users = Array.isArray(usersResponse)
    ? usersResponse
    : usersResponse?.data || [];



  // APPLY / UPDATE LEAVE

  const applyLeave = async (payload) => {
    try {
      await axiosInstance.post(`/employee/leave/apply`, payload);
      refetchLeaves();
    } catch (err) {
      console.error("Leave apply failed:", err);
    }
  };


  const updateLeaveStatus = async (leaveId, status) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `Do you want to mark this leave as ${status}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: `Yes, ${status}`,
        cancelButtonText: "Cancel",
      });

      if (!result.isConfirmed) return;

      const res = await axiosInstance.put(
        `/employee/leave/status/${leaveId}`,
        { Status: status }
      );

      if (res.status === 200) {
        await Swal.fire({
          title: "Success!",
          text: `Leave ${status} successfully.`,
          icon: "success",
        });

        refetchLeaves();
      } else {
        Swal.fire("Failed!", "Unable to update leave status.", "error");
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      Swal.fire("Error!", "Something went wrong!", "error");
    }
  };


  // Admin: All Employees Leave Summary
  const [leaveSummaryData, setLeaveSummaryData] = useState([]);
  const [summaryLoading, setSummaryLoading] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      const fetchAllLeaveSummary = async () => {
        setSummaryLoading(true);
        try {
          const res = await axiosInstance.get("/employee/leave/all/stats");
          const formatted = Array.isArray(res.data)
            ? res.data.map((item) => ({
              EmpId: item.EmpId,
              EmployeeName: item.EmployeeName,
              totalLeaves: item.totalLeaves,
              used: item.used,
              remaining: item.remaining,
              compOff: item.compOff,
            }))
            : Array.isArray(res.data?.data)
              ? res.data.data.map((item) => ({
                EmpId: item.EmpId,
                EmployeeName: item.EmployeeName,
                totalLeaves: item.totalLeaves,
                used: item.used,
                remaining: item.remaining,
                compOff: item.compOff,
              }))
              : [];

          setLeaveSummaryData(formatted);
        } catch (err) {
          console.error("Error fetching all leave summary:", err);
        } finally {
          setSummaryLoading(false);
        }
      };
      fetchAllLeaveSummary();
    }
  }, [isAdmin]);


  // FORM CONFIG

  const INITIAL_FORM_STATE = {
    LeaveType: "",
    StartDate: "",
    EndDate: "",
    Reason: "",
    EmpId: isAdmin ? "" : empId,
  };

  const FORM_VALIDATION = Yup.object().shape({
    LeaveType: Yup.string().required("Leave type is required"),
    StartDate: Yup.string().required("Start date is required"),
    EndDate: Yup.string()
      .required("End date is required")
      .test(
        "is-after-start",
        "End date must be same or after start date",
        function (value) {
          const { StartDate } = this.parent;
          if (!StartDate || !value) return true;
          return new Date(value) >= new Date(StartDate);
        }
      ),
    Reason: Yup.string().required("Reason is required"),
    EmpId: isAdmin ? Yup.mixed().required("Please pick an employee") : Yup.mixed(),
  });


  // LEAVES (EMPLOYEES UNDER MANAGER OR SELF)

  const leaves = useMemo(() => {
   const dataToShow = isManager
  ? leavesRaw.filter((l) => (l.User?.EmpId ? l.User.EmpId !== empId : true))
  : leavesRaw;


    return (dataToShow || []).map((l) => {
      const status = l.Status || "Pending";
      const leaveId = l.LeaveId;

      return {
        ...l,
        EmployeeName:
          l.User?.FirstName || l.User?.FirstName === ""
            ? `${l.User?.FirstName ?? ""} ${l.User?.LastName ?? ""}`.trim()
            : l.EmployeeName || "N/A",
        StartDate: l.StartDate
          ? new Date(l.StartDate).toLocaleDateString("en-IN")
          : "-",
        EndDate: l.EndDate
          ? new Date(l.EndDate).toLocaleDateString("en-IN")
          : "-",
        Status: (
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${status === "Approved"
              ? "bg-green-100 text-green-700"
              : status === "Rejected"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
              }`}
          >
            {status}
          </span>
        ),



        //   RIGHT SECTION: APPROVAL BUTTONS 
        actions:
          (isManager || isAdmin) && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => updateLeaveStatus(leaveId, "Approved")}
                disabled={status === "Approved"}
                className="px-3 py-1 text-xs font-semibold rounded-md 
          border border-green-200 bg-green-50 text-green-800 
          hover:bg-green-100 disabled:opacity-50"
              >
                Approve
              </button>

              <button
                onClick={() => updateLeaveStatus(leaveId, "Rejected")}
                disabled={status === "Rejected"}
                className="px-3 py-1 text-xs font-semibold rounded-md 
          border border-red-200 bg-red-50 text-red-800 
          hover:bg-red-100 disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          ),
       };
    });
  }, [leavesRaw, isManager, isAdmin]);


  // MANAGER OWN LEAVES

  const managerOwnLeaves = useMemo(() => {
    if (!isManager) return [];
    const data = Array.isArray(managerLeavesResponse)
      ? managerLeavesResponse
      : Array.isArray(managerLeavesResponse?.data)
        ? managerLeavesResponse.data
        : [];

    return data.map((l) => ({
      ...l,
      StartDate: l.StartDate
        ? new Date(l.StartDate).toLocaleDateString("en-IN")
        : "-",
      EndDate: l.EndDate
        ? new Date(l.EndDate).toLocaleDateString("en-IN")
        : "-",
      Status: (
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${l.Status === "Approved"
            ? "bg-green-100 text-green-700"
            : l.Status === "Rejected"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
            }`}
        >
          {l.Status || "Pending"}
        </span>
      ),

    }));
  }, [managerLeavesResponse, isManager]);


  // FILTER CONFIG

  const filterFields = ["EmployeeName", "LeaveType", "StartDate", "EndDate"];

  const filterMeta = {
    LeaveType: {
      type: "select",
      options: [
        { label: "All", value: "" },
        { label: "Sick Leave", value: "Sick Leave" },
        { label: "Casual Leave", value: "Casual Leave" },
        { label: "Earned Leave", value: "Earned Leave" },
      ],
    },
  };

  const columns = [
    ...(isManager || isAdmin ? [{ field: "EmployeeName", headerName: "Employee" }] : []),
    { field: "LeaveType", headerName: "Type" },
    { field: "StartDate", headerName: "Start" },
    { field: "EndDate", headerName: "End" },
    { field: "Reason", headerName: "Reason" },
    { field: "Status", headerName: "Status" },
    ...(isManager || isAdmin ? [{ field: "actions", headerName: "Action" }] : []),
  ];


  // LEAVE STATS

  const [stats, setStats] = useState({
    totalLeaves: 0,
    used: 0,
    remaining: 0,
    compOff: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const url = "/employee/leave/stats";
        const res = await axiosInstance.get(url);
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching leave stats:", err);
      }
    };

    fetchStats();
  }, [isManager]);


  // RENDER

  return (
    <div className="space-y-8">
      <HeaderTitle
        title={
          isAdmin
            ? "All Leave Requests"
            : isManager
              ? "My Leaves & Approvals"
              : "My Leaves"
        }
      />

      {/* LEAVE SUMMARY (for employee / manager view) */}
      {!isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
            Leave Summary
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Leaves */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 250 }}
              className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-5 flex items-center border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-200"
            >
              <CalendarDaysIcon className="w-8 h-8 text-green-600 mr-4" />
              <div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">Total Leaves</p>
                <h3 className="text-3xl font-bold text-green-600 mt-1">
                  {stats.totalLeaves || 0}
                </h3>
              </div>
            </motion.div>

            {/* Used */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 250 }}
              className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-5 flex items-center border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-200"
            >
              <CheckCircleIcon className="w-8 h-8 text-red-500 mr-4" />
              <div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">Used</p>
                <h3 className="text-3xl font-bold text-red-500 mt-1">
                  {stats.used || 0}
                </h3>
              </div>
            </motion.div>

            {/* Remaining */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 250 }}
              className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-5 flex items-center border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-200"
            >
              <ClockIcon className="w-8 h-8 text-blue-600 mr-4" />
              <div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">Remaining</p>
                <h3 className="text-3xl font-bold text-blue-600 mt-1">
                  {stats.remaining || 0}
                </h3>
              </div>
            </motion.div>

            {/* Comp Off */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 250 }}
              className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-5 flex items-center border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-200"
            >
              <GiftIcon className="w-8 h-8 text-yellow-500 mr-4" />
              <div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">Comp Off</p>
                <h3 className="text-3xl font-bold text-yellow-500 mt-1">
                  {stats.compOff || 0}
                </h3>
              </div>
            </motion.div>
          </div>

        </motion.div>
      )}


      {/* Apply Leave Form */}
      <ApplyLeaveForm
        INITIAL_FORM_STATE={INITIAL_FORM_STATE}
        FORM_VALIDATION={FORM_VALIDATION}
        isAdmin={isAdmin}
        empId={empId}
        users={users}
        applyLeave={applyLeave}
      />

      {/* Manager Own Leaves Table */}
      {isManager && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 border border-gray-100 dark:border-gray-700"
        >

          <FilterableCollapsibleTable
            title="My Leaves"
            data={managerOwnLeaves}
            columns={[
              { field: "LeaveType", headerName: "Type" },
              { field: "StartDate", headerName: "Start" },
              { field: "EndDate", headerName: "End" },
              { field: "Reason", headerName: "Reason" },
              { field: "Status", headerName: "Status" },
            ]}
            filterFields={["LeaveType", "StartDate", "EndDate"]}
            filterMeta={filterMeta}
          />
          {managerLeavesLoading && (
            <p className="text-center text-gray-500 text-sm mt-3">
              Loading my leaves...
            </p>
          )}
        </motion.div>
      )}

      {/* Team / All Leaves Table */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 border border-gray-100 dark:border-gray-700"
      >
        <FilterableCollapsibleTable
          title={isManager ? "Team Leave Requests" : "Leave Records"}
          data={leaves}
          columns={columns}
          filterFields={filterFields}
          filterMeta={filterMeta}
        />
        {leavesLoading && (
          <p className="text-center text-gray-500 text-sm mt-3">Loading leaves...</p>
        )}
      </motion.div>
      {/*  All Employees Leave Summary (Admin Only) */}
      {isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 border border-gray-100 dark:border-gray-700"
        >
          <FilterableCollapsibleTable
            title="All Employees Leave Summary"
            data={leaveSummaryData}
            columns={[
              { field: "EmpId", headerName: "Employee ID" },
              { field: "EmployeeName", headerName: "Employee Name" },
              { field: "totalLeaves", headerName: "Total Leaves" },
              { field: "used", headerName: "Used" },
              { field: "remaining", headerName: "Remaining" },
              { field: "compOff", headerName: "Comp-Off" },
            ]}
            filterFields={["EmployeeName"]}
          />

          {summaryLoading && (
            <p className="text-center text-gray-500 text-sm mt-3">
              Loading leave summary...
            </p>
          )}
        </motion.div>
      )}

    </div>
  );
};

export default Leave;

