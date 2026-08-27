import React, { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Circle,
  AlertTriangle,
  FolderKanban,
  Zap,
  ListTodo,
  Target,
} from "lucide-react";
import { useOutletContext } from "react-router-dom";

function Calendar() {
  const context = useOutletContext() || {};

  const { tasks = [], projects = [], toggleTask, updateTask } = context;

  const [currentDate, setCurrentDate] = useState(new Date());

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [selectedView, setSelectedView] = useState("month");

  // =========================================================
  // DATE HELPERS
  // =========================================================

  const formatDateKey = (date) => {
    if (!date) return "";

    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0",
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const parseDate = (dateString) => {
    if (!dateString) return null;

    const parts = dateString.split("-");

    if (parts.length !== 3) return null;

    const year = Number(parts[0]);
    const month = Number(parts[1]) - 1;
    const day = Number(parts[2]);

    return new Date(year, month, day);
  };

  const addDays = (date, amount) => {
    const result = new Date(date);
    result.setDate(result.getDate() + amount);
    return result;
  };

  const todayKey = formatDateKey(new Date());

  const selectedDateKey = formatDateKey(selectedDate);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleDateString("default", {
    month: "long",
    year: "numeric",
  });

  const selectedDateLabel = selectedDate.toLocaleDateString("default", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // =========================================================
  // PROJECT HELPERS
  // =========================================================

  const getProject = (projectId) => {
    if (!projectId) return null;

    return projects.find((project) => project.id === projectId);
  };

  const getProjectName = (projectId) => {
    const project = getProject(projectId);

    return project?.name || project?.title || "No project";
  };

  const getProjectColor = (projectId) => {
    const project = getProject(projectId);

    if (project?.color && typeof project.color === "string") {
      if (project.color.startsWith("#")) {
        return project.color;
      }

      const colors = {
        sage: "#6f9473",
        blue: "#3b82f6",
        purple: "#a855f7",
        orange: "#f97316",
        rose: "#f43f5e",
        cyan: "#06b6d4",
      };

      return colors[project.color] || "#6f9473";
    }

    return "#6f9473";
  };

  // =========================================================
  // TASK HELPERS
  // =========================================================

  const getTasksForDate = (dateKey) => {
    if (!dateKey) return [];

    return tasks.filter((task) => !task.archived && task.dueDate === dateKey);
  };

  const isOverdue = (task) => {
    if (!task?.dueDate) return false;

    return !task.completed && task.dueDate < todayKey;
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "High":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400";

      case "Medium":
        return "bg-orange-500/10 text-orange-600 dark:text-orange-400";

      case "Low":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400";

      default:
        return "bg-black/5 text-black/50 dark:bg-white/10 dark:text-white/50";
    }
  };

  const getEnergyClass = (energy) => {
    switch (energy) {
      case "High":
        return "text-rose-500";

      case "Medium":
        return "text-orange-500";

      case "Low":
        return "text-emerald-500";

      default:
        return "text-black/40 dark:text-white/40";
    }
  };

  const getStatusLabel = (task) => {
    if (task.completed) {
      return "Completed";
    }

    switch (task.status) {
      case "in-progress":
        return "In Progress";

      case "review":
        return "Review";

      case "done":
        return "Done";

      case "backlog":
      default:
        return "Backlog";
    }
  };

  const getStatusClass = (task) => {
    if (task.completed) {
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    }

    switch (task.status) {
      case "in-progress":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400";

      case "review":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400";

      default:
        return "bg-black/5 text-black/50 dark:bg-white/10 dark:text-white/50";
    }
  };

  // =========================================================
  // CALENDAR DAYS
  // =========================================================

  const days = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const result = [];

    for (let index = 0; index < firstDay; index++) {
      result.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      result.push(day);
    }

    return result;
  }, [year, month]);

  // =========================================================
  // SELECTED DATE TASKS
  // =========================================================

  const selectedDateTasks = useMemo(() => {
    return getTasksForDate(selectedDateKey).sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      if (a.dueTime && b.dueTime) {
        return a.dueTime.localeCompare(b.dueTime);
      }

      if (a.dueTime) return -1;
      if (b.dueTime) return 1;

      return 0;
    });
  }, [tasks, selectedDateKey]);

  // =========================================================
  // MONTH TASKS
  // =========================================================

  const monthTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (task.archived || !task.dueDate) {
        return false;
      }

      const date = parseDate(task.dueDate);

      if (!date) return false;

      return date.getFullYear() === year && date.getMonth() === month;
    });
  }, [tasks, year, month]);

  const monthCompleted = monthTasks.filter((task) => task.completed).length;

  const monthPending = monthTasks.length - monthCompleted;

  const monthOverdue = monthTasks.filter((task) => isOverdue(task)).length;

  // =========================================================
  // TODAY TASKS
  // =========================================================

  const todayTasks = useMemo(() => {
    return getTasksForDate(todayKey);
  }, [tasks, todayKey]);

  const todayCompleted = todayTasks.filter((task) => task.completed).length;

  const todayPending = todayTasks.length - todayCompleted;

  // =========================================================
  // UPCOMING DEADLINES
  // =========================================================

  const upcomingTasks = useMemo(() => {
    return tasks
      .filter((task) => !task.archived && !task.completed && task.dueDate)
      .sort((a, b) => {
        const dateA = parseDate(a.dueDate);

        const dateB = parseDate(b.dueDate);

        if (!dateA || !dateB) {
          return 0;
        }

        const dateDifference = dateA - dateB;

        if (dateDifference !== 0) {
          return dateDifference;
        }

        return (a.dueTime || "").localeCompare(b.dueTime || "");
      })
      .slice(0, 8);
  }, [tasks]);

  // =========================================================
  // TASK LOAD
  // =========================================================

  const busiestDay = useMemo(() => {
    if (monthTasks.length === 0) {
      return null;
    }

    const counts = {};

    monthTasks.forEach((task) => {
      counts[task.dueDate] = (counts[task.dueDate] || 0) + 1;
    });

    let highestDate = null;
    let highestCount = 0;

    Object.entries(counts).forEach(([date, count]) => {
      if (count > highestCount) {
        highestDate = date;
        highestCount = count;
      }
    });

    return {
      date: highestDate,
      count: highestCount,
    };
  }, [monthTasks]);

  // =========================================================
  // MONTH NAVIGATION
  // =========================================================

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToday = () => {
    const today = new Date();

    setCurrentDate(today);
    setSelectedDate(today);
  };

  // =========================================================
  // SELECT DATE
  // =========================================================

  const handleSelectDate = (day) => {
    if (!day) return;

    const clickedDate = new Date(year, month, day);

    setSelectedDate(clickedDate);
  };

  // =========================================================
  // COMPLETE TASK
  // =========================================================

  const handleToggleTask = (taskId) => {
    if (typeof toggleTask === "function") {
      toggleTask(taskId);
    }
  };

  // =========================================================
  // MOVE TASK TO TODAY
  // =========================================================

  const moveTaskToToday = (task) => {
    if (typeof updateTask !== "function" || !task) {
      return;
    }

    updateTask(task.id, {
      dueDate: todayKey,
    });
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#6f9473]">
            Planning & Scheduling
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            Calendar
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-black/40 dark:text-white/40">
            Plan deadlines, understand your workload, and keep track of what
            needs to get done.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={goToday}
            className="rounded-2xl border border-black/5 bg-white px-5 py-3 text-sm font-black shadow-sm transition hover:bg-black/5 dark:border-white/10 dark:bg-[#171a17] dark:hover:bg-white/5"
          >
            Today
          </button>

          <button
            type="button"
            onClick={() => setSelectedDate(new Date())}
            className="rounded-2xl bg-[#4f6f52] px-5 py-3 text-sm font-black text-white shadow-lg shadow-[#4f6f52]/20 transition hover:-translate-y-0.5 hover:bg-[#3f5d43]"
          >
            Plan Today
          </button>
        </div>
      </div>

      {/* =====================================================
          OVERVIEW
      ===================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#171a17]">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#6f9473]/10 text-[#6f9473]">
              <CalendarDays size={21} />
            </div>

            <span className="text-[10px] font-black uppercase tracking-wider text-black/30 dark:text-white/30">
              This month
            </span>
          </div>

          <p className="mt-5 text-3xl font-black">{monthTasks.length}</p>

          <p className="mt-1 text-xs font-bold text-black/40 dark:text-white/40">
            Scheduled tasks
          </p>
        </div>

        <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#171a17]">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
              <ListTodo size={21} />
            </div>

            <span className="text-[10px] font-black uppercase tracking-wider text-black/30 dark:text-white/30">
              Remaining
            </span>
          </div>

          <p className="mt-5 text-3xl font-black">{monthPending}</p>

          <p className="mt-1 text-xs font-bold text-black/40 dark:text-white/40">
            Tasks to complete
          </p>
        </div>

        <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#171a17]">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 size={21} />
            </div>

            <span className="text-[10px] font-black uppercase tracking-wider text-black/30 dark:text-white/30">
              Completed
            </span>
          </div>

          <p className="mt-5 text-3xl font-black">{monthCompleted}</p>

          <p className="mt-1 text-xs font-bold text-black/40 dark:text-white/40">
            Finished this month
          </p>
        </div>

        <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#171a17]">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
              <AlertTriangle size={21} />
            </div>

            <span className="text-[10px] font-black uppercase tracking-wider text-black/30 dark:text-white/30">
              Attention
            </span>
          </div>

          <p className="mt-5 text-3xl font-black">{monthOverdue}</p>

          <p className="mt-1 text-xs font-bold text-black/40 dark:text-white/40">
            Overdue tasks
          </p>
        </div>
      </div>

      {/* =====================================================
          CALENDAR
      ===================================================== */}

      <div className="overflow-hidden rounded-[32px] border border-black/5 bg-white shadow-sm dark:border-white/10 dark:bg-[#171a17]">
        {/* MONTH HEADER */}

        <div className="flex flex-col gap-4 border-b border-black/5 p-5 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={previousMonth}
              className="flex h-10 w-10 items-center justify-center rounded-xl transition hover:bg-black/5 dark:hover:bg-white/5"
              aria-label="Previous month"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-3">
              <CalendarDays size={20} className="text-[#6f9473]" />

              <h2 className="text-lg font-black sm:text-xl">{monthName}</h2>
            </div>

            <button
              type="button"
              onClick={nextMonth}
              className="flex h-10 w-10 items-center justify-center rounded-xl transition hover:bg-black/5 dark:hover:bg-white/5"
              aria-label="Next month"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-black/30 dark:text-white/30">
              {monthTasks.length} tasks
            </span>
          </div>
        </div>

        {/* WEEK DAYS */}

        <div className="grid grid-cols-7 border-b border-black/5 dark:border-white/10">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="p-3 text-center text-[10px] font-black uppercase tracking-wider text-black/35 dark:text-white/35 sm:p-4"
            >
              {day}
            </div>
          ))}
        </div>

        {/* DAYS */}

        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const key = day
              ? `${year}-${String(month + 1).padStart(2, "0")}-${String(
                  day,
                ).padStart(2, "0")}`
              : "";

            const dayTasks = getTasksForDate(key);

            const completedCount = dayTasks.filter(
              (task) => task.completed,
            ).length;

            const overdueCount = dayTasks.filter((task) =>
              isOverdue(task),
            ).length;

            const isToday = key === todayKey;

            const isSelected = key === selectedDateKey;

            return (
              <button
                key={index}
                type="button"
                disabled={!day}
                onClick={() => handleSelectDate(day)}
                className={`relative min-h-[125px] border-b border-r border-black/5 p-2 text-left transition dark:border-white/10 sm:min-h-[155px] sm:p-3 ${
                  !day
                    ? "cursor-default"
                    : "cursor-pointer hover:bg-[#6f9473]/5"
                } ${isSelected ? "bg-[#6f9473]/10" : ""}`}
              >
                {day && (
                  <>
                    <div className="flex items-center justify-between">
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-black ${
                          isToday
                            ? "bg-[#4f6f52] text-white"
                            : isSelected
                              ? "bg-[#6f9473] text-white"
                              : "text-black/50 dark:text-white/50"
                        }`}
                      >
                        {day}
                      </span>

                      {dayTasks.length > 0 && (
                        <span className="rounded-lg bg-[#6f9473]/10 px-1.5 py-1 text-[10px] font-black text-[#4f6f52] dark:text-[#9fbea2]">
                          {dayTasks.length}
                        </span>
                      )}
                    </div>

                    {dayTasks.length > 0 && (
                      <div className="mt-2 space-y-1.5">
                        {dayTasks.slice(0, 3).map((task) => {
                          const projectColor = getProjectColor(task.projectId);

                          return (
                            <span
                              key={task.id}
                              className={`block w-full truncate rounded-xl border-l-2 px-2 py-1.5 text-[10px] font-black ${
                                task.completed
                                  ? "bg-emerald-500/10 text-emerald-600 line-through"
                                  : isOverdue(task)
                                    ? "bg-rose-500/10 text-rose-600"
                                    : "bg-[#6f9473]/10 text-[#4f6f52] dark:text-[#9fbea2]"
                              }`}
                              style={{
                                borderLeftColor: projectColor,
                              }}
                              title={task.title}
                            >
                              {task.dueTime && (
                                <span className="mr-1 opacity-60">
                                  {task.dueTime}
                                </span>
                              )}
                              {task.title}
                            </span>
                          );
                        })}

                        {dayTasks.length > 3 && (
                          <p className="px-2 text-[9px] font-bold text-black/30 dark:text-white/30">
                            +{dayTasks.length - 3} more
                          </p>
                        )}

                        <div className="flex gap-1 px-1 pt-1">
                          {completedCount > 0 && (
                            <span className="text-[9px] font-black text-emerald-500">
                              {completedCount} done
                            </span>
                          )}

                          {overdueCount > 0 && (
                            <span className="text-[9px] font-black text-rose-500">
                              {overdueCount} late
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* =====================================================
          WORKLOAD SUMMARY
      ===================================================== */}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#171a17]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#6f9473]/10 text-[#6f9473]">
              <Target size={20} />
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-wider text-[#6f9473]">
                Today
              </p>

              <p className="text-sm font-black">{todayPending} remaining</p>
            </div>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
            <div
              className="h-full rounded-full bg-[#6f9473] transition-all"
              style={{
                width: `${
                  todayTasks.length === 0
                    ? 0
                    : Math.min(100, (todayCompleted / todayTasks.length) * 100)
                }%`,
              }}
            />
          </div>

          <p className="mt-2 text-xs font-bold text-black/35 dark:text-white/35">
            {todayCompleted} of {todayTasks.length} completed
          </p>
        </div>

        <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#171a17]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
              <Clock3 size={20} />
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-wider text-orange-500">
                Busiest day
              </p>

              <p className="text-sm font-black">
                {busiestDay ? `${busiestDay.count} tasks` : "No scheduled work"}
              </p>
            </div>
          </div>

          <p className="mt-4 text-xs font-bold text-black/35 dark:text-white/35">
            {busiestDay ? busiestDay.date : "Add deadlines to see workload"}
          </p>
        </div>

        <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#171a17]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
              <Zap size={20} />
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-wider text-blue-500">
                Planning
              </p>

              <p className="text-sm font-black">
                {upcomingTasks.length} upcoming
              </p>
            </div>
          </div>

          <p className="mt-4 text-xs font-bold text-black/35 dark:text-white/35">
            Next scheduled deadlines
          </p>
        </div>
      </div>

      {/* =====================================================
          SELECTED DATE
      ===================================================== */}

      <div className="rounded-[30px] border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#171a17]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#6f9473]/10 text-[#6f9473]">
              <CalendarDays size={20} />
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-wider text-[#6f9473]">
                Selected date
              </p>

              <h2 className="mt-1 font-black">{selectedDateLabel}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-black/40 dark:text-white/40">
            <span>{selectedDateTasks.length}</span>
            <span>scheduled</span>
          </div>
        </div>

        {selectedDateTasks.length > 0 ? (
          <div className="mt-6 space-y-3">
            {selectedDateTasks.map((task) => {
              const project = getProject(task.projectId);

              const projectColor = getProjectColor(task.projectId);

              return (
                <div
                  key={task.id}
                  className={`rounded-2xl border p-4 transition ${
                    isOverdue(task)
                      ? "border-rose-500/20 bg-rose-500/[0.03]"
                      : "border-black/5 bg-black/[0.03] dark:border-white/10 dark:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <button
                      type="button"
                      onClick={() => handleToggleTask(task.id)}
                      className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${
                        task.completed
                          ? "bg-emerald-500 text-white"
                          : "bg-white text-black/25 shadow-sm hover:bg-emerald-500/10 hover:text-emerald-500 dark:bg-[#202420] dark:text-white/25"
                      }`}
                      aria-label={
                        task.completed
                          ? "Mark task incomplete"
                          : "Complete task"
                      }
                    >
                      {task.completed ? (
                        <CheckCircle2 size={19} />
                      ) : (
                        <Circle size={19} />
                      )}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <p
                            className={`text-sm font-black ${
                              task.completed
                                ? "text-black/40 line-through dark:text-white/40"
                                : ""
                            }`}
                          >
                            {task.title}
                          </p>

                          {task.description && (
                            <p className="mt-1 line-clamp-2 text-xs font-medium text-black/40 dark:text-white/40">
                              {task.description}
                            </p>
                          )}
                        </div>

                        {isOverdue(task) && (
                          <span className="flex shrink-0 items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-1 text-[10px] font-black text-rose-600 dark:text-rose-400">
                            <AlertTriangle size={12} />
                            Overdue
                          </span>
                        )}
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {task.dueTime && (
                          <span className="flex items-center gap-1 rounded-full bg-black/5 px-2.5 py-1 text-[10px] font-black dark:bg-white/10">
                            <Clock3 size={11} />
                            {task.dueTime}
                          </span>
                        )}

                        {task.priority && (
                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-black ${getPriorityClass(
                              task.priority,
                            )}`}
                          >
                            {task.priority}
                          </span>
                        )}

                        {task.energy && (
                          <span
                            className={`flex items-center gap-1 rounded-full bg-black/5 px-2.5 py-1 text-[10px] font-black dark:bg-white/10 ${getEnergyClass(
                              task.energy,
                            )}`}
                          >
                            <Zap size={11} />
                            {task.energy}
                          </span>
                        )}

                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-black ${getStatusClass(
                            task,
                          )}`}
                        >
                          {getStatusLabel(task)}
                        </span>

                        {task.projectId && (
                          <span
                            className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black"
                            style={{
                              backgroundColor: `${projectColor}18`,
                              color: projectColor,
                            }}
                          >
                            <FolderKanban size={11} />
                            {project?.name || project?.title || "Project"}
                          </span>
                        )}
                      </div>

                      {!task.completed && updateTask && (
                        <button
                          type="button"
                          onClick={() => moveTaskToToday(task)}
                          className="mt-3 text-[10px] font-black text-[#6f9473] transition hover:underline"
                        >
                          Move to today
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-black/10 bg-black/[0.02] px-5 py-10 text-center dark:border-white/10 dark:bg-white/[0.02]">
            <CalendarDays
              size={30}
              className="mx-auto text-black/20 dark:text-white/20"
            />

            <p className="mt-3 text-sm font-black text-black/50 dark:text-white/50">
              No tasks scheduled for this day.
            </p>

            <p className="mt-1 text-xs font-bold text-black/30 dark:text-white/30">
              Select another date to see its tasks.
            </p>
          </div>
        )}
      </div>

      {/* =====================================================
          UPCOMING DEADLINES
      ===================================================== */}

      <div className="rounded-[30px] border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#171a17]">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#6f9473]/10 text-[#6f9473]">
              <Clock3 size={20} />
            </div>

            <div>
              <h2 className="font-black">Upcoming deadlines</h2>

              <p className="text-xs font-bold text-black/35 dark:text-white/35">
                Your next scheduled tasks
              </p>
            </div>
          </div>

          <span className="hidden rounded-full bg-black/5 px-3 py-1 text-[10px] font-black dark:bg-white/10 sm:block">
            Next 8
          </span>
        </div>

        <div className="mt-6 space-y-3">
          {upcomingTasks.map((task) => {
            const projectColor = getProjectColor(task.projectId);

            return (
              <div
                key={task.id}
                className="flex items-center gap-4 rounded-2xl bg-black/[0.03] p-4 dark:bg-white/[0.04]"
              >
                <div
                  className="h-10 w-1 shrink-0 rounded-full"
                  style={{
                    backgroundColor: projectColor,
                  }}
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black">{task.title}</p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="text-xs font-bold text-black/35 dark:text-white/35">
                      Due {task.dueDate}
                      {task.dueTime ? ` · ${task.dueTime}` : ""}
                    </span>

                    {task.priority && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-black ${getPriorityClass(
                          task.priority,
                        )}`}
                      >
                        {task.priority}
                      </span>
                    )}

                    {task.projectId && (
                      <span className="text-[10px] font-black text-black/30 dark:text-white/30">
                        {getProjectName(task.projectId)}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleTask(task.id)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-black/30 transition hover:bg-emerald-500/10 hover:text-emerald-500 dark:text-white/30"
                  aria-label="Complete task"
                >
                  <CheckCircle2 size={18} />
                </button>
              </div>
            );
          })}

          {upcomingTasks.length === 0 && (
            <p className="py-8 text-center text-sm font-bold text-black/35 dark:text-white/35">
              No upcoming deadlines.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Calendar;
