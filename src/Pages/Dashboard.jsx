import { useMemo } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  CheckCircle2,
  Circle,
  Clock3,
  FolderKanban,
  ListTodo,
  Plus,
  ArrowRight,
  AlertTriangle,
  Flame,
  Target,
  Zap,
  CalendarDays,
  TrendingUp,
} from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();

  const {
    tasks = [],
    projects = [],
    streak = {},
    xp = 0,
    level = 1,
    xpProgress = 0,
    energy = 100,
    addTask,
    toggleTask,
  } = useOutletContext();

  const safeTasks = Array.isArray(tasks)
    ? tasks
    : [];

  const safeProjects = Array.isArray(projects)
    ? projects
    : [];

  // =====================================================
  // TODAY
  // =====================================================

  const today = new Date();

  const todayString =
    `${today.getFullYear()}-` +
    `${String(today.getMonth() + 1).padStart(2, "0")}-` +
    `${String(today.getDate()).padStart(2, "0")}`;

  // =====================================================
  // TASK CALCULATIONS
  // =====================================================

  const completedTasks = safeTasks.filter(
    (task) => task.completed
  );

  const pendingTasks = safeTasks.filter(
    (task) =>
      !task.completed &&
      !task.archived
  );

  const highPriorityTasks =
    pendingTasks.filter(
      (task) =>
        task.priority === "High"
    );

  const todayTasks = pendingTasks.filter(
    (task) =>
      task.dueDate === todayString
  );

  // =====================================================
  // UPCOMING TASKS
  // =====================================================

  const upcomingTasks = useMemo(() => {
    return [...pendingTasks]
      .sort((a, b) => {
        if (
          !a.dueDate &&
          !b.dueDate
        ) {
          return 0;
        }

        if (!a.dueDate) {
          return 1;
        }

        if (!b.dueDate) {
          return -1;
        }

        return a.dueDate.localeCompare(
          b.dueDate
        );
      })
      .slice(0, 6);
  }, [pendingTasks]);

  // =====================================================
  // PROJECT CALCULATIONS
  // =====================================================

  const activeProjects =
    safeProjects.filter(
      (project) =>
        project.status !==
        "Completed"
    );

  // =====================================================
  // QUICK ADD
  // =====================================================

  const createQuickTask = () => {
    if (!addTask) {
      return;
    }

    addTask({
      title: "New task",
      description: "",
      priority: "Medium",
      dueDate: "",
      dueTime: "",
      tags: [],
      recurring: "None",
      energy: "Medium",
      progress: 0,
      subtasks: [],
      category: "",
      projectId: null,
      status: "backlog",
      dependencies: [],
    });

    navigate("/todos");
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "No deadline";
    }

    try {
      return new Date(
        `${date}T00:00:00`
      ).toLocaleDateString(
        undefined,
        {
          month: "short",
          day: "numeric",
        }
      );
    } catch {
      return date;
    }
  };

  // =====================================================
  // PRIORITY STYLE
  // =====================================================

  const priorityClass = (
    priority
  ) => {
    if (priority === "High") {
      return "bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400";
    }

    if (priority === "Medium") {
      return "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400";
    }

    return "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400";
  };

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      {/* HEADER */}

      <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#765b6b]">
            Your workspace
          </p>

          <h1 className="text-3xl font-black tracking-[-0.04em] text-[#292725] dark:text-white sm:text-4xl">
            Good to see you.
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-[#817b73] dark:text-[#aaa69e]">
            Manage your tasks, track
            your projects, and keep
            moving forward without
            losing focus.
          </p>
        </div>

        <button
          type="button"
          onClick={createQuickTask}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-2xl
            bg-[#765b6b]
            px-5
            py-3.5
            text-sm
            font-black
            text-white
            shadow-[0_4px_0_#543f4d]
            transition
            hover:-translate-y-0.5
            hover:bg-[#674e5e]
          "
        >
          <Plus size={18} />
          New Task
        </button>
      </section>

      {/* OVERVIEW */}

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-3xl border border-[#e0dcd5] bg-white p-5 dark:border-[#343934] dark:bg-[#1b1f1c]">
          <div className="flex items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0e9ee] text-[#765b6b] dark:bg-[#332a30]">
              <ListTodo size={19} />
            </div>

            <TrendingUp
              size={17}
              className="text-[#9b958c]"
            />
          </div>

          <p className="mt-5 text-[10px] font-black uppercase tracking-wider text-[#918b82]">
            Total Tasks
          </p>

          <p className="mt-1 text-3xl font-black text-[#292725] dark:text-white">
            {safeTasks.length}
          </p>
        </div>

        <div className="rounded-3xl border border-[#e0dcd5] bg-white p-5 dark:border-[#343934] dark:bg-[#1b1f1c]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
            <CheckCircle2 size={19} />
          </div>

          <p className="mt-5 text-[10px] font-black uppercase tracking-wider text-[#918b82]">
            Completed
          </p>

          <p className="mt-1 text-3xl font-black text-[#292725] dark:text-white">
            {completedTasks.length}
          </p>
        </div>

        <div className="rounded-3xl border border-[#e0dcd5] bg-white p-5 dark:border-[#343934] dark:bg-[#1b1f1c]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400">
            <CalendarDays size={19} />
          </div>

          <p className="mt-5 text-[10px] font-black uppercase tracking-wider text-[#918b82]">
            Due Today
          </p>

          <p className="mt-1 text-3xl font-black text-[#292725] dark:text-white">
            {todayTasks.length}
          </p>
        </div>

        <div className="rounded-3xl border border-[#e0dcd5] bg-white p-5 dark:border-[#343934] dark:bg-[#1b1f1c]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400">
            <AlertTriangle size={19} />
          </div>

          <p className="mt-5 text-[10px] font-black uppercase tracking-wider text-[#918b82]">
            High Priority
          </p>

          <p className="mt-1 text-3xl font-black text-[#292725] dark:text-white">
            {highPriorityTasks.length}
          </p>
        </div>
      </section>

      {/* MAIN GRID */}

      <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* TASKS */}

        <div className="rounded-[28px] border border-[#e0dcd5] bg-white p-5 dark:border-[#343934] dark:bg-[#1b1f1c] sm:p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-[#918b82]">
                Priority queue
              </p>

              <h2 className="mt-1 text-xl font-black text-[#292725] dark:text-white">
                My Tasks
              </h2>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/todos")
              }
              className="flex items-center gap-1 text-xs font-black text-[#765b6b] hover:underline"
            >
              View all
              <ArrowRight size={14} />
            </button>
          </div>

          {upcomingTasks.length ===
          0 ? (
            <div className="rounded-2xl border border-dashed border-[#d8d3ca] px-5 py-12 text-center dark:border-[#393d39]">
              <CheckCircle2
                size={30}
                className="mx-auto text-emerald-500"
              />

              <p className="mt-3 text-sm font-black text-[#292725] dark:text-white">
                Everything is under
                control.
              </p>

              <p className="mt-1 text-xs text-[#918b82]">
                You don't have any
                pending tasks.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {upcomingTasks.map(
                (task) => (
                  <div
                    key={task.id}
                    className="
                      group
                      flex
                      items-center
                      gap-3
                      rounded-2xl
                      border
                      border-[#ebe7e0]
                      bg-[#faf9f6]
                      p-3
                      transition
                      hover:border-[#d9ced6]
                      hover:bg-white
                      dark:border-[#303530]
                      dark:bg-[#161916]
                      dark:hover:bg-[#202520]
                    "
                  >
                    <button
                      type="button"
                      onClick={() =>
                        toggleTask?.(
                          task.id
                        )
                      }
                      className="shrink-0 text-[#aaa49c] transition hover:text-[#765b6b]"
                    >
                      <Circle size={21} />
                    </button>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-[#292725] dark:text-white">
                        {task.title ||
                          "Untitled task"}
                      </p>

                      <div className="mt-1 flex items-center gap-3">
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-[#918b82]">
                          <Clock3 size={11} />
                          {formatDate(
                            task.dueDate
                          )}
                        </span>

                        {task.projectId && (
                          <span className="flex items-center gap-1 text-[10px] font-semibold text-[#918b82]">
                            <FolderKanban
                              size={11}
                            />
                            Project
                          </span>
                        )}
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[9px] font-black ${priorityClass(
                        task.priority
                      )}`}
                    >
                      {task.priority ||
                        "Low"}
                    </span>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* PRODUCTIVITY */}

        <div className="space-y-6">
          <div className="rounded-[28px] bg-[#765b6b] p-6 text-white shadow-xl shadow-[#765b6b]/15">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">
                  Productivity level
                </p>

                <h2 className="mt-2 text-3xl font-black">
                  Level {level}
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                <Zap size={20} />
              </div>
            </div>

            <div className="mt-7">
              <div className="mb-2 flex justify-between text-xs">
                <span className="font-bold text-white/60">
                  XP Progress
                </span>

                <span className="font-black">
                  {xp} XP
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-white transition-all duration-700"
                  style={{
                    width: `${xpProgress}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-[#e0dcd5] bg-white p-6 dark:border-[#343934] dark:bg-[#1b1f1c]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-[#918b82]">
                  Current streak
                </p>

                <p className="mt-2 text-3xl font-black text-[#292725] dark:text-white">
                  {streak.current ||
                    0}

                  <span className="ml-2 text-sm text-[#918b82]">
                    days
                  </span>
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-500 dark:bg-orange-950/30">
                <Flame size={21} />
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-[#eeeae4] pt-4 dark:border-[#303530]">
              <span className="text-xs font-semibold text-[#918b82]">
                Best streak
              </span>

              <span className="text-sm font-black text-[#292725] dark:text-white">
                {streak.best ||
                  0}{" "}
                days
              </span>
            </div>
          </div>

          <div className="rounded-[28px] border border-[#e0dcd5] bg-white p-6 dark:border-[#343934] dark:bg-[#1b1f1c]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-[#918b82]">
                  Energy
                </p>

                <p className="mt-2 text-3xl font-black text-[#292725] dark:text-white">
                  {energy}%
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-yellow-50 text-yellow-600 dark:bg-yellow-950/30 dark:text-yellow-400">
                <Zap size={21} />
              </div>
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#eeeae4] dark:bg-[#303530]">
              <div
                className="h-full rounded-full bg-yellow-500 transition-all duration-500"
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(
                      0,
                      energy
                    )
                  )}%`,
                }}
              />
            </div>

            <p className="mt-3 text-xs font-medium text-[#918b82]">
              Complete tasks
              strategically to manage
              your energy.
            </p>
          </div>
        </div>
      </section>

      {/* PROJECTS */}

      <section className="rounded-[28px] border border-[#e0dcd5] bg-white p-5 dark:border-[#343934] dark:bg-[#1b1f1c] sm:p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-[#918b82]">
              Work management
            </p>

            <h2 className="mt-1 text-xl font-black text-[#292725] dark:text-white">
              Active Projects
            </h2>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/projects")
            }
            className="flex items-center gap-1 text-xs font-black text-[#765b6b] hover:underline"
          >
            Manage projects
            <ArrowRight size={14} />
          </button>
        </div>

        {activeProjects.length ===
        0 ? (
          <div className="rounded-2xl border border-dashed border-[#d8d3ca] py-10 text-center dark:border-[#393d39]">
            <FolderKanban
              size={28}
              className="mx-auto text-[#aaa49c]"
            />

            <p className="mt-3 text-sm font-black text-[#292725] dark:text-white">
              No active projects
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/projects")
              }
              className="mt-3 text-xs font-black text-[#765b6b] hover:underline"
            >
              Create a project
            </button>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {activeProjects
              .slice(0, 6)
              .map((project) => {
                const projectTasks =
                  safeTasks.filter(
                    (task) =>
                      task.projectId ===
                      project.id
                  );

                const completed =
                  projectTasks.filter(
                    (task) =>
                      task.completed
                  ).length;

                const projectProgress =
                  projectTasks.length ===
                  0
                    ? 0
                    : Math.round(
                        (completed /
                          projectTasks.length) *
                          100
                      );

                return (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() =>
                      navigate(
                        "/projects"
                      )
                    }
                    className="
                      rounded-2xl
                      border
                      border-[#ebe7e0]
                      bg-[#faf9f6]
                      p-4
                      text-left
                      transition
                      hover:-translate-y-0.5
                      hover:border-[#d9ced6]
                      hover:bg-white
                      dark:border-[#303530]
                      dark:bg-[#161916]
                      dark:hover:bg-[#202520]
                    "
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-[#292725] dark:text-white">
                          {project.name ||
                            project.title ||
                            "Untitled Project"}
                        </p>

                        <p className="mt-1 text-xs text-[#918b82]">
                          {completed} /{" "}
                          {
                            projectTasks.length
                          }{" "}
                          tasks
                        </p>
                      </div>

                      <FolderKanban
                        size={17}
                        className="shrink-0 text-[#765b6b]"
                      />
                    </div>

                    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#e9e5de] dark:bg-[#303530]">
                      <div
                        className="h-full rounded-full bg-[#765b6b]"
                        style={{
                          width: `${projectProgress}%`,
                        }}
                      />
                    </div>

                    <div className="mt-2 flex justify-between">
                      <span className="text-[10px] font-bold text-[#918b82]">
                        {project.status ||
                          "Not Started"}
                      </span>

                      <span className="text-[10px] font-black text-[#765b6b]">
                        {
                          projectProgress
                        }
                        %
                      </span>
                    </div>
                  </button>
                );
              })}
          </div>
        )}
      </section>

      {/* DAILY FOCUS */}

      <section className="rounded-[28px] border border-[#e0dcd5] bg-[#f2eee8] p-6 dark:border-[#343934] dark:bg-[#202420]">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#765b6b] shadow-sm dark:bg-[#171a17]">
              <Target size={22} />
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#918b82]">
                Daily focus
              </p>

              <h2 className="mt-1 text-lg font-black text-[#292725] dark:text-white">
                {todayTasks.length >
                0
                  ? `You have ${todayTasks.length} task${
                      todayTasks.length ===
                      1
                        ? ""
                        : "s"
                    } due today.`
                  : "No tasks are due today."}
              </h2>

              <p className="mt-1 text-xs text-[#817b73] dark:text-[#aaa69e]">
                Focus on the important
                work before moving to
                the next thing.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/todos")
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#292725] px-5 py-3 text-xs font-black text-white transition hover:bg-[#403c38] dark:bg-white dark:text-[#292725] dark:hover:bg-[#e8e8e8]"
          >
            Open task manager
            <ArrowRight size={15} />
          </button>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;