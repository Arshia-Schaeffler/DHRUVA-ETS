import { useState } from "react";
import useAxios from "../../hooks/useAxios";
import TopProjectsPie from "../../components/chart/TopProjectsPie";
import DailyTimesheetTrend from "../../components/common/DailyTimesheetTrend";
import ReportTimesheetTable from "../../components/common/ReportTimesheetTable";


export default function ReportsPage() {
  const [filters, setFilters] = useState({
    dateRange: "",
    project: "",
    status: "",
  });

  const empId = localStorage.getItem("empId");

  // PIE CHART API
  const { data: projectPie } = useAxios(
    `/project/top-projects?empId=${empId}`
  );


  const { data: timesheetData } = useAxios(
    `/empTimesheet/get-daily-summary`
  );

  const { data: timesheetReport } = useAxios(
  `/empTimesheet/get-timesheets?empId=${empId}`
);


  return (
    <div className="min-h-screen bg-[#F6F8FA] flex justify-center px-6 py-8">
      <div className="w-full max-w-[1440px]">

        {/* Header */}
        <header className="mb-6">
          <h1 className="text-[28px] font-semibold text-[#1F2937]">Reports</h1>
        
        </header>
        {/*    CHART SECTION     */}

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div className="col-span-1">
            <DailyTimesheetTrend data={timesheetData || []} />
          </div>

          <div className="col-span-1">
            <TopProjectsPie data={projectPie || []} />
          </div>

        </div>
        <ReportTimesheetTable data={timesheetReport || []} />


      </div>
    </div>
   
  );
}

