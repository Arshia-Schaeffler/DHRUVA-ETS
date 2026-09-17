import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import useAuth from "./hooks/useAuth";
import PropTypes from "prop-types";
import "./index.css";


// Layout
import RoleBasedDashboardLayout from "./components/layout/RoleBasedDashboardLayout";

// Public
import LogIn from "./Pages/login/LogIn";

// Admin Pages
import AdminDashboard from "./Pages/admin/AdminDahboard";
import Report from "./Pages/admin/Report";
import Employee from "./Pages/admin/Employee";
import Customer from "./Pages/admin/customer/Customer";

// Manager + Shared Pages
// import Projects from "./Pages/common/Projects";

import ProjectDetails from "./components/common/ProjectDetails";
import ManagerDashboard from "./Pages/manager/ManagerDashboard";
import ManagerReport from "./Pages/manager/ManagerReport";
import TimeTracking from "./Pages/employee/TimeTracking";

// Employee Pages
import EmployeeDashboard from "./Pages/employee/EmployeeDashboard";
// import Reports from "./Pages/admin/report/Reports";
import TimeSheetTracker from "./Pages/manager/TimeSheetTracker";
import Projects from "./components/common/Projects";
//import TeamAdmin from "./Pages/admin/TeamAdmin";
import Teams from "./Pages/manager/Teams";
import TeamDetails from "./components/common/TeamDetail";
import Leave from "./Pages/employee/Leave"
import EmployeeReport from "./Pages/employee/EmployeeReport";
import ProfilePage from "./Pages/profile/ProfilePage";
import TeamPage from "./Pages/admin/Teams/TeamPage";
import EditProfile from "./Pages/profile/EditProfile";
import ChangePassword from "./Pages/profile/ChangePassword";


// Protected Route Component

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { auth } = useAuth();
  console.log("PROTECTED ROUTE - ROLE CHECK:", auth.role, "Allowed:", allowedRoles);

  if (!auth?.token || !auth?.role) return <Navigate to="/login" />;

  if (allowedRoles && !allowedRoles.includes(auth.role)) {
    console.warn("Role mismatch:", auth.role);
    return <Navigate to="/login" />;
  }

  return children;
};


//  Main App Component

const App = () => {
  return (
    <AuthProvider>
      <Routes>

        {/*  Public Route */}
        <Route path="/login" element={<LogIn />} />
        {/* <Route path="/profile" element={<ProfilePage />} /> */}

        <Route
          path="/profile/*"
          element={
            <ProtectedRoute allowedRoles={["Admin", "Manager", "User"]}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/edit"
          element={
            <ProtectedRoute allowedRoles={["Admin", "Manager", "User"]}>
              <EditProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/change-password"
          element={
            <ProtectedRoute allowedRoles={["Admin", "Manager", "User"]}>
              <ChangePassword />
            </ProtectedRoute>
          }
        />

        {/*  Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <RoleBasedDashboardLayout role="Admin" />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="report" element={<Report />} />
          <Route path="employees" element={<Employee />} />
          <Route path="customers" element={<Customer />} />
          <Route path="projects" element={<Projects />} />
          <Route path="teams/:team" element={<TeamPage />} />
          <Route path="project-details/:id" element={<ProjectDetails />} />
          <Route path="leave" element={<Leave />} />
        </Route>

        {/* Manager Routes */}
        <Route
          path="/manager/*"
          element={
            <ProtectedRoute allowedRoles={["Manager"]}>
              <RoleBasedDashboardLayout role="Manager" />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<ManagerDashboard />} />
          <Route path="report" element={<ManagerReport />} />
          <Route path="team" element={<Teams />} />
          <Route path="time-tracker" element={<TimeSheetTracker />} />
          <Route path="projects" element={<Projects />} />
          <Route path="project-details/:id" element={<ProjectDetails />} />
          <Route path="team-details/:empId" element={<TeamDetails />} />
          <Route path="leave" element={<Leave />} />

        </Route>


        <Route
          path="/user/*"
          element={
            <ProtectedRoute allowedRoles={["User"]}>
              <RoleBasedDashboardLayout role="User" />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<EmployeeDashboard />} />
          <Route path="report" element={<EmployeeReport />} />
          <Route path="time-tracker" element={<TimeTracking />} />
          <Route path="projects" element={<Projects />} />
          <Route path="project-details/:id" element={<ProjectDetails />} />
          <Route path="leave" element={<Leave />} />
        </Route>


        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
