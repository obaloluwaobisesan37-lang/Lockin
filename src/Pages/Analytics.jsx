import React, { useMemo } from "react";
import {
  BarChart3,
  CheckCircle2,
  Clock3,
  Flame,
  Target,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { useOutletContext } from "react-router-dom";

function Analytics() {
  const {
    tasks = [],
    stats = {},
    streak = {},
    xp = 0,
    level = 1,
    projects = [],
    projectStats = [],
  } = useOutletContext();

  const analytics = useMemo(() => {
    const activeTasks = tasks.filter(
      (task) => !task.archived,
    );

    const completedTasks = activeTasks.filter(
      (task) => task.completed,
    );

    const totalEstimated = activeTasks.reduce(
      (sum, task) =>
        sum + (Number(task.estimatedMinutes) || 0),
      0,
    );

    const totalSpent = activeTasks.reduce(
      (sum, task) =>
        sum + (Number(task.timeSpent) || 0),
      0,
    );

    const highPriorityCompleted =
      completedTasks.filter(
        (task) => task.priority === "High",
      ).length;

    const overdue = activeTasks.filter(
      (task) => {
        if (!task.dueDate || task.completed) {
          return false;
        }

        return (
          new Date(`${task.dueDate}T00:00:00`) <
          new Date(
            `${new Date()
              .toISOString()
              .slice(0, 10)}T00:00:00`,
          )
        );
      },
    ).length;

    const categories = {};

    activeTasks.forEach((task) => {
      const category =
        task.category || "Uncategorized";

      if (!categories[category]) {
        categories[category] = {
          total: 0,
          completed: 0,
        };
      }

      categories[category].total++;

      if (task.completed) {
        categories[category].completed++;
      }
    });

    const categoryData = Object.entries(categories)
      .map(([name, value]) => ({
        name,
        ...value,
        progress:
          value.total === 0
            ? 0
            : Math.round(
                (value.completed / value.total) *
                  100,
              ),
      }))
      .sort((a, b) => b.total - a.total);

    return {
      activeTasks,
      completedTasks,
      totalEstimated,
      totalSpent,
      highPriorityCompleted,
      overdue,
      categoryData,
    };
  }, [tasks]);

  const completionRate =
    analytics.activeTasks.length === 0
      ? 0
      : Math.round(
          (analytics.completedTasks.length /
            analytics.activeTasks.length) *
            100,
        );

  const timeAccuracy =
    analytics.totalEstimated === 0
      ? 0
      : Math.min(
          100,
          Math.round(
            (analytics.totalSpent /
              analytics.totalEstimated) *
              100,
          ),
        );

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* HEADER */}
      <div>
        <p className="text-xs font-black uppercase tracking-[0.25em] text-[#6f9473]">
          Performance
        </p>

        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
          Analytics
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-black/50 dark:text-white/50">
          Understand how you work, where your time goes,
          and how consistently you complete your tasks.
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#171a17]">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#6f9473]/10 text-[#6f9473]">
              <Target size={21} />
            </div>

            <span className="text-xs font-black text-black/30 dark:text-white/30">
              COMPLETION
            </span>
          </div>

          <p className="mt-5 text-3xl font-black">
            {completionRate}%
          </p>

          <p className="mt-1 text-xs font-bold text-black/40 dark:text-white/40">
            Overall completion rate
          </p>
        </div>

        <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#171a17]">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
            <Flame size={21} />
          </div>

          <p className="mt-5 text-3xl font-black">
            {streak.current || 0}
          </p>

          <p className="mt-1 text-xs font-bold text-black/40 dark:text-white/40">
            Current day streak
          </p>
        </div>

        <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#171a17]">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
            <TrendingUp size={21} />
          </div>

          <p className="mt-5 text-3xl font-black">
            {xp}
          </p>

          <p className="mt-1 text-xs font-bold text-black/40 dark:text-white/40">
            Total XP · Level {level}
          </p>
        </div>

        <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#171a17]">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-500">
            <BarChart3 size={21} />
          </div>

          <p className="mt-5 text-3xl font-black">
            {analytics.totalSpent}m
          </p>

          <p className="mt-1 text-xs font-bold text-black/40 dark:text-white/40">
            Time recorded
          </p>
        </div>
      </div>

      {/* MAIN ANALYTICS */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* COMPLETION */}
        <div className="rounded-[30px] border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#171a17]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 size={21} />
            </div>

            <div>
              <h2 className="font-black">
                Completion performance
              </h2>

              <p className="text-xs font-bold text-black/35 dark:text-white/35">
                How much of your workload is finished
              </p>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center">
            <div
              className="relative flex h-52 w-52 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(#6f9473 ${completionRate}%, rgba(0,0,0,0.06) 0)`,
              }}
            >
              <div className="flex h-40 w-40 flex-col items-center justify-center rounded-full bg-white dark:bg-[#171a17]">
                <span className="text-4xl font-black">
                  {completionRate}%
                </span>

                <span className="mt-1 text-xs font-bold text-black/35 dark:text-white/35">
                  completed
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-black/[0.03] p-4 dark:bg-white/[0.04]">
              <p className="text-xs font-bold text-black/35 dark:text-white/35">
                Total
              </p>

              <p className="mt-1 text-xl font-black">
                {analytics.activeTasks.length}
              </p>
            </div>

            <div className="rounded-2xl bg-emerald-500/5 p-4">
              <p className="text-xs font-bold text-emerald-500/60">
                Done
              </p>

              <p className="mt-1 text-xl font-black text-emerald-500">
                {analytics.completedTasks.length}
              </p>
            </div>

            <div className="rounded-2xl bg-orange-500/5 p-4">
              <p className="text-xs font-bold text-orange-500/60">
                Overdue
              </p>

              <p className="mt-1 text-xl font-black text-orange-500">
                {analytics.overdue}
              </p>
            </div>
          </div>
        </div>

        {/* TIME */}
        <div className="rounded-[30px] border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#171a17]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
              <Clock3 size={21} />
            </div>

            <div>
              <h2 className="font-black">
                Time management
              </h2>

              <p className="text-xs font-bold text-black/35 dark:text-white/35">
                Estimated time vs actual time
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <div>
              <div className="mb-2 flex justify-between text-xs font-bold">
                <span className="text-black/40 dark:text-white/40">
                  Estimated
                </span>

                <span>
                  {analytics.totalEstimated} min
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
                <div
                  className="h-full rounded-full bg-blue-500"
                  style={{
                    width: "100%",
                  }}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex justify-between text-xs font-bold">
                <span className="text-black/40 dark:text-white/40">
                  Recorded
                </span>

                <span>
                  {analytics.totalSpent} min
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
                <div
                  className="h-full rounded-full bg-[#6f9473]"
                  style={{
                    width: `${timeAccuracy}%`,
                  }}
                />
              </div>
            </div>

            <div className="rounded-2xl bg-black/[0.03] p-5 dark:bg-white/[0.04]">
              <p className="text-xs font-bold text-black/40 dark:text-white/40">
                Time tracking accuracy
              </p>

              <p className="mt-2 text-3xl font-black">
                {timeAccuracy}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CATEGORY ANALYTICS */}
      <div className="rounded-[30px] border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#171a17]">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-500">
            <BarChart3 size={21} />
          </div>

          <div>
            <h2 className="font-black">
              Work by category
            </h2>

            <p className="text-xs font-bold text-black/35 dark:text-white/35">
              Which areas are taking most of your attention
            </p>
          </div>
        </div>

        {analytics.categoryData.length === 0 ? (
          <div className="py-12 text-center text-sm font-bold text-black/35 dark:text-white/35">
            Create tasks with categories to see analytics.
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            {analytics.categoryData.map(
              (category) => (
                <div key={category.name}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-black">
                      {category.name}
                    </span>

                    <span className="text-xs font-bold text-black/40 dark:text-white/40">
                      {category.completed}/
                      {category.total} ·{" "}
                      {category.progress}%
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
                    <div
                      className="h-full rounded-full bg-[#6f9473] transition-all"
                      style={{
                        width: `${category.progress}%`,
                      }}
                    />
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </div>

      {/* PROJECT PERFORMANCE */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-black">
            Project performance
          </h2>

          <p className="mt-1 text-sm font-bold text-black/40 dark:text-white/40">
            Compare progress across your projects.
          </p>
        </div>

        {projectStats.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-black/10 p-10 text-center text-sm font-bold text-black/40 dark:border-white/10 dark:text-white/40">
            No projects available.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {projectStats.map((project) => (
              <div
                key={project.id}
                className="rounded-3xl border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-[#171a17]"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-black">
                    {project.name ||
                      project.title ||
                      "Untitled"}
                  </h3>

                  <span className="text-sm font-black text-[#6f9473]">
                    {project.progress || 0}%
                  </span>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
                  <div
                    className="h-full rounded-full bg-[#6f9473]"
                    style={{
                      width: `${project.progress || 0}%`,
                    }}
                  />
                </div>

                <div className="mt-4 flex justify-between text-xs font-bold text-black/40 dark:text-white/40">
                  <span>
                    {project.completed || 0} completed
                  </span>

                  <span>
                    {project.total || 0} total
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* INSIGHT */}
      <div className="rounded-[30px] border border-[#6f9473]/20 bg-[#6f9473]/5 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#6f9473]/15 text-[#6f9473]">
            <TrendingUp size={21} />
          </div>

          <div>
            <h2 className="font-black">
              Productivity insight
            </h2>

            <p className="mt-2 text-sm leading-6 text-black/55 dark:text-white/55">
              {completionRate >= 80
                ? "Excellent work. You're completing most of the tasks you take on. Keep protecting your focus."
                : completionRate >= 50
                  ? "You're making solid progress. Try breaking large tasks into smaller steps to improve completion."
                  : "Focus on finishing a few important tasks before adding more. Consistency matters more than volume."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;