import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock3,
  FolderKanban,
  ListTodo,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useOutletContext } from "react-router-dom";

function Calendar() {
  const context = useOutletContext() || {};

  const {
    tasks = [],
    projects = [],
    toggleTask,
    updateTask,
  } = context;

  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const safeProjects = Array.isArray(projects) ? projects : [];

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formatDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const parseDate = (dateString) => {
    if (!dateString) return null;

    const date = new Date(`${dateString}T00:00:00`);

    return Number.isNaN(date.getTime()) ? null : date;
  };

  const getProject = (projectId) => {
    if (!projectId) return null;

    return (
      safeProjects.find(
        (project) => String(project.id) === String(projectId),
      ) || null
    );
  };

  const getProjectName = (projectId) => {
    const project = getProject(projectId);

    return project?.name || "No project";
  };

  const getProjectColor = (projectId) => {
    const project = getProject(projectId);

    if (project?.color) {
      if (project.color.startsWith?.("#")) {
        return project.color;
      }

      const colorMap = {
        sage: "#6f9473",
        blue: "#627b82",
        purple: "#765b6b",
        orange: "#b07b4d",
        rose: "#a85b5b",
        cyan: "#627b82",
      };

      return colorMap[project.color] || "#765b6b";
    }

    return "#765b6b";
  };

  const todayKey = formatDateKey(new Date());
  const selectedDateKey = formatDateKey(selectedDate);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const selectedDateLabel = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const getTasksForDate = (dateKey) => {
    return safeTasks
      .filter(
        (task) =>
          !task.archived &&
          task.dueDate &&
          task.dueDate === dateKey,
      )
      .sort((a, b) => {
        if (Boolean(a.completed) !== Boolean(b.completed)) {
          return a.completed ? 1 : -1;
        }

        return String(a.dueTime || "").localeCompare(
          String(b.dueTime || ""),
        );
      });
  };

  const isOverdue = (task) => {
    if (task.completed || !task.dueDate) return false;

    return task.dueDate < todayKey;
  };

  const getPriorityStyle = (priority) => {
    const styles = {
      high: {
        label: "High",
        className:
          "border-[#a85b5b]/20 bg-[#a85b5b]/10 text-[#8e4b4b] dark:text-[#d99a9a]",
      },
      medium: {
        label: "Medium",
        className:
          "border-[#b07b4d]/20 bg-[#b07b4d]/10 text-[#98683f] dark:text-[#d8aa7e]",
      },
      low: {
        label: "Low",
        className:
          "border-[#627b82]/20 bg-[#627b82]/10 text-[#526a70] dark:text-[#9bb1b7]",
      },
    };

    return (
      styles[String(priority || "medium").toLowerCase()] ||
      styles.medium
    );
  };

  const getEnergyStyle = (energy) => {
    const styles = {
      high: {
        label: "High energy",
        className:
          "border-[#765b6b]/20 bg-[#765b6b]/10 text-[#765b6b] dark:text-[#c7aebe]",
      },
      medium: {
        label: "Medium energy",
        className:
          "border-[#b07b4d]/20 bg-[#b07b4d]/10 text-[#98683f] dark:text-[#d8aa7e]",
      },
      low: {
        label: "Low energy",
        className:
          "border-[#627b82]/20 bg-[#627b82]/10 text-[#526a70] dark:text-[#9bb1b7]",
      },
    };

    return (
      styles[String(energy || "medium").toLowerCase()] ||
      styles.medium
    );
  };

  const getStatusLabel = (task) => {
    if (task.completed) return "Completed";

    if (isOverdue(task)) return "Overdue";

    return "Pending";
  };

  const getStatusStyle = (task) => {
    if (task.completed) {
      return "border-[#557a62]/20 bg-[#557a62]/10 text-[#557a62] dark:text-[#91b49b]";
    }

    if (isOverdue(task)) {
      return "border-[#a85b5b]/20 bg-[#a85b5b]/10 text-[#8e4b4b] dark:text-[#d99a9a]";
    }

    return "border-[#627b82]/20 bg-[#627b82]/10 text-[#526a70] dark:text-[#9bb1b7]";
  };

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startingDay = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const days = [];

    for (let index = 0; index < startingDay; index += 1) {
      days.push(null);
    }

    for (let day = 1; day <= totalDays; day += 1) {
      days.push(new Date(year, month, day));
    }

    while (days.length % 7 !== 0) {
      days.push(null);
    }

    return days;
  }, [year, month]);

  const selectedDateTasks = useMemo(
    () => getTasksForDate(selectedDateKey),
    [safeTasks, selectedDateKey],
  );

  const monthTasks = useMemo(() => {
    return safeTasks.filter((task) => {
      if (task.archived || !task.dueDate) return false;

      const date = parseDate(task.dueDate);

      if (!date) return false;

      return (
        date.getFullYear() === year &&
        date.getMonth() === month
      );
    });
  }, [safeTasks, year, month]);

  const monthCompleted = monthTasks.filter(
    (task) => task.completed,
  ).length;

  const monthPending = monthTasks.filter(
    (task) => !task.completed,
  ).length;

  const monthOverdue = monthTasks.filter(
    (task) => isOverdue(task),
  ).length;

  const todayTasks = getTasksForDate(todayKey);

  const todayCompleted = todayTasks.filter(
    (task) => task.completed,
  ).length;

  const todayPending = todayTasks.filter(
    (task) => !task.completed,
  ).length;

  const upcomingTasks = useMemo(() => {
    return safeTasks
      .filter(
        (task) =>
          !task.archived &&
          !task.completed &&
          task.dueDate &&
          task.dueDate >= todayKey,
      )
      .sort((a, b) => {
        const first = `${a.dueDate} ${a.dueTime || ""}`;
        const second = `${b.dueDate} ${b.dueTime || ""}`;

        return first.localeCompare(second);
      })
      .slice(0, 8);
  }, [safeTasks, todayKey]);

  const busiestDay = useMemo(() => {
    if (!monthTasks.length) return null;

    const counts = {};

    monthTasks.forEach((task) => {
      counts[task.dueDate] =
        (counts[task.dueDate] || 0) + 1;
    });

    const busiest = Object.entries(counts).sort(
      (a, b) => b[1] - a[1],
    )[0];

    if (!busiest) return null;

    const date = parseDate(busiest[0]);

    return {
      date,
      count: busiest[1],
    };
  }, [monthTasks]);

  const previousMonth = () => {
    setCurrentDate(
      (previous) =>
        new Date(
          previous.getFullYear(),
          previous.getMonth() - 1,
          1,
        ),
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      (previous) =>
        new Date(
          previous.getFullYear(),
          previous.getMonth() + 1,
          1,
        ),
    );
  };

  const goToday = () => {
    const today = new Date();

    setCurrentDate(today);
    setSelectedDate(today);
  };

  const handleSelectDate = (day) => {
    if (!day) return;

    setSelectedDate(day);
  };

  const handleToggleTask = (taskId) => {
    if (typeof toggleTask === "function") {
      toggleTask(taskId);
    }
  };

  const moveTaskToToday = (task) => {
    if (
      !task ||
      typeof updateTask !== "function"
    ) {
      return;
    }

    updateTask(task.id, {
      dueDate: todayKey,
    });

    setSelectedDate(new Date());
    setCurrentDate(new Date());
  };

  const formatTaskDate = (dateString) => {
    const date = parseDate(dateString);

    if (!date) return "No date";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatWeekday = (dateString) => {
    const date = parseDate(dateString);

    if (!date) return "";

    return date.toLocaleDateString("en-US", {
      weekday: "short",
    });
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 pb-10">
      {/* HEADER */}
      <section className="relative overflow-hidden rounded-[24px] border border-[#e2ddd5] bg-[#f6f4ef] p-6 shadow-sm dark:border-[#343934] dark:bg-[#1b1f1c] sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#765b6b]/10 blur-3xl dark:bg-[#765b6b]/15" />

        <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#765b6b] dark:text-[#c7aebe]">
              <CalendarDays size={15} />
              Planning & Scheduling
            </div>

            <h1 className="mt-3 text-3xl font-black tracking-tight text-[#292725] dark:text-white sm:text-4xl">
              Calendar
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-[#777169] dark:text-[#aaa69e]">
              See your workload clearly, plan around deadlines,
              and keep your day moving without losing track of
              the bigger picture.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={goToday}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#ded9d1] bg-white px-4 py-2.5 text-sm font-black text-[#292725] transition hover:-translate-y-0.5 hover:border-[#765b6b]/30 hover:text-[#765b6b] dark:border-[#343934] dark:bg-[#202420] dark:text-white dark:hover:text-[#c7aebe]"
            >
              <CalendarDays size={16} />
              Today
            </button>

            <button
              type="button"
              onClick={goToday}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#765b6b] px-4 py-2.5 text-sm font-black text-white shadow-[0_4px_0_#594451] transition hover:-translate-y-0.5 active:translate-y-0"
            >
              <Target size={16} />
              View Today
            </button>
          </div>
        </div>
      </section>

      {/* OVERVIEW */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-[#e2ddd5] bg-white p-5 shadow-sm dark:border-[#343934] dark:bg-[#1b1f1c]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-[#918b82]">
              This month
            </span>

            <ListTodo
              size={20}
              className="text-[#765b6b]"
            />
          </div>

          <p className="mt-5 text-3xl font-black text-[#292725] dark:text-white">
            {monthTasks.length}
          </p>

          <p className="mt-1 text-xs text-[#918b82] dark:text-[#888f88]">
            Scheduled tasks
          </p>
        </div>

        <div className="rounded-2xl border border-[#e2ddd5] bg-white p-5 shadow-sm dark:border-[#343934] dark:bg-[#1b1f1c]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-[#918b82]">
              Remaining
            </span>

            <Clock3
              size={20}
              className="text-[#627b82]"
            />
          </div>

          <p className="mt-5 text-3xl font-black text-[#292725] dark:text-white">
            {monthPending}
          </p>

          <p className="mt-1 text-xs text-[#918b82] dark:text-[#888f88]">
            Tasks to complete
          </p>
        </div>

        <div className="rounded-2xl border border-[#e2ddd5] bg-white p-5 shadow-sm dark:border-[#343934] dark:bg-[#1b1f1c]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-[#918b82]">
              Completed
            </span>

            <CheckCircle2
              size={20}
              className="text-[#557a62]"
            />
          </div>

          <p className="mt-5 text-3xl font-black text-[#292725] dark:text-white">
            {monthCompleted}
          </p>

          <p className="mt-1 text-xs text-[#918b82] dark:text-[#888f88]">
            Finished this month
          </p>
        </div>

        <div className="rounded-2xl border border-[#e2ddd5] bg-white p-5 shadow-sm dark:border-[#343934] dark:bg-[#1b1f1c]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-[#918b82]">
              Attention
            </span>

            <AlertTriangle
              size={20}
              className="text-[#a85b5b]"
            />
          </div>

          <p className="mt-5 text-3xl font-black text-[#292725] dark:text-white">
            {monthOverdue}
          </p>

          <p className="mt-1 text-xs text-[#918b82] dark:text-[#888f88]">
            Overdue tasks
          </p>
        </div>
      </section>

      {/* CALENDAR + SIDEBAR */}
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        {/* CALENDAR */}
        <div className="overflow-hidden rounded-[24px] border border-[#e2ddd5] bg-white shadow-sm dark:border-[#343934] dark:bg-[#1b1f1c]">
          <div className="flex flex-col gap-4 border-b border-[#eeeae4] p-5 dark:border-[#30352f] sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#918b82]">
                Monthly view
              </p>

              <h2 className="mt-1 text-xl font-black text-[#292725] dark:text-white">
                {monthName}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={previousMonth}
                aria-label="Previous month"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#ded9d1] bg-[#faf9f6] text-[#777169] transition hover:-translate-y-0.5 hover:border-[#765b6b]/30 hover:text-[#765b6b] dark:border-[#343934] dark:bg-[#151815] dark:text-[#aaa69e]"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                type="button"
                onClick={goToday}
                className="rounded-xl border border-[#ded9d1] bg-[#faf9f6] px-4 py-2 text-xs font-black text-[#777169] transition hover:border-[#765b6b]/30 hover:text-[#765b6b] dark:border-[#343934] dark:bg-[#151815] dark:text-[#aaa69e]"
              >
                Current
              </button>

              <button
                type="button"
                onClick={nextMonth}
                aria-label="Next month"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#ded9d1] bg-[#faf9f6] text-[#777169] transition hover:-translate-y-0.5 hover:border-[#765b6b]/30 hover:text-[#765b6b] dark:border-[#343934] dark:bg-[#151815] dark:text-[#aaa69e]"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 border-b border-[#eeeae4] dark:border-[#30352f]">
            {[
              "Sun",
              "Mon",
              "Tue",
              "Wed",
              "Thu",
              "Fri",
              "Sat",
            ].map((day) => (
              <div
                key={day}
                className="px-2 py-3 text-center text-[10px] font-black uppercase tracking-wider text-[#918b82]"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {calendarDays.map((day, index) => {
              if (!day) {
                return (
                  <div
                    key={`empty-${index}`}
                    className="min-h-[112px] border-b border-r border-[#eeeae4] bg-[#faf9f6]/60 dark:border-[#30352f] dark:bg-[#151815]/40 sm:min-h-[130px]"
                  />
                );
              }

              const dateKey = formatDateKey(day);
              const dayTasks = getTasksForDate(dateKey);
              const isToday = dateKey === todayKey;
              const isSelected =
                dateKey === selectedDateKey;

              const completedCount = dayTasks.filter(
                (task) => task.completed,
              ).length;

              const overdueCount = dayTasks.filter(
                (task) => isOverdue(task),
              ).length;

              return (
                <button
                  type="button"
                  key={dateKey}
                  onClick={() => handleSelectDate(day)}
                  className={[
                    "group min-h-[112px] border-b border-r border-[#eeeae4] p-2 text-left align-top transition dark:border-[#30352f] sm:min-h-[130px] sm:p-3",
                    isSelected
                      ? "bg-[#765b6b]/[0.06] dark:bg-[#765b6b]/10"
                      : "hover:bg-[#faf9f6] dark:hover:bg-[#202420]",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={[
                        "flex h-7 w-7 items-center justify-center rounded-lg text-xs font-black",
                        isToday
                          ? "bg-[#765b6b] text-white"
                          : isSelected
                            ? "bg-[#765b6b]/10 text-[#765b6b] dark:text-[#c7aebe]"
                            : "text-[#777169] dark:text-[#aaa69e]",
                      ].join(" ")}
                    >
                      {day.getDate()}
                    </span>

                    {dayTasks.length > 0 && (
                      <span className="text-[10px] font-black text-[#918b82]">
                        {dayTasks.length}
                      </span>
                    )}
                  </div>

                  <div className="mt-2 space-y-1.5">
                    {dayTasks.slice(0, 3).map((task) => (
                      <div
                        key={task.id}
                        className={[
                          "truncate rounded-md border px-1.5 py-1 text-[9px] font-bold",
                          task.completed
                            ? "border-[#557a62]/15 bg-[#557a62]/10 text-[#557a62] line-through dark:text-[#91b49b]"
                            : isOverdue(task)
                              ? "border-[#a85b5b]/15 bg-[#a85b5b]/10 text-[#8e4b4b] dark:text-[#d99a9a]"
                              : "border-[#765b6b]/10 bg-[#765b6b]/[0.06] text-[#765b6b] dark:text-[#c7aebe]",
                        ].join(" ")}
                      >
                        {task.title}
                      </div>
                    ))}

                    {dayTasks.length > 3 && (
                      <div className="px-1 text-[9px] font-black text-[#918b82]">
                        +{dayTasks.length - 3} more
                      </div>
                    )}
                  </div>

                  {(completedCount > 0 ||
                    overdueCount > 0) && (
                    <div className="mt-2 flex items-center gap-2 text-[9px] font-bold text-[#918b82]">
                      {completedCount > 0 && (
                        <span className="flex items-center gap-1 text-[#557a62]">
                          <CheckCircle2 size={10} />
                          {completedCount}
                        </span>
                      )}

                      {overdueCount > 0 && (
                        <span className="flex items-center gap-1 text-[#a85b5b]">
                          <AlertTriangle size={10} />
                          {overdueCount}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* SIDE SUMMARY */}
        <div className="space-y-4">
          <div className="rounded-[24px] border border-[#e2ddd5] bg-white p-5 shadow-sm dark:border-[#343934] dark:bg-[#1b1f1c]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#918b82]">
                  Today
                </p>

                <h3 className="mt-1 text-lg font-black text-[#292725] dark:text-white">
                  {todayPending} remaining
                </h3>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#557a62]/10 text-[#557a62]">
                <CheckCircle2 size={19} />
              </div>
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#ebe7e0] dark:bg-[#292e2a]">
              <div
                className="h-full rounded-full bg-[#557a62] transition-all"
                style={{
                  width:
                    todayTasks.length > 0
                      ? `${(todayCompleted / todayTasks.length) * 100}%`
                      : "0%",
                }}
              />
            </div>

            <div className="mt-2 flex justify-between text-[10px] font-bold text-[#918b82]">
              <span>{todayCompleted} completed</span>
              <span>{todayTasks.length} scheduled</span>
            </div>
          </div>

          <div className="rounded-[24px] border border-[#e2ddd5] bg-white p-5 shadow-sm dark:border-[#343934] dark:bg-[#1b1f1c]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#b07b4d]/10 text-[#b07b4d]">
                <TrendingUp size={19} />
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#918b82]">
                  Busiest day
                </p>

                <p className="mt-1 text-sm font-black text-[#292725] dark:text-white">
                  {busiestDay?.date
                    ? busiestDay.date.toLocaleDateString(
                        "en-US",
                        {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        },
                      )
                    : "No scheduled work"}
                </p>
              </div>
            </div>

            {busiestDay && (
              <p className="mt-4 text-xs text-[#777169] dark:text-[#aaa69e]">
                {busiestDay.count} scheduled{" "}
                {busiestDay.count === 1 ? "task" : "tasks"} on
                this day.
              </p>
            )}
          </div>

          <div className="rounded-[24px] border border-[#e2ddd5] bg-[#f6f4ef] p-5 shadow-sm dark:border-[#343934] dark:bg-[#202420]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#765b6b]/10 text-[#765b6b] dark:text-[#c7aebe]">
                <Target size={19} />
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#918b82]">
                  Planning
                </p>

                <p className="mt-1 text-sm font-black text-[#292725] dark:text-white">
                  {upcomingTasks.length} upcoming
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs leading-5 text-[#777169] dark:text-[#aaa69e]">
              Stay ahead by checking the next few deadlines
              before starting your day.
            </p>
          </div>
        </div>
      </section>

      {/* SELECTED DATE */}
      <section className="rounded-[24px] border border-[#e2ddd5] bg-white shadow-sm dark:border-[#343934] dark:bg-[#1b1f1c]">
        <div className="flex flex-col gap-4 border-b border-[#eeeae4] p-5 dark:border-[#30352f] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#918b82]">
              Selected date
            </p>

            <h2 className="mt-1 text-xl font-black text-[#292725] dark:text-white">
              {selectedDateLabel}
            </h2>
          </div>

          <span className="rounded-full border border-[#765b6b]/15 bg-[#765b6b]/10 px-3 py-1.5 text-xs font-black text-[#765b6b] dark:text-[#c7aebe]">
            {selectedDateTasks.length}{" "}
            {selectedDateTasks.length === 1
              ? "task"
              : "tasks"}
          </span>
        </div>

        {selectedDateTasks.length === 0 ? (
          <div className="p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#627b82]/10 text-[#627b82]">
              <CalendarDays size={22} />
            </div>

            <h3 className="mt-4 text-base font-black text-[#292725] dark:text-white">
              Nothing scheduled
            </h3>

            <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-[#918b82]">
              This date is clear. Use the extra space to focus
              on important work or schedule something new.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#eeeae4] dark:divide-[#30352f]">
            {selectedDateTasks.map((task) => {
              const priority = getPriorityStyle(task.priority);
              const energy = getEnergyStyle(task.energy);

              return (
                <div
                  key={task.id}
                  className="group flex flex-col gap-4 p-5 transition hover:bg-[#faf9f6] dark:hover:bg-[#202420] lg:flex-row lg:items-center"
                >
                  <button
                    type="button"
                    onClick={() =>
                      handleToggleTask(task.id)
                    }
                    className={[
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition",
                      task.completed
                        ? "border-[#557a62] bg-[#557a62] text-white"
                        : "border-[#d7d1c8] bg-white text-transparent hover:border-[#765b6b] dark:border-[#444a45] dark:bg-[#151815]",
                    ].join(" ")}
                    aria-label={
                      task.completed
                        ? "Mark task incomplete"
                        : "Complete task"
                    }
                  >
                    {task.completed ? (
                      <CheckCircle2 size={18} />
                    ) : (
                      <Circle
                        size={18}
                        className="text-[#aaa39a]"
                      />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3
                        className={[
                          "text-sm font-black",
                          task.completed
                            ? "text-[#918b82] line-through"
                            : "text-[#292725] dark:text-white",
                        ].join(" ")}
                      >
                        {task.title}
                      </h3>

                      <span
                        className={[
                          "rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-wider",
                          getStatusStyle(task),
                        ].join(" ")}
                      >
                        {getStatusLabel(task)}
                      </span>
                    </div>

                    {task.description && (
                      <p className="mt-1 line-clamp-1 text-xs text-[#918b82]">
                        {task.description}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {task.dueTime && (
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#777169] dark:text-[#aaa69e]">
                          <Clock3 size={12} />
                          {task.dueTime}
                        </span>
                      )}

                      <span
                        className={[
                          "rounded-full border px-2 py-1 text-[9px] font-black",
                          priority.className,
                        ].join(" ")}
                      >
                        {priority.label}
                      </span>

                      <span
                        className={[
                          "flex items-center gap-1 rounded-full border px-2 py-1 text-[9px] font-black",
                          energy.className,
                        ].join(" ")}
                      >
                        <Zap size={10} />
                        {energy.label}
                      </span>

                      {task.projectId && (
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#777169] dark:text-[#aaa69e]">
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{
                              backgroundColor:
                                getProjectColor(
                                  task.projectId,
                                ),
                            }}
                          />
                          {getProjectName(task.projectId)}
                        </span>
                      )}
                    </div>
                  </div>

                  {!task.completed &&
                    selectedDateKey !== todayKey && (
                      <button
                        type="button"
                        onClick={() =>
                          moveTaskToToday(task)
                        }
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[#ded9d1] bg-white px-3 py-2 text-xs font-black text-[#777169] transition hover:-translate-y-0.5 hover:border-[#765b6b]/30 hover:text-[#765b6b] dark:border-[#343934] dark:bg-[#202420] dark:text-[#aaa69e]"
                      >
                        Move to today
                      </button>
                    )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* UPCOMING */}
      <section className="rounded-[24px] border border-[#e2ddd5] bg-white shadow-sm dark:border-[#343934] dark:bg-[#1b1f1c]">
        <div className="border-b border-[#eeeae4] p-5 dark:border-[#30352f]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#627b82]/10 text-[#627b82] dark:text-[#9bb1b7]">
              <Clock3 size={19} />
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#918b82]">
                Upcoming deadlines
              </p>

              <h2 className="mt-1 text-xl font-black text-[#292725] dark:text-white">
                What's coming next
              </h2>
            </div>
          </div>
        </div>

        {upcomingTasks.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm font-bold text-[#777169] dark:text-[#aaa69e]">
              No upcoming deadlines.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#eeeae4] dark:divide-[#30352f]">
            {upcomingTasks.map((task) => {
              const priority = getPriorityStyle(
                task.priority,
              );

              return (
                <div
                  key={task.id}
                  className="flex flex-col gap-4 p-5 transition hover:bg-[#faf9f6] dark:hover:bg-[#202420] sm:flex-row sm:items-center"
                >
                  <div
                    className="h-12 w-1 shrink-0 rounded-full"
                    style={{
                      backgroundColor: getProjectColor(
                        task.projectId,
                      ),
                    }}
                  />

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-black text-[#292725] dark:text-white">
                      {task.title}
                    </h3>

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] font-bold text-[#918b82]">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays size={12} />
                        {formatWeekday(task.dueDate)},{" "}
                        {formatTaskDate(task.dueDate)}
                      </span>

                      {task.dueTime && (
                        <span className="flex items-center gap-1.5">
                          <Clock3 size={12} />
                          {task.dueTime}
                        </span>
                      )}

                      {task.projectId && (
                        <span className="flex items-center gap-1.5">
                          <FolderKanban size={12} />
                          {getProjectName(
                            task.projectId,
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={[
                        "rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-wider",
                        priority.className,
                      ].join(" ")}
                    >
                      {priority.label}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        handleToggleTask(task.id)
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#ded9d1] bg-white text-[#777169] transition hover:-translate-y-0.5 hover:border-[#557a62]/30 hover:text-[#557a62] dark:border-[#343934] dark:bg-[#202420] dark:text-[#aaa69e]"
                      aria-label="Complete task"
                    >
                      <CheckCircle2 size={17} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default Calendar;