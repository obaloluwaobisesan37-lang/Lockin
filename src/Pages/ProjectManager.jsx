import { useEffect, useMemo, useRef, useState } from "react";
import {
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";

import {
  Plus,
  Search,
  FolderKanban,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
  Check,
  AlertTriangle,
  CheckCircle2,
  Circle,
  ListTodo,
  ArrowRight,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  SlidersHorizontal,
} from "lucide-react";

/* =========================================================
   HELPERS
========================================================= */

const getProjectName = (project) =>
  project?.name || project?.title || "Untitled Project";

const getProjectDueDate = (project) =>
  project?.dueDate || project?.deadline || "";

const getProjectTasks = (tasks, projectId) =>
  tasks.filter(
    (task) =>
      task.projectId === projectId ||
      task.project === projectId ||
      task.project?.id === projectId
  );

const formatDate = (dateString) => {
  if (!dateString) return "No deadline";

  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatDateValue = (value) => {
  if (!value) return "";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatModalStatus = (status) => {
  if (status === "completed") return "Completed";
  if (status === "paused") return "Paused";
  return "Active";
};

/* =========================================================
   MAIN
========================================================= */

export default function ProjectManager() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    projects = [],
    projectStats = [],
    tasks = [],
    addProject,
    updateProject,
    deleteProject,
    darkMode = false,
  } = useOutletContext() || {};

  /* =========================================================
     STATE
  ========================================================= */

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const [showProjectFilter, setShowProjectFilter] =
    useState(false);

  const [showSortMenu, setShowSortMenu] =
    useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] =
    useState(null);

  const [openMenu, setOpenMenu] = useState(null);

  const [selectedProjectId, setSelectedProjectId] =
    useState(searchParams.get("project") || null);

  const [selectedTaskFilter, setSelectedTaskFilter] =
    useState("all");

  const [deleteTarget, setDeleteTarget] =
    useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    priority: "Medium",
    status: "active",
    deadline: "",
  });

  const menuRef = useRef(null);

  /* =========================================================
     THEME
  ========================================================= */

  const pageBg = darkMode
    ? "bg-[#0d0d0d] text-white"
    : "bg-[#f7f6f4] text-[#171717]";

  const cardBg = darkMode
    ? "border-white/[0.08] bg-[#151515]"
    : "border-black/[0.08] bg-white";

  const inputBg = darkMode
    ? "border-white/[0.09] bg-white/[0.04] text-white placeholder:text-white/35"
    : "border-black/[0.09] bg-black/[0.025] text-black placeholder:text-black/35";

  const mutedText = darkMode
    ? "text-white/50"
    : "text-black/50";

  const menuBg = darkMode
    ? "border-white/10 bg-[#171717] text-white"
    : "border-black/10 bg-white text-black";

  /* =========================================================
     OUTSIDE CLICK
  ========================================================= */

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        event.target.closest(
          "[data-project-create-button]"
        )
      ) {
        return;
      }

      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpenMenu(null);
        setShowProjectFilter(false);
        setShowSortMenu(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  /* =========================================================
     CREATE
  ========================================================= */

  const openCreateModal = () => {
    setOpenMenu(null);
    setShowProjectFilter(false);
    setShowSortMenu(false);
    setEditingProject(null);

    setForm({
      name: "",
      description: "",
      priority: "Medium",
      status: "active",
      deadline: "",
    });

    setShowForm(true);
  };

  /* =========================================================
     EDIT
  ========================================================= */

  const openEditModal = (project) => {
    setOpenMenu(null);
    setShowProjectFilter(false);
    setShowSortMenu(false);

    setEditingProject(project);

    setForm({
      name: getProjectName(project),
      description: project.description || "",
      priority: project.priority || "Medium",
      status: project.status || "active",
      deadline: getProjectDueDate(project),
    });

    setShowForm(true);
  };

  /* =========================================================
     CLOSE FORM
  ========================================================= */

  const closeForm = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  /* =========================================================
     SAVE / CREATE
  ========================================================= */

  const handleSubmit = (event) => {
    event.preventDefault();

    const name = form.name.trim();

    if (!name) return;

    if (editingProject) {
      if (typeof updateProject === "function") {
        updateProject(editingProject.id, {
          name,
          description: form.description.trim(),
          priority: form.priority,
          status: form.status,
          dueDate: form.deadline,
        });
      }
    } else {
      const colors = [
        "#557a62",
        "#627b82",
        "#765b6b",
        "#b07b4d",
        "#a85b5b",
        "#737773",
      ];

      if (typeof addProject === "function") {
        addProject({
          name,
          description: form.description.trim(),
          priority: form.priority,
          status: form.status,
          dueDate: form.deadline,
          color:
            colors[projects.length % colors.length],
        });
      }
    }

    closeForm();
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const confirmDelete = (project) => {
    setOpenMenu(null);
    setShowProjectFilter(false);
    setShowSortMenu(false);
    setDeleteTarget(project);
  };

  const cancelDelete = () => {
    setDeleteTarget(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;

    const projectId = deleteTarget.id;

    if (typeof deleteProject === "function") {
      deleteProject(projectId);
    }

    if (selectedProjectId === projectId) {
      setSelectedProjectId(null);
      setSearchParams({});
    }

    setDeleteTarget(null);
  };

  /* =========================================================
     NAVIGATION
  ========================================================= */

  const viewProjectTasks = (project) => {
    setSelectedProjectId(project.id);

    setSearchParams({
      project: project.id,
    });
  };

  const openProjectTasksPage = (project) => {
    setOpenMenu(null);

    navigate(
      `/todos?project=${encodeURIComponent(
        project.id
      )}`
    );
  };

  const openTask = (task) => {
    navigate(
      `/todos?task=${encodeURIComponent(task.id)}`
    );
  };

  /* =========================================================
     FILTER + SORT
  ========================================================= */

  const filteredProjects = useMemo(() => {
    let result = [...projects];

    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter((project) => {
        const name =
          getProjectName(project).toLowerCase();

        const description = (
          project.description || ""
        ).toLowerCase();

        return (
          name.includes(query) ||
          description.includes(query)
        );
      });
    }

    if (statusFilter !== "all") {
      result = result.filter((project) => {
        const status = String(
          project.status || ""
        ).toLowerCase();

        return status === statusFilter;
      });
    }

    result.sort((a, b) => {
      if (sortBy === "name") {
        return getProjectName(a).localeCompare(
          getProjectName(b)
        );
      }

      if (sortBy === "priority") {
        const order = {
          High: 1,
          Medium: 2,
          Low: 3,
        };

        return (
          (order[a.priority] || 99) -
          (order[b.priority] || 99)
        );
      }

      if (sortBy === "deadline") {
        const aDate = getProjectDueDate(a);
        const bDate = getProjectDueDate(b);

        if (!aDate && !bDate) return 0;
        if (!aDate) return 1;
        if (!bDate) return -1;

        return (
          new Date(aDate).getTime() -
          new Date(bDate).getTime()
        );
      }

      if (sortBy === "newest") {
        return (
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
        );
      }

      return 0;
    });

    return result;
  }, [
    projects,
    search,
    statusFilter,
    sortBy,
  ]);

  /* =========================================================
     SELECTED PROJECT
  ========================================================= */

  const selectedProject = useMemo(
    () =>
      projects.find(
        (project) =>
          project.id === selectedProjectId
      ) || null,
    [projects, selectedProjectId]
  );

  const selectedProjectTasks = useMemo(() => {
    if (!selectedProject) return [];

    let result = getProjectTasks(
      tasks,
      selectedProject.id
    );

    if (selectedTaskFilter === "active") {
      result = result.filter(
        (task) => !task.completed
      );
    }

    if (selectedTaskFilter === "completed") {
      result = result.filter(
        (task) => task.completed
      );
    }

    return result;
  }, [
    selectedProject,
    tasks,
    selectedTaskFilter,
  ]);

  /* =========================================================
     STATS
  ========================================================= */

  const getStats = (project) => {
    const projectTasks = getProjectTasks(
      tasks,
      project.id
    );

    const total = projectTasks.length;

    const completed = projectTasks.filter(
      (task) => task.completed
    ).length;

    const progress =
      total > 0
        ? Math.round((completed / total) * 100)
        : 0;

    const externalStats =
      Array.isArray(projectStats)
        ? projectStats.find(
            (item) => item.id === project.id
          )
        : null;

    return {
      total:
        externalStats?.total ??
        externalStats?.taskCount ??
        total,

      completed:
        externalStats?.completed ??
        externalStats?.completedCount ??
        completed,

      progress:
        externalStats?.progress ??
        progress,
    };
  };

  /* =========================================================
     STATUS
  ========================================================= */

  const formatStatus = (status) => {
    const value = String(
      status || ""
    ).toLowerCase();

    if (
      value === "completed" ||
      value === "complete"
    ) {
      return "Completed";
    }

    if (
      value === "paused" ||
      value === "pause"
    ) {
      return "Paused";
    }

    if (
      value === "not started" ||
      value === "not-started"
    ) {
      return "Not Started";
    }

    return "Active";
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className={`min-h-full ${pageBg}`}>
      <div className="mx-auto w-full max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <FolderKanban size={20} />

              <span
                className={`text-xs font-semibold uppercase tracking-[0.18em] ${mutedText}`}
              >
                Workspace
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Project Manager
            </h1>

            <p
              className={`mt-1 text-sm ${mutedText}`}
            >
              Organize your work and keep every project moving.
            </p>
          </div>

          {/* NEW PROJECT */}

          <button
            type="button"
            data-project-create-button="true"
            onPointerDown={(event) => {
              event.stopPropagation();
            }}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              openCreateModal();
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#765b6b] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 active:scale-[0.98]"
          >
            <Plus
              size={16}
              strokeWidth={2.8}
            />

            New project
          </button>
        </div>

        {/* =================================================
            TOOLBAR
        ================================================= */}

        <div
          ref={menuRef}
          className={`relative mb-6 flex flex-col gap-3 rounded-2xl border p-3 sm:flex-row sm:items-center ${cardBg}`}
        >
          {/* SEARCH */}

          <div className="relative min-w-0 flex-1">
            <Search
              size={17}
              className={`absolute left-3 top-1/2 -translate-y-1/2 ${mutedText}`}
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search projects..."
              className={`h-11 w-full rounded-xl border pl-10 pr-4 text-sm outline-none transition focus:border-[#765b6b] ${inputBg}`}
            />
          </div>

          {/* FILTER */}

          <div className="relative">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();

                setShowProjectFilter(
                  (current) => !current
                );

                setShowSortMenu(false);
              }}
              className={`flex h-11 w-full items-center justify-between gap-3 rounded-xl border px-4 text-sm font-medium sm:w-auto ${inputBg}`}
            >
              <span className="flex items-center gap-2">
                <SlidersHorizontal size={16} />
                Filter
              </span>

              <ChevronDown size={15} />
            </button>

            {showProjectFilter && (
              <div
                className={`absolute right-0 top-12 z-[900] w-52 rounded-xl border p-1.5 shadow-2xl ${menuBg}`}
                onClick={(event) =>
                  event.stopPropagation()
                }
              >
                {[
                  ["all", "All projects"],
                  ["active", "Active"],
                  ["paused", "Paused"],
                  ["completed", "Completed"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setStatusFilter(value);
                      setShowProjectFilter(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition ${
                      darkMode
                        ? "hover:bg-white/[0.07]"
                        : "hover:bg-black/[0.05]"
                    }`}
                  >
                    <span>{label}</span>

                    {statusFilter === value && (
                      <Check size={15} />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* SORT */}

          <div className="relative">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();

                setShowSortMenu(
                  (current) => !current
                );

                setShowProjectFilter(false);
              }}
              className={`flex h-11 w-full items-center justify-between gap-3 rounded-xl border px-4 text-sm font-medium sm:w-auto ${inputBg}`}
            >
              <span>Sort</span>

              <ChevronDown size={15} />
            </button>

            {showSortMenu && (
              <div
                className={`absolute right-0 top-12 z-[900] w-52 rounded-xl border p-1.5 shadow-2xl ${menuBg}`}
                onClick={(event) =>
                  event.stopPropagation()
                }
              >
                {[
                  ["name", "Name"],
                  ["priority", "Priority"],
                  ["deadline", "Deadline"],
                  ["newest", "Newest"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setSortBy(value);
                      setShowSortMenu(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition ${
                      darkMode
                        ? "hover:bg-white/[0.07]"
                        : "hover:bg-black/[0.05]"
                    }`}
                  >
                    <span>{label}</span>

                    {sortBy === value && (
                      <Check size={15} />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* =================================================
            PROJECTS
        ================================================= */}

        {filteredProjects.length === 0 ? (
          <EmptyProjects
            darkMode={darkMode}
            onCreate={openCreateModal}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((project) => {
              const stats = getStats(project);

              const projectColor =
                project.color || "#765b6b";

              return (
                <div
                  key={project.id}
                  className={`relative overflow-visible rounded-2xl border transition hover:-translate-y-0.5 hover:shadow-lg ${cardBg}`}
                >
                  {/* CARD TOP */}

                  <div className="flex items-start justify-between gap-3 p-5">
                    <button
                      type="button"
                      onClick={() =>
                        viewProjectTasks(project)
                      }
                      className="flex min-w-0 flex-1 items-start gap-3 text-left"
                    >
                      <div
                        className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                        style={{
                          backgroundColor: `${projectColor}20`,
                          color: projectColor,
                        }}
                      >
                        <FolderKanban size={19} />
                      </div>

                      <div className="min-w-0">
                        <h2 className="truncate text-base font-bold">
                          {getProjectName(project)}
                        </h2>

                        <p
                          className={`mt-1 line-clamp-2 text-sm ${mutedText}`}
                        >
                          {project.description ||
                            "No project description"}
                        </p>
                      </div>
                    </button>

                    {/* THREE DOT MENU */}

                    <div className="relative z-[1000] shrink-0">
                      <button
                        type="button"
                        onPointerDown={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                        }}
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();

                          setOpenMenu(
                            (current) =>
                              current ===
                              project.id
                                ? null
                                : project.id
                          );
                        }}
                        className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                          darkMode
                            ? "text-white/60 hover:bg-white/[0.08] hover:text-white"
                            : "text-black/50 hover:bg-black/[0.06] hover:text-black"
                        }`}
                        aria-label="Project options"
                      >
                        <MoreHorizontal
                          size={20}
                        />
                      </button>

                      {openMenu ===
                        project.id && (
                        <div
                          className={`absolute right-0 top-11 z-[9999] w-52 overflow-hidden rounded-xl border p-1.5 shadow-2xl ${menuBg}`}
                          onPointerDown={(event) =>
                            event.stopPropagation()
                          }
                          onClick={(event) =>
                            event.stopPropagation()
                          }
                        >
                          {/* OPEN */}

                          <button
                            type="button"
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();

                              setOpenMenu(null);
                              openProjectTasksPage(
                                project
                              );
                            }}
                            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                              darkMode
                                ? "hover:bg-white/[0.08]"
                                : "hover:bg-black/[0.05]"
                            }`}
                          >
                            <ExternalLink
                              size={16}
                            />

                            <span>
                              Open Project
                            </span>
                          </button>

                          {/* EDIT */}

                          <button
                            type="button"
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();

                              setOpenMenu(null);
                              openEditModal(
                                project
                              );
                            }}
                            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                              darkMode
                                ? "hover:bg-white/[0.08]"
                                : "hover:bg-black/[0.05]"
                            }`}
                          >
                            <Pencil size={16} />

                            <span>
                              Edit Project
                            </span>
                          </button>

                          {/* DELETE */}

                          <button
                            type="button"
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();

                              confirmDelete(project);
                            }}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-red-500 transition hover:bg-red-500/10"
                          >
                            <Trash2 size={16} />

                            <span>
                              Delete Project
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* STATUS */}

                  <div className="px-5">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        String(
                          project.status || ""
                        ).toLowerCase() ===
                        "completed"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : String(
                              project.status || ""
                            ).toLowerCase() ===
                            "paused"
                          ? "bg-amber-500/10 text-amber-500"
                          : "bg-[#765b6b]/10 text-[#765b6b]"
                      }`}
                    >
                      {formatStatus(
                        project.status
                      )}
                    </span>
                  </div>

                  {/* PROGRESS */}

                  <div className="px-5 pt-5">
                    <div className="mb-2 flex items-center justify-between text-xs">
                      <span className={mutedText}>
                        Progress
                      </span>

                      <span className="font-semibold">
                        {stats.progress}%
                      </span>
                    </div>

                    <div
                      className={`h-2 overflow-hidden rounded-full ${
                        darkMode
                          ? "bg-white/[0.08]"
                          : "bg-black/[0.07]"
                      }`}
                    >
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${Math.min(
                            stats.progress,
                            100
                          )}%`,
                          backgroundColor:
                            projectColor,
                        }}
                      />
                    </div>
                  </div>

                  {/* INFO */}

                  <div
                    className={`mt-5 grid grid-cols-2 border-t ${
                      darkMode
                        ? "border-white/[0.08]"
                        : "border-black/[0.08]"
                    }`}
                  >
                    <div className="p-4">
                      <p
                        className={`text-xs ${mutedText}`}
                      >
                        Tasks
                      </p>

                      <p className="mt-1 text-sm font-bold">
                        {stats.completed}/
                        {stats.total}
                      </p>
                    </div>

                    <div
                      className={`border-l p-4 ${
                        darkMode
                          ? "border-white/[0.08]"
                          : "border-black/[0.08]"
                      }`}
                    >
                      <p
                        className={`text-xs ${mutedText}`}
                      >
                        Deadline
                      </p>

                      <p className="mt-1 truncate text-sm font-bold">
                        {formatDate(
                          getProjectDueDate(
                            project
                          )
                        )}
                      </p>
                    </div>
                  </div>

                  {/* FOOTER */}

                  <div
                    className={`flex items-center justify-between border-t px-5 py-4 ${
                      darkMode
                        ? "border-white/[0.08]"
                        : "border-black/[0.08]"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        viewProjectTasks(project)
                      }
                      className={`text-sm font-medium ${mutedText}`}
                    >
                      View details
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        openProjectTasksPage(
                          project
                        )
                      }
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#765b6b]"
                    >
                      Open Project
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* =================================================
            SELECTED PROJECT
        ================================================= */}

        {selectedProject && (
          <div
            className={`mt-6 rounded-2xl border p-5 ${cardBg}`}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: `${
                      selectedProject.color ||
                      "#765b6b"
                    }20`,
                    color:
                      selectedProject.color ||
                      "#765b6b",
                  }}
                >
                  <FolderKanban size={18} />
                </div>

                <div>
                  <h2 className="text-lg font-bold">
                    {getProjectName(
                      selectedProject
                    )}
                  </h2>

                  <p
                    className={`text-sm ${mutedText}`}
                  >
                    Project tasks
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedProjectId(null);
                  setSearchParams({});
                }}
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  darkMode
                    ? "hover:bg-white/[0.08]"
                    : "hover:bg-black/[0.05]"
                }`}
              >
                <X size={17} />
              </button>
            </div>

            {/* TASK FILTER */}

            <div className="mt-5 flex flex-wrap gap-2">
              {[
                ["all", "All"],
                ["active", "Active"],
                ["completed", "Completed"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setSelectedTaskFilter(
                      value
                    )
                  }
                  className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    selectedTaskFilter === value
                      ? "bg-[#765b6b] text-white"
                      : darkMode
                      ? "bg-white/[0.06] text-white/60 hover:bg-white/[0.1]"
                      : "bg-black/[0.04] text-black/60 hover:bg-black/[0.07]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* TASK LIST */}

            <div className="mt-5">
              {selectedProjectTasks.length ===
              0 ? (
                <div
                  className={`rounded-xl border border-dashed p-8 text-center ${
                    darkMode
                      ? "border-white/10"
                      : "border-black/10"
                  }`}
                >
                  <ListTodo
                    size={25}
                    className={`mx-auto ${mutedText}`}
                  />

                  <p className="mt-3 text-sm font-semibold">
                    No tasks here yet
                  </p>

                  <p
                    className={`mt-1 text-xs ${mutedText}`}
                  >
                    Tasks assigned to this project will appear here.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      openProjectTasksPage(
                        selectedProject
                      )
                    }
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#765b6b] px-3 py-2 text-xs font-semibold text-white"
                  >
                    Go to tasks
                    <ArrowRight size={14} />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedProjectTasks.map(
                    (task) => (
                      <button
                        key={task.id}
                        type="button"
                        onClick={() =>
                          openTask(task)
                        }
                        className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                          darkMode
                            ? "border-white/[0.08] hover:bg-white/[0.04]"
                            : "border-black/[0.08] hover:bg-black/[0.025]"
                        }`}
                      >
                        {task.completed ? (
                          <CheckCircle2
                            size={18}
                            className="shrink-0 text-emerald-500"
                          />
                        ) : (
                          <Circle
                            size={18}
                            className={`shrink-0 ${mutedText}`}
                          />
                        )}

                        <span
                          className={`min-w-0 flex-1 truncate text-sm font-medium ${
                            task.completed
                              ? "line-through opacity-50"
                              : ""
                          }`}
                        >
                          {task.title ||
                            task.name ||
                            "Untitled task"}
                        </span>

                        <ArrowRight
                          size={15}
                          className={mutedText}
                        />
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* =====================================================
          CREATE / EDIT MODAL
      ===================================================== */}

      {showForm && (
        <ProjectModal
          darkMode={darkMode}
          form={form}
          setForm={setForm}
          editingProject={editingProject}
          onClose={closeForm}
          onSubmit={handleSubmit}
        />
      )}

      {/* =====================================================
          DELETE MODAL
      ===================================================== */}

      {deleteTarget && (
        <DeleteProjectModal
          darkMode={darkMode}
          project={deleteTarget}
          onCancel={cancelDelete}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

/* =========================================================
   PROJECT MODAL
========================================================= */

function ProjectModal({
  darkMode,
  form,
  setForm,
  editingProject,
  onClose,
  onSubmit,
}) {
  const [showCalendar, setShowCalendar] =
    useState(false);

  const [error, setError] = useState("");

  /* =========================================================
     ESC + BODY SCROLL LOCK
  ========================================================= */

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow =
        previousOverflow;
    };
  }, [onClose]);

  /* =========================================================
     THEME
  ========================================================= */

  const modalBg = darkMode
    ? "border-white/10 bg-[#151515] text-white"
    : "border-black/10 bg-white text-black";

  const fieldBg = darkMode
    ? "border-white/10 bg-white/[0.04] text-white placeholder:text-white/30"
    : "border-black/10 bg-black/[0.025] text-black placeholder:text-black/35";

  const subtleBg = darkMode
    ? "bg-white/[0.025]"
    : "bg-black/[0.02]";

  const borderColor = darkMode
    ? "border-white/[0.08]"
    : "border-black/[0.08]";

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleLocalSubmit = (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Project name is required.");
      return;
    }

    setError("");
    onSubmit(event);
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div
      className="fixed inset-0 z-[2000] overflow-y-auto bg-black/70 p-3 backdrop-blur-md sm:p-6"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div className="flex min-h-full items-center justify-center">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          onMouseDown={(event) =>
            event.stopPropagation()
          }
          className={`flex w-full max-w-xl flex-col overflow-hidden rounded-3xl border shadow-[0_25px_80px_rgba(0,0,0,0.35)] ${modalBg}`}
          style={{
            maxHeight:
              "calc(100vh - 2rem)",
          }}
        >
          {/* =================================================
              HEADER
          ================================================= */}

          <div
            className={`flex shrink-0 items-center justify-between border-b px-5 py-4 sm:px-6 ${borderColor}`}
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#765b6b]/10 text-[#765b6b]">
                <FolderKanban size={19} />
              </div>

              <div className="min-w-0">
                <h2
                  id="project-modal-title"
                  className="truncate text-base font-bold sm:text-lg"
                >
                  {editingProject
                    ? "Edit Project"
                    : "Create New Project"}
                </h2>

                <p
                  className={`mt-0.5 text-xs ${
                    darkMode
                      ? "text-white/40"
                      : "text-black/45"
                  }`}
                >
                  {editingProject
                    ? "Update the details of this project."
                    : "Set up your project and start organizing your work."}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close project modal"
              className={`ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${
                darkMode
                  ? "text-white/55 hover:bg-white/[0.08] hover:text-white"
                  : "text-black/45 hover:bg-black/[0.05] hover:text-black"
              }`}
            >
              <X size={18} />
            </button>
          </div>

          {/* =================================================
              FORM SCROLL AREA
          ================================================= */}

          <form
            onSubmit={handleLocalSubmit}
            className="min-h-0 flex-1 overflow-y-auto"
          >
            <div className="space-y-5 p-5 sm:p-6">

              {/* =================================================
                  NAME
              ================================================= */}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="project-name"
                    className="text-xs font-bold"
                  >
                    Project name
                  </label>

                  <span
                    className={`text-[10px] ${darkMode ? "text-white/30" : "text-black/30"}`}
                  >
                    Required
                  </span>
                </div>

                <input
                  id="project-name"
                  autoFocus
                  value={form.name}
                  onChange={(event) => {
                    setForm({
                      ...form,
                      name: event.target.value,
                    });

                    if (error) {
                      setError("");
                    }
                  }}
                  placeholder="e.g. Portfolio Website"
                  className={`h-12 w-full rounded-xl border px-3.5 text-sm outline-none transition focus:border-[#765b6b] focus:ring-2 focus:ring-[#765b6b]/10 ${fieldBg}`}
                />

                {error && (
                  <p className="mt-2 text-xs font-medium text-red-500">
                    {error}
                  </p>
                )}
              </div>

              {/* =================================================
                  DESCRIPTION
              ================================================= */}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="project-description"
                    className="text-xs font-bold"
                  >
                    Description
                  </label>

                  <span
                    className={`text-[10px] ${darkMode ? "text-white/30" : "text-black/30"}`}
                  >
                    Optional
                  </span>
                </div>

                <textarea
                  id="project-description"
                  value={form.description}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      description:
                        event.target.value,
                    })
                  }
                  placeholder="What is this project about?"
                  rows={4}
                  className={`w-full resize-none rounded-xl border px-3.5 py-3 text-sm leading-6 outline-none transition focus:border-[#765b6b] focus:ring-2 focus:ring-[#765b6b]/10 ${fieldBg}`}
                />
              </div>

              {/* =================================================
                  SETTINGS
              ================================================= */}

              <div
                className={`rounded-2xl border p-3.5 ${borderColor} ${subtleBg}`}
              >
                <div className="mb-3">
                  <p className="text-xs font-bold">
                    Project settings
                  </p>

                  <p
                    className={`mt-0.5 text-[11px] ${darkMode ? "text-white/35" : "text-black/40"}`}
                  >
                    Choose how this project should be organized.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                  {/* PRIORITY */}

                  <ProjectSelect
                    darkMode={darkMode}
                    label="Priority"
                    value={form.priority}
                    options={[
                      {
                        value: "High",
                        label: "High",
                      },
                      {
                        value: "Medium",
                        label: "Medium",
                      },
                      {
                        value: "Low",
                        label: "Low",
                      },
                    ]}
                    onChange={(value) =>
                      setForm({
                        ...form,
                        priority: value,
                      })
                    }
                  />

                  {/* STATUS */}

                  <ProjectSelect
                    darkMode={darkMode}
                    label="Status"
                    value={form.status}
                    options={[
                      {
                        value: "active",
                        label: "Active",
                      },
                      {
                        value: "paused",
                        label: "Paused",
                      },
                      {
                        value: "completed",
                        label: "Completed",
                      },
                    ]}
                    onChange={(value) =>
                      setForm({
                        ...form,
                        status: value,
                      })
                    }
                  />
                </div>
              </div>

              {/* =================================================
                  DEADLINE
              ================================================= */}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs font-bold">
                    Deadline
                  </label>

                  <span
                    className={`text-[10px] ${darkMode ? "text-white/30" : "text-black/30"}`}
                  >
                    Optional
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowCalendar(
                      (current) => !current
                    )
                  }
                  className={`flex h-12 w-full items-center justify-between rounded-xl border px-3.5 text-left text-sm outline-none transition focus:border-[#765b6b] ${fieldBg}`}
                >
                  <span
                    className={
                      form.deadline
                        ? "font-medium"
                        : darkMode
                        ? "text-white/35"
                        : "text-black/35"
                    }
                  >
                    {form.deadline
                      ? formatDateValue(
                          form.deadline
                        )
                      : "Select a deadline"}
                  </span>

                  <CalendarDays
                    size={17}
                    className={
                      form.deadline
                        ? "text-[#765b6b]"
                        : darkMode
                        ? "text-white/40"
                        : "text-black/40"
                    }
                  />
                </button>

                {showCalendar && (
                  <div className="mt-2">
                    <CustomCalendar
                      darkMode={darkMode}
                      value={form.deadline}
                      onChange={(date) => {
                        setForm({
                          ...form,
                          deadline: date,
                        });

                        setShowCalendar(false);
                      }}
                    />
                  </div>
                )}

                {form.deadline && (
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        deadline: "",
                      })
                    }
                    className={`mt-2 text-xs font-medium ${
                      darkMode
                        ? "text-white/40 hover:text-white"
                        : "text-black/45 hover:text-black"
                    }`}
                  >
                    Clear deadline
                  </button>
                )}
              </div>
            </div>

            {/* =================================================
                FOOTER
            ================================================= */}

            <div
              className={`sticky bottom-0 flex shrink-0 items-center justify-between gap-3 border-t px-5 py-4 backdrop-blur-xl sm:px-6 ${borderColor} ${
                darkMode
                  ? "bg-[#151515]/95"
                  : "bg-white/95"
              }`}
            >
              <button
                type="button"
                onClick={onClose}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  darkMode
                    ? "text-white/65 hover:bg-white/[0.07] hover:text-white"
                    : "text-black/55 hover:bg-black/[0.05] hover:text-black"
                }`}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!form.name.trim()}
                className="inline-flex items-center gap-2 rounded-xl bg-[#765b6b] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Check size={16} />

                {editingProject
                  ? "Save changes"
                  : "Create project"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PROJECT SELECT
========================================================= */

function ProjectSelect({
  darkMode,
  label,
  value,
  options,
  onChange,
}) {
  const fieldBg = darkMode
    ? "border-white/10 bg-white/[0.04] text-white"
    : "border-black/10 bg-black/[0.025] text-black";

  return (
    <div>
      <label className="mb-2 block text-[11px] font-semibold">
        {label}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className={`h-11 w-full appearance-none rounded-xl border px-3 pr-9 text-sm outline-none transition focus:border-[#765b6b] focus:ring-2 focus:ring-[#765b6b]/10 ${fieldBg}`}
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className={
                darkMode
                  ? "bg-[#171717] text-white"
                  : "bg-white text-black"
              }
            >
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown
          size={15}
          className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${
            darkMode
              ? "text-white/40"
              : "text-black/40"
          }`}
        />
      </div>
    </div>
  );
}

/* =========================================================
   CALENDAR
========================================================= */

function CustomCalendar({
  darkMode,
  value,
  onChange,
}) {
  const initialDate = value
    ? new Date(`${value}T00:00:00`)
    : new Date();

  const [currentDate, setCurrentDate] =
    useState(
      Number.isNaN(initialDate.getTime())
        ? new Date()
        : initialDate
    );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(
    year,
    month,
    1
  ).getDay();

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const previousMonthDays = new Date(
    year,
    month,
    0
  ).getDate();

  const cells = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({
      day: previousMonthDays - i,
      currentMonth: false,
    });
  }

  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {
    cells.push({
      day,
      currentMonth: true,
    });
  }

  let nextDay = 1;

  while (cells.length < 42) {
    cells.push({
      day: nextDay++,
      currentMonth: false,
    });
  }

  const changeMonth = (amount) => {
    setCurrentDate(
      new Date(year, month + amount, 1)
    );
  };

  const selectDay = (cell) => {
    if (!cell.currentMonth) return;

    const monthNumber = String(
      month + 1
    ).padStart(2, "0");

    const dayNumber = String(
      cell.day
    ).padStart(2, "0");

    onChange(
      `${year}-${monthNumber}-${dayNumber}`
    );
  };

  return (
    <div
      className={`w-full rounded-2xl border p-4 ${
        darkMode
          ? "border-white/10 bg-[#181818]"
          : "border-black/10 bg-white"
      }`}
    >
      {/* CALENDAR HEADER */}

      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() =>
            changeMonth(-1)
          }
          className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
            darkMode
              ? "hover:bg-white/[0.08]"
              : "hover:bg-black/[0.05]"
          }`}
          aria-label="Previous month"
        >
          <ChevronLeft size={17} />
        </button>

        <span className="text-sm font-bold">
          {currentDate.toLocaleDateString(
            undefined,
            {
              month: "long",
              year: "numeric",
            }
          )}
        </span>

        <button
          type="button"
          onClick={() =>
            changeMonth(1)
          }
          className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
            darkMode
              ? "hover:bg-white/[0.08]"
              : "hover:bg-black/[0.05]"
          }`}
          aria-label="Next month"
        >
          <ChevronRight size={17} />
        </button>
      </div>

      {/* DAYS */}

      <div className="mb-2 grid grid-cols-7 text-center">
        {[
          "S",
          "M",
          "T",
          "W",
          "T",
          "F",
          "S",
        ].map((day, index) => (
          <span
            key={`${day}-${index}`}
            className={`py-1.5 text-[10px] font-bold ${
              darkMode
                ? "text-white/30"
                : "text-black/35"
            }`}
          >
            {day}
          </span>
        ))}
      </div>

      {/* DATE GRID */}

      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, index) => {
          const selected =
            value &&
            cell.currentMonth &&
            value ===
              `${year}-${String(
                month + 1
              ).padStart(2, "0")}-${String(
                cell.day
              ).padStart(2, "0")}`;

          return (
            <button
              key={index}
              type="button"
              disabled={!cell.currentMonth}
              onClick={() =>
                selectDay(cell)
              }
              className={`flex h-9 items-center justify-center rounded-lg text-xs transition ${
                selected
                  ? "bg-[#765b6b] font-bold text-white"
                  : cell.currentMonth
                  ? darkMode
                    ? "hover:bg-white/[0.08]"
                    : "hover:bg-black/[0.06]"
                  : darkMode
                  ? "text-white/10"
                  : "text-black/15"
              }`}
            >
              {cell.day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================
   DELETE MODAL
========================================================= */

function DeleteProjectModal({
  darkMode,
  project,
  onCancel,
  onDelete,
}) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [onCancel]);

  const bg = darkMode
    ? "border-white/10 bg-[#171717] text-white"
    : "border-black/10 bg-white text-black";

  return (
    <div
      className="fixed inset-0 z-[2200] flex items-center justify-center bg-black/65 p-4 backdrop-blur-md"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget
        ) {
          onCancel();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={`w-full max-w-md rounded-2xl border p-5 shadow-2xl ${bg}`}
        onMouseDown={(event) =>
          event.stopPropagation()
        }
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
            <AlertTriangle size={19} />
          </div>

          <div>
            <h2 className="text-base font-bold">
              Delete project?
            </h2>

            <p
              className={`mt-1 text-sm ${
                darkMode
                  ? "text-white/50"
                  : "text-black/50"
              }`}
            >
              Are you sure you want to delete{" "}
              <strong>
                {getProjectName(project)}
              </strong>
              ? This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onCancel();
            }}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold ${
              darkMode
                ? "hover:bg-white/[0.07]"
                : "hover:bg-black/[0.05]"
            }`}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onDelete();
            }}
            className="rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
          >
            Delete project
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyProjects({
  darkMode,
  onCreate,
}) {
  return (
    <div
      className={`rounded-2xl border border-dashed p-10 text-center ${
        darkMode
          ? "border-white/10 bg-[#151515]"
          : "border-black/10 bg-white"
      }`}
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#765b6b]/10 text-[#765b6b]">
        <FolderKanban size={25} />
      </div>

      <h2 className="mt-4 text-lg font-bold">
        No projects found
      </h2>

      <p
        className={`mx-auto mt-1 max-w-md text-sm ${
          darkMode
            ? "text-white/45"
            : "text-black/45"
        }`}
      >
        Create your first project and start organizing your work.
      </p>

      <button
        type="button"
        data-project-create-button="true"
        onPointerDown={(event) => {
          event.stopPropagation();
        }}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onCreate();
        }}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#765b6b] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
      >
        <Plus size={16} />
        New project
      </button>
    </div>
  );
}