
import React from "react";

const StatCard = ({ title, value, icon, accent = "green", trend }) => {
  const accentMap = {
    blue: {
      icon: "text-blue-600 bg-blue-50",
      trend: "text-blue-600",
    },
    green: {
      icon: "text-green-600 bg-green-50",
      trend: "text-green-600",
    },
    yellow: {
      icon: "text-yellow-600 bg-yellow-50",
      trend: "text-yellow-600",
    },
    red: {
      icon: "text-red-600 bg-red-50",
      trend: "text-red-600",
    },
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="p-5 flex items-center justify-between">
        {/* LEFT */}
        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <p className="mt-1 text-3xl font-semibold text-gray-900">
            {value}
          </p>

          {trend && (
            <p className="mt-1 text-xs text-gray-500">
              <span
                className={`font-medium ${
                  trend.startsWith("-")
                    ? "text-red-600"
                    : accentMap[accent].trend
                }`}
              >
                {trend}
              </span>{" "}
              vs last month
            </p>
          )}
        </div>

        {/* RIGHT ICON */}
        <div
          className={`h-12 w-12 rounded-lg flex items-center justify-center ${accentMap[accent].icon}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
