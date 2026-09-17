import React from "react";
import { Outlet } from "react-router-dom";

const MainContent = ({ open, darkMode, children }) => {
  return (
    <main
      className={`
        min-h-screen transition-all duration-300 px-6 pt-20
        ${open ? "ml-[240px]" : "ml-[64px]"}
        ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"}
      `}
    >
      <div className="w-full">
        <Outlet />
        {children}
      </div>
    </main>
  );
};

export default MainContent;


