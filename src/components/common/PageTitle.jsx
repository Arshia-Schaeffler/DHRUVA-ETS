import React from "react";

const PageTitle = ({ title, subtitle }) => {
  return (
    <div className="mb-4">
      <h1 className="text-gray-700 dark:text-gray-200 font-bold text-2xl sm:text-3xl">
        {title}
      </h1>
      {subtitle && (
        <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base mt-1">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default PageTitle;
