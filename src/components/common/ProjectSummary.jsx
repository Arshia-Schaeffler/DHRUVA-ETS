
// import React from "react";
// import { useNavigate } from "react-router-dom";   
// import { useAuth } from "../../context/AuthContext"; 
// import useAxios from "../../hooks/useAxios";

// const ProjectSummary = () => {
//   const { auth } = useAuth();       
//   const navigate = useNavigate();    

//   // Project Status Summary API
//   const {
//     data: projectSummary = {},
//     loading: summaryLoading,
//     error: summaryError,
//   } = useAxios("/project/get-project-statuswise-counts", {}, true, {});

//   // Upcoming Deadlines API
//   const {
//     data: upcomingDeadlines = [],
//     loading: deadlineLoading,
//     error: deadlineError,
//   } = useAxios("/project/get-upcoming-deadlines", {}, true, []);

//   if (summaryLoading || deadlineLoading) return <p>Loading...</p>;
//   if (summaryError || deadlineError) return <p>Error loading report data</p>;

//   const deadlines = Array.isArray(upcomingDeadlines) ? upcomingDeadlines : [];

//   // Function to get urgency color based on days left
//   const getUrgency = (endDate) => {
//     const today = new Date();
//     const due = new Date(endDate);
//     const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

//     if (diff <= 0) return { label: "Overdue", color: "bg-red-500 text-white" };
//     if (diff <= 3) return { label: `Due in ${diff} days`, color: "bg-orange-400 text-white" };
//     if (diff <= 7) return { label: `Due in ${diff} days`, color: "bg-yellow-400 text-black" };
//     return { label: `Due in ${diff} days`, color: "bg-green-400 text-white" };
//   };

//   // Format budget as INR currency
//   const formatBudget = (budget) => {
//     if (!budget) return "N/A";
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 0,
//     }).format(budget);
//   };

//   // Navigate to project details
//   const handleView = (projectId) => {
//     const role = auth?.role?.toLowerCase(); // admin, user, manager
//     navigate(`/${role}/project-details/${projectId}`);
//   };

//   return (
//     <div className="p-6 space-y-6">
//       {/* Project Status Summary */}
//       <h2 className="text-2xl font-bold mb-4">Project Summary</h2>
//      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//   <div className="rounded-2xl shadow-md bg-white p-4 border">
//     <h3 className="text-lg font-medium text-gray-700">Pending</h3>
//     <p className="text-2xl font-bold text-red-600">{projectSummary?.Pending || 0}</p>
//   </div>
//   <div className="rounded-2xl shadow-md bg-white p-4 border">
//     <h3 className="text-lg font-medium text-gray-700">In Progress</h3>
//     <p className="text-2xl font-bold text-yellow-600">{projectSummary?.InProgress || 0}</p>
//   </div>
//   <div className="rounded-2xl shadow-md bg-white p-4 border">
//     <h3 className="text-lg font-medium text-gray-700">Completed</h3>
//     <p className="text-2xl font-bold text-green-600">{projectSummary?.Completed || 0}</p>
//   </div>
//   <div className="rounded-2xl shadow-md bg-white p-4 border">
//     <h3 className="text-lg font-medium text-gray-700">Total</h3>
//     <p className="text-2xl font-bold text-blue-600">{projectSummary?.Total || 0}</p>
//   </div>
// </div>
//       {/* Upcoming Deadlines */}
//       <h2 className="text-2xl font-bold mt-8 mb-4">Upcoming Deadlines</h2>
//       {deadlines.length === 0 ? (
//         <p className="text-gray-600">No upcoming project deadlines</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {deadlines.map((project) => {
//             const urgency = getUrgency(project.ProjectEndDate);
//             return (
//               <div
//                 key={project.Id}
//                 onClick={() => handleView(project.Id)}
//                 className="rounded-2xl shadow-md bg-white p-4 border flex flex-col justify-between cursor-pointer hover:shadow-lg transition"
//               >
//                 <div>
//                   <h3 className="text-lg font-semibold">{project.ProjectName}</h3>
//                   <p className="text-sm text-gray-600">
//                     End Date: {new Date(project.ProjectEndDate).toLocaleDateString()}
//                   </p>
//                   <span
//                     className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${urgency.color}`}
//                   >
//                     {urgency.label}
//                   </span>

//                   {/* Budget Section */}
//                   <div className="mt-3">
//                     <p className="text-sm text-gray-700">
//                       <span className="font-medium">Budget:</span>{" "}
//                       {formatBudget(project.Budget)}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Status */}
//                 <div className="mt-4">
//                   <span
//                     className={`inline-block px-3 py-1 rounded-md text-sm ${
//                       project.CompletionStatus === "Completed"
//                         ? "bg-green-100 text-green-700"
//                         : project.CompletionStatus === "In Progress"
//                         ? "bg-yellow-100 text-yellow-700"
//                         : "bg-red-100 text-red-700"
//                     }`}
//                   >
//                     {project.CompletionStatus}
//                   </span>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProjectSummary;


import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import useAxios from "../../hooks/useAxios";

// Heroicons
import {
  ExclamationCircleIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  FolderIcon,
} from "@heroicons/react/24/outline";


const ProjectSummary = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const {
    data: projectSummary = {},
    loading: summaryLoading,
    error: summaryError,
  } = useAxios("/project/get-project-statuswise-counts", {}, true, {});

  const {
    data: upcomingDeadlines = [],
    loading: deadlineLoading,
    error: deadlineError,
  } = useAxios("/project/get-upcoming-deadlines", {}, true, []);

  if (summaryLoading || deadlineLoading) return <p>Loading...</p>;
  if (summaryError || deadlineError) return <p>Error loading report data</p>;

  const deadlines = Array.isArray(upcomingDeadlines) ? upcomingDeadlines : [];

  const getUrgency = (endDate) => {
    const today = new Date();
    const due = new Date(endDate);
    const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    if (diff <= 0) return { label: "Overdue", color: "bg-red-500 text-white" };
    if (diff <= 3) return { label: `Due in ${diff} days`, color: "bg-orange-400 text-white" };
    if (diff <= 7) return { label: `Due in ${diff} days`, color: "bg-yellow-400 text-black" };
    return { label: `Due in ${diff} days`, color: "bg-green-400 text-white" };
  };

  const formatBudget = (budget) => {
    if (!budget) return "N/A";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(budget);
  };

  const handleView = (projectId) => {
    const role = auth?.role?.toLowerCase();
    navigate(`/${role}/project-details/${projectId}`);
  };

  return (
    <div className="px-6 py-4 space-y-4">
      {/* Project Summary */}
      <section className="space-y-2">
        <h2 className="text-lg font-bold text-gray-700">Project Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Pending */}
          <div className="rounded-2xl bg-white p-5 shadow-lg border flex items-center gap-4">
            <ExclamationCircleIcon className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-red-600">{projectSummary?.Pending || 0}</p>
            </div>
          </div>

          {/* In Progress */}
          <div className="rounded-2xl bg-white p-5 shadow-lg border flex items-center gap-4">
            <ClipboardDocumentListIcon  className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-yellow-600">{projectSummary?.InProgress || 0}</p>
            </div>
          </div>

          {/* Completed */}
          <div className="rounded-2xl bg-white p-5 shadow-lg border flex items-center gap-4">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{projectSummary?.Completed || 0}</p>
            </div>
          </div>

          {/* Total */}
          <div className="rounded-2xl bg-white p-5 shadow-lg border flex items-center gap-4">
            < FolderIcon className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-blue-600">{projectSummary?.Total || 0}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Deadlines */}
      <section className="space-y-2">
        <h2 className="text-lg font-bold text-gray-700">Upcoming Deadlines</h2>
        {deadlines.length === 0 ? (
          <p className="text-gray-500 text-sm">No upcoming project deadlines</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deadlines.map((project) => {
              const urgency = getUrgency(project.ProjectEndDate);
              return (
                <div
                  key={project.Id}
                  onClick={() => handleView(project.Id)}
                  className="rounded-2xl bg-white p-5 border shadow-lg hover:shadow-xl transition cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-base font-semibold text-gray-800">{project.ProjectName}</h3>
                    <p className="text-sm text-gray-500">
                      End Date: {new Date(project.ProjectEndDate).toLocaleDateString()}
                    </p>
                    <span
                      className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${urgency.color}`}
                    >
                      {urgency.label}
                    </span>

                    {/* Budget Section */}
                    <div className="mt-3 text-sm text-gray-700">
                      <span className="font-medium">Budget:</span> {formatBudget(project.Budget)}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="mt-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-md text-sm font-medium ${
                        project.CompletionStatus === "Completed"
                          ? "bg-green-100 text-green-700"
                          : project.CompletionStatus === "In Progress"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {project.CompletionStatus}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProjectSummary;
