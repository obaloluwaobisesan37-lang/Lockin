import React from "react";
import {
  useNavigate,
  useOutletContext,
} from "react-router-dom";

function TaskOverview() {
  const navigate = useNavigate();

  const context = useOutletContext() || {};

  const tasks = Array.isArray(context.tasks)
    ? context.tasks
    : [];

  const stats = context.stats || {};

  const startFocus = context.startFocus;

  const total = stats.total ?? tasks.length;

  const completed = stats.completed ?? 0;

  const pending = stats.pending ?? 0;

  const overdue = stats.overdue ?? 0;

  const today = stats.today ?? 0;

  const completionRate =
    stats.completionRate ?? 0;

  return (
    <div className="mx-auto max-w-7xl space-y-6">

      {/* HEADER */}
      <div>
        <button
          type="button"
          onClick={() => navigate("/todos")}
          className="
            mb-5
            rounded-xl
            bg-[#765b6b]
            px-4
            py-2
            text-sm
            font-bold
            text-white
            transition
            hover:bg-[#674e5e]
          "
        >
          ← Back to Tasks
        </button>

        <p className="text-xs font-black uppercase tracking-[0.25em] text-[#765b6b]">
          Productivity
        </p>

        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
          Task Overview
        </h1>

        <p className="mt-2 text-sm text-black/40 dark:text-white/35">
          See how your tasks and productivity are progressing.
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

        {/* TOTAL */}
        <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#171a17]">
          <p className="text-xs font-bold uppercase tracking-wider text-black/40 dark:text-white/40">
            Total
          </p>

          <p className="mt-3 text-3xl font-black">
            {total}
          </p>
        </div>

        {/* COMPLETED */}
        <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#171a17]">
          <p className="text-xs font-bold uppercase tracking-wider text-black/40 dark:text-white/40">
            Completed
          </p>

          <p className="mt-3 text-3xl font-black text-[#4f6f52]">
            {completed}
          </p>
        </div>

        {/* PENDING */}
        <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#171a17]">
          <p className="text-xs font-bold uppercase tracking-wider text-black/40 dark:text-white/40">
            Pending
          </p>

          <p className="mt-3 text-3xl font-black">
            {pending}
          </p>
        </div>

        {/* TODAY */}
        <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#171a17]">
          <p className="text-xs font-bold uppercase tracking-wider text-black/40 dark:text-white/40">
            Today
          </p>

          <p className="mt-3 text-3xl font-black">
            {today}
          </p>
        </div>

        {/* OVERDUE */}
        <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#171a17]">
          <p className="text-xs font-bold uppercase tracking-wider text-black/40 dark:text-white/40">
            Overdue
          </p>

          <p className="mt-3 text-3xl font-black text-red-500">
            {overdue}
          </p>
        </div>
      </div>

      {/* PROGRESS */}
      <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#171a17]">

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black">
              Overall Progress
            </h2>

            <p className="mt-1 text-sm text-black/40 dark:text-white/35">
              Your current task completion rate.
            </p>
          </div>

          <span className="text-2xl font-black text-[#765b6b]">
            {completionRate}%
          </span>
        </div>

        <div className="mt-5 h-3 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
          <div
            className="h-full rounded-full bg-[#765b6b] transition-all duration-700"
            style={{
              width: `${Math.min(
                100,
                Math.max(0, completionRate)
              )}%`,
            }}
          />
        </div>
      </div>

      {/* TASK LIST */}
      <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#171a17]">

        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

          <div>
            <h2 className="text-xl font-black">
              Your Tasks
            </h2>

            <p className="mt-1 text-sm text-black/40 dark:text-white/35">
              All tasks currently in Lockin.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/todos")}
            className="
              rounded-xl
              bg-[#765b6b]
              px-4
              py-2
              text-xs
              font-black
              text-white
              transition
              hover:bg-[#674e5e]
            "
          >
            Manage Tasks
          </button>
        </div>

        <div className="mt-5 space-y-3">

          {tasks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-black/10 p-10 text-center dark:border-white/10">

              <p className="font-bold">
                You don't have any tasks yet.
              </p>

              <p className="mt-1 text-sm text-black/40 dark:text-white/35">
                Create your first task to see it here.
              </p>

              <button
                type="button"
                onClick={() => navigate("/todos")}
                className="
                  mt-4
                  rounded-xl
                  bg-[#765b6b]
                  px-5
                  py-2.5
                  text-sm
                  font-bold
                  text-white
                "
              >
                Create a Task
              </button>

            </div>
          ) : (

            tasks.map((task) => (
              <div
                key={task.id}
                className="
                  flex
                  flex-col
                  gap-4
                  rounded-2xl
                  border
                  border-black/5
                  p-4
                  transition
                  hover:bg-black/[0.02]
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                  dark:border-white/10
                  dark:hover:bg-white/[0.02]
                "
              >

                <div className="min-w-0">

                  <div className="flex items-center gap-3">

                    <div
                      className={`h-3 w-3 shrink-0 rounded-full ${
                        task.completed
                          ? "bg-[#4f6f52]"
                          : "bg-[#765b6b]"
                      }`}
                    />

                    <p
                      className={`truncate font-bold ${
                        task.completed
                          ? "text-black/40 line-through dark:text-white/30"
                          : ""
                      }`}
                    >
                      {task.title || "Untitled task"}
                    </p>

                  </div>

                  <div className="mt-2 flex flex-wrap gap-2">

                    <span className="rounded-lg bg-black/5 px-2 py-1 text-[10px] font-bold text-black/50 dark:bg-white/10 dark:text-white/40">
                      {task.completed
                        ? "Completed"
                        : task.status || "Backlog"}
                    </span>

                    {task.priority && (
                      <span className="rounded-lg bg-black/5 px-2 py-1 text-[10px] font-bold text-black/50 dark:bg-white/10 dark:text-white/40">
                        {task.priority}
                      </span>
                    )}

                    {task.dueDate && (
                      <span className="rounded-lg bg-black/5 px-2 py-1 text-[10px] font-bold text-black/50 dark:bg-white/10 dark:text-white/40">
                        Due: {task.dueDate}
                      </span>
                    )}

                  </div>

                </div>

                {!task.completed &&
                  typeof startFocus === "function" && (
                    <button
                      type="button"
                      onClick={() => startFocus(task)}
                      className="
                        shrink-0
                        rounded-xl
                        bg-[#4f6f52]
                        px-4
                        py-2
                        text-sm
                        font-bold
                        text-white
                        transition
                        hover:bg-[#405b43]
                      "
                    >
                      Focus
                    </button>
                  )}

              </div>
            ))

          )}

        </div>
      </div>

    </div>
  );
}

export default TaskOverview;
