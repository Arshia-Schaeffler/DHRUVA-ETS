// import { useEffect, useState } from "react";
// import axiosInstance from "./AxiosInstance";
// // import axiosInstance from "../api/AxiosInstance";


// const statusColor = {
//   Pending: "bg-yellow-100 text-yellow-700",
//   "In Progress": "bg-blue-100 text-blue-700",
//   Completed: "bg-green-100 text-green-700",
// };

// const ProjectReportTable = () => {
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   const fetchProjects = async () => {
//     try {
//       setLoading(true);
//       const res = await axiosInstance.get("/project/report-table");
//       setProjects(res.data.data || []);
//     } catch (error) {
//       console.error("Failed to fetch project reports", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return <p className="text-gray-500">Loading reports...</p>;
//   }

//   return (
//     <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
//       <h3 className="text-lg font-semibold text-gray-800 mb-4">
//         Project Reports
//       </h3>

//       <div className="overflow-x-auto">
//         <table className="min-w-full border border-gray-200 text-sm">
//           <thead className="bg-gray-50 text-gray-600 uppercase">
//             <tr>
//               <th className="px-4 py-3 text-left">Project ID</th>
//               <th className="px-4 py-3 text-left">Project Name</th>
//               <th className="px-4 py-3 text-left">Team</th>
//               <th className="px-4 py-3 text-left">Status</th>
//               <th className="px-4 py-3 text-left">Start Date</th>
//               <th className="px-4 py-3 text-left">End Date</th>
//               <th className="px-4 py-3 text-right">Budget</th>
//               <th className="px-4 py-3 text-right">Spent</th>
//             </tr>
//           </thead>

//           <tbody>
//             {projects.length === 0 && (
//               <tr>
//                 <td
//                   colSpan="8"
//                   className="text-center py-6 text-gray-500"
//                 >
//                   No project data found
//                 </td>
//               </tr>
//             )}

//             {projects.map((item) => (
//               <tr
//                 key={item.projectId}
//                 className="border-t hover:bg-gray-50"
//               >
//                 <td className="px-4 py-3">{item.projectId}</td>
//                 <td className="px-4 py-3 font-medium text-gray-800">
//                   {item.projectName}
//                 </td>
//                 <td className="px-4 py-3">{item.team}</td>
//                 <td className="px-4 py-3">
//                   <span
//                     className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                       statusColor[item.status] || "bg-gray-100 text-gray-600"
//                     }`}
//                   >
//                     {item.status}
//                   </span>
//                 </td>
//                 <td className="px-4 py-3">
//                   {new Date(item.startDate).toLocaleDateString()}
//                 </td>
//                 <td className="px-4 py-3">
//                   {new Date(item.endDate).toLocaleDateString()}
//                 </td>
//                 <td className="px-4 py-3 text-right">
//                   ${item.budget.toLocaleString()}
//                 </td>
//                 <td className="px-4 py-3 text-right">
//                   ${item.spent.toLocaleString()}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ProjectReportTable;


import { useEffect, useMemo, useState } from "react";
import axiosInstance from "./AxiosInstance";

const statusColor = {
  Pending: "bg-yellow-100 text-yellow-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Completed: "bg-green-100 text-green-700",
};

const PAGE_SIZE = 8;

const ProjectReportTable = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/project/report-table");
      setProjects(res.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch project reports", error);
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     PAGINATION LOGIC
  ======================= */
  const totalPages = Math.ceil(projects.length / PAGE_SIZE);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return projects.slice(start, start + PAGE_SIZE);
  }, [projects, currentPage]);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm text-gray-500">
        Loading project reports...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Project Reports
        </h3>

        <span className="text-sm text-gray-500">
          Total Projects: {projects.length}
        </span>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Project ID</th>
              <th className="px-4 py-3 text-left">Project Name</th>
              <th className="px-4 py-3 text-left">Team</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Start Date</th>
              <th className="px-4 py-3 text-left">End Date</th>
              <th className="px-4 py-3 text-right">Budget</th>
              <th className="px-4 py-3 text-right">Spent</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.length === 0 && (
              <tr>
                <td
                  colSpan="8"
                  className="text-center py-6 text-gray-500"
                >
                  No project data found
                </td>
              </tr>
            )}

            {paginatedData.map((item) => (
              <tr
                key={item.projectId}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3">{item.projectId}</td>
                <td className="px-4 py-3 font-medium text-gray-800">
                  {item.projectName}
                </td>
                <td className="px-4 py-3">{item.team}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      statusColor[item.status] ||
                      "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {new Date(item.startDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  {new Date(item.endDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  ₹{item.budget.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right">
                  ₹{item.spent.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-5">
          <p className="text-sm text-gray-500">
            Showing {(currentPage - 1) * PAGE_SIZE + 1}–
            {Math.min(currentPage * PAGE_SIZE, projects.length)} of{" "}
            {projects.length}
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded border text-sm ${
                    currentPage === page
                      ? "bg-[#006633] text-white border-[#006633]"
                      : "bg-white text-gray-700"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectReportTable;

