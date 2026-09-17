
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";

const UpcomingDeadlinesForReport = ({ deadlines = [] }) => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const formatCurrency = (amount) =>
    amount
      ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(amount))
      : "N/A";

  const getUrgency = (endDate) => {
    const today = new Date();
    const due = new Date(endDate);
    const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24)); // days

    if (diff <= 0) return { label: "Overdue", color: "bg-red-500 text-white" };
    if (diff <= 3) return { label: `Due in ${diff} days`, color: "bg-orange-400 text-white" };
    if (diff <= 7) return { label: `Due in ${diff} days`, color: "bg-yellow-400 text-black" };
    return { label: `Due in ${diff} days`, color: "bg-green-400 text-white" };
  };

  const handleView = (id) => {
    const role = auth?.role?.toLowerCase();
    navigate(`/${role}/project-details/${id}`);
  };

  return (
    <motion.section initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Upcoming Deadlines</h2>

      {Array.isArray(deadlines) && deadlines.length === 0 ? (
        <p className="text-gray-500 text-sm">No upcoming project deadlines</p>
      ) : Array.isArray(deadlines) ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {deadlines.map((project) => {
            const urgency = getUrgency(project.ProjectEndDate);
            return (
              <motion.div
                key={project.Id}
                onClick={() => handleView(project.Id)}
                whileHover={{ y: -4 }}
                className="rounded-2xl bg-white p-5 border shadow-sm hover:shadow-lg transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-base font-semibold text-gray-800">{project.ProjectName}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    End Date: {new Date(project.ProjectEndDate).toLocaleDateString()}
                  </p>

                  <div className="mt-3 text-sm text-gray-700">
                    <span className="font-medium">Budget:</span> {formatCurrency(project.Budget)}
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${urgency.color}`}>
                      {urgency.label}
                    </span>

                    <span
                      className={`inline-block px-2 py-1 rounded-md text-sm font-medium ${
                        project.CompletionStatus === "Completed"
                          ? "bg-green-100 text-green-700"
                          : project.CompletionStatus === "In Progress"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {project.CompletionStatus}
                    </span>
                  </div>
                </div>
                <div className="mt-4 text-right">
                  <span className="text-xs text-gray-400">Click to view details</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <p className="text-red-500 text-sm">Invalid deadlines data</p>
      )}
    </motion.section>
  );
};

export default UpcomingDeadlinesForReport;

