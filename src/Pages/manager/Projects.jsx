
import { useState, useMemo } from "react";
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

const Projects = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const perPage = 8;

  const [isCreateUpdate, setIsCreateUpdate] = useState(false);
  const [objectToEdit, setObjectToEdit] = useState(null);

  const API =
    auth.role === "Manager"
      ? GET_PROJECTS_BY_MANAGER_ID
      : auth.role === "User"
      ? GET_PROJECTS_BY_USER_ID
      : GET_ALL_PROJECTS_DETAILS;

  const projects = useAxios(
    API,
    {
      params:
        auth.role === "Admin"
          ? {}
          : { department: auth?.department },
    },
    true,
    [isCreateUpdate]
  );


  const handleView = (projectId) => {
    navigate(`/${auth.role.toLowerCase()}/project-details/${projectId}`);
  };

  const handleAddClick = () => {
    setObjectToEdit(null);
    setIsCreateUpdate(true);
  };

  const handleEditClick = (project) => {
    setObjectToEdit(project);
    setIsCreateUpdate(true);
  };

  //  FILTER + SEARCH + SORT + PAGINATION
  const filteredProjects = useMemo(() => {
    let data = [...(projects?.data || [])];

    // Search
    if (search.trim() !== "") {
      data = data.filter((p) =>
        p.ProjectName.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "All") {
      data = data.filter((p) => p.CompletionStatus === statusFilter);
    }

    // Sorting
    if (sortBy === "name") {
      data.sort((a, b) => a.ProjectName.localeCompare(b.ProjectName));
    } else if (sortBy === "startDate") {
      data.sort(
        (a, b) =>
          new Date(a.ProjectStartDate) - new Date(b.ProjectStartDate)
      );
    }

    return data;
  }, [projects?.data, search, sortBy, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredProjects.length / perPage);
  const paginated = filteredProjects.slice(
    (page - 1) * perPage,
    page * perPage
  );

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <HeaderTitle
          title="Projects Overview"
          subtitle="Manage and track all active projects"
          buttons={[
            {
              label: "Add Project",
              variant: "success",
              onClick: handleAddClick,
            },
          ]}
        />

        {/* Filters Row */}
        {!isCreateUpdate && (
          <div className="flex flex-wrap items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md mb-6">

            {/* Search */}
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search project..."
              className="px-3 py-2 rounded border dark:bg-gray-700 dark:text-white w-60"
            />

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded border dark:bg-gray-700 dark:text-white"
            >
              <option value="name">Sort by Name</option>
              <option value="startDate">Sort by Start Date</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded border dark:bg-gray-700 dark:text-white"
            >
              <option>All</option>
              <option>Pending</option>
              <option>Completed</option>
              <option>In Progress</option>
            </select>

          </div>
        )}

        {/* Content */}
        <div>
          {isCreateUpdate ? (
            <ProjectForm
              setIsCreateUpdate={setIsCreateUpdate}
              objectToEdit={objectToEdit}
            />
          ) : (
            <>
              <ProjectCard
                projects={paginated}
                onEdit={handleEditClick}
                onView={handleView}
              />

              {/* Pagination Controls */}
              <div className="flex justify-center mt-6 gap-3">
                <button
                  className="px-4 py-2 bg-gray-300 rounded disabled:opacity-40"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Prev
                </button>

                <span className="px-4 py-2 font-semibold">
                  Page {page} / {totalPages}
                </span>

                <button
                  className="px-4 py-2 bg-gray-300 rounded disabled:opacity-40"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;

