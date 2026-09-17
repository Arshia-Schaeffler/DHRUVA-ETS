
import React from "react";
import { MdHistory } from "react-icons/md";

export default function RecentEntriesTable({ entries }) {
  if (!entries || entries.length === 0) {
    return (
      <div className="p-4 border rounded-lg shadow-sm text-center text-gray-500">
        No recent timesheet entries
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg shadow-sm overflow-x-auto">
      <h3 className="font-bold text-lg mb-2 flex items-center space-x-2">
        <MdHistory className="text-blue-600" size={20} />
        <span>Recent Timesheet Entries</span>
      </h3>
      <table className="w-full text-sm border rounded-lg overflow-hidden">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="p-2 text-left">Date</th>
            <th className="p-2 text-left">Employee</th>
            <th className="p-2 text-left">Project</th>
            <th className="p-2 text-left">Title</th>
            <th className="p-2 text-left">Hours</th>
            <th className="p-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e, i) => (
            <tr
              key={e.id || i}
              className="border-t hover:bg-gray-50 transition"
            >
              {/*  Directly show formatted date from adaptor */}
              <td className="p-2 text-gray-600">{e.date}</td>

              {/*  Employee string directly */}
              <td className="p-2">{e.employee || "—"}</td>

              {/*  Project string directly */}
              <td className="p-2">{e.project || "—"}</td>

              <td className="p-2">{e.title}</td>

            
              <td className="p-2 font-medium">{e.hours}</td>

              <td className="p-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    e.status === "Approved"
                      ? "bg-green-100 text-green-700"
                      : e.status === "Rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {e.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


