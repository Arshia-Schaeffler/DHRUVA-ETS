import React, { useEffect, useState, useMemo } from "react";
import { EyeIcon, PencilIcon } from "@heroicons/react/24/solid";
import axiosInstance from "../../../components/common/AxiosInstance";
import HeaderTitle from "../../../components/common/HeaderTitle";
import FilterableCollapsibleTable from "../../../components/HOC/FilterableCollapsibleTable";
import Modal from "../../../components/common/Modal";
import EmployeeForm from "./EmployeeForm";

/* =======================
   DEFAULT AVATAR
======================= */
const DEFAULT_AVATAR = "https://i.pravatar.cc/150?img=32";

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  /* =======================
     FETCH EMPLOYEES
  ======================= */
  const fetchEmployees = async () => {
    try {
    const res = await axiosInstance.get("/employee/all");
    setEmployees(res.data || []);
      // Normalize avatar for table
      // const normalized = (res.data || []).map((emp) => ({
      //   ...emp,
      //   avatar: emp.avatar || DEFAULT_AVATAR,
      // }));

      // const normalized = (res.data || []).map((emp) => ({
      //   ...emp,
      //   avatar: emp.avatar,
      // }));

      // setEmployees(normalized);

    } catch (err) {
      console.error("Failed to load employees", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  /* =======================
     ADD EMPLOYEE
  ======================= */
  const handleAdd = () => {
    setMode("add");
    setSelectedEmployee(null);
    setModalOpen(true);
  };

  /* =======================
     VIEW / EDIT EMPLOYEE
  ======================= */
  const openEmployee = async (row, type) => {
    try {
      const res = await axiosInstance.get(
        `/employee/employee/${row.EmpID}`
      );
      const u = res.data;

      setSelectedEmployee({
        EmpID: u.EmpId,
        Name: u.FirstName,
        LastName: u.LastName,
        Email: u.Email,
        Mobile: u.Mobile,
        Role: u.Role,
        Department: u.department,
        Status: u.status,
        JoiningDate: u.JoiningDate,
        UserName: u.UserName,
        Designation: u.Designation,
        avatar: u.avatar || DEFAULT_AVATAR, //  IMPORTANT
      });

      setMode(type);
      setModalOpen(true);
    } catch (err) {
      console.error("Failed to open employee", err);
    }
  };

  /* =======================
     TABLE COLUMNS
  ======================= */
  const columns = useMemo(
    () => [
      { field: "EmpID", headerName: "Emp ID" },

      {
        headerName: "Employee",
        render: (row) => (
          <div className="flex items-center gap-3">
            <img
              src={row.avatar ? row.avatar : DEFAULT_AVATAR}
              alt="profile"
              className="h-9 w-9 rounded-full object-cover border"
              onError={(e) => {
                e.currentTarget.src = DEFAULT_AVATAR;
              }}
            />

            <div>
              <p className="font-medium text-gray-900">
                {row.Name} {row.LastName}
              </p>
              <p className="text-xs text-gray-500">
                {row.Designation || "Employee"}
              </p>
            </div>
          </div>
        ),
      },

      { field: "Department", headerName: "Department" },
      { field: "UserName", headerName: "Username" },
      {
  headerName: "Status",
  render: (row) => {
    const isActive = row.Status === "Active";

    return (
      <span
        className={`px-3 py-1 text-xs font-semibold rounded-full 
        ${
          isActive
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-600"
        }`}
      >
        {row.Status}
      </span>
    );
  },
},


      {
        field: "actions",
        headerName: "Actions",
        render: (row) => (
          <div className="flex gap-3">
            <EyeIcon
              className="h-4 w-4 text-[#006633] cursor-pointer"
              onClick={() => openEmployee(row, "view")}
            />
            <PencilIcon
              className="h-4 w-4 text-green-700 cursor-pointer"
              onClick={() => openEmployee(row, "edit")}
            />
          </div>
        ),
      },
    ],
    []
  );

  /* =======================
     RENDER
  ======================= */
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <HeaderTitle title="Employees" />
      </div>

      <FilterableCollapsibleTable
        title="Employee List"
        columns={columns}
        data={employees}
        keyField="EmpID"
        filterFields={["Name", "Department", "Status"]}
        onAddClick={handleAdd}
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          mode === "add"
            ? "Add Employee"
            : mode === "edit"
              ? "Edit Employee"
              : "Employee Details"
        }
      >
        <EmployeeForm
          initialValues={selectedEmployee}
          mode={mode}
          onSuccess={() => {
            setModalOpen(false);
            fetchEmployees();
          }}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default EmployeeTable;
