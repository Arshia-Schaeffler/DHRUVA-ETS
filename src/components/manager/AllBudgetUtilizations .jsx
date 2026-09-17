
import React from "react";
import { motion } from "framer-motion";

const AllBudgetUtilizations = ({ data = [] }) => {
  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "N/A";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(amount));
  };

  return (
    <motion.section
      className="bg-white rounded-2xl p-6 shadow-md border overflow-hidden"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-700">Project Budget Utilization</h2>
        <p className="text-sm text-gray-500">{data.length} projects</p>
      </div>

      <div className="mt-4 max-h-[420px] overflow-y-auto">
        {data.length === 0 ? (
          <p className="text-gray-500 text-sm">No budget utilization data available</p>
        ) : (
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="text-gray-600 border-b">
                <th className="pb-3 pr-6">Project</th>
                <th className="pb-3 pr-6">Used / Total</th>
                <th className="pb-3 text-right">Utilization</th>
              </tr>
            </thead>
            <tbody>
              {data.map((project) => {
                const utilization = Number(project.utilizationPercent) || 0;
                const colorClass =
                  utilization > 80 ? "bg-red-500" : utilization > 50 ? "bg-orange-400" : "bg-blue-500";
                const textColor =
                  utilization > 80 ? "text-red-600" : utilization > 50 ? "text-orange-500" : "text-blue-600";

                return (
                  <tr key={project.projectId} className="border-b hover:bg-gray-50 transition">
                    <td className="py-3 align-top">
                      <div>
                        <p className="font-semibold text-gray-800 truncate">{project.projectName}</p>
                        <p className="text-xs text-gray-500">ID: {project.projectId}</p>
                      </div>
                    </td>

                    <td className="py-3 align-top">
                      <p className="text-gray-700 text-xs">
                        {formatCurrency(project.used)} / {formatCurrency(project.totalBudget)}
                      </p>
                    </td>

                    <td className="py-3 text-right align-top w-40">
                      <div className="flex items-center justify-end gap-3">
                        <span className={`font-semibold text-sm ${textColor}`}>{utilization.toFixed(2)}%</span>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full ${colorClass}`}
                          style={{ width: `${Math.min(100, utilization)}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </motion.section>
  );
};

export default AllBudgetUtilizations;

