
import React, { useState, useMemo } from "react";
import { FunnelIcon, PlusCircleIcon } from "@heroicons/react/24/solid";

const withFilter = (WrappedTable) => {
  return function FilterableComponent({
    data = [],
    filterFields = [],
    filterMeta = {},
    onAddClick,
    title = "",
    ...props
  }) {
    const [filters, setFilters] = useState({});
    const [showFilters, setShowFilters] = useState(false);

    const handleFilterChange = (field, value) => {
      setFilters((prev) => ({ ...prev, [field]: value ?? "" }));
    };

    const clearAllFilters = () => setFilters({});

    const filteredData = useMemo(() => {
      if (!filterFields || filterFields.length === 0) return data;

      return data.filter((row) =>
        filterFields.every((field) => {
          const rawFilter = filters[field];

          // if no filter set for this field, its a match
          if (rawFilter === undefined || rawFilter === null || rawFilter === "")
            return true;

          const rowValue = String(row[field] ?? "")
            .toLowerCase()
            .trim();

          let filterValue = "";
          // simple date-like object handling 
          if (rawFilter instanceof Date) {
            filterValue = rawFilter.toISOString().split("T")[0];
          } else if (rawFilter && typeof rawFilter === "object" && rawFilter.format) {
            filterValue = rawFilter.format("YYYY-MM-DD");
          } else {
            filterValue = String(rawFilter).toLowerCase();
          }

          return rowValue.includes(filterValue);
        })
      );
    }, [data, filterFields, filters]);

    // count active filters for quick UI hint
    const activeFilterCount = Object.values(filters).filter(Boolean).length;

    return (
      <div className="w-full space-y-4">
        <div className="flex items-center justify-between gap-4">
          {title && <h2 className="text-xl font-semibold text-gray-800">{title}</h2>}

          <div className="flex items-center gap-3">
            {onAddClick && (
              <button
                onClick={onAddClick}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-md shadow-sm hover:bg-green-800 transition"
              >
                <PlusCircleIcon className="h-5 w-5" />
                <span className="font-medium">Add</span>
              </button>
            )}

            {filterFields.length > 0 && (
              <button
                type="button"
                onClick={() => setShowFilters((s) => !s)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-md font-medium transition border ${showFilters
                  ? "bg-green-600 text-white border-transparent"
                  : "bg-white text-gray-800 border-gray-200 hover:bg-gray-50"
                  }`}
                aria-expanded={showFilters}
              >
                <FunnelIcon className="h-5 w-5" />
                <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
                {activeFilterCount > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* filter card */}
        <div
          className={`transition-all duration-200 ease-in-out overflow-hidden ${showFilters ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
            }`}
          aria-hidden={!showFilters}
        >
          {showFilters && (
            <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filterFields.map((field, idx) => {
                  const meta = filterMeta[field] || {};
                  const type = meta.type || "text";

                  // SELECT
                  if (type === "select") {
                    return (
                      <div key={`${field}-${idx}`}>
                        <label className="block text-sm font-medium mb-2 text-gray-700">
                          {meta.label ?? field}
                        </label>
                        <select
                          value={filters[field] ?? ""}
                          onChange={(e) => handleFilterChange(field, e.target.value)}
                          className="w-full h-11 rounded-lg border border-gray-300
  bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700
  text-sm px-3 focus:ring-2 focus:ring-green-700 focus:outline-none"
                        >

                          <option value="">{meta.placeholder ?? "All"}</option>
                          {meta.options?.map((opt, optIdx) => (
                            <option key={`${field}-${opt.value}-${optIdx}`} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  }

                  // DATE (expect a custom component via props if needed)
                  if (type === "date") {
                    const DateComponent = props.FormikDateFilter || meta.component || (() => (
                      <input
                        type="date"
                        value={filters[field] || ""}
                        onChange={(e) => handleFilterChange(field, e.target.value)}
                        className="w-full h-11 rounded-lg border border-gray-300
  bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700
  text-sm px-3 focus:ring-2 focus:ring-green-700 focus:outline-none"
                      />

                    ));

                    return (
                      <div key={`${field}-${idx}`}>
                        <label className="block text-sm font-medium mb-2 text-gray-700">
                          {meta.label ?? field}
                        </label>
                        <DateComponent name={field} value={filters[field] || ""} onChange={(name, val) => handleFilterChange(name, val)} />

                      </div>
                    );
                  }

                  // TEXT (default)
                  return (
                    <div key={`${field}-${idx}`}>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        {meta.label ?? field}
                      </label>
                      <input
                        type="text"
                        value={filters[field] ?? ""}
                        onChange={(e) => handleFilterChange(field, e.target.value)}
                        placeholder={meta.placeholder ?? `Filter by ${meta.label ?? field}`}
                        className="w-full h-11 rounded-lg border border-gray-300
  bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700
  text-sm px-3 focus:ring-2 focus:ring-green-700 focus:outline-none"
                      />

                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center justify-end gap-4">
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-red-600 hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* pass filtered data to the wrapped component */}
        <WrappedTable data={filteredData} {...props} />
      </div>
    );
  };
};

export default withFilter;

