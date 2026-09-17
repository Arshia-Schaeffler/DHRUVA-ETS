// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaEye, FaEdit, FaSearch } from "react-icons/fa";
// import { motion, AnimatePresence } from "framer-motion";
// import useAxios from "../../hooks/useAxios";
// import useAuth from "../../hooks/useAuth";
// import TeamForm from "../../components/common/TeamForm";

// const Team = () => {
//   const { auth } = useAuth();
//   const navigate = useNavigate();
//   const [isCreateUpdate, setIsCreateUpdate] = useState(false);
//   const [objectToEdit, setObjectToEdit] = useState(null);
//   const [endpoint, setEndpoint] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [teamData, setTeamData] = useState([]);

//   useEffect(() => {
//     if (auth?.empId) setEndpoint(`/employee/manager/team/${auth.empId}`);
//   }, [auth?.empId]);

//   const { data: apiResponse, loading, error, refetch } = useAxios(
//     endpoint,
//     {},
//     !!endpoint,
//     [endpoint]
//   );

//   useEffect(() => {
//     if (Array.isArray(apiResponse?.data)) {
//       setTeamData(apiResponse.data);
//     }
//   }, [apiResponse]);

//   const handleView = (empId, showTimeSheet = false) => {
//     const role = auth?.role?.toLowerCase();
//     navigate(`/${role}/team-details/${empId}`, {
//       state: { isManager: role === "manager", showTimeSheet },
//     });
//   };

//   const handleEditClick = (member) => {
//     setObjectToEdit(member);
//     setIsCreateUpdate(true);
//   };

//   const filteredTeam = teamData.filter((member) => {
//     const matchesSearch =
//       member.FirstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       member.LastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       member.Email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       member.department?.toLowerCase().includes(searchQuery.toLowerCase());

//     // const matchesStatus =
//     //   statusFilter === "All" || member.Status === statusFilter;
//     const matchesStatus =
//   statusFilter === "All" || member.status === statusFilter;


//     return matchesSearch && matchesStatus;
//   });

//   if (loading)
//     return (
//       <div className="p-6 text-center text-gray-600 dark:text-gray-300">
//         Loading team...
//       </div>
//     );
//   if (error)
//     return (
//       <div className="p-6 text-center text-red-500">
//         Error loading team data.
//       </div>
//     );

//   return (
//     <div className="p-6">
//       <AnimatePresence mode="wait">
//         {isCreateUpdate ? (
//           <motion.div
//             key="form"
//             initial={{ opacity: 0, y: 40 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -40 }}
//             transition={{ duration: 0.4, ease: "easeInOut" }}
//           >
//             <TeamForm
//               objectToEdit={objectToEdit}
//               setIsCreateUpdate={setIsCreateUpdate}
//               refetch={refetch}
//               onUpdateLocal={(updatedEmp) => {
//                 setTeamData((prev) =>
//                   prev.map((emp) =>
//                     emp.EmpId === updatedEmp.EmpId
//                       ? { ...emp, ...updatedEmp }
//                       : emp
//                   )
//                 );
//               }}
//             />
//           </motion.div>
//         ) : (
//           <motion.div
//             key="teamList"
//             initial={{ opacity: 0, y: 40 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -40 }}
//             transition={{ duration: 0.4, ease: "easeInOut" }}
//           >
//             {/* Header */}
//             <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
//               <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
//                 My Team
//               </h2>

//               {/* Search + Filter */}
//               <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
//                 <div className="relative w-full sm:w-64">
//                   <FaSearch className="absolute left-3 top-3 text-gray-400" />
//                   <input
//                     type="text"
//                     placeholder="Search by name, email..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition"
//                   />
//                 </div>

//                 <select
//                   value={statusFilter}
//                   onChange={(e) => setStatusFilter(e.target.value)}
//                   className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition"
//                 >
//                   <option value="All">All Status</option>
//                   <option value="Active">Active</option>
//                   <option value="Idle">Idle</option>
//                 </select>
//               </div>
//             </div>

//             {/* Team Cards */}
//             {filteredTeam.length === 0 ? (
//               <motion.p
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="text-gray-500 dark:text-gray-300 text-center py-10"
//               >
//                 No team members found.
//               </motion.p>
//             ) : (
//               <motion.div
//                 layout
//                 className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
//               >
//                 {filteredTeam.map((member, index) => {
//                   const imageUrl =
//                     typeof member.Photo === "string" && member.Photo !== ""
//                       ? `${import.meta.env.VITE_BASE_API_URL.replace(
//                           "/api",
//                           ""
//                         )}/uploads/${member.Photo}`
//                       : "/assets/images/team-1.jpg";

//                   const statusColor =
//                     member.Status === "Active"
//                       ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
//                       : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300";

//                   return (
//                     <motion.div
//                       key={member.EmpId}
//                       initial={{ opacity: 0, y: 30 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{
//                         delay: index * 0.05,
//                         duration: 0.4,
//                         ease: "easeOut",
//                       }}
//                       whileHover={{ scale: 1.03 }}
//                       whileTap={{ scale: 0.98 }}
//                       onClick={() => handleView(member.EmpId, true)}
//                       className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl overflow-hidden flex flex-col h-full cursor-pointer border border-gray-100 dark:border-gray-700 transition-all duration-300"
//                     >
//                       {/* Header */}
//                       <div className="flex items-center justify-between px-4 pt-4">
//                         <div className="flex items-center gap-3">
//                           <img
//                             src={imageUrl}
//                             alt={member.FirstName}
//                             className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
//                           />
//                           <div>
//                             <h3 className="text-base font-semibold text-gray-800 dark:text-white capitalize">
//                               {member.FirstName} {member.LastName}
//                             </h3>
//                             <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
//                               {member.department} - {member.Designation}
//                             </p>
//                           </div>
//                         </div>
//                         <span
//                           className={`px-3 py-1 text-xs font-medium rounded-full ${statusColor}`}
//                         >
//                           {member.Status || "Unknown"}
//                         </span>
//                       </div>

//                       {/* Details */}
//                       <div className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 space-y-1">
//                         <p>
//                           <strong>Email:</strong> {member.Email}
//                         </p>
//                         <p>
//                           <strong>Joining:</strong>{" "}
//                           {member.JoiningDate || "Not Available"}
//                         </p>
//                         <p>
//                           <strong>Mobile:</strong>{" "}
//                           {member.Mobile || "Not Available"}
//                         </p>
//                       </div>

//                       {/* Footer */}
//                       <div
//                         className="mt-auto px-4 py-3 border-t bg-gray-50 dark:bg-gray-700 dark:border-gray-600 flex justify-between"
//                         onClick={(e) => e.stopPropagation()}
//                       >
//                         <button
//                           onClick={() => handleView(member.EmpId, false)}
//                           className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 flex items-center gap-1 transition"
//                         >
//                           <FaEye /> View
//                         </button>
//                         <button
//                           onClick={() => handleEditClick(member)}
//                           className="text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 flex items-center gap-1 transition"
//                         >
//                           <FaEdit /> Edit
//                         </button>
//                       </div>
//                     </motion.div>
//                   );
//                 })}
//               </motion.div>
//             )}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default Team;


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEdit, FaSearch } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";
import TeamForm from "../../components/common/TeamForm";

const Team = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [isCreateUpdate, setIsCreateUpdate] = useState(false);
  const [objectToEdit, setObjectToEdit] = useState(null);
  const [endpoint, setEndpoint] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [teamData, setTeamData] = useState([]);

  useEffect(() => {
    if (auth?.empId) setEndpoint(`/employee/manager/team/${auth.empId}`);
  }, [auth?.empId]);

  const { data: apiResponse, loading, error, refetch } = useAxios(
    endpoint,
    {},
    !!endpoint,
    [endpoint]
  );

  useEffect(() => {
    if (Array.isArray(apiResponse?.data)) {
      setTeamData(apiResponse.data);
    }
  }, [apiResponse]);

  const handleView = (empId, showTimeSheet = false) => {
    const role = auth?.role?.toLowerCase();
    navigate(`/${role}/team-details/${empId}`, {
      state: { isManager: role === "manager", showTimeSheet },
    });
  };

  const handleEditClick = (member) => {
    setObjectToEdit(member);
    setIsCreateUpdate(true);
  };

  const filteredTeam = teamData.filter((member) => {
    const matchesSearch =
      member.FirstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.LastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.Email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || member.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading)
    return (
      <div className="p-6 text-center text-gray-600 dark:text-gray-300">
        Loading team...
      </div>
    );

  if (error)
    return (
      <div className="p-6 text-center text-red-500">
        Error loading team data.
      </div>
    );

  return (
    <div className="p-6">
      <AnimatePresence mode="wait">
        {isCreateUpdate ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <TeamForm
              objectToEdit={objectToEdit}
              setIsCreateUpdate={setIsCreateUpdate}
              refetch={refetch}
              onUpdateLocal={(updatedEmp) => {
                setTeamData((prev) =>
                  prev.map((emp) =>
                    emp.EmpId === updatedEmp.EmpId
                      ? { ...emp, ...updatedEmp }
                      : emp
                  )
                );
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="teamList"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                My Team
              </h2>

              {/* Search + Filter */}
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Idle">Idle</option>
                </select>
              </div>
            </div>

            {/* Team Cards */}
            {filteredTeam.length === 0 ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-500 dark:text-gray-300 text-center py-10"
              >
                No team members found.
              </motion.p>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              >
                {filteredTeam.map((member, index) => {
                  const imageUrl =
                    typeof member.Photo === "string" && member.Photo !== ""
                      ? `${import.meta.env.VITE_BASE_API_URL.replace(
                          "/api",
                          ""
                        )}/uploads/${member.Photo}`
                      : "/assets/images/team-1.jpg";

                  const statusColor =
                    member.status === "Active"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300";

                  return (
                    <motion.div
                      key={member.EmpId}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: index * 0.05,
                        duration: 0.4,
                        ease: "easeOut",
                      }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleView(member.EmpId, true)}
                      className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl overflow-hidden flex flex-col h-full cursor-pointer border border-gray-100 dark:border-gray-700 transition-all duration-300"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between px-4 pt-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={imageUrl}
                            alt={member.FirstName}
                            className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                          />
                          <div>
                            <h3 className="text-base font-semibold text-gray-800 dark:text-white capitalize">
                              {member.FirstName} {member.LastName}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                              {member.department} - {member.Designation}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${statusColor}`}
                        >
                          {member.status || "Unknown"}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                        <p>
                          <strong>Email:</strong> {member.Email}
                        </p>
                        <p>
                          <strong>Joining:</strong>{" "}
                          {member.JoiningDate || "Not Available"}
                        </p>
                        <p>
                          <strong>Mobile:</strong>{" "}
                          {member.Mobile || "Not Available"}
                        </p>
                      </div>

                      {/* Footer */}
                      <div
                        className="mt-auto px-4 py-3 border-t bg-gray-50 dark:bg-gray-700 dark:border-gray-600 flex justify-between"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => handleView(member.EmpId, false)}
                          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 flex items-center gap-1 transition"
                        >
                          <FaEye /> View
                        </button>
                        <button
                          onClick={() => handleEditClick(member)}
                          className="text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 flex items-center gap-1 transition"
                        >
                          <FaEdit /> Edit
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Team;

