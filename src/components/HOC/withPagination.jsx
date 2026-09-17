
import React, { useState, useMemo } from "react";

const withPagination = (WrappedTable) => {
  return function PaginatedComponent({
    data = [],
    rowsPerPageOptions = [5, 10, 25, 50],
    initialRowsPerPage,
    ...props
  }) {
    const defaultRows = initialRowsPerPage || rowsPerPageOptions[0] || 10;
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(defaultRows);

    const totalPages = Math.max(1, Math.ceil((data?.length || 0) / rowsPerPage));

    const paginatedData = useMemo(() => {
      const start = currentPage * rowsPerPage;
      return data.slice(start, start + rowsPerPage);
    }, [data, currentPage, rowsPerPage]);

    const handlePageChange = (page) => {
      if (page < 0) page = 0;
      if (page > totalPages - 1) page = totalPages - 1;
      setCurrentPage(page);
    };

    const handleRowsPerPageChange = (e) => {
      setRowsPerPage(Number(e.target.value));
      setCurrentPage(0);
    };

    return (
      <div className="space-y-4">
        <WrappedTable data={paginatedData} {...props} />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-gray-100 pt-3">
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <span className="font-medium">Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="px-3 py-1 border rounded-md focus:ring-2 focus:ring-green-200"
            >
              {rowsPerPageOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <span>
              {data.length === 0
                ? "0"
                : `${currentPage * rowsPerPage + 1}-${Math.min(
                    (currentPage + 1) * rowsPerPage,
                    data.length
                  )} of ${data.length}`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {["<<", "Prev"].map((label, idx) => (
              <button
                key={label}
                onClick={() =>
                  handlePageChange(label === "<<" ? 0 : currentPage - 1)
                }
                disabled={currentPage === 0}
                className={`px-3 py-1 rounded-md border text-sm ${
                  currentPage === 0
                    ? "text-gray-400 border-gray-200 cursor-not-allowed"
                    : "text-gray-700 border-gray-300 hover:bg-[#006633] hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}

            <span className="px-3 py-1 font-semibold text-gray-800">
              Page {currentPage + 1} / {totalPages}
            </span>

            {["Next", ">>"].map((label, idx) => (
              <button
                key={label}
                onClick={() =>
                  handlePageChange(
                    label === ">>" ? totalPages - 1 : currentPage + 1
                  )
                }
                disabled={currentPage >= totalPages - 1}
                className={`px-3 py-1 rounded-md border text-sm ${
                  currentPage >= totalPages - 1
                    ? "text-gray-400 border-gray-200 cursor-not-allowed"
                    : "text-gray-700 border-gray-300 hover:bg-[#006633] hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };
};

export default withPagination;
