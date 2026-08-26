import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Plus,
  Search,
  FolderKanban,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
  Check,
  Clock3,
  AlertTriangle,
  CheckCircle2,
  Circle,
  ListTodo,
  ArrowRight,
  CalendarDays,
  TrendingUp,
  Target,
  Activity,
  ChevronDown,
} from "lucide-react";

function ProjectManager() {
  const {
    projects = [],
    projectStats = [],
    tasks = [],
    addProject,
    updateProject,
    deleteProject,
    setProjectFilter,
  } = useOutletContext();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [openMenu, setOpenMenu] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [taskFilter, setTaskFilter] = useState("all");

  // DELETE CONFIRMATION
  const [deleteProjectTarget, setDeleteProjectTarget] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    priority: "Medium",
    status: "active",
    color: "sage",
    deadline: "",
  });

  // =========================================================
  // COLORS
  // =========================================================

  const projectColors = {
    sage: {
      background: "bg-[#6f9473]",
      light: "bg-[#6f9473]/10",
      text: "text-[#6f9473]",
      border: "border-[#6f9473]/20",
    },
    blue: {
      background: "bg-blue-500",
      light: "bg-blue-500/10",
      text: "text-blue-500",
      border: "border-blue-500/20",
    },
    purple: {
      background: "bg-purple-500",
      light: "bg-purple-500/10",
      text: "text-purple-500",
      border: "border-purple-500/20",
    },
    orange: {
      background: "bg-orange-500",
      light: "bg-orange-500/10",
      text: "text-orange-500",
      border: "border-orange-500/20",
    },
    rose: {
      background: "bg-rose-500",
      light: "bg-rose-500/10",
      text: "text-rose-500",
      border: "border-rose-500/20",
    },
    cyan: {
      background: "bg-cyan-500",
      light: "bg-cyan-500/10",
      text: "text-cyan-500",
      border: "border-cyan-500/20",
    },
  };

  // =========================================================
  // HELPERS
  // =========================================================

  const getProjectName = (project) =>
    project?.name || project?.title || "Untitled Project";

  const getToday = () => new Date().toISOString().slice(0, 10);

  const getDaysUntilDeadline = (deadline) => {
    if (!deadline) return null;

    const today = new Date(`${getToday()}T00:00:00`);
    const target = new Date(`${deadline}T00:00:00`);

    return Math.ceil(
      (target.getTime() - today.getTime()) /
        (1000 * 60 * 60 * 24)
    );
  };

  const getDeadlineLabel = (deadline) => {
    const days = getDaysUntilDeadline(deadline);

    if (days === null) return "No deadline";

    if (days < 0) {
      return `${Math.abs(days)} ${
        Math.abs(days) === 1 ? "day" : "days"
      } overdue`;
    }

    if (days === 0) return "Due today";
    if (days === 1) return "Due tomorrow";

    return `${days} days remaining`;
  };

  const getPriorityWeight = (priority) => {
    if (priority === "High") return 3;
    if (priority === "Medium") return 2;
    return 1;
  };

  const getPriorityStyle = (priority) => {
    if (priority === "High") {
      return "bg-rose-500/10 text-rose-500";
    }

    if (priority === "Medium") {
      return "bg-orange-500/10 text-orange-500";
    }

    return "bg-blue-500/10 text-blue-500";
  };

  const getStatusStyle = (status) => {
    if (status === "completed") {
      return "bg-[#6f9473]/10 text-[#6f9473]";
    }

    if (status === "paused") {
      return "bg-orange-500/10 text-orange-500";
    }

    return "bg-blue-500/10 text-blue-500";
  };

  const getProjectHealth = (project) => {
    const progress = Number(project.progress || 0);
    const overdue = Number(project.overdue || 0);
    const days = getDaysUntilDeadline(project.deadline);

    if (
      project.status === "completed" ||
      progress >= 100
    ) {
      return {
        label: "Completed",
        className: "bg-[#6f9473]/10 text-[#6f9473]",
        dot: "bg-[#6f9473]",
      };
    }

    if (
      overdue > 0 ||
      (days !== null && days < 0)
    ) {
      return {
        label: "Overdue",
        className: "bg-rose-500/10 text-rose-500",
        dot: "bg-rose-500",
      };
    }

    if (
      (days !== null && days <= 3) ||
      progress < 25
    ) {
      return {
        label: "At Risk",
        className: "bg-orange-500/10 text-orange-500",
        dot: "bg-orange-500",
      };
    }

    return {
      label: "On Track",
      className: "bg-blue-500/10 text-blue-500",
      dot: "bg-blue-500",
    };
  };

  // =========================================================
  // MERGE PROJECTS + PROJECT STATS
  // =========================================================

  const displayProjects = useMemo(() => {
    const statsMap = new Map(
      projectStats.map((project) => [
        String(project.id),
        project,
      ])
    );

    return projects.map((project) => {
      const stats = statsMap.get(String(project.id));

      if (!stats) {
        return {
          ...project,
          total: 0,
          completed: 0,
          overdue: 0,
          progress: 0,
        };
      }

      return {
        ...project,
        ...stats,
        name:
          project.name ||
          stats.name ||
          stats.title ||
          "Untitled Project",
      };
    });
  }, [projects, projectStats]);

  // =========================================================
  // FILTER + SORT
  // =========================================================

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = displayProjects.filter((project) => {
      const name = getProjectName(project);
      const description = project.description || "";

      const matchesSearch =
        !query ||
        `${name} ${description}`
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    return [...result].sort((a, b) => {
      if (sortBy === "progress") {
        return (
          Number(b.progress || 0) -
          Number(a.progress || 0)
        );
      }

      if (sortBy === "priority") {
        return (
          getPriorityWeight(b.priority) -
          getPriorityWeight(a.priority)
        );
      }

      if (sortBy === "deadline") {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;

        return (
          new Date(a.deadline) -
          new Date(b.deadline)
        );
      }

      if (sortBy === "name") {
        return getProjectName(a).localeCompare(
          getProjectName(b)
        );
      }

      return 0;
    });
  }, [
    displayProjects,
    search,
    statusFilter,
    sortBy,
  ]);

  // =========================================================
  // CREATE / EDIT MODAL
  // =========================================================

  const openCreateModal = () => {
    setEditingProject(null);

    setForm({
      name: "",
      description: "",
      priority: "Medium",
      status: "active",
      color: "sage",
      deadline: "",
    });

    setOpenMenu(null);
    setShowModal(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);

    setForm({
      name: getProjectName(project),
      description: project.description || "",
      priority: project.priority || "Medium",
      status: project.status || "active",
      color: project.color || "sage",
      deadline: project.deadline || "",
    });

    setOpenMenu(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProject(null);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // =========================================================
  // CREATE / UPDATE
  // =========================================================

  const handleSubmit = (event) => {
    event.preventDefault();

    const name = form.name.trim();

    if (!name) return;

    const projectData = {
      ...(editingProject || {}),
      name,
      description: form.description.trim(),
      priority: form.priority,
      status: form.status,
      color: form.color,
      deadline: form.deadline,
    };

    if (editingProject) {
      updateProject?.(projectData);
    } else {
      addProject?.(projectData);
    }

    closeModal();
  };

  // =========================================================
  // DELETE
  // =========================================================

  const requestDeleteProject = (project) => {
    setOpenMenu(null);
    setDeleteProjectTarget(project);
  };

  const cancelDeleteProject = () => {
    setDeleteProjectTarget(null);
  };

  const confirmDeleteProject = () => {
    if (!deleteProjectTarget) return;

    const projectId = deleteProjectTarget.id;

    deleteProject?.(projectId);

    if (selectedProject?.id === projectId) {
      setSelectedProject(null);
    }

    setDeleteProjectTarget(null);
    setOpenMenu(null);
  };

  // =========================================================
  // VIEW PROJECT
  // =========================================================

  const viewProjectTasks = (project) => {
    if (typeof setProjectFilter === "function") {
      setProjectFilter(project.id);
    }

    setSelectedProject(project);
    setTaskFilter("all");
  };

  // =========================================================
  // OVERALL STATS
  // =========================================================

  const overallStats = useMemo(() => {
    const activeTasks = tasks.filter(
      (task) => !task.archived
    );

    const completedTasks = activeTasks.filter(
      (task) => task.completed
    );

    const overdueTasks = activeTasks.filter(
      (task) =>
        !task.completed &&
        task.dueDate &&
        new Date(`${task.dueDate}T00:00:00`) <
          new Date(`${getToday()}T00:00:00`)
    );

    const activeProjects = projects.filter(
      (project) => project.status !== "completed"
    );

    const averageProgress =
      displayProjects.length > 0
        ? Math.round(
            displayProjects.reduce(
              (sum, project) =>
                sum + Number(project.progress || 0),
              0
            ) / displayProjects.length
          )
        : 0;

    return {
      projects: projects.length,
      activeProjects: activeProjects.length,
      totalTasks: activeTasks.length,
      completedTasks: completedTasks.length,
      overdueTasks: overdueTasks.length,
      averageProgress,
    };
  }, [projects, tasks, displayProjects]);

  // =========================================================
  // SELECTED PROJECT TASKS
  // =========================================================

  const selectedProjectTasks = useMemo(() => {
    if (!selectedProject) return [];

    const projectTasks = tasks.filter(
      (task) =>
        String(task.projectId) ===
          String(selectedProject.id) &&
        !task.archived
    );

    if (taskFilter === "open") {
      return projectTasks.filter(
        (task) => !task.completed
      );
    }

    if (taskFilter === "completed") {
      return projectTasks.filter(
        (task) => task.completed
      );
    }

    if (taskFilter === "overdue") {
      return projectTasks.filter(
        (task) =>
          !task.completed &&
          task.dueDate &&
          new Date(`${task.dueDate}T00:00:00`) <
            new Date(`${getToday()}T00:00:00`)
      );
    }

    return projectTasks;
  }, [selectedProject, tasks, taskFilter]);

  // =========================================================
  // SELECTED ANALYTICS
  // =========================================================

  const selectedAnalytics = useMemo(() => {
    if (!selectedProject) {
      return {
        total: 0,
        completed: 0,
        open: 0,
        overdue: 0,
      };
    }

    const projectTasks = tasks.filter(
      (task) =>
        String(task.projectId) ===
          String(selectedProject.id) &&
        !task.archived
    );

    const completed = projectTasks.filter(
      (task) => task.completed
    );

    const overdue = projectTasks.filter(
      (task) =>
        !task.completed &&
        task.dueDate &&
        new Date(`${task.dueDate}T00:00:00`) <
          new Date(`${getToday()}T00:00:00`)
    );

    return {
      total: projectTasks.length,
      completed: completed.length,
      open:
        projectTasks.length - completed.length,
      overdue: overdue.length,
    };
  }, [selectedProject, tasks]);

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-7">

      {/* HEADER */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#6f9473]">
            <FolderKanban size={15} />
            Workspace
          </div>

          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            Project Manager
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-black/45 dark:text-white/45">
            Plan projects, monitor progress, manage
            deadlines, and keep your work moving.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 rounded-2xl bg-[#6f9473] px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-[#6f9473]/20 transition hover:-translate-y-0.5 hover:bg-[#5f8263]"
        >
          <Plus size={19} />
          New Project
        </button>
      </div>

      {/* STATS */}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatCard
          icon={<FolderKanban size={20} />}
          label="Projects"
          value={overallStats.projects}
          sub={`${overallStats.activeProjects} active`}
          color="sage"
        />

        <StatCard
          icon={<ListTodo size={20} />}
          label="Tasks"
          value={overallStats.totalTasks}
          sub={`${overallStats.completedTasks} completed`}
          color="blue"
        />

        <StatCard
          icon={<TrendingUp size={20} />}
          label="Avg. Progress"
          value={`${overallStats.averageProgress}%`}
          sub="across projects"
          color="sage"
          progress={overallStats.averageProgress}
        />

        <StatCard
          icon={<CheckCircle2 size={20} />}
          label="Completed"
          value={overallStats.completedTasks}
          sub="tasks finished"
          color="sage"
        />

        <StatCard
          icon={<AlertTriangle size={20} />}
          label="Attention"
          value={overallStats.overdueTasks}
          sub="overdue tasks"
          color="rose"
        />
      </div>

      {/* SEARCH */}

      <div className="flex flex-col gap-3 rounded-3xl border border-black/[0.06] bg-white p-4 shadow-sm dark:border-white/[0.06] dark:bg-[#171a17] lg:flex-row">

        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30 dark:text-white/30"
          />

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search projects..."
            className="h-12 w-full rounded-2xl bg-[#f5f6f3] pl-11 pr-4 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#6f9473]/20 dark:bg-white/[0.05] dark:text-white dark:placeholder:text-white/30"
          />
        </div>

        <SelectBox
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            ["all", "All projects"],
            ["active", "Active"],
            ["paused", "Paused"],
            ["completed", "Completed"],
          ]}
        />

        <SelectBox
          value={sortBy}
          onChange={setSortBy}
          options={[
            ["recent", "Sort: Recent"],
            ["progress", "Sort: Progress"],
            ["deadline", "Sort: Deadline"],
            ["priority", "Sort: Priority"],
            ["name", "Sort: Name"],
          ]}
        />
      </div>

      {/* PROJECTS */}

      {filteredProjects.length === 0 ? (
        <div className="rounded-[32px] border border-dashed border-black/10 bg-white p-12 text-center dark:border-white/10 dark:bg-[#171a17]">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#6f9473]/10 text-[#6f9473]">
            <FolderKanban size={28} />
          </div>

          <h2 className="mt-5 text-xl font-black">
            {search
              ? "No projects found"
              : "No projects yet"}
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-black/40 dark:text-white/40">
            {search
              ? "Try changing your search or filters."
              : "Create your first project to start organizing your work."}
          </p>

          {!search && (
            <button
              type="button"
              onClick={openCreateModal}
              className="mt-6 rounded-2xl bg-[#6f9473] px-5 py-3 text-sm font-black text-white hover:bg-[#5f8263]"
            >
              Create Project
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

          {filteredProjects.map((project) => {
            const color =
              projectColors[project.color] ||
              projectColors.sage;

            const health =
              getProjectHealth(project);

            const progress = Math.min(
              100,
              Math.max(
                0,
                Number(project.progress || 0)
              )
            );

            return (
              <div
                key={project.id}
                className="group relative overflow-hidden rounded-[30px] border border-black/[0.06] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-white/[0.06] dark:bg-[#171a17]"
              >

                <div
                  className={`h-1.5 w-full ${color.background}`}
                />

                <div className="p-6">

                  <div className="flex items-start justify-between gap-4">

                    <button
                      type="button"
                      onClick={() =>
                        viewProjectTasks(project)
                      }
                      className="flex min-w-0 items-center gap-3 text-left"
                    >
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${color.light} ${color.text}`}
                      >
                        <FolderKanban size={21} />
                      </div>

                      <div className="min-w-0">
                        <h2 className="truncate text-lg font-black">
                          {getProjectName(project)}
                        </h2>

                        <p className="mt-0.5 text-xs font-bold text-black/35 dark:text-white/35">
                          {project.total || 0}{" "}
                          {project.total === 1
                            ? "task"
                            : "tasks"}
                        </p>
                      </div>
                    </button>

                    <div className="relative">

                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenu(
                            openMenu === project.id
                              ? null
                              : project.id
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-black/35 hover:bg-black/5 dark:text-white/35 dark:hover:bg-white/5"
                      >
                        <MoreHorizontal size={19} />
                      </button>

                      {openMenu === project.id && (
                        <div className="absolute right-0 top-11 z-20 w-44 overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-1.5 shadow-2xl dark:border-white/[0.06] dark:bg-[#202420]">

                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(project)
                            }
                            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-bold hover:bg-black/5 dark:hover:bg-white/5"
                          >
                            <Pencil size={15} />
                            Edit Project
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              viewProjectTasks(project)
                            }
                            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-bold hover:bg-black/5 dark:hover:bg-white/5"
                          >
                            <ListTodo size={15} />
                            View Tasks
                          </button>

                          <div className="my-1 h-px bg-black/[0.06] dark:bg-white/[0.06]" />

                          <button
                            type="button"
                            onClick={() =>
                              requestDeleteProject(project)
                            }
                            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-bold text-rose-500 hover:bg-rose-500/10"
                          >
                            <Trash2 size={15} />
                            Delete Project
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="mt-5 min-h-[48px] text-sm leading-6 text-black/45 dark:text-white/45">
                    {project.description ||
                      "No project description added yet."}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">

                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${getPriorityStyle(
                        project.priority
                      )}`}
                    >
                      {project.priority || "Medium"}{" "}
                      Priority
                    </span>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${getStatusStyle(
                        project.status
                      )}`}
                    >
                      {project.status || "active"}
                    </span>

                    <span
                      className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${health.className}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${health.dot}`}
                      />
                      {health.label}
                    </span>
                  </div>

                  <div className="mt-6">

                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target
                          size={14}
                          className="text-black/30 dark:text-white/30"
                        />

                        <span className="text-xs font-black text-black/40 dark:text-white/40">
                          Completion
                        </span>
                      </div>

                      <span className="text-xs font-black">
                        {progress}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-black/[0.06] dark:bg-white/[0.07]">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${color.background}`}
                        style={{
                          width: `${progress}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-2">

                    <SmallStat
                      label="Total"
                      value={project.total || 0}
                    />

                    <SmallStat
                      label="Done"
                      value={project.completed || 0}
                      valueClass="text-[#6f9473]"
                    />

                    <SmallStat
                      label="Late"
                      value={project.overdue || 0}
                      valueClass="text-rose-500"
                    />
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3">

                    {project.deadline ? (
                      <>
                        <div className="flex items-center gap-2 text-xs font-bold text-black/40 dark:text-white/40">
                          <CalendarDays size={14} />

                          {new Date(
                            `${project.deadline}T00:00:00`
                          ).toLocaleDateString(
                            undefined,
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </div>

                        <span
                          className={`text-[10px] font-black ${
                            getDaysUntilDeadline(
                              project.deadline
                            ) < 0
                              ? "text-rose-500"
                              : getDaysUntilDeadline(
                                    project.deadline
                                  ) <= 3
                                ? "text-orange-500"
                                : "text-[#6f9473]"
                          }`}
                        >
                          {getDeadlineLabel(
                            project.deadline
                          )}
                        </span>
                      </>
                    ) : (
                      <div className="flex items-center gap-2 text-xs font-bold text-black/30 dark:text-white/30">
                        <Clock3 size={14} />
                        No deadline
                      </div>
                    )}
                  </div>

                  <div className="mt-6 grid grid-cols-[1fr_auto] gap-2">

                    <button
                      type="button"
                      onClick={() =>
                        viewProjectTasks(project)
                      }
                      className="flex items-center justify-center gap-2 rounded-2xl border border-black/[0.07] py-3 text-xs font-black transition hover:border-[#6f9473]/30 hover:bg-[#6f9473]/5 hover:text-[#6f9473] dark:border-white/[0.08]"
                    >
                      Open Project
                      <ArrowRight size={15} />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        requestDeleteProject(project)
                      }
                      className="flex h-full items-center justify-center rounded-2xl border border-rose-500/10 px-4 text-rose-500 hover:bg-rose-500/10"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =====================================================
          SELECTED PROJECT
      ===================================================== */}

      {selectedProject && (
        <div className="overflow-hidden rounded-[32px] border border-black/[0.06] bg-white shadow-sm dark:border-white/[0.06] dark:bg-[#171a17]">

          <div className="border-b border-black/[0.06] p-6 dark:border-white/[0.06]">

            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#6f9473]">
                  <Activity size={13} />
                  Project Workspace
                </div>

                <h2 className="mt-2 text-2xl font-black">
                  {getProjectName(selectedProject)}
                </h2>

                <p className="mt-1 text-sm text-black/40 dark:text-white/40">
                  {selectedProject.description ||
                    "Project task overview"}
                </p>
              </div>

              <div className="flex items-center gap-2">

                <button
                  type="button"
                  onClick={() =>
                    openEditModal(selectedProject)
                  }
                  className="flex items-center gap-2 rounded-xl border border-black/[0.07] px-4 py-2.5 text-xs font-black hover:bg-black/5 dark:border-white/[0.08] dark:hover:bg-white/5"
                >
                  <Pencil size={14} />
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() =>
                    requestDeleteProject(selectedProject)
                  }
                  className="flex items-center gap-2 rounded-xl bg-rose-500/10 px-4 py-2.5 text-xs font-black text-rose-500 hover:bg-rose-500/15"
                >
                  <Trash2 size={14} />
                  Delete
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedProject(null)
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/5 text-black/40 hover:bg-black/10 dark:bg-white/5 dark:text-white/40"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">

              <ProjectNumber
                label="Total Tasks"
                value={selectedAnalytics.total}
              />

              <ProjectNumber
                label="Open"
                value={selectedAnalytics.open}
                className="text-blue-500"
              />

              <ProjectNumber
                label="Completed"
                value={selectedAnalytics.completed}
                className="text-[#6f9473]"
              />

              <ProjectNumber
                label="Overdue"
                value={selectedAnalytics.overdue}
                className="text-rose-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 border-b border-black/[0.06] p-4 dark:border-white/[0.06]">

            {[
              ["all", "All Tasks"],
              ["open", "Open"],
              ["completed", "Completed"],
              ["overdue", "Overdue"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() =>
                  setTaskFilter(value)
                }
                className={`rounded-xl px-4 py-2 text-xs font-black ${
                  taskFilter === value
                    ? "bg-[#6f9473] text-white"
                    : "bg-black/5 text-black/45 dark:bg-white/5 dark:text-white/45"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="space-y-2 p-6">

            {selectedProjectTasks.length === 0 ? (
              <div className="rounded-2xl bg-[#f5f6f3] p-10 text-center dark:bg-white/[0.04]">
                <Circle
                  className="mx-auto text-black/20 dark:text-white/20"
                  size={32}
                />

                <p className="mt-3 text-sm font-black">
                  No tasks here
                </p>
              </div>
            ) : (
              selectedProjectTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 rounded-2xl bg-[#f5f6f3] p-4 dark:bg-white/[0.04]"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      task.completed
                        ? "bg-[#6f9473]/10 text-[#6f9473]"
                        : "bg-black/5 text-black/30 dark:bg-white/5 dark:text-white/30"
                    }`}
                  >
                    {task.completed ? (
                      <Check size={17} />
                    ) : (
                      <Circle size={17} />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate text-sm font-black ${
                        task.completed
                          ? "text-black/40 line-through dark:text-white/40"
                          : ""
                      }`}
                    >
                      {task.title || "Untitled task"}
                    </p>

                    <div className="mt-1 flex gap-2 text-[10px] font-bold text-black/35 dark:text-white/35">
                      <span>
                        {task.status || "backlog"}
                      </span>

                      {task.dueDate && (
                        <span>
                          Due {task.dueDate}
                        </span>
                      )}
                    </div>
                  </div>

                  {task.priority && (
                    <span
                      className={`hidden rounded-full px-2.5 py-1 text-[9px] font-black uppercase sm:block ${getPriorityStyle(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* =====================================================
          CREATE / EDIT MODAL
      ===================================================== */}

      {showModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget
            ) {
              closeModal();
            }
          }}
        >

          <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[34px] border border-black/[0.06] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.3)] dark:border-white/[0.08] dark:bg-[#171a17]">

            <div className="relative overflow-hidden border-b border-black/[0.06] p-6 dark:border-white/[0.06] sm:p-8">

              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#6f9473]/10 blur-3xl" />

              <div className="relative flex items-start justify-between">

                <div className="flex items-center gap-4">

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#6f9473] text-white shadow-lg shadow-[#6f9473]/20">
                    <FolderKanban size={24} />
                  </div>

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6f9473]">
                      {editingProject
                        ? "Edit Project"
                        : "New Project"}
                    </p>

                    <h2 className="mt-1 text-2xl font-black">
                      {editingProject
                        ? "Update project"
                        : "Create a project"}
                    </h2>

                    <p className="mt-1 text-xs text-black/40 dark:text-white/40">
                      Build your project and start
                      tracking your work.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/5 text-black/40 hover:bg-black/10 dark:bg-white/5 dark:text-white/40"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6 p-6 sm:p-8"
            >

              <div>
                <label className="mb-2 block text-[10px] font-black uppercase tracking-wider text-black/45 dark:text-white/45">
                  Project Name
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Lockin redesign"
                  autoFocus
                  className="h-13 w-full rounded-2xl border border-black/[0.08] bg-[#f5f6f3] px-4 text-sm font-bold outline-none transition focus:border-[#6f9473]/50 focus:ring-4 focus:ring-[#6f9473]/10 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-black uppercase tracking-wider text-black/45 dark:text-white/45">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="What are you trying to accomplish?"
                  className="w-full resize-none rounded-2xl border border-black/[0.08] bg-[#f5f6f3] p-4 text-sm font-semibold outline-none focus:border-[#6f9473]/50 focus:ring-4 focus:ring-[#6f9473]/10 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">

                <StyledSelect
                  label="Priority"
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  options={[
                    ["Low", "Low"],
                    ["Medium", "Medium"],
                    ["High", "High"],
                  ]}
                />

                <StyledSelect
                  label="Status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  options={[
                    ["active", "Active"],
                    ["paused", "Paused"],
                    ["completed", "Completed"],
                  ]}
                />

                <div>
                  <label className="mb-2 block text-[10px] font-black uppercase tracking-wider text-black/45 dark:text-white/45">
                    Deadline
                  </label>

                  <div className="group relative">

                    <div className="pointer-events-none absolute left-4 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center">
                      <CalendarDays
                        size={18}
                        className="text-[#6f9473]"
                      />
                    </div>

                    <input
                      type="date"
                      name="deadline"
                      value={form.deadline}
                      onChange={handleChange}
                      min={getToday()}
                      className="h-13 w-full cursor-pointer rounded-2xl border border-black/[0.08] bg-[#f5f6f3] pl-12 pr-4 text-sm font-bold text-black outline-none transition hover:border-[#6f9473]/40 focus:border-[#6f9473]/60 focus:ring-4 focus:ring-[#6f9473]/10 [color-scheme:light] dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white dark:[color-scheme:dark]"
                    />
                  </div>

                  <p className="mt-2 flex items-center gap-1.5 text-[10px] font-semibold text-black/35 dark:text-white/35">
                    <Clock3 size={12} />

                    {form.deadline
                      ? getDeadlineLabel(
                          form.deadline
                        )
                      : "Choose when this project should be completed."}
                  </p>
                </div>

                <StyledSelect
                  label="Project Color"
                  name="color"
                  value={form.color}
                  onChange={handleChange}
                  options={[
                    ["sage", "Sage"],
                    ["blue", "Blue"],
                    ["purple", "Purple"],
                    ["orange", "Orange"],
                    ["rose", "Rose"],
                    ["cyan", "Cyan"],
                  ]}
                />
              </div>

              <div>
                <p className="mb-3 text-[10px] font-black uppercase tracking-wider text-black/45 dark:text-white/45">
                  Quick Color
                </p>

                <div className="flex flex-wrap gap-3">

                  {Object.entries(projectColors).map(
                    ([key, color]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() =>
                          setForm((current) => ({
                            ...current,
                            color: key,
                          }))
                        }
                        className={`flex h-10 w-10 items-center justify-center rounded-xl border-2 transition ${
                          form.color === key
                            ? "scale-110 border-black dark:border-white"
                            : "border-transparent"
                        }`}
                      >
                        <span
                          className={`h-6 w-6 rounded-full ${color.background}`}
                        />
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="overflow-hidden rounded-3xl border border-black/[0.07] bg-[#f5f6f3] dark:border-white/[0.07] dark:bg-white/[0.035]">

                <div className="border-b border-black/[0.06] px-5 py-3 dark:border-white/[0.06]">
                  <p className="text-[9px] font-black uppercase tracking-[0.18em] text-black/30 dark:text-white/30">
                    Live Preview
                  </p>
                </div>

                <div className="p-5">

                  <div className="flex items-center gap-3">

                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                        projectColors[form.color]?.light
                      } ${
                        projectColors[form.color]?.text
                      }`}
                    >
                      <FolderKanban size={21} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-black">
                        {form.name.trim() ||
                          "Your project name"}
                      </p>

                      <p className="mt-1 truncate text-xs text-black/35 dark:text-white/35">
                        {form.description.trim() ||
                          "Your project description"}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1.5 text-[9px] font-black uppercase ${getPriorityStyle(
                        form.priority
                      )}`}
                    >
                      {form.priority}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">

                    <span
                      className={`rounded-full px-3 py-1.5 text-[9px] font-black uppercase ${getStatusStyle(
                        form.status
                      )}`}
                    >
                      {form.status}
                    </span>

                    {form.deadline && (
                      <span className="flex items-center gap-1.5 rounded-full bg-black/5 px-3 py-1.5 text-[9px] font-black dark:bg-white/5">
                        <CalendarDays size={12} />
                        {new Date(
                          `${form.deadline}T00:00:00`
                        ).toLocaleDateString(
                          undefined,
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-black/[0.06] pt-6 dark:border-white/[0.06] sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-2xl px-5 py-3.5 text-sm font-black text-black/50 hover:bg-black/5 dark:text-white/50 dark:hover:bg-white/5"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!form.name.trim()}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-[#6f9473] px-7 py-3.5 text-sm font-black text-white shadow-lg shadow-[#6f9473]/20 transition hover:-translate-y-0.5 hover:bg-[#5f8263] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Check size={17} />

                  {editingProject
                    ? "Save Changes"
                    : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          DELETE CONFIRMATION MODAL
      ===================================================== */}

      {deleteProjectTarget && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget
            ) {
              cancelDeleteProject();
            }
          }}
        >
          <div className="w-full max-w-md overflow-hidden rounded-[30px] border border-black/[0.07] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.3)] dark:border-white/[0.08] dark:bg-[#171a17]">

            <div className="p-6 sm:p-7">

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500">
                  <Trash2 size={21} />
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-black">
                    Delete project?
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-black/45 dark:text-white/45">
                    Are you sure you want to delete{" "}
                    <span className="font-black text-black dark:text-white">
                      "{getProjectName(
                        deleteProjectTarget
                      )}"
                    </span>
                    ?
                  </p>
                </div>

                <button
                  type="button"
                  onClick={cancelDeleteProject}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/5 text-black/40 hover:bg-black/10 dark:bg-white/5 dark:text-white/40 dark:hover:bg-white/10"
                >
                  <X size={17} />
                </button>
              </div>

              <div className="mt-5 rounded-2xl bg-rose-500/5 p-4 dark:bg-rose-500/[0.06]">
                <p className="text-xs font-semibold leading-5 text-rose-500">
                  The project will be removed. Its tasks will
                  not be deleted.
                </p>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={cancelDeleteProject}
                  className="rounded-2xl px-5 py-3 text-sm font-black text-black/50 transition hover:bg-black/5 dark:text-white/50 dark:hover:bg-white/5"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={confirmDeleteProject}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-rose-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-rose-500/20 transition hover:bg-rose-600"
                >
                  <Trash2 size={16} />
                  Delete Project
                </button>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================================
// SMALL COMPONENTS
// =========================================================

function StatCard({
  icon,
  label,
  value,
  sub,
  color,
  progress,
}) {
  const colors = {
    sage: "bg-[#6f9473]/10 text-[#6f9473]",
    blue: "bg-blue-500/10 text-blue-500",
    rose: "bg-rose-500/10 text-rose-500",
  };

  return (
    <div className="rounded-3xl border border-black/[0.06] bg-white p-5 shadow-sm dark:border-white/[0.06] dark:bg-[#171a17]">

      <div
        className={`mb-4 flex h-10 w-10 items-center justify-center rounded-2xl ${colors[color]}`}
      >
        {icon}
      </div>

      <p className="text-xs font-bold text-black/40 dark:text-white/40">
        {label}
      </p>

      <p className="mt-1 text-2xl font-black">
        {value}
      </p>

      <p className="mt-1 text-[10px] font-bold text-black/30 dark:text-white/30">
        {sub}
      </p>

      {progress !== undefined && (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-black/[0.06] dark:bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-[#6f9473]"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      )}
    </div>
  );
}

function SmallStat({
  label,
  value,
  valueClass = "",
}) {
  return (
    <div className="rounded-2xl bg-[#f5f6f3] p-3 dark:bg-white/[0.04]">
      <p className="text-[9px] font-black uppercase tracking-wider text-black/30 dark:text-white/30">
        {label}
      </p>

      <p
        className={`mt-1 text-lg font-black ${valueClass}`}
      >
        {value}
      </p>
    </div>
  );
}

function ProjectNumber({
  label,
  value,
  className = "",
}) {
  return (
    <div className="rounded-2xl bg-[#f5f6f3] p-4 dark:bg-white/[0.04]">
      <p className="text-[9px] font-black uppercase tracking-wider text-black/30 dark:text-white/30">
        {label}
      </p>

      <p className={`mt-1 text-xl font-black ${className}`}>
        {value}
      </p>
    </div>
  );
}

function SelectBox({
  value,
  onChange,
  options,
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="h-12 w-full appearance-none rounded-2xl bg-[#f5f6f3] px-4 pr-10 text-sm font-bold outline-none dark:bg-white/[0.05] dark:text-white lg:w-48"
      >
        {options.map(([optionValue, label]) => (
          <option
            key={optionValue}
            value={optionValue}
          >
            {label}
          </option>
        ))}
      </select>

      <ChevronDown
        size={15}
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black/30"
      />
    </div>
  );
}

function StyledSelect({
  label,
  name,
  value,
  onChange,
  options,
}) {
  return (
    <div>
      <label className="mb-2 block text-[10px] font-black uppercase tracking-wider text-black/45 dark:text-white/45">
        {label}
      </label>

      <div className="relative">

        <select
          name={name}
          value={value}
          onChange={onChange}
          className="h-13 w-full appearance-none rounded-2xl border border-black/[0.08] bg-[#f5f6f3] px-4 pr-10 text-sm font-bold outline-none transition focus:border-[#6f9473]/50 focus:ring-4 focus:ring-[#6f9473]/10 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white"
        >
          {options.map(([optionValue, text]) => (
            <option
              key={optionValue}
              value={optionValue}
            >
              {text}
            </option>
          ))}
        </select>

        <ChevronDown
          size={15}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black/30 dark:text-white/30"
        />
      </div>
    </div>
  );
}

export default ProjectManager;