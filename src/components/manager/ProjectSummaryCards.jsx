import React from "react";
import {
  ExclamationCircleIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  FolderIcon,
} from "@heroicons/react/24/outline";

const ProjectSummaryCards = ({ summary }) => {
  const cards = [
    {
      label: "Pending",
      value: summary?.Pending || 0,
      icon: <ExclamationCircleIcon className="h-8 w-8 text-red-500" />,
      color: "text-red-600",
    },
    {
      label: "In Progress",
      value: summary?.InProgress || 0,
      icon: <ClipboardDocumentListIcon className="h-8 w-8 text-yellow-500" />,
      color: "text-yellow-600",
    },
    {
      label: "Completed",
      value: summary?.Completed || 0,
      icon: <CheckCircleIcon className="h-8 w-8 text-green-600" />,
      color: "text-green-600",
    },
    {
      label: "Total",
      value: summary?.Total || 0,
      icon: <FolderIcon className="h-8 w-8 text-blue-600" />,
      color: "text-blue-600",
    },
  ];

  return (
    <section>
      <h2 className="text-lg font-bold text-gray-700 mb-4">Project Summary</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((item, i) => (
          <div
            key={i}
            className="rounded-2xl bg-white p-5 shadow-md border flex items-center gap-4 hover:shadow-lg transition"
          >
            {item.icon}
            <div>
              <p className="text-sm font-medium text-gray-600">{item.label}</p>
              <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectSummaryCards;
