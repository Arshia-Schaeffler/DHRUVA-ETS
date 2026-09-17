

import React, { useMemo, useState } from "react";

const ITEMS_PER_PAGE = 5;

const ReportTable = ({ rows = [] }) => {
 const safeRows = Array.isArray(rows) ? rows : [];
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedRows = useMemo(
    () =>
      safeRows.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
      ),
    [safeRows, currentPage]
  );

  const totalPages = Math.ceil(safeRows.length / ITEMS_PER_PAGE);

  return (
    <div className="mt-6 bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-green-700 text-white">
        <h3 className="text-lg font-semibold">Employee Report Table</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">Project</th>
              <th className="px-4 py-2 text-left">Work Details</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Start</th>
              <th className="px-4 py-2 text-left">End</th>
              <th className="px-4 py-2 text-left">Duration</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRows.map((row, idx) => (
              <tr
                key={idx}
                className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <td className="px-4 py-2">{row.ProjectName}</td>
                <td className="px-4 py-2">{row.WorkDetail}</td>
                <td className="px-4 py-2">{row.WorkDate}</td>
                <td className="px-4 py-2">{row.StartTime}</td>
                <td className="px-4 py-2">{row.EndTime}</td>
                <td className="px-4 py-2">{row.TotalTimeSpentInMinutes} mins</td>
              </tr>
            ))}

            {paginatedRows.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-6 text-gray-500 dark:text-gray-400"
                >
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row justify-between items-center px-4 py-3 bg-gray-50 dark:bg-gray-900 border-t dark:border-gray-700 text-sm">
        <div className="mb-2 md:mb-0">
          Page <span className="font-semibold">{currentPage}</span> of{" "}
          <span className="font-semibold">{totalPages || 1}</span>
        </div>

        <div className="flex gap-2">
          <button
            className="px-4 py-1 border rounded-md bg-white dark:bg-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 transition"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            className="px-4 py-1 border rounded-md bg-white dark:bg-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 transition"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportTable;
