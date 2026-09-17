
import PropTypes from "prop-types";
import { useState, useMemo } from "react";
import {
  PencilIcon,
  EyeIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";

const DataTable = ({ rows = [], columns, onEdit, onView, onDelete }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const visibleRows = useMemo(() => {
    return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [rows, page, rowsPerPage]);

  const totalPages = Math.ceil(rows.length / rowsPerPage);

  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-900 shadow-md rounded-lg border dark:border-gray-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            {columns.map((col) => (
              <th
                key={col.id}
                className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
              >
                {col.label}
              </th>
            ))}
            {(onEdit || onView || onDelete) && (
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {visibleRows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="text-center py-6 text-gray-500 dark:text-gray-400"
              >
                No records found
              </td>
            </tr>
          ) : (
            visibleRows.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                {columns.map((col) => (
                  <td
                    key={col.id}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-300"
                  >
                    {row[col.id]}
                  </td>
                ))}
                {(onEdit || onView || onDelete) && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center space-x-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row)}
                        className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-green-600 dark:hover:bg-green-600 text-blue-600 dark:text-blue-300 hover:text-white transition"
                        title="Edit"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                    )}
                    {onView && (
                      <button
                        onClick={() => onView(row)}
                        className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-blue-600 dark:hover:bg-blue-600 text-green-600 dark:text-green-300 hover:text-white transition"
                        title="View"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row)}
                        className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-red-600 dark:hover:bg-red-600 text-red-600 dark:text-red-300 hover:text-white transition"
                        title="Delete"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center p-4 gap-3">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Page {page + 1} of {totalPages || 1}
        </span>

        <div className="flex items-center gap-3">
          {/* Rows per page selector */}
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(parseInt(e.target.value));
              setPage(0);
            }}
            className="px-2 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm dark:text-white"
          >
            {[5, 10, 25, 50].map((n) => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </select>

          {/* Prev Button */}
          <button
            onClick={() => setPage((prev) => prev - 1)}
            disabled={page === 0}
            className="flex items-center gap-1 px-3 py-1 text-sm rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-green-700 hover:text-white disabled:opacity-50 transition"
          >
            <ChevronLeftIcon className="h-4 w-4" />
            Prev
          </button>

          {/* Next Button */}
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={(page + 1) * rowsPerPage >= rows.length}
            className="flex items-center gap-1 px-3 py-1 text-sm rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-green-700 hover:text-white disabled:opacity-50 transition"
          >
            Next
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

DataTable.propTypes = {
  rows: PropTypes.array,
  columns: PropTypes.array.isRequired,
  onEdit: PropTypes.func,
  onView: PropTypes.func,
  onDelete: PropTypes.func,
};

export default DataTable;
