import React from "react";

const ReportCardWrapper = ({ title, actions, children }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          {title}
        </h2>

        <div className="flex gap-2">{actions}</div>
      </div>

      {children}
    </div>
  );
};

export default ReportCardWrapper;
