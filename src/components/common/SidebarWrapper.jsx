// import { NavLink } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
// import schaefflerLogo from "../../assets/schaeffler.png";

// const SidebarWrapper = ({ 
//   open, 
//   setOpen, 
//   darkMode, 
//   menuItems, 
//   teamItems = [], 
//   baseTeamPath = "", 
//   title = ""  
// }) => {
//   return (
//     <aside
//       className={`fixed top-0 left-0 h-screen transition-all duration-300 z-40
//         ${open ? "w-60" : "w-20"} 
//         backdrop-blur-xl bg-white/70 dark:bg-gray-900/50 shadow-xl border-r border-white/20 flex flex-col`}
//     >
//       {/* Top Section: Logo + Toggle */}
//       <div className="flex items-center justify-between h-16 px-3 border-b border-gray-200 dark:border-gray-700">
//         <div className="flex items-center gap-2">
          
//           <span
//             className={`font-bold text-lg text-green-600 transition-opacity duration-300
//               ${open ? "opacity-100" : "opacity-0 hidden"}`}
//           >
//             {title}  {/*  Dynamic title */}
//           </span>
//         </div>

//         <button
//           onClick={() => setOpen(!open)}
//           className="p-1 rounded-full hover:bg-green-100 dark:hover:bg-gray-800 transition-colors"
//         >
//           {open ? <FiChevronLeft size={18} /> : <FiChevronRight size={18} />}
//         </button>
//       </div>

//       {/* Menu */}
//       <nav className="space-y-2 px-2 flex-1">
//         {menuItems.map((item, idx) => (
//           <NavLink
//             key={idx}
//             to={item.path}
//             className={({ isActive }) =>
//               `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm
//               ${isActive
//                 ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
//                 : "text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-800"}`
//             }
//             title={!open ? item.name : ""}
//           >
//             <span className="shrink-0">{item.icon}</span>
//             <AnimatePresence>
//               {open && (
//                 <motion.span
//                   initial={{ opacity: 0, x: -10 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -10 }}
//                   className="whitespace-nowrap"
//                 >
//                   {item.name}
//                 </motion.span>
//               )}
//             </AnimatePresence>
//           </NavLink>
//         ))}
//       </nav>

//       {/* Teams Section same as before... */}
//       {teamItems.length > 0 && (
//         <div className="mt-0 mb-4">
//           <AnimatePresence>
//             {open && (
//               <motion.p
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="px-4 text-xs uppercase text-gray-400 tracking-wider mb-1"
//               >
//                 Teams
//               </motion.p>
//             )}
//           </AnimatePresence>
//           <nav className="space-y-1 px-2">
//             {teamItems.map((item, idx) => (
//               <NavLink
//                 key={idx}
//                 to={`${baseTeamPath}/${item.path}`}
//                 className={({ isActive }) =>
//                   `flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm
//                   ${isActive
//                     ? "bg-green-500 text-white shadow"
//                     : "text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-800"}`
//                 }
//                 title={!open ? item.name : ""}
//               >
//                 <span className="shrink-0">{item.icon}</span>
//                 <AnimatePresence>
//                   {open && (
//                     <motion.span
//                       initial={{ opacity: 0, x: -10 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       exit={{ opacity: 0, x: -10 }}
//                       className="whitespace-nowrap"
//                     >
//                       {item.name}
//                     </motion.span>
//                   )}
//                 </AnimatePresence>
//               </NavLink>
//             ))}
//           </nav>
//         </div>
//       )}
//     </aside>
//   );
// };

// export default SidebarWrapper;

import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const SidebarWrapper = ({
  open,
  setOpen,
  darkMode,
  menuItems,
  teamItems = [],
  baseTeamPath = "",
  title = "",
}) => {
  return (
    <aside
      className={`fixed top-0 left-0 h-screen transition-all duration-300 z-40
      ${open ? "w-60" : "w-16"} 
      backdrop-blur-xl bg-white/70 dark:bg-gray-900/50 shadow-xl border-r border-white/20 flex flex-col`}
    >
      {/* Top Section: Title + Toggle */}
      <div className="flex items-center justify-between h-16 px-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <span
            className={`font-bold text-lg text-green-600 transition-opacity duration-300
            ${open ? "opacity-100" : "opacity-0 hidden"}`}
          >
            {title}
          </span>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="p-1 rounded-full hover:bg-green-100 dark:hover:bg-gray-800 transition-colors"
        >
          {open ? <FiChevronLeft size={18} /> : <FiChevronRight size={18} />}
        </button>
      </div>

      {/* Main Menu */}
      <div className="flex-1 overflow-y-auto">
        <nav className="px-2 mt-2 space-y-1">
          {menuItems.map((item, idx) => (
            <NavLink
              key={idx}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center ${open ? "gap-3 px-3" : "justify-center px-2"} py-3 
                rounded-lg transition-all text-sm
                ${
                  isActive
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                    : "text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-800"
                }`
              }
              title={!open ? item.name : ""}
            >
              <span className="shrink-0">{item.icon}</span>
              <AnimatePresence>
                {open && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="whitespace-nowrap"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}
        </nav>

        {/* Teams Section */}
        {teamItems.length > 0 && (
          <div className="mt-2 mb-4">
            <AnimatePresence>
              {open && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-4 text-xs uppercase text-gray-400 tracking-wider mb-1"
                >
                  Teams
                </motion.p>
              )}
            </AnimatePresence>

            <nav className="space-y-1 px-2">
              {teamItems.map((item, idx) => (
                <NavLink
                  key={idx}
                  to={`${baseTeamPath}/${item.path}`}
                  className={({ isActive }) =>
                    `flex items-center ${open ? "gap-3 px-3" : "justify-center px-2"} py-3 
                    rounded-lg transition-all text-sm
                    ${
                      isActive
                        ? "bg-green-500 text-white shadow"
                        : "text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-800"
                    }`
                  }
                  title={!open ? item.name : ""}
                >
                  <span className="shrink-0">{item.icon}</span>
                  <AnimatePresence>
                    {open && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="whitespace-nowrap"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </div>
    </aside>
  );
};

export default SidebarWrapper;
