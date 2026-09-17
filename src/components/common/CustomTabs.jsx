

import React from "react";
import PropTypes from "prop-types";

const CustomTabs = ({
  tabs,
  value,
  onChange,
  tabStyles = {},
  indicatorColor = "bg-blue-600",
}) => {
  return (
    <div className="flex border-b border-gray-300 dark:border-gray-700 overflow-x-auto">
      {tabs.map((tab, index) => {
        const isActive = value === index;

        const activeClass = isActive
          ? tabStyles.active || "text-blue-600 dark:text-blue-400 font-semibold"
          : "";

        const hoverClass = tabStyles.hover || "hover:text-blue-600 dark:hover:text-blue-400";

        const baseClass =
          tabStyles.default ||
          "relative px-4 py-3 font-medium text-gray-700 dark:text-gray-200 transition-colors duration-200";

        return (
          <button
            key={index}
            onClick={() => onChange(index)} 
            className={`${baseClass} ${hoverClass} ${activeClass}`}
          >
            {tab.label}

            {/* Indicator */}
            {isActive && (
              <span
                className={`absolute left-0 right-0 bottom-0 h-1 ${indicatorColor} rounded-t-md`}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

CustomTabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  tabStyles: PropTypes.object,
  indicatorColor: PropTypes.string,
};

export default CustomTabs;
