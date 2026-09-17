
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

import {
  GET_ALL_PROJECTS_DETAILS,
  GET_PROJECTS_BY_MANAGER_ID,
  GET_PROJECTS_BY_USER_ID,
} from "../../utils/Strings";

import HeaderTitle from "../../components/common/HeaderTitle";
import ProjectCard from "../../components/common/ProjectCard";
import ProjectForm from "../../components/common/ProjectForm";
import useAxios from "../../hooks/useAxios";
import { FiSearch } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

const Projects = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [statusFilter, setStatusFilter] = useState("All");

  const [page, setPage] = useState(1);
  const perPage = 8;

  const [showModal, setShowModal] = useState(false);
  const [objectToEdit, setObjectToEdit] = useState(null);

  //  Reload trigger 
  const [reload, setReload] = useState(false);

  const API =
    auth.role === "Manager"
      ? GET_PROJECTS_BY_MANAGER_ID
      : auth.role === "User"
        ? GET_PROJECTS_BY_USER_ID
        : GET_ALL_PROJECTS_DETAILS;

  //  API fetch with reload trigger ONLY 
  const { data: projectData, loading } = useAxios(
    API,
    {
      params: auth.role === "Admin" ? {} : { department: auth?.department },
    },
    true,
    [reload] // showModal removed → speed boost
  );

  const projects = projectData || [];

  const handleView = (projectId) => {
    navigate(`/${auth.role.toLowerCase()}/project-details/${projectId}`);
  };

  const handleAddClick = () => {
    setObjectToEdit(null);
    setShowModal(true);
  };

  const handleEditClick = (project) => {
    setObjectToEdit(project);
    setShowModal(true);
  };

  const handleFormSuccess = () => {
    setReload((r) => !r); // re-fetch data only when needed
    setShowModal(false);
  };

  //FILTER + SORT optimized
  const filtered = useMemo(() => {
    let list = [...projects];

    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter((p) => p.ProjectName.toLowerCase().includes(s));
    }

    if (statusFilter !== "All") {
      list = list.filter((p) => p.CompletionStatus === statusFilter);
    }

    if (sortBy === "name") {
      list.sort((a, b) => a.ProjectName.localeCompare(b.ProjectName));
    } else {
      list.sort(
        (a, b) => new Date(a.ProjectStartDate) - new Date(b.ProjectStartDate)
      );
    }

    return list;
  }, [projects, search, sortBy, statusFilter]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, sortBy, statusFilter]);

  //  Loader UI (for smooth UX)
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <HeaderTitle
          title="Project Details"
          buttons={[
            {
              label: "Add Project",
              variant: "success",
              onClick: handleAddClick,
            },
          ]}
        />

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg mb-8 flex flex-wrap items-center gap-4 border border-gray-100 dark:border-gray-700">

          {/* Search */}
          <div className="relative w-full sm:w-72">

            <span className="absolute left-3 top-2.5 text-gray-400">
              <FiSearch />
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search project..."
              className="w-full pl-10 pr-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            />
          </div>

          {/* Status  */}
          <div className="flex flex-wrap gap-2">
            {["All", "Pending", "In Progress", "Completed"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-1.5 rounded-full text-sm border transition-all
          ${statusFilter === s
                    ? "bg-green-600 text-white border-green-600 shadow-md"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
              >
                {s}
              </button>
            ))}
          </div>

        </div>

        {/* List */}
        <ProjectCard projects={paginated} onEdit={handleEditClick} onView={handleView} />

        {/* Pagination */}
        <div className="flex justify-center items-center mt-10 gap-3">

          {/* Prev */}
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className={`px-4 py-2 rounded-xl border text-sm flex items-center gap-1
      ${page === 1
                ? "opacity-40 cursor-not-allowed bg-gray-100 dark:bg-gray-700"
                : "bg-white dark:bg-gray-800 hover:bg-green-600 hover:text-white border-gray-300 dark:border-gray-600"
              }`}
          >
            Prev
          </button>

          <div className="px-5 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-sm font-semibold">
            Page {page} / {totalPages}
          </div>

          {/* Next */}
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className={`px-4 py-2 rounded-xl border text-sm flex items-center gap-1
      ${page === totalPages
                ? "opacity-40 cursor-not-allowed bg-gray-100 dark:bg-gray-700"
                : "bg-white dark:bg-gray-800 hover:bg-green-600 hover:text-white border-gray-300 dark:border-gray-600"
              }`}
          >
            Next
          </button>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            {/* <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-2xl relative"> */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
            >
              {/* ✖ */}
              
      <IoClose />
            </button>

            <ProjectForm
              setIsCreateUpdate={handleFormSuccess}
              objectToEdit={objectToEdit}
            />
          </div>
          // </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
