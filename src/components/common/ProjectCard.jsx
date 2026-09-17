import React from "react";
import { motion } from "framer-motion";
import { FaEdit, FaEye } from "react-icons/fa";
import MDAvatarGroup from "./MDAvatarGroup";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 25, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const ProjectCard = ({ projects = [], onEdit, onView }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-500";
      case "In Progress":
        return "bg-yellow-500";
      case "Pending":
        return "bg-red-400";
      default:
        return "bg-gray-400";
    }
  };

  if (!Array.isArray(projects)) {
    return (
      <div className="text-red-500 text-sm p-4 bg-red-100 rounded-md shadow-sm">
        No project data found or invalid response.
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-gray-500 text-sm p-4 bg-gray-100 rounded-md shadow-sm">
        No projects available.
      </div>
    );
  }

  console.log("ProjectCard recieved:", projects);

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {projects.map((project, index) => (
      <motion.div
  key={project.ProjectId || index}
  variants={cardVariants}
  whileHover={{ y: -5, scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 
             flex flex-col justify-between overflow-hidden border border-gray-100 dark:border-gray-700
             min-h-[260px] h-full"
>

          {/* Header */}
          <div className="border-b px-4 py-3 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate group-hover:text-green-700 transition">
              {project.ProjectName}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-300 truncate">
              {project.Department} • {project.ProjectCode}
            </p>
          </div>

          {/* Dates & Status */}
          <div className="px-4 py-3 flex flex-col flex-1 justify-between">
            <div className="flex justify-between mb-2">
              <div>
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                  Start Date
                </p>
                <p className="text-sm text-gray-800 dark:text-white">
                  {project.ProjectStartDate || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                  End Date
                </p>
                <p className="text-sm text-gray-800 dark:text-white">
                  {project.ProjectEndDate || "-"}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center mt-3">
              <MDAvatarGroup
                avatars={project?.Members?.map((member) => {
                  const hasPhoto =
                    typeof member?.Photo === "string" && member.Photo !== "";
                  const imageUrl = hasPhoto
                    ? `${import.meta.env.VITE_BASE_API_URL.replace(
                        "/api",
                        ""
                      )}/uploads/${member.Photo}`
                    : null;
                  return {
                    name: `${member.FirstName} ${member.LastName}`,
                    src: imageUrl,
                    fallback:
                      member.FirstName?.charAt(0).toUpperCase() || "U",
                  };
                })}
                max={3}
                size="medium"
              />

              <motion.span
                layout
                className={`text-xs px-3 py-1 rounded-full text-white font-medium ${getStatusColor(
                  project.CompletionStatus
                )}`}
              >
                {project.CompletionStatus || "Unknown"}
              </motion.span>
            </div>
          </div>

          {/* Actions */}
          <motion.div
            className="flex border-t items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-sm flex items-center gap-2 text-green-600 hover:bg-green-100 px-3 py-1 rounded-lg transition"
              onClick={() => onView(project.ProjectId)}
            >
              <FaEye className="text-sm" /> View
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-sm flex items-center gap-2 text-purple-600 hover:bg-purple-100 px-3 py-1 rounded-lg transition"
              onClick={() => onEdit(project)}
            >
              <FaEdit className="text-sm" /> Edit
            </motion.button>
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ProjectCard;

