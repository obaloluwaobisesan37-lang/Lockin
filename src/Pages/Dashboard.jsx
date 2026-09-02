import { useMemo } from "react";
import {
  useNavigate,
  useOutletContext,
} from "react-router-dom";

import {
  ArrowRight,
  AlertTriangle,
  CalendarDays,
  Check,
  CheckCircle2,
  Circle,
  Clock3,
  Flame,
  FolderKanban,
  ListTodo,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";

import TaskForm from "../Components/TaskForm";

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

  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const safeProjects = Array.isArray(projects) ? projects : [];

  // =========================================================
  // TODAY
  // =========================================================

  const today = new Date();

  const todayString =
    `${today.getFullYear()}-` +
    `${String(today.getMonth() + 1).padStart(2, "0")}-` +
    `${String(today.getDate()).padStart(2, "0")}`;

  // =========================================================
  // TASK CALCULATIONS
  // =========================================================

  const completedTasks = safeTasks.filter(
    (task) => task.completed
  );

  const pendingTasks = safeTasks.filter(
    (task) =>
      !task.completed &&
      !task.archived
  );

  const highPriorityTasks = pendingTasks.filter(
    (task) => task.priority === "High"
  );

  const todayTasks = pendingTasks.filter(
    (task) => task.dueDate === todayString
  );

  const completionRate =
    safeTasks.length > 0
      ? Math.round(
          (completedTasks.length /
            safeTasks.length) *
            100
        )
      : 0;

  // =========================================================
  // UPCOMING TASKS
  // =========================================================

  const upcomingTasks = useMemo(() => {
    return [...pendingTasks]
      .sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;

        return a.dueDate.localeCompare(
          b.dueDate
        );
      })
      .slice(0, 6);
  }, [pendingTasks]);

  // =========================================================
  // PROJECTS
  // =========================================================

  const activeProjects = safeProjects.filter(
    (project) =>
      project.status !== "Completed" &&
      project.status !== "completed"
  );

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) return "No deadline";

    try {
      return new Date(
        `${date}T00:00:00`
      ).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
    } catch {
      return date;
    }
  };

  // =========================================================
  // PRIORITY
  // =========================================================

  const getPriorityStyle = (priority) => {
    if (priority === "High") {
      return {
        wrapper:
          "bg-[#f8e9ed] text-[#a84c60] dark:bg-[#351f26] dark:text-[#e29aaa]",
        dot: "bg-[#b95c70]",
      };
    }

    if (priority === "Medium") {
      return {
        wrapper:
          "bg-[#f7f0df] text-[#9b7435] dark:bg-[#352d1e] dark:text-[#d9b66c]",
        dot: "bg-[#c59643]",
      };
    }

    return {
      wrapper:
        "bg-[#eeece8] text-[#77716a] dark:bg-[#292d29] dark:text-[#aaa69e]",
      dot: "bg-[#918b82]",
    };
  };

  // =========================================================
  // PROJECT PROGRESS
  // =========================================================

  const getProjectProgress = (project) => {
    const projectTasks = safeTasks.filter(
      (task) => task.projectId === project.id
    );

    const completed = projectTasks.filter(
      (task) => task.completed
    ).length;

    const progress =
      projectTasks.length === 0
        ? 0
        : Math.round(
            (completed /
              projectTasks.length) *
              100
          );

    return {
      total: projectTasks.length,
      completed,
      progress,
    };
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div
      className="
        mx-auto
        w-full
        max-w-[1380px]
        space-y-8
        pb-8
      "
    >
      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        className="
          relative
          overflow-hidden
          rounded-[26px]
          border
          border-[#e2ddd5]
          bg-white
          px-5
          py-6
          sm:px-7
          sm:py-7
          lg:px-8
          dark:border-[#343934]
          dark:bg-[#1b1f1c]
        "
      >
        <div
          className="
            pointer-events-none
            absolute
            -right-20
            -top-24
            h-56
            w-56
            rounded-full
            bg-[#765b6b]/[0.045]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-28
            right-24
            h-48
            w-48
            rounded-full
            bg-[#627b82]/[0.035]
          "
        />

        <div
          className="
            relative
            flex
            flex-col
            gap-6
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          <div className="max-w-2xl">
            <div className="mb-3 flex items-center gap-2">
              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-[#765b6b]
                "
              />

              <p
                className="
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.22em]
                  text-[#765b6b]
                  dark:text-[#c9aebe]
                "
              >
                Your workspace
              </p>
            </div>

            <h1
              className="
                text-[30px]
                font-black
                leading-[1.05]
                tracking-[-0.045em]
                text-[#292725]
                sm:text-[38px]
                dark:text-white
              "
            >
              Good to see you.
            </h1>

            <p
              className="
                mt-3
                max-w-xl
                text-[13px]
                leading-6
                text-[#817b73]
                dark:text-[#aaa69e]
              "
            >
              Stay organized, protect your
              focus, and keep making progress
              on the work that matters.
            </p>
          </div>

          <div className="relative shrink-0">
            <TaskForm
              onAdd={(task) => {
                if (addTask) addTask(task);
              }}
              projects={safeProjects}
              tasks={safeTasks}
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          QUICK STATS
      ===================================================== */}

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {/* TOTAL */}
        <div
          className="
            group
            rounded-[22px]
            border
            border-[#e2ddd5]
            bg-white
            p-4
            shadow-[0_3px_12px_rgba(41,39,37,0.04)]
            transition-all
            duration-200
            hover:-translate-y-0.5
            hover:border-[#d6cbd2]
            hover:shadow-[0_8px_24px_rgba(41,39,37,0.07)]
            sm:p-5
            dark:border-[#343934]
            dark:bg-[#1b1f1c]
            dark:hover:border-[#49404a]
          "
        >
          <div className="flex items-center justify-between">
            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-[11px]
                bg-[#f0e9ee]
                text-[#765b6b]
                dark:bg-[#332a30]
                dark:text-[#c9aebe]
              "
            >
              <ListTodo size={17} />
            </div>

            <span className="text-[9px] font-black text-[#aaa49c]">
              ALL
            </span>
          </div>

          <p className="mt-5 text-[9px] font-black uppercase tracking-[0.16em] text-[#918b82]">
            Total tasks
          </p>

          <div className="mt-1 flex items-end justify-between">
            <p className="text-[27px] font-black tracking-[-0.04em] text-[#292725] dark:text-white">
              {safeTasks.length}
            </p>

            <TrendingUp
              size={16}
              className="mb-1 text-[#b0aaa2]"
            />
          </div>
        </div>

        {/* COMPLETED */}
        <div
          className="
            group
            rounded-[22px]
            border
            border-[#e2ddd5]
            bg-white
            p-4
            shadow-[0_3px_12px_rgba(41,39,37,0.04)]
            transition-all
            duration-200
            hover:-translate-y-0.5
            hover:border-[#d6cbd2]
            hover:shadow-[0_8px_24px_rgba(41,39,37,0.07)]
            sm:p-5
            dark:border-[#343934]
            dark:bg-[#1b1f1c]
            dark:hover:border-[#49404a]
          "
        >
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-[#edf3ee] text-[#557a62] dark:bg-[#26342a] dark:text-[#8db49a]">
              <CheckCircle2 size={17} />
            </div>

            <span className="text-[9px] font-black text-[#557a62]">
              {completionRate}%
            </span>
          </div>

          <p className="mt-5 text-[9px] font-black uppercase tracking-[0.16em] text-[#918b82]">
            Completed
          </p>

          <p className="mt-1 text-[27px] font-black tracking-[-0.04em] text-[#292725] dark:text-white">
            {completedTasks.length}
          </p>
        </div>

        {/* TODAY */}
        <div
          className="
            group
            rounded-[22px]
            border
            border-[#e2ddd5]
            bg-white
            p-4
            shadow-[0_3px_12px_rgba(41,39,37,0.04)]
            transition-all
            duration-200
            hover:-translate-y-0.5
            hover:border-[#d6cbd2]
            hover:shadow-[0_8px_24px_rgba(41,39,37,0.07)]
            sm:p-5
            dark:border-[#343934]
            dark:bg-[#1b1f1c]
            dark:hover:border-[#49404a]
          "
        >
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-[#f5efe2] text-[#9b7435] dark:bg-[#352d1e] dark:text-[#d9b66c]">
              <CalendarDays size={17} />
            </div>

            <span className="text-[9px] font-black uppercase tracking-wide text-[#aaa49c]">
              Today
            </span>
          </div>

          <p className="mt-5 text-[9px] font-black uppercase tracking-[0.16em] text-[#918b82]">
            Due today
          </p>

          <p className="mt-1 text-[27px] font-black tracking-[-0.04em] text-[#292725] dark:text-white">
            {todayTasks.length}
          </p>
        </div>

        {/* HIGH PRIORITY */}
        <div
          className="
            group
            rounded-[22px]
            border
            border-[#e2ddd5]
            bg-white
            p-4
            shadow-[0_3px_12px_rgba(41,39,37,0.04)]
            transition-all
            duration-200
            hover:-translate-y-0.5
            hover:border-[#d6cbd2]
            hover:shadow-[0_8px_24px_rgba(41,39,37,0.07)]
            sm:p-5
            dark:border-[#343934]
            dark:bg-[#1b1f1c]
            dark:hover:border-[#49404a]
          "
        >
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-[#f7eaed] text-[#a84c60] dark:bg-[#351f26] dark:text-[#e29aaa]">
              <AlertTriangle size={17} />
            </div>

            <span className="h-1.5 w-1.5 rounded-full bg-[#b95c70]" />
          </div>

          <p className="mt-5 text-[9px] font-black uppercase tracking-[0.16em] text-[#918b82]">
            High priority
          </p>

          <p className="mt-1 text-[27px] font-black tracking-[-0.04em] text-[#292725] dark:text-white">
            {highPriorityTasks.length}
          </p>
        </div>
      </section>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.75fr)]">
        {/* TASK QUEUE */}

        <div className="overflow-hidden rounded-[24px] border border-[#e2ddd5] bg-white shadow-[0_3px_12px_rgba(41,39,37,0.04)] dark:border-[#343934] dark:bg-[#1b1f1c]">
          <div className="flex items-end justify-between border-b border-[#ebe7e0] px-5 py-5 sm:px-6 dark:border-[#303530]">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#918b82]">
                Priority queue
              </p>

              <h2 className="mt-1 text-[20px] font-black tracking-[-0.025em] text-[#292725] dark:text-white">
                My Tasks
              </h2>
            </div>

            <button
              type="button"
              onClick={() => navigate("/todos")}
              className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wide text-[#765b6b] transition hover:text-[#594451] dark:text-[#c9aebe] dark:hover:text-white"
            >
              View all
              <ArrowRight size={13} />
            </button>
          </div>

          {upcomingTasks.length === 0 ? (
            <div className="px-5 py-14 text-center sm:px-6">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[15px] bg-[#edf3ee] text-[#557a62] dark:bg-[#26342a] dark:text-[#8db49a]">
                <Check size={21} />
              </div>

              <p className="mt-4 text-[13px] font-black text-[#292725] dark:text-white">
                Everything is under control.
              </p>

              <p className="mt-1 text-[11px] text-[#918b82]">
                You don't have any pending tasks right now.
              </p>
            </div>
          ) : (
            <div>
              {upcomingTasks.map((task, index) => {
                const priority = getPriorityStyle(
                  task.priority
                );

                return (
                  <div
                    key={task.id}
                    className="group flex items-center gap-3 border-b border-[#eeeae4] px-5 py-4 transition last:border-b-0 hover:bg-[#faf9f6] sm:px-6 dark:border-[#303530] dark:hover:bg-[#202520]"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        toggleTask?.(task.id)
                      }
                      aria-label={`Complete ${
                        task.title || "task"
                      }`}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#aaa49c] transition hover:bg-[#f0e9ee] hover:text-[#765b6b] dark:hover:bg-[#332a30] dark:hover:text-[#c9aebe]"
                    >
                      <Circle
                        size={20}
                        strokeWidth={1.8}
                      />
                    </button>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] font-bold text-[#292725] dark:text-white">
                        {task.title || "Untitled task"}
                      </p>

                      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="flex items-center gap-1 text-[9px] font-semibold text-[#918b82]">
                          <Clock3 size={10} />
                          {formatDate(task.dueDate)}
                        </span>

                        {task.projectId && (
                          <span className="flex items-center gap-1 text-[9px] font-semibold text-[#918b82]">
                            <FolderKanban size={10} />
                            Project
                          </span>
                        )}
                      </div>
                    </div>

                    <span
                      className={`hidden shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[8px] font-black uppercase tracking-wide sm:flex ${priority.wrapper}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${priority.dot}`}
                      />

                      {task.priority || "Low"}
                    </span>

                    <span className="text-[9px] font-black text-[#c1bbb3] sm:hidden">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* PRODUCTIVITY PANEL */}

        <div className="space-y-4">
          {/* LEVEL */}

          <div className="relative overflow-hidden rounded-[24px] bg-[#765b6b] p-6 text-white shadow-[0_16px_40px_rgba(118,91,107,0.13)]">
            <div className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full border border-white/10" />

            <div className="relative flex items-start justify-between gap-4">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/55">
                  Productivity level
                </p>

                <h2 className="mt-2 text-[30px] font-black tracking-[-0.04em]">
                  Level {level}
                </h2>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] border border-white/10 bg-white/10">
                <Zap size={18} />
              </div>
            </div>

            <div className="relative mt-7">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[9px] font-bold uppercase tracking-wide text-white/55">
                  XP progress
                </span>

                <span className="text-[10px] font-black">
                  {xp} XP
                </span>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-white transition-[width] duration-700 ease-out"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(0, xpProgress)
                    )}%`,
                  }}
                />
              </div>

              <div className="mt-2 flex justify-between">
                <span className="text-[8px] font-bold text-white/40">
                  Keep building
                </span>

                <span className="text-[8px] font-black text-white/55">
                  {Math.round(
                    Math.min(
                      100,
                      Math.max(0, xpProgress)
                    )
                  )}
                  %
                </span>
              </div>
            </div>
          </div>

          {/* STREAK */}

          <div className="rounded-[22px] border border-[#e2ddd5] bg-white p-5 shadow-[0_3px_12px_rgba(41,39,37,0.04)] dark:border-[#343934] dark:bg-[#1b1f1c]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#918b82]">
                  Current streak
                </p>

                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-[28px] font-black tracking-[-0.04em] text-[#292725] dark:text-white">
                    {streak.current || 0}
                  </span>

                  <span className="text-[10px] font-bold text-[#918b82]">
                    days
                  </span>
                </div>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#f6eee6] text-[#b26d3e] dark:bg-[#352920] dark:text-[#d99a6c]">
                <Flame size={19} />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-[#eeeae4] pt-3.5 dark:border-[#303530]">
              <span className="text-[10px] font-semibold text-[#918b82]">
                Best streak
              </span>

              <span className="text-[11px] font-black text-[#292725] dark:text-white">
                {streak.best || 0} days
              </span>
            </div>
          </div>

          {/* ENERGY */}

          <div className="rounded-[22px] border border-[#e2ddd5] bg-white p-5 shadow-[0_3px_12px_rgba(41,39,37,0.04)] dark:border-[#343934] dark:bg-[#1b1f1c]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#918b82]">
                  Energy
                </p>

                <p className="mt-2 text-[28px] font-black tracking-[-0.04em] text-[#292725] dark:text-white">
                  {Math.min(
                    100,
                    Math.max(0, energy)
                  )}

                  <span className="ml-1 text-[12px] text-[#918b82]">
                    %
                  </span>
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#f5efe2] text-[#9b7435] dark:bg-[#352d1e] dark:text-[#d9b66c]">
                <Zap size={18} />
              </div>
            </div>

            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#eeeae4] dark:bg-[#303530]">
              <div
                className="h-full rounded-full bg-[#b99048] transition-[width] duration-500"
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(0, energy)
                  )}%`,
                }}
              />
            </div>

            <p className="mt-3 text-[10px] leading-5 text-[#918b82]">
              Complete tasks strategically
              and protect your focus.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          PROJECTS
      ===================================================== */}

      <section className="overflow-hidden rounded-[24px] border border-[#e2ddd5] bg-white shadow-[0_3px_12px_rgba(41,39,37,0.04)] dark:border-[#343934] dark:bg-[#1b1f1c]">
        <div className="flex items-end justify-between border-b border-[#ebe7e0] px-5 py-5 sm:px-6 dark:border-[#303530]">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#918b82]">
              Work management
            </p>

            <h2 className="mt-1 text-[20px] font-black tracking-[-0.025em] text-[#292725] dark:text-white">
              Active Projects
            </h2>
          </div>

          <button
            type="button"
            onClick={() => navigate("/projects")}
            className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wide text-[#765b6b] transition hover:text-[#594451] dark:text-[#c9aebe] dark:hover:text-white"
          >
            Manage
            <ArrowRight size={13} />
          </button>
        </div>

        {activeProjects.length === 0 ? (
          <div className="px-5 py-12 text-center sm:px-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[15px] bg-[#f0e9ee] text-[#765b6b] dark:bg-[#332a30] dark:text-[#c9aebe]">
              <FolderKanban size={21} />
            </div>

            <p className="mt-4 text-[13px] font-black text-[#292725] dark:text-white">
              No active projects
            </p>

            <p className="mt-1 text-[10px] text-[#918b82]">
              Create a project to organize larger pieces of work.
            </p>

            <button
              type="button"
              onClick={() => navigate("/projects")}
              className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wide text-[#765b6b] hover:underline dark:text-[#c9aebe]"
            >
              Create a project
              <ArrowRight size={12} />
            </button>
          </div>
        ) : (
          <div className="grid gap-px bg-[#ebe7e0] md:grid-cols-2 xl:grid-cols-3 dark:bg-[#303530]">
            {activeProjects
              .slice(0, 6)
              .map((project) => {
                const {
                  total,
                  completed,
                  progress,
                } = getProjectProgress(project);

                return (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() =>
                      navigate("/projects")
                    }
                    className="group bg-white p-5 text-left transition hover:bg-[#faf9f6] dark:bg-[#1b1f1c] dark:hover:bg-[#202520]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate text-[12px] font-black text-[#292725] dark:text-white">
                          {project.name ||
                            project.title ||
                            "Untitled Project"}
                        </p>

                        <p className="mt-1 text-[9px] font-semibold text-[#918b82]">
                          {completed} of {total} tasks
                        </p>
                      </div>

                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[#f0e9ee] text-[#765b6b] transition group-hover:bg-[#765b6b] group-hover:text-white dark:bg-[#332a30] dark:text-[#c9aebe] dark:group-hover:bg-[#765b6b] dark:group-hover:text-white">
                        <FolderKanban size={14} />
                      </div>
                    </div>

                    <div className="mt-5 h-1 overflow-hidden rounded-full bg-[#e9e5de] dark:bg-[#303530]">
                      <div
                        className="h-full rounded-full bg-[#765b6b] transition-[width] duration-500"
                        style={{
                          width: `${progress}%`,
                        }}
                      />
                    </div>

                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="text-[9px] font-bold text-[#918b82]">
                        {project.status || "Not Started"}
                      </span>

                      <span className="text-[9px] font-black text-[#765b6b] dark:text-[#c9aebe]">
                        {progress}%
                      </span>
                    </div>
                  </button>
                );
              })}
          </div>
        )}
      </section>

      {/* =====================================================
          DAILY FOCUS
      ===================================================== */}

      <section className="rounded-[24px] border border-[#ded8cf] bg-[#f1ede6] px-5 py-6 shadow-[0_3px_12px_rgba(41,39,37,0.03)] sm:px-6 dark:border-[#343934] dark:bg-[#202420]">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] bg-white text-[#765b6b] shadow-sm dark:bg-[#171a17] dark:text-[#c9aebe]">
              <Target size={20} />
            </div>

            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#918b82]">
                Daily focus
              </p>

              <h2 className="mt-1 text-[16px] font-black tracking-[-0.02em] text-[#292725] dark:text-white">
                {todayTasks.length > 0
                  ? `You have ${
                      todayTasks.length
                    } task${
                      todayTasks.length === 1
                        ? ""
                        : "s"
                    } due today.`
                  : "No tasks are due today."}
              </h2>

              <p className="mt-1 text-[10px] leading-5 text-[#817b73] dark:text-[#aaa69e]">
                Focus on important work before moving to the next thing.
              </p>
            </div>
          </div>

          {/* VIEW TODAY */}

          <button
            type="button"
            onClick={() =>
              navigate("/todos?filter=today")
            }
            className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-[12px] bg-[#765b6b] px-5 text-[10px] font-black uppercase tracking-wide text-white transition hover:bg-[#624b59] dark:bg-[#c9aebe] dark:text-[#292725] dark:hover:bg-[#b99aaa]"
          >
            View today
            <ArrowRight size={14} />
          </button>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;