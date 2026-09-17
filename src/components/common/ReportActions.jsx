import React from "react";
import MUIButton from "./MUIButton";
import { FaDownload } from "react-icons/fa";
import { FiToggleRight, FiSliders } from "react-icons/fi";

const ReportActions = () => {
  return (
    <div className="flex flex-wrap gap-2">
      <MUIButton>
        <FaDownload className="w-4 h-4" />
        Export
      </MUIButton>
      <MUIButton>
        <FiToggleRight className="w-4 h-4" />
        Rounding
      </MUIButton>
      <MUIButton>
        <FiSliders className="w-4 h-4" />
        Show amount
      </MUIButton>
    </div>
  );
};

export default ReportActions;
