import React from "react";
import {
  MdEventAvailable,
  MdError,
  MdAccessTime,
  MdCheckCircle,
} from "react-icons/md";

export default function UpcomingDeadlines({ projects }) {
  if (!projects || projects.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-white shadow-md border border-gray-100 flex flex-col items-center justify-center text-gray-500 space-y-2">
        <MdCheckCircle className="text-green-500" size={28} />
        <p className="text-sm font-medium">No upcoming deadlines</p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl bg-white shadow-md hover:shadow-lg border border-gray-100 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center mb-4 border-b pb-2">
        <div className="flex items-center space-x-2">
          <div className="bg-green-100 text-green-600 p-2 rounded-full">
            <MdEventAvailable size={20} />
          </div>
          <h3 className="font-bold text-lg text-gray-800">Upcoming Deadlines</h3>
        </div>
      </div>

      {/* Deadlines List */}
      <div className="space-y-4">
        {projects.map((p) => (
          <div
            key={p.ProjectId || p.id || `${p.name}-${p.endDate}`}
            className="group relative p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md transition-all duration-300"
          >
            {/* Project Info */}
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-800 group-hover:text-gray-900 transition">
                  {p.name}
                </p>
                <p className="text-sm text-gray-600">
                  End Date:{" "}
                  <span className="font-medium text-gray-700">
                    {p.endDate}
                  </span>
                </p>
              </div>

              {/* Status Badge */}
              <span
                className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full transition-all duration-300 ${
                  p.daysLeft <= 0
                    ? "bg-red-100 text-red-700 ring-1 ring-red-200"
                    : p.daysLeft <= 7
                    ? "bg-orange-100 text-orange-700 ring-1 ring-orange-200"
                    : "bg-green-100 text-green-700 ring-1 ring-green-200"
                }`}
              >
                {p.daysLeft <= 0 ? (
                  <>
                    <MdError size={14} className="mr-1" />
                    Overdue
                  </>
                ) : p.daysLeft <= 7 ? (
                  <>
                    <MdAccessTime size={14} className="mr-1" />
                    Due in {p.daysLeft} days
                  </>
                ) : (
                  <>
                    <MdCheckCircle size={14} className="mr-1" />
                    Due in {p.daysLeft} days
                  </>
                )}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
