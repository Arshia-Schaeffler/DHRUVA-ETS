import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

// Export PDF 
export const exportToPDF = (columns, data, fileName = "timesheet.pdf") => {
  if (!data || !columns || data.length === 0 || columns.length === 0) return;

  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("Timesheet Report", 14, 15);

  const tableColumn = columns.map((col) => col.headerName);
  const tableRows = data.map((row) => columns.map((col) => row[col.field] ?? ""));

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 25,
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [34, 197, 94], textColor: 255 },
    theme: "striped",
  });

  doc.save(fileName);
};

// Export Excel
export const exportToExcel = (data, fileName = "timesheet.xlsx") => {
  if (!data || data.length === 0) return;

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Timesheet");
  XLSX.writeFile(workbook, fileName);
};
