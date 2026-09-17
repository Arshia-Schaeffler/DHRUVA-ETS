import React from "react";

export const teamColumns = [
  {
    headerName: "Employee",
    render: (row) => (
      <div className="flex items-center gap-3">
  <img
          src={row.avatar || "https://i.pravatar.cc/40"}
          alt={row.name}
          className="h-9 w-9 rounded-full object-cover"
        />
                <div>
          <p className="font-medium text-gray-900">{row.name}</p>
          <p className="text-xs text-gray-500">
            Joined {row.joinedDate}
          </p>
        </div>
      </div>
    ),
  },
  { headerName: "Email", field: "email" },
  { headerName: "Designation", field: "designation" },
  { headerName: "Phone", field: "phone" },
  {
  headerName: "Status",
  render: (row) => {
    const status = row.status?.toLowerCase();

    const statusStyles = {
      active: "bg-green-100 text-green-700",
      idle: "bg-red-100 text-red-600",
    };

    const badgeClass =
      statusStyles[status] || "bg-gray-100 text-gray-600";

    return (
      <span
        className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${badgeClass}`}
      >
        {row.status}
      </span>
    );
  },
},

];
