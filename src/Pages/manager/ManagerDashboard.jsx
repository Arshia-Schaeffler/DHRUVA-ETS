
import { useState, useEffect } from "react";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";
import UpcomingDeadlines from "../../components/manager/UpcomingDeadlines";
import TimesheetSummary from "../../components/manager/TimesheetSummary";
import RecentEntriesTable from "../../components/manager/RecentEntriesTable";
import { adaptProjects, adaptEntries } from "../../utils/adapters";
import {
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  ExclamationCircleIcon,
  FolderIcon,
} from "@heroicons/react/24/outline";
import PageTitle from "../../components/common/PageTitle";

const ManagerDashboard = () => {
  const { auth } = useAuth();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    if (!auth?.empId) return;
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    setStartDate(startOfWeek.toISOString().split("T")[0]);
    setEndDate(endOfWeek.toISOString().split("T")[0]);
  }, [auth?.empId]);

  const { data: rawStatus = {}, loading: loadingStatus, error: errorStatus } =
    useAxios("/project/get-project-statuswise-counts", { method: "GET" }, !!auth?.empId, [auth?.empId]);

  const { data: rawDeadlines = [], loading: loadingDeadlines, error: errorDeadlines } =
    useAxios("/project/get-upcoming-deadlines", { method: "GET" }, !!auth?.empId, [auth?.empId]);

  const { data: rawSummary = {}, loading: loadingTimesheet, error: errorTimesheet } = useAxios(
    "/empTimesheet/summary",
    { method: "GET", params: { startDate, endDate } },
    !!(startDate && endDate),
    [startDate, endDate]
  );

  const departmentId = auth?.departmentId || null;
  const { data: responseEntries = {}, loading: loadingRecent, error: errorRecent } = useAxios(
    "/empTimesheet/get-recent",
    {
      method: "GET",
      params: departmentId ? { limit: 5, departmentId } : {},
    },
    !!departmentId,
    [departmentId]
  );

  const rawEntries = responseEntries.data || [];
  const projects = adaptProjects(rawDeadlines);
  const entries = adaptEntries(rawEntries);
  const summary = rawSummary;

  const loading = loadingStatus || loadingDeadlines || loadingTimesheet || loadingRecent;
  const error = errorStatus || errorDeadlines || errorTimesheet || errorRecent;

  if (loading) return <div className="p-6 text-gray-600 animate-pulse">Loading dashboard...</div>;
  if (error) return <div className="p-6 text-red-500">Error loading dashboard.</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 space-y-8 transition-all duration-300">
      {/* Page Title */}
      <PageTitle title="Manager Dashboard" />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="rounded-2xl bg-white p-5 shadow-lg border flex items-center gap-4">
          <ExclamationCircleIcon className="h-8 w-8 text-red-500" />
          <div>
            <p className="text-sm font-medium text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-red-600">{rawStatus?.Pending || 0}</p>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-lg border flex items-center gap-4">
          <ClipboardDocumentListIcon className="h-8 w-8 text-yellow-500" />
          <div>
            <p className="text-sm font-medium text-gray-600">In Progress</p>
            <p className="text-2xl font-bold text-yellow-600">{rawStatus?.InProgress || 0}</p>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-lg border flex items-center gap-4">
          <CheckCircleIcon className="h-8 w-8 text-green-600" />
          <div>
            <p className="text-sm font-medium text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-green-600">{rawStatus?.Completed || 0}</p>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-lg border flex items-center gap-4">
          <FolderIcon className="h-8 w-8 text-blue-600" />
          <div>
            <p className="text-sm font-medium text-gray-600">Total</p>
            <p className="text-2xl font-bold text-blue-600">{rawStatus?.Total || 0}</p>
          </div>
        </div>
      </div>

      {/* Row 2: Upcoming Deadlines + Timesheet Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <UpcomingDeadlines projects={projects} />
        <TimesheetSummary summary={summary} />
      </div>

      {/* Row 3: Recent Entries */}
      {/* <div className="rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 p-6">
        <RecentEntriesTable entries={entries} />
      </div> */}
    </div>
  );
};

export default ManagerDashboard;
