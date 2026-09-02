import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock3,
  ListTodo,
  Target,
  TrendingUp,
  AlertTriangle,
  Play,
} from "lucide-react";

function TaskOverview() {
  const navigate = useNavigate();
  const context = useOutletContext() || {};

  const tasks = Array.isArray(context.tasks) ? context.tasks : [];
  const stats = context.stats || {};
  const startFocus = context.startFocus;

  const total = stats.total ?? tasks.length;
  const completed = stats.completed ?? tasks.filter((task) => task.completed).length;
  const pending =
    stats.pending ??
    tasks.filter((task) => !task.completed && !task.archived).length;
  const overdue = stats.overdue ?? 0;
  const today = stats.today ?? 0;

  const completionRate =
    stats.completionRate ??
    (total > 0 ? Math.round((completed / total) * 100) : 0);

  const safeCompletionRate = Math.min(
    100,
    Math.max(0, Number(completionRate) || 0),
  );

  const activeTasks = tasks.filter(
    (task) => !task.completed && !task.archived,
  );

  const completedTasks = tasks.filter(
    (task) => task.completed && !task.archived,
  );

  const priorityWeight = {
    high: 3,
    medium: 2,
    low: 1,
  };

  const getPriority = (priority) =>
    String(priority || "").toLowerCase();

  const getPriorityStyle = (priority) => {
    const value = getPriority(priority);

    if (value === "high") {
      return "bg-[#a85b5b]/10 text-[#9a4f4f] dark:bg-[#a85b5b]/15 dark:text-[#d58a8a]";
    }

    if (value === "medium") {
      return "bg-[#b07b4d]/10 text-[#9a693f] dark:bg-[#b07b4d]/15 dark:text-[#d39a6c]";
    }

    if (value === "low") {
      return "bg-[#627b82]/10 text-[#526d74] dark:bg-[#627b82]/15 dark:text-[#9bb2b7]";
    }

    return "bg-black/[0.045] text-black/45 dark:bg-white/[0.07] dark:text-white/45";
  };

  const getStatusStyle = (task) => {
    if (task.completed) {
      return "bg-[#557a62]/10 text-[#4f715a] dark:bg-[#557a62]/15 dark:text-[#91b19a]";
    }

    const status = String(task.status || "").toLowerCase();

    if (status.includes("progress")) {
      return "bg-[#765b6b]/10 text-[#765b6b] dark:bg-[#765b6b]/15 dark:text-[#b99ead]";
    }

    if (status.includes("review")) {
      return "bg-[#627b82]/10 text-[#526d74] dark:bg-[#627b82]/15 dark:text-[#9bb2b7]";
    }

    return "bg-black/[0.045] text-black/45 dark:bg-white/[0.07] dark:text-white/45";
  };

  const getDueLabel = (task) => {
    if (!task.dueDate) return null;

    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    const due = new Date(`${task.dueDate}T00:00:00`);

    if (Number.isNaN(due.getTime())) {
      return `Due ${task.dueDate}`;
    }

    const difference = Math.round(
      (due.getTime() - todayDate.getTime()) / 86400000,
    );

    if (difference < 0) {
      return "Overdue";
    }

    if (difference === 0) {
      return "Due today";
    }

    if (difference === 1) {
      return "Due tomorrow";
    }

    return `Due ${task.dueDate}`;
  };

  const sortedTasks = [...tasks]
    .sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      const priorityA = priorityWeight[getPriority(a.priority)] || 0;
      const priorityB = priorityWeight[getPriority(b.priority)] || 0;

      return priorityB - priorityA;
    });

  const statCards = [
    {
      label: "Total",
      value: total,
      icon: ListTodo,
      tone: "text-[#765b6b]",
      iconBg: "bg-[#765b6b]/10 dark:bg-[#765b6b]/15",
    },
    {
      label: "Completed",
      value: completed,
      icon: CheckCircle2,
      tone: "text-[#557a62]",
      iconBg: "bg-[#557a62]/10 dark:bg-[#557a62]/15",
    },
    {
      label: "Pending",
      value: pending,
      icon: Clock3,
      tone: "text-[#627b82]",
      iconBg: "bg-[#627b82]/10 dark:bg-[#627b82]/15",
    },
    {
      label: "Today",
      value: today,
      icon: Target,
      tone: "text-[#765b6b]",
      iconBg: "bg-[#765b6b]/10 dark:bg-[#765b6b]/15",
    },
    {
      label: "Overdue",
      value: overdue,
      icon: AlertTriangle,
      tone: "text-[#a85b5b]",
      iconBg: "bg-[#a85b5b]/10 dark:bg-[#a85b5b]/15",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-8">

      {/* =========================================================
          HEADER
      ========================================================= */}
      <section className="relative overflow-hidden rounded-[24px] border border-[#ded9d1] bg-[#eeeae3] p-6 dark:border-white/10 dark:bg-[#1b1f1c] sm:p-8">

        <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-[#765b6b]/10 blur-3xl" />

        <div className="relative">

          <button
            type="button"
            onClick={() => navigate("/todos")}
            className="mb-7 inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white/70 px-3.5 py-2 text-xs font-black text-black/65 transition hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-white/[0.06] dark:text-white/70 dark:hover:bg-white/[0.09]"
          >
            ← Back to Tasks
          </button>

          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">

            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#765b6b]">
                Productivity
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-[-0.03em] sm:text-4xl">
                Task Overview
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-black/50 dark:text-white/40">
                A clear view of your workload, progress, and the work
                that needs your attention.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/todos")}
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#765b6b] px-4 py-2.5 text-xs font-black text-white shadow-[0_8px_20px_rgba(118,91,107,0.16)] transition hover:-translate-y-0.5 hover:bg-[#674e5e]"
            >
              Manage Tasks
              <ArrowRight size={14} />
            </button>

          </div>
        </div>
      </section>

      {/* =========================================================
          STATISTICS
      ========================================================= */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">

        {statCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="group rounded-2xl border border-[#ded9d1] bg-white p-5 shadow-[0_4px_18px_rgba(40,34,30,0.035)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(40,34,30,0.06)] dark:border-white/10 dark:bg-[#171a17]"
            >
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-black/40 dark:text-white/35">
                  {stat.label}
                </p>

                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.iconBg}`}
                >
                  <Icon size={15} className={stat.tone} />
                </div>
              </div>

              <p className={`mt-4 text-3xl font-black tracking-tight ${stat.tone}`}>
                {stat.value}
              </p>
            </div>
          );
        })}

      </section>

      {/* =========================================================
          PROGRESS + WORKLOAD
      ========================================================= */}
      <section className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">

        {/* PROGRESS */}
        <div className="rounded-2xl border border-[#ded9d1] bg-white p-6 shadow-[0_4px_18px_rgba(40,34,30,0.035)] dark:border-white/10 dark:bg-[#171a17]">

          <div className="flex items-start justify-between gap-5">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#765b6b]/10 dark:bg-[#765b6b]/15">
                  <TrendingUp
                    size={15}
                    className="text-[#765b6b]"
                  />
                </div>

                <h2 className="font-black">
                  Overall Progress
                </h2>
              </div>

              <p className="mt-3 text-sm text-black/40 dark:text-white/35">
                Your current task completion rate.
              </p>
            </div>

            <span className="text-2xl font-black text-[#765b6b]">
              {safeCompletionRate}%
            </span>
          </div>

          <div className="mt-7">
            <div className="h-2.5 overflow-hidden rounded-full bg-black/[0.055] dark:bg-white/[0.08]">
              <div
                className="h-full rounded-full bg-[#765b6b] transition-all duration-700"
                style={{
                  width: `${safeCompletionRate}%`,
                }}
              />
            </div>

            <div className="mt-3 flex justify-between text-[11px] font-bold text-black/35 dark:text-white/30">
              <span>{completed} completed</span>
              <span>{pending} remaining</span>
            </div>
          </div>
        </div>

        {/* WORKLOAD */}
        <div className="rounded-2xl border border-[#ded9d1] bg-white p-6 shadow-[0_4px_18px_rgba(40,34,30,0.035)] dark:border-white/10 dark:bg-[#171a17]">

          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#627b82]/10 dark:bg-[#627b82]/15">
              <Target
                size={15}
                className="text-[#627b82]"
              />
            </div>

            <h2 className="font-black">
              Current Workload
            </h2>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">

            <div className="rounded-xl border border-black/[0.06] bg-[#f6f4ef] p-4 dark:border-white/10 dark:bg-[#202420]">
              <p className="text-[10px] font-black uppercase tracking-wider text-black/35 dark:text-white/30">
                Active
              </p>

              <p className="mt-2 text-2xl font-black">
                {activeTasks.length}
              </p>
            </div>

            <div className="rounded-xl border border-black/[0.06] bg-[#f6f4ef] p-4 dark:border-white/10 dark:bg-[#202420]">
              <p className="text-[10px] font-black uppercase tracking-wider text-black/35 dark:text-white/30">
                Finished
              </p>

              <p className="mt-2 text-2xl font-black text-[#557a62]">
                {completedTasks.length}
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* =========================================================
          TASKS
      ========================================================= */}
      <section className="rounded-2xl border border-[#ded9d1] bg-white p-5 shadow-[0_4px_18px_rgba(40,34,30,0.035)] dark:border-white/10 dark:bg-[#171a17] sm:p-6">

        <div className="flex flex-col justify-between gap-4 border-b border-black/[0.06] pb-5 dark:border-white/10 sm:flex-row sm:items-center">

          <div>
            <div className="flex items-center gap-2">
              <ListTodo
                size={18}
                className="text-[#765b6b]"
              />

              <h2 className="text-xl font-black">
                Your Tasks
              </h2>
            </div>

            <p className="mt-1.5 text-sm text-black/40 dark:text-white/35">
              All tasks currently in Lockin.
            </p>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-bold text-black/35 dark:text-white/30">
            <span>{tasks.length} total</span>
            <span>•</span>
            <span>{activeTasks.length} active</span>
          </div>

        </div>

        <div className="mt-4 space-y-2">

          {tasks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-black/10 bg-[#f6f4ef]/60 px-6 py-12 text-center dark:border-white/10 dark:bg-white/[0.02]">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#765b6b]/10 dark:bg-[#765b6b]/15">
                <ListTodo
                  size={20}
                  className="text-[#765b6b]"
                />
              </div>

              <p className="mt-4 font-black">
                Your workspace is empty
              </p>

              <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-black/40 dark:text-white/35">
                Create your first task and it will appear here
                with its progress and status.
              </p>

              <button
                type="button"
                onClick={() => navigate("/todos")}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#765b6b] px-4 py-2.5 text-xs font-black text-white transition hover:-translate-y-0.5 hover:bg-[#674e5e]"
              >
                Create a Task
                <ArrowRight size={14} />
              </button>

            </div>
          ) : (
            sortedTasks.map((task) => {
              const dueLabel = getDueLabel(task);
              const isOverdue = dueLabel === "Overdue";

              return (
                <div
                  key={task.id}
                  className="group flex flex-col gap-4 rounded-xl border border-black/[0.055] bg-white p-4 transition duration-200 hover:-translate-y-0.5 hover:border-[#765b6b]/20 hover:bg-[#fdfcf9] dark:border-white/[0.08] dark:bg-[#171a17] dark:hover:border-white/15 dark:hover:bg-[#1b1f1c] sm:flex-row sm:items-center sm:justify-between"
                >

                  {/* TASK INFO */}
                  <div className="min-w-0 flex-1">

                    <div className="flex items-start gap-3">

                      <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-black/[0.035] dark:bg-white/[0.06]">
                        {task.completed ? (
                          <CheckCircle2
                            size={15}
                            className="text-[#557a62]"
                          />
                        ) : (
                          <Circle
                            size={15}
                            className="text-[#765b6b]"
                          />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p
                          className={`truncate text-sm font-black ${
                            task.completed
                              ? "text-black/35 line-through dark:text-white/30"
                              : ""
                          }`}
                        >
                          {task.title || "Untitled task"}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-1.5">

                          <span
                            className={`rounded-md px-2 py-1 text-[10px] font-black ${getStatusStyle(
                              task,
                            )}`}
                          >
                            {task.completed
                              ? "Completed"
                              : task.status || "Backlog"}
                          </span>

                          {task.priority && (
                            <span
                              className={`rounded-md px-2 py-1 text-[10px] font-black ${getPriorityStyle(
                                task.priority,
                              )}`}
                            >
                              {task.priority}
                            </span>
                          )}

                          {dueLabel && (
                            <span
                              className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-black ${
                                isOverdue
                                  ? "bg-[#a85b5b]/10 text-[#9a4f4f] dark:bg-[#a85b5b]/15 dark:text-[#d58a8a]"
                                  : "bg-black/[0.045] text-black/40 dark:bg-white/[0.07] dark:text-white/40"
                              }`}
                            >
                              <CalendarDays size={10} />
                              {dueLabel}
                            </span>
                          )}

                        </div>
                      </div>

                    </div>

                  </div>

                  {/* ACTION */}
                  {!task.completed &&
                    typeof startFocus === "function" && (
                      <button
                        type="button"
                        onClick={() => startFocus(task)}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-[#557a62]/20 bg-[#557a62]/10 px-3.5 py-2 text-xs font-black text-[#4f715a] transition hover:-translate-y-0.5 hover:bg-[#557a62]/15 dark:border-[#557a62]/20 dark:bg-[#557a62]/10 dark:text-[#91b19a]"
                      >
                        <Play size={12} fill="currentColor" />
                        Focus
                      </button>
                    )}

                </div>
              );
            })
          )}

        </div>

        {/* FOOTER */}
        {tasks.length > 0 && (
          <div className="mt-5 flex justify-end border-t border-black/[0.06] pt-4 dark:border-white/10">
            <button
              type="button"
              onClick={() => navigate("/todos")}
              className="inline-flex items-center gap-1.5 text-xs font-black text-[#765b6b] transition hover:gap-2.5 dark:text-[#b99ead]"
            >
              View all tasks
              <ArrowRight size={13} />
            </button>
          </div>
        )}

      </section>
    </div>
  );
}

export default TaskOverview;