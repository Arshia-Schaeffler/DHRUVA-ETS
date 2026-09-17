import React, { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import axiosInstance from "../common/AxiosInstance";
import Swal from "sweetalert2";


const CollapsibleTable = ({
  columns = [],
  data = [],
  collapsibleFields = [],
  keyField,
  refetch,
  isManager = false,
}) => {
  const [openRows, setOpenRows] = useState({});

  const handleToggleRow = (key) => {
    setOpenRows((prev) => ({ ...prev, [key]: !prev[key] }));
  };
    const handleApproval = async (timesheetId, status) => {
  const confirm = await Swal.fire({
    title: "Are you sure?",
    text: `You want to ${status} this timesheet?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: `Yes, ${status}`,
    cancelButtonText: "Cancel",
  });

  if (!confirm.isConfirmed) return;

  try {
    await axiosInstance.put(
      `/empTimesheet/manager/approve-timesheet/${timesheetId}`,
      { approvalStatus: status }
    );

    await Swal.fire({
      title: "Success!",
      text: `Timesheet ${status} successfully.`,
      icon: "success",
    });

    refetch?.();
  } catch (error) {
    console.error("Approval failed:", error);
    Swal.fire("Error!", "Something went wrong!", "error");
  }
};

  const getSafeKey = (row, suffix = "") => {
    const base =
      (keyField && row?.[keyField]) ||
      `row-${Math.random().toString(36).substr(2, 9)}`;
    return suffix ? `${base}-${suffix}` : base;
  };

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden">
      <table className="min-w-full text-sm text-gray-700">
      <thead className="bg-green-500 text-white">

          <tr className="bg-green-600 text-white text-left">
            <th className="px-3 py-3 w-10"></th>
            <th className="px-4 py-3 font-semibold">Sr. No.</th>
            {columns.map((col, i) => (
              <th
                key={col.field || `col-${i}`}
                className="px-4 py-3 font-semibold"
              >
                {col.headerName}
              </th>
            ))}
            {isManager && <th className="px-4 py-3 text-center font-semibold">Action</th>}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length + (isManager ? 3 : 2)}
                className="px-6 py-8 text-center text-gray-400 italic"
              >
                No records available
              </td>
            </tr>
          )}

          {data.map((row, index) => {
            const rowKey = getSafeKey(row);
            const isOpen = !!openRows[rowKey];

            return (
              <React.Fragment key={rowKey}>
                <tr
                  key={`${rowKey}-main`}
                  className={`transition-colors hover:bg-green-50 ${
                    isOpen ? "bg-green-50/50" : ""
                  }`}
                >
                  <td className="px-3 py-3 align-top">
                    <button
                      onClick={() => handleToggleRow(rowKey)}
                      className="p-1 rounded-md hover:bg-green-100 focus:outline-none"
                      title={isOpen ? "Collapse" : "Expand"}
                    >
                      {isOpen ? (
                        <ChevronUpIcon className="h-5 w-5 text-gray-600" />
                      ) : (
                        <ChevronDownIcon className="h-5 w-5 text-gray-600" />
                      )}
                    </button>
                  </td>

                  <td className="px-4 py-3 font-medium align-top">{index + 1}</td>

                  {columns.map((col, colIndex) => {
                    const value =
                      col.render?.(row) ?? row?.[col.field] ?? "—";

                    if (col.field === "ManagerApproval") {
                      const status = row.ManagerApproval ?? "Pending";
                      const colors = {
                        Approved: "bg-green-100 text-green-700",
                        Rejected: "bg-red-100 text-red-700",
                        Pending: "bg-yellow-100 text-yellow-800",
                      };

                      return (
                        <td key={`${rowKey}-${col.field}`} className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${colors[status]}`}
                          >
                            {status}
                          </span>
                        </td>
                      );
                    }

                    return (
                      <td
                        key={`${rowKey}-${col.field || colIndex}`}
                        className="px-4 py-3 align-top"
                      >
                        <div className="truncate max-w-[18rem]">{value}</div>
                      </td>
                    );
                  })}

                  {isManager && (
                    <td className="px-4 py-3 text-center">
                      {row.ManagerApproval === "Pending" ? (
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() =>
                              handleApproval(row.TimeSheetId, "Approved")
                            }
                            className="px-3 py-1 text-xs font-semibold rounded-md border border-green-200 bg-green-50 text-green-800 hover:bg-green-100"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              handleApproval(row.TimeSheetId, "Rejected")
                            }
                            className="px-3 py-1 text-xs font-semibold rounded-md border border-red-200 bg-red-50 text-red-800 hover:bg-red-100"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs italic">—</span>
                      )}
                    </td>
                  )}
                </tr>

                {isOpen && (
                  <tr id={`${rowKey}-panel`} className="bg-gray-50">
                    <td
                      colSpan={columns.length + (isManager ? 3 : 2)}
                      className="p-0"
                    >
                      <div className="p-4 animate-[fadeIn_120ms_ease-in]">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {collapsibleFields.length === 0 ? (
                            <div className="col-span-full text-sm text-gray-500">
                              No additional details.
                            </div>
                          ) : (
                            collapsibleFields.map((field, i) => (
                              <div
                                key={`${rowKey}-${field}-${i}`}
                                className="border border-gray-100 rounded-lg p-3 bg-white shadow-sm"
                              >
                                <p className="text-xs font-semibold text-gray-600 mb-1">
                                  {field}
                                </p>
                                <p className="text-sm text-gray-700">
                                  {String(row[field] ?? "—")}
                                </p>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CollapsibleTable;
