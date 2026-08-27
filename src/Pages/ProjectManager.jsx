import { useEffect, useMemo, useState } from "react";
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
  ExternalLink,
  LayoutList,
  Pause,
  Zap,
  BarChart3,
  CircleDot,
  Layers3,
} from "lucide-react";

function ProjectManager() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    projects = [],
    projectStats = [],
    tasks = [],
    addProject,
    updateProject,
    deleteProject,
    setProjectFilter,
  } = useOutletContext() || {};

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [openMenu, setOpenMenu] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [taskFilter, setTaskFilter] = useState("all");

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

  const getProjectTasks = (projectId) =>
    tasks.filter(
      (task) =>
        String(task.projectId) === String(projectId) && !task.archived,
    );

  const getDaysUntilDeadline = (deadline) => {
    if (!deadline) return null;

    const today = new Date(`${getToday()}T00:00:00`);
    const target = new Date(`${deadline}T00:00:00`);

    return Math.ceil(
      (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
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

  const getTaskStatusStyle = (task) => {
    if (task.completed) {
      return "bg-[#6f9473]/10 text-[#6f9473]";
    }

    if (task.status === "in-progress") {
      return "bg-blue-500/10 text-blue-500";
    }

    if (task.status === "review") {
      return "bg-purple-500/10 text-purple-500";
    }

    return "bg-black/5 text-black/40 dark:bg-white/5 dark:text-white/40";
  };

  const getProjectHealth = (project) => {
    const progress = Number(project.progress || 0);
    const overdue = Number(project.overdue || 0);
    const deadline = project.deadline || project.dueDate;
    const days = getDaysUntilDeadline(deadline);

    if (project.status === "completed" || progress >= 100) {
      return {
        label: "Completed",
        className: "bg-[#6f9473]/10 text-[#6f9473]",
        dot: "bg-[#6f9473]",
        icon: CheckCircle2,
      };
    }

    if (project.status === "paused") {
      return {
        label: "Paused",
        className: "bg-orange-500/10 text-orange-500",
        dot: "bg-orange-500",
        icon: Pause,
      };
    }

    if (overdue > 0 || (days !== null && days < 0)) {
      return {
        label: "Overdue",
        className: "bg-rose-500/10 text-rose-500",
        dot: "bg-rose-500",
        icon: AlertTriangle,
      };
    }

    if ((days !== null && days <= 3) || progress < 25) {
      return {
        label: "At Risk",
        className: "bg-orange-500/10 text-orange-500",
        dot: "bg-orange-500",
        icon: AlertTriangle,
      };
    }

    return {
      label: "On Track",
      className: "bg-blue-500/10 text-blue-500",
      dot: "bg-blue-500",
      icon: CircleDot,
    };
  };

  // =========================================================
  // CALCULATED PROJECT STATS
  // =========================================================

  const calculatedProjectStats = useMemo(() => {
    return projects.map((project) => {
      const projectTasks = getProjectTasks(project.id);

      const completed = projectTasks.filter((task) => task.completed);

      const overdue = projectTasks.filter(
        (task) =>
          !task.completed &&
          task.dueDate &&
          new Date(`${task.dueDate}T00:00:00`) <
            new Date(`${getToday()}T00:00:00`),
      );

      const progress =
        projectTasks.length > 0
          ? Math.round((completed.length / projectTasks.length) * 100)
          : project.status === "completed"
            ? 100
            : 0;

      return {
        id: project.id,
        total: projectTasks.length,
        completed: completed.length,
        overdue: overdue.length,
        progress,
      };
    });
  }, [projects, tasks]);

  // =========================================================
  // MERGE PROJECTS + STATS
  // =========================================================

  const displayProjects = useMemo(() => {
    const statsSource =
      projectStats.length > 0 ? projectStats : calculatedProjectStats;

    const statsMap = new Map(
      statsSource.map((project) => [String(project.id), project]),
    );

    return projects.map((project) => {
      const stats = statsMap.get(String(project.id));

      if (!stats) {
        return {
          ...project,
          total: 0,
          completed: 0,
          overdue: 0,
          progress: project.status === "completed" ? 100 : 0,
        };
      }

      return {
        ...project,
        ...stats,
        name: project.name || stats.name || stats.title || "Untitled Project",
      };
    });
  }, [projects, projectStats, calculatedProjectStats]);

  // =========================================================
  // OPEN PROJECT FROM URL
  // =========================================================

  useEffect(() => {
    const projectId = searchParams.get("project");

    if (!projectId) {
      return;
    }

    const project = projects.find(
      (item) => String(item.id) === String(projectId),
    );

    if (project) {
      setSelectedProject(project);
      setTaskFilter("all");

      if (typeof setProjectFilter === "function") {
        setProjectFilter(project.id);
      }
    }
  }, [searchParams, projects, setProjectFilter]);

  // =========================================================
  // KEEP SELECTED PROJECT UPDATED
  // =========================================================

  useEffect(() => {
    if (!selectedProject) return;

    const updatedProject = projects.find(
      (project) => String(project.id) === String(selectedProject.id),
    );

    if (updatedProject) {
      setSelectedProject(updatedProject);
    } else {
      setSelectedProject(null);
    }
  }, [projects]);

  // =========================================================
  // FILTER + SORT
  // =========================================================

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = displayProjects.filter((project) => {
      const name = getProjectName(project);
      const description = project.description || "";

      const matchesSearch =
        !query || `${name} ${description}`.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" || project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    return [...result].sort((a, b) => {
      if (sortBy === "progress") {
        return Number(b.progress || 0) - Number(a.progress || 0);
      }

      if (sortBy === "priority") {
        return getPriorityWeight(b.priority) - getPriorityWeight(a.priority);
      }

      if (sortBy === "deadline") {
        const aDeadline = a.deadline || a.dueDate;
        const bDeadline = b.deadline || b.dueDate;

        if (!aDeadline) return 1;
        if (!bDeadline) return -1;

        return new Date(aDeadline) - new Date(bDeadline);
      }

      if (sortBy === "name") {
        return getProjectName(a).localeCompare(getProjectName(b));
      }

      return 0;
    });
  }, [displayProjects, search, statusFilter, sortBy]);

  // =========================================================
  // DASHBOARD BREAKDOWN
  // =========================================================

  const projectBreakdown = useMemo(() => {
    return {
      active: projects.filter((project) => project.status === "active").length,
      paused: projects.filter((project) => project.status === "paused").length,
      completed: projects.filter(
        (project) => project.status === "completed",
      ).length,
    };
  }, [projects]);

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
      deadline: project.deadline || project.dueDate || "",
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
  // CREATE / UPDATE PROJECT
  // =========================================================

  const handleSubmit = (event) => {
    event.preventDefault();

    const name = form.name.trim();

    if (!name) return;

    const projectData = {
      name,
      description: form.description.trim(),
      priority: form.priority,
      status: form.status,
      color: form.color,
      deadline: form.deadline,
      dueDate: form.deadline,
    };

    if (editingProject) {
      updateProject?.(editingProject.id, projectData);
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

    if (selectedProject && String(selectedProject.id) === String(projectId)) {
      setSelectedProject(null);

      setSearchParams(
        {},
        {
          replace: true,
        },
      );
    }

    setDeleteProjectTarget(null);
    setOpenMenu(null);
  };

  // =========================================================
  // OPEN PROJECT
  // =========================================================

  const viewProjectTasks = (project) => {
    if (typeof setProjectFilter === "function") {
      setProjectFilter(project.id);
    }

    setSelectedProject(project);
    setTaskFilter("all");

    setSearchParams(
      {
        project: String(project.id),
      },
      {
        replace: false,
      },
    );

    navigate(
      `/project-manager?project=${encodeURIComponent(String(project.id))}`,
    );
  };

  // =========================================================
  // OPEN PROJECT IN TODOS
  // =========================================================

  const openProjectTasksPage = (project) => {
    if (typeof setProjectFilter === "function") {
      setProjectFilter(project.id);
    }

    navigate(`/todos?project=${encodeURIComponent(String(project.id))}`);
  };

  // =========================================================
  // OPEN SPECIFIC TASK
  // =========================================================

  const openTask = (task) => {
    if (task.projectId) {
      if (typeof setProjectFilter === "function") {
        setProjectFilter(task.projectId);
      }
    }

    navigate(`/todos?task=${encodeURIComponent(String(task.id))}`);
  };

  // =========================================================
  // CLOSE PROJECT
  // =========================================================

  const closeSelectedProject = () => {
    setSelectedProject(null);

    setSearchParams(
      {},
      {
        replace: true,
      },
    );
  };

  // =========================================================
  // OVERALL STATS
  // =========================================================

  const overallStats = useMemo(() => {
    const activeTasks = tasks.filter((task) => !task.archived);

    const completedTasks = activeTasks.filter((task) => task.completed);

    const overdueTasks = activeTasks.filter(
      (task) =>
        !task.completed &&
        task.dueDate &&
        new Date(`${task.dueDate}T00:00:00`) <
          new Date(`${getToday()}T00:00:00`),
    );

    const activeProjects = projects.filter(
      (project) => project.status !== "completed",
    );

    const averageProgress =
      displayProjects.length > 0
        ? Math.round(
            displayProjects.reduce(
              (sum, project) => sum + Number(project.progress || 0),
              0,
            ) / displayProjects.length,
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
    if (!selectedProject) {
      return [];
    }

    const projectTasks = getProjectTasks(selectedProject.id);

    if (taskFilter === "open") {
      return projectTasks.filter((task) => !task.completed);
    }

    if (taskFilter === "completed") {
      return projectTasks.filter((task) => task.completed);
    }

    if (taskFilter === "overdue") {
      return projectTasks.filter(
        (task) =>
          !task.completed &&
          task.dueDate &&
          new Date(`${task.dueDate}T00:00:00`) <
            new Date(`${getToday()}T00:00:00`),
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
        progress: 0,
      };
    }

    const projectTasks = getProjectTasks(selectedProject.id);

    const completed = projectTasks.filter((task) => task.completed);

    const overdue = projectTasks.filter(
      (task) =>
        !task.completed &&
        task.dueDate &&
        new Date(`${task.dueDate}T00:00:00`) <
          new Date(`${getToday()}T00:00:00`),
    );

    const progress =
      projectTasks.length > 0
        ? Math.round((completed.length / projectTasks.length) * 100)
        : selectedProject.status === "completed"
          ? 100
          : 0;

    return {
      total: projectTasks.length,
      completed: completed.length,
      open: projectTasks.length - completed.length,
      overdue: overdue.length,
      progress,
    };
  }, [selectedProject, tasks]);

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-7 pb-10">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="relative overflow-hidden rounded-[32px] border border-black/[0.06] bg-white p-6 shadow-sm dark:border-white/[0.06] dark:bg-[#171a17] sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#6f9473]/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#6f9473]">
              <FolderKanban size={15} />
              Workspace
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Project Manager
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-black/45 dark:text-white/45">
              Your central workspace for planning projects, tracking progress,
              managing deadlines, and keeping your work moving.
            </p>

            {projects.length > 0 && (
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <MiniPill
                  icon={<CircleDot size={12} />}
                  text={`${projectBreakdown.active} active`}
                  className="bg-blue-500/10 text-blue-500"
                />

                <MiniPill
                  icon={<Pause size={12} />}
                  text={`${projectBreakdown.paused} paused`}
                  className="bg-orange-500/10 text-orange-500"
                />

                <MiniPill
                  icon={<CheckCircle2 size={12} />}
                  text={`${projectBreakdown.completed} completed`}
                  className="bg-[#6f9473]/10 text-[#6f9473]"
                />
              </div>
            )}
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
      </div>

      {/* =====================================================
          STATS
      ===================================================== */}

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
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

      {/* =====================================================
          SEARCH / FILTER BAR
      ===================================================== */}

      <div className="rounded-[28px] border border-black/[0.06] bg-white p-4 shadow-sm dark:border-white/[0.06] dark:bg-[#171a17]">
        <div className="flex flex-col gap-3 xl:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30 dark:text-white/30"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search projects by name or description..."
              className="h-12 w-full rounded-2xl bg-[#f5f6f3] pl-11 pr-4 text-sm font-semibold outline-none transition focus:ring-2 focus:ring-[#6f9473]/20 dark:bg-white/[0.05] dark:text-white dark:placeholder:text-white/30"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
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
        </div>

        {(search || statusFilter !== "all") && (
          <div className="mt-3 flex items-center justify-between border-t border-black/[0.06] pt-3 dark:border-white/[0.06]">
            <p className="text-[10px] font-bold text-black/35 dark:text-white/35">
              Showing {filteredProjects.length} of {projects.length} projects
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
              }}
              className="text-[10px] font-black text-[#6f9473] hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* =====================================================
          PROJECTS
      ===================================================== */}

      {filteredProjects.length === 0 ? (
        <div className="rounded-[32px] border border-dashed border-black/10 bg-white p-12 text-center dark:border-white/10 dark:bg-[#171a17]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#6f9473]/10 text-[#6f9473]">
            <FolderKanban size={28} />
          </div>

          <h2 className="mt-5 text-xl font-black">
            {search || statusFilter !== "all"
              ? "No projects found"
              : "No projects yet"}
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-black/40 dark:text-white/40">
            {search || statusFilter !== "all"
              ? "Try changing your search or filters."
              : "Create your first project to start organizing your work."}
          </p>

          {!search && statusFilter === "all" && (
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
              projectColors[project.color] || projectColors.sage;

            const health = getProjectHealth(project);
            const HealthIcon = health.icon;

            const progress = Math.min(
              100,
              Math.max(0, Number(project.progress || 0)),
            );

            return (
              <div
                key={project.id}
                className="group relative overflow-hidden rounded-[30px] border border-black/[0.06] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/[0.06] dark:bg-[#171a17]"
              >
                <div className={`h-1.5 w-full ${color.background}`} />

                <div className="p-6">
                  {/* CARD HEADER */}

                  <div className="flex items-start justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => viewProjectTasks(project)}
                      className="flex min-w-0 items-center gap-3 text-left"
                    >
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${color.light} ${color.text}`}
                      >
                        <FolderKanban size={21} />
                      </div>

                      <div className="min-w-0">
                        <h2 className="truncate text-lg font-black transition group-hover:text-[#6f9473]">
                          {getProjectName(project)}
                        </h2>

                        <p className="mt-0.5 flex items-center gap-1.5 text-xs font-bold text-black/35 dark:text-white/35">
                          <ListTodo size={12} />
                          {project.total || 0}{" "}
                          {project.total === 1 ? "task" : "tasks"}
                        </p>
                      </div>
                    </button>

                    {/* MENU */}

                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenu(
                            openMenu === project.id ? null : project.id,
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-black/35 transition hover:bg-black/5 dark:text-white/35 dark:hover:bg-white/5"
                      >
                        <MoreHorizontal size={19} />
                      </button>

                      {openMenu === project.id && (
                        <div className="absolute right-0 top-11 z-30 w-48 overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-1.5 shadow-2xl dark:border-white/[0.06] dark:bg-[#202420]">
                          <button
                            type="button"
                            onClick={() => openEditModal(project)}
                            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-bold hover:bg-black/5 dark:hover:bg-white/5"
                          >
                            <Pencil size={15} />
                            Edit Project
                          </button>

                          <button
                            type="button"
                            onClick={() => viewProjectTasks(project)}
                            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-bold hover:bg-black/5 dark:hover:bg-white/5"
                          >
                            <ListTodo size={15} />
                            View Tasks
                          </button>

                          <button
                            type="button"
                            onClick={() => openProjectTasksPage(project)}
                            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-bold hover:bg-black/5 dark:hover:bg-white/5"
                          >
                            <ExternalLink size={15} />
                            Open in Todos
                          </button>

                          <div className="my-1 h-px bg-black/[0.06] dark:bg-white/[0.06]" />

                          <button
                            type="button"
                            onClick={() => requestDeleteProject(project)}
                            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-bold text-rose-500 hover:bg-rose-500/10"
                          >
                            <Trash2 size={15} />
                            Delete Project
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* DESCRIPTION */}

                  <p className="mt-5 min-h-[48px] text-sm leading-6 text-black/45 dark:text-white/45">
                    {project.description ||
                      "No project description added yet."}
                  </p>

                  {/* TAGS */}

                  <div className="mt-5 flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${getPriorityStyle(
                        project.priority,
                      )}`}
                    >
                      {project.priority || "Medium"} Priority
                    </span>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${getStatusStyle(
                        project.status,
                      )}`}
                    >
                      {project.status || "active"}
                    </span>

                    <span
                      className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${health.className}`}
                    >
                      <HealthIcon size={11} />
                      {health.label}
                    </span>
                  </div>

                  {/* PROGRESS */}

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

                      <span className="text-xs font-black">{progress}%</span>
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

                  {/* SMALL STATS */}

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

                  {/* DEADLINE */}

                  <div className="mt-5 flex min-h-[28px] items-center justify-between gap-3">
                    {project.deadline || project.dueDate ? (
                      <>
                        <div className="flex items-center gap-2 text-xs font-bold text-black/40 dark:text-white/40">
                          <CalendarDays size={14} />

                          {new Date(
                            `${project.deadline || project.dueDate}T00:00:00`,
                          ).toLocaleDateString(undefined, {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>

                        <span
                          className={`text-[10px] font-black ${
                            getDaysUntilDeadline(
                              project.deadline || project.dueDate,
                            ) < 0
                              ? "text-rose-500"
                              : getDaysUntilDeadline(
                                    project.deadline || project.dueDate,
                                  ) <= 3
                                ? "text-orange-500"
                                : "text-[#6f9473]"
                          }`}
                        >
                          {getDeadlineLabel(
                            project.deadline || project.dueDate,
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

                  {/* ACTIONS */}

                  <div className="mt-6 grid grid-cols-[1fr_auto] gap-2">
                    <button
                      type="button"
                      onClick={() => viewProjectTasks(project)}
                      className="flex items-center justify-center gap-2 rounded-2xl border border-black/[0.07] py-3 text-xs font-black transition hover:border-[#6f9473]/30 hover:bg-[#6f9473]/5 hover:text-[#6f9473] dark:border-white/[0.08]"
                    >
                      Open Project
                      <ArrowRight size={15} />
                    </button>

                    <button
                      type="button"
                      onClick={() => requestDeleteProject(project)}
                      className="flex h-full items-center justify-center rounded-2xl border border-rose-500/10 px-4 text-rose-500 transition hover:bg-rose-500/10"
                      aria-label="Delete project"
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
          SELECTED PROJECT WORKSPACE
      ===================================================== */}

      {selectedProject && (
        <div className="overflow-hidden rounded-[32px] border border-black/[0.06] bg-white shadow-sm dark:border-white/[0.06] dark:bg-[#171a17]">
          {/* WORKSPACE HEADER */}

          <div className="border-b border-black/[0.06] p-6 dark:border-white/[0.06] sm:p-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#6f9473]">
                  <Activity size={13} />
                  Project Workspace
                </div>

                <h2 className="mt-2 truncate text-2xl font-black">
                  {getProjectName(selectedProject)}
                </h2>

                <p className="mt-1 text-sm text-black/40 dark:text-white/40">
                  {selectedProject.description ||
                    "Project task overview"}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => openProjectTasksPage(selectedProject)}
                  className="flex items-center gap-2 rounded-xl bg-[#6f9473] px-4 py-2.5 text-xs font-black text-white shadow-lg shadow-[#6f9473]/15 hover:bg-[#5f8263]"
                >
                  <Plus size={14} />
                  New Task
                </button>

                <button
                  type="button"
                  onClick={() => openEditModal(selectedProject)}
                  className="flex items-center gap-2 rounded-xl border border-black/[0.07] px-4 py-2.5 text-xs font-black hover:bg-black/5 dark:border-white/[0.08] dark:hover:bg-white/5"
                >
                  <Pencil size={14} />
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => requestDeleteProject(selectedProject)}
                  className="flex items-center gap-2 rounded-xl bg-rose-500/10 px-4 py-2.5 text-xs font-black text-rose-500 hover:bg-rose-500/15"
                >
                  <Trash2 size={14} />
                  Delete
                </button>

                <button
                  type="button"
                  onClick={closeSelectedProject}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/5 text-black/40 hover:bg-black/10 dark:bg-white/5 dark:text-white/40"
                  aria-label="Close project"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* PROJECT PROGRESS */}

            <div className="mt-6 rounded-3xl bg-[#f5f6f3] p-5 dark:bg-white/[0.04]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-black/35 dark:text-white/35">
                    Project Progress
                  </p>

                  <p className="mt-1 text-2xl font-black">
                    {selectedAnalytics.progress}%
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#6f9473]/10 text-[#6f9473]">
                  <Target size={22} />
                </div>
              </div>

              <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-black/[0.07] dark:bg-white/[0.08]">
                <div
                  className="h-full rounded-full bg-[#6f9473] transition-all duration-500"
                  style={{
                    width: `${selectedAnalytics.progress}%`,
                  }}
                />
              </div>

              <div className="mt-2 flex items-center justify-between">
                <p className="text-[10px] font-bold text-black/30 dark:text-white/30">
                  {selectedAnalytics.completed} of{" "}
                  {selectedAnalytics.total} tasks completed
                </p>

                {selectedAnalytics.progress === 100 && (
                  <span className="flex items-center gap-1 text-[10px] font-black text-[#6f9473]">
                    <CheckCircle2 size={12} />
                    Complete
                  </span>
                )}
              </div>
            </div>

            {/* ANALYTICS */}

            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
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

          {/* TASK FILTERS */}

          <div className="flex flex-col gap-3 border-b border-black/[0.06] p-4 dark:border-white/[0.06] sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {[
                ["all", "All Tasks"],
                ["open", "Open"],
                ["completed", "Completed"],
                ["overdue", "Overdue"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTaskFilter(value)}
                  className={`rounded-xl px-4 py-2 text-xs font-black transition ${
                    taskFilter === value
                      ? "bg-[#6f9473] text-white shadow-sm"
                      : "bg-black/5 text-black/45 hover:bg-black/10 dark:bg-white/5 dark:text-white/45 dark:hover:bg-white/10"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => openProjectTasksPage(selectedProject)}
              className="flex items-center justify-center gap-2 rounded-xl border border-black/[0.07] px-4 py-2 text-xs font-black hover:bg-black/5 dark:border-white/[0.08] dark:hover:bg-white/5"
            >
              <LayoutList size={14} />
              Manage Tasks
            </button>
          </div>

          {/* TASK LIST */}

          <div className="space-y-2 p-6">
            {selectedProjectTasks.length === 0 ? (
              <div className="rounded-3xl bg-[#f5f6f3] p-10 text-center dark:bg-white/[0.04]">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#6f9473]/10 text-[#6f9473]">
                  <ListTodo size={25} />
                </div>

                <p className="mt-4 text-sm font-black">
                  {taskFilter === "all"
                    ? "No tasks in this project"
                    : taskFilter === "open"
                      ? "No open tasks"
                      : taskFilter === "completed"
                        ? "No completed tasks"
                        : "No overdue tasks"}
                </p>

                <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-black/35 dark:text-white/35">
                  {taskFilter === "all"
                    ? "Create a task from the Todos page and assign it to this project."
                    : "Try another task filter."}
                </p>

                {taskFilter === "all" && (
                  <button
                    type="button"
                    onClick={() => openProjectTasksPage(selectedProject)}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#6f9473] px-4 py-2.5 text-xs font-black text-white hover:bg-[#5f8263]"
                  >
                    <Plus size={14} />
                    Create Task
                  </button>
                )}
              </div>
            ) : (
              selectedProjectTasks.map((task) => {
                const taskOverdue =
                  !task.completed &&
                  task.dueDate &&
                  new Date(`${task.dueDate}T00:00:00`) <
                    new Date(`${getToday()}T00:00:00`);

                return (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => openTask(task)}
                    className="group flex w-full items-center gap-3 rounded-2xl bg-[#f5f6f3] p-4 text-left transition hover:bg-[#eef0eb] dark:bg-white/[0.04] dark:hover:bg-white/[0.07]"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        task.completed
                          ? "bg-[#6f9473]/10 text-[#6f9473]"
                          : taskOverdue
                            ? "bg-rose-500/10 text-rose-500"
                            : "bg-black/5 text-black/30 dark:bg-white/5 dark:text-white/30"
                      }`}
                    >
                      {task.completed ? (
                        <Check size={17} />
                      ) : taskOverdue ? (
                        <AlertTriangle size={17} />
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

                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] font-bold text-black/35 dark:text-white/35">
                        <span
                          className={`rounded-full px-2 py-0.5 ${getTaskStatusStyle(
                            task,
                          )}`}
                        >
                          {task.completed
                            ? "completed"
                            : task.status || "backlog"}
                        </span>

                        {task.dueDate && (
                          <span
                            className={
                              taskOverdue ? "font-black text-rose-500" : ""
                            }
                          >
                            Due {task.dueDate}
                          </span>
                        )}
                      </div>
                    </div>

                    {task.priority && (
                      <span
                        className={`hidden rounded-full px-2.5 py-1 text-[9px] font-black uppercase sm:block ${getPriorityStyle(
                          task.priority,
                        )}`}
                      >
                        {task.priority}
                      </span>
                    )}

                    <ArrowRight
                      size={16}
                      className="shrink-0 text-black/20 transition group-hover:translate-x-0.5 group-hover:text-[#6f9473] dark:text-white/20"
                    />
                  </button>
                );
              })
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
            if (event.target === event.currentTarget) {
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
                      {editingProject ? "Edit Project" : "New Project"}
                    </p>

                    <h2 className="mt-1 text-2xl font-black">
                      {editingProject
                        ? "Update project"
                        : "Create a project"}
                    </h2>

                    <p className="mt-1 text-xs text-black/40 dark:text-white/40">
                      Build your project and start tracking your work.
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

            <form onSubmit={handleSubmit} className="space-y-6 p-6 sm:p-8">
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
                      ? getDeadlineLabel(form.deadline)
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

              {/* QUICK COLORS */}

              <div>
                <p className="mb-3 text-[10px] font-black uppercase tracking-wider text-black/45 dark:text-white/45">
                  Quick Color
                </p>

                <div className="flex flex-wrap gap-3">
                  {Object.entries(projectColors).map(([key, color]) => (
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
                  ))}
                </div>
              </div>

              {/* LIVE PREVIEW */}

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
                      } ${projectColors[form.color]?.text}`}
                    >
                      <FolderKanban size={21} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-black">
                        {form.name.trim() || "Your project name"}
                      </p>

                      <p className="mt-1 truncate text-xs text-black/35 dark:text-white/35">
                        {form.description.trim() ||
                          "Your project description"}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1.5 text-[9px] font-black uppercase ${getPriorityStyle(
                        form.priority,
                      )}`}
                    >
                      {form.priority}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1.5 text-[9px] font-black uppercase ${getStatusStyle(
                        form.status,
                      )}`}
                    >
                      {form.status}
                    </span>

                    {form.deadline && (
                      <span className="flex items-center gap-1.5 rounded-full bg-black/5 px-3 py-1.5 text-[9px] font-black dark:bg-white/5">
                        <CalendarDays size={12} />

                        {new Date(
                          `${form.deadline}T00:00:00`,
                        ).toLocaleDateString(undefined, {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* FORM ACTIONS */}

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
          DELETE MODAL
      ===================================================== */}

      {deleteProjectTarget && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
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
                      "{getProjectName(deleteProjectTarget)}"
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
                  The project will be removed. Its tasks will not be deleted.
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
    <div className="rounded-3xl border border-black/[0.06] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/[0.06] dark:bg-[#171a17]">
      <div
        className={`mb-4 flex h-10 w-10 items-center justify-center rounded-2xl ${
          colors[color] || colors.sage
        }`}
      >
        {icon}
      </div>

      <p className="text-xs font-bold text-black/40 dark:text-white/40">
        {label}
      </p>

      <p className="mt-1 text-2xl font-black">{value}</p>

      <p className="mt-1 text-[10px] font-bold text-black/30 dark:text-white/30">
        {sub}
      </p>

      {progress !== undefined && (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-black/[0.06] dark:bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-[#6f9473] transition-all duration-500"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      )}
    </div>
  );
}

function MiniPill({ icon, text, className }) {
  return (
    <span
      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-black ${className}`}
    >
      {icon}
      {text}
    </span>
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

      <p className={`mt-1 text-lg font-black ${valueClass}`}>
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
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full appearance-none rounded-2xl bg-[#f5f6f3] px-4 pr-10 text-sm font-bold outline-none dark:bg-white/[0.05] dark:text-white sm:w-48"
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
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black/30 dark:text-white/30"
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