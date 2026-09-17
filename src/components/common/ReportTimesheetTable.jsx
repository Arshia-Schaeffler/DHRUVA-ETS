import React, { useMemo } from "react";

export default function TimesheetOverview({ data = [] }) {
  const overview = useMemo(() => {
    const result = {};

    const timeToMinutes = (time = "00:00:00") => {
  if (!time || typeof time !== "string") return 0;
  const [h = 0, m = 0] = time.split(":").map(Number);
  return h * 60 + m;
};

const minutesToHHMM = (minutes = 0) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
};


    data.forEach((item) => {
      const project = item.ProjectName || "Unknown";

      if (!result[project]) {
        result[project] = {
          totalMinutes: 0,
          approvedMinutes: 0,
          tasks: 0,
          approved: 0,
          pending: 0,
          rejected: 0,
        };
      }

      const minutes = timeToMinutes(item.TotalTimeSpent);

      result[project].totalMinutes += minutes;
      result[project].tasks += 1;

      if (item.ManagerApproval === "Approved") {
        result[project].approved += 1;
        result[project].approvedMinutes += minutes;
      }
      if (item.ManagerApproval === "Pending") result[project].pending += 1;
      if (item.ManagerApproval === "Rejected") result[project].rejected += 1;
    });

    return Object.entries(result).map(([project, stats]) => {
      const approvalPercent =
        stats.totalMinutes > 0
          ? Math.round((stats.approvedMinutes / stats.totalMinutes) * 100)
          : 0;

      return {
        project,
        totalHours: minutesToHHMM(stats.totalMinutes),
        approvedHours: minutesToHHMM(stats.approvedMinutes),
        approvalPercent,
        ...stats,
      };
    });
  }, [data]);

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 mt-8 border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Timesheet Summary (Project-wise)
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100 sticky top-0 shadow-sm">
            <tr>
              <th className="p-3 text-left text-sm font-semibold">Project</th>
              <th className="p-3 text-sm font-semibold">Logged (hh:mm)</th>
              <th className="p-3 text-sm font-semibold">Approved (hh:mm)</th>
              <th className="p-3 text-sm font-semibold">Tasks</th>
              <th className="p-3 text-sm font-semibold">Approval %</th>
              <th className="p-3 text-sm font-semibold">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {overview.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  No data available
                </td>
              </tr>
            ) : (
              overview.map((item) => (
                <tr key={item.project} className="hover:bg-gray-50">
                  <td className="p-3 font-medium">{item.project}</td>
                  <td className="p-3 text-center">{item.totalHours}</td>
                  <td className="p-3 text-center text-green-700">
                    {item.approvedHours}
                  </td>
                  <td className="p-3 text-center">{item.tasks}</td>
                  <td className="p-3 text-center font-semibold">
                    {item.approvalPercent}%
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium
                        ${
                          item.pending > 0
                            ? "bg-yellow-100 text-yellow-800"
                            : item.rejected > 0
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                    >
                      {item.pending > 0
                        ? "Pending"
                        : item.rejected > 0
                        ? "Rejected"
                        : "Approved"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

