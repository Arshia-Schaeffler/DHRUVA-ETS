

import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import MUIButton from "./MUIButton";
import { FaFilePdf, FaFileExcel } from "react-icons/fa";

const ReportHeaderActions = ({ rows = [] }) => {
  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Weekly Timesheet Report", 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [["Project", "Work Detail", "Date", "Start", "End", "Duration (mins)"]],
      body: rows.map((r) => [
        r.ProjectName,
        r.WorkDetail,
        r.WorkDate,
        r.StartTime,
        r.EndTime,
        r.TotalTimeSpentInMinutes,
      ]),
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [34, 197, 94], // Tailwind green-500
      },
    });

    doc.save("Report.pdf");
  };

  const handleExportExcel = () => {
    const worksheetData = [
      ["Project", "Work Detail", "Date", "Start", "End", "Duration (mins)"],
      ...rows.map((r) => [
        r.ProjectName,
        r.WorkDetail,
        r.WorkDate,
        r.StartTime,
        r.EndTime,
        r.TotalTimeSpentInMinutes,
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(fileData, "Report.xlsx");
  };

  return (
    <div className="flex flex-wrap gap-2 justify-end items-center mt-2">
      <MUIButton
        onClick={handleExportPDF}
        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-150"
      >
        <FaFilePdf className="w-5 h-5" />
        Export PDF
      </MUIButton>

      <MUIButton
        onClick={handleExportExcel}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition duration-150"
      >
        <FaFileExcel className="w-5 h-5" />
        Export Excel
      </MUIButton>
    </div>
  );
};

export default ReportHeaderActions;
