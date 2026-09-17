
import React from "react";

const MUIButton = ({ children, onClick, type = "button", className = "" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-md flex items-center gap-2 transition ${className}`}
    >
      {children}
    </button>
  );
};

export default MUIButton;
