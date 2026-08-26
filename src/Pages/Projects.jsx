import React from "react";
import {
  FolderKanban,
  Plus,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { useNavigate, useOutletContext } from "react-router-dom";

function Projects() {
  const navigate = useNavigate();

  const {
    projectStats = [],
    projects = [],
    tasks = [],
  } = useOutletContext();

  // =========================================================
  // PROJECT COLORS
  // =========================================================

  const projectColors = {
    sage: "#6f9473",
    blue: "#3b82f6",
    purple: "#a855f7",
    orange: "#f97316",
    rose: "#f43f5e",
    cyan: "#06b6d4",
  };

  const getProjectColor = (project, index) => {
    const color = project?.color;

    // Supports the project color keys used by ProjectManager
    if (projectColors[color]) {
      return projectColors[color];
    }

    // Also supports an existing hex color
    if (
      typeof color === "string" &&
      color.startsWith("#")
    ) {
      return color;
    }

    const fallbackColors = [
      "#6f9473",
      "#7b8fd6",
      "#c58b62",
      "#9a7bb5",
      "#5d91a6",
    ];

    return fallbackColors[
      index % fallbackColors.length
    ];
  };

  // =========================================================
  // STATS
  // =========================================================

  const activeTasks = tasks.filter(
    (task) => !task.archived,
  );

  const totalTasks = activeTasks.length;

  const completedTasks = activeTasks.filter(
    (task) => task.completed,
  ).length;

  const activeTaskCount =
    totalTasks - completedTasks;

  const overdueTasks = projectStats.reduce(
    (total, project) =>
      total + Number(project.overdue || 0),
    0,
  );

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* HEADER */}

      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#6f9473]">
            Workspace
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            Projects
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-black/50 dark:text-white/50">
            Organize your tasks into projects and track
            progress from one place.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate("/project-manager")
          }
          className="flex items-center justify-center gap-2 rounded-2xl bg-[#4f6f52] px-5 py-3 text-sm font-black text-white shadow-lg shadow-[#4f6f52]/20 transition hover:-translate-y-0.5 hover:bg-[#3f5d43]"
        >
          <Plus size={18} />
          Manage Projects
        </button>
      </div>

      {/* OVERVIEW */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#171a17]">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#6f9473]/10 text-[#6f9473]">
              <FolderKanban size={21} />
            </div>

            <span className="text-xs font-bold text-black/30 dark:text-white/30">
              TOTAL
            </span>
          </div>

          <p className="mt-5 text-3xl font-black">
            {projects.length}
          </p>

          <p className="mt-1 text-xs font-bold text-black/40 dark:text-white/40">
            Projects
          </p>
        </div>

        <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#171a17]">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
            <Clock3 size={21} />
          </div>

          <p className="mt-5 text-3xl font-black">
            {activeTaskCount}
          </p>

          <p className="mt-1 text-xs font-bold text-black/40 dark:text-white/40">
            Active tasks
          </p>
        </div>

        <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#171a17]">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 size={21} />
          </div>

          <p className="mt-5 text-3xl font-black">
            {completedTasks}
          </p>

          <p className="mt-1 text-xs font-bold text-black/40 dark:text-white/40">
            Completed tasks
          </p>
        </div>

        <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#171a17]">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
            <AlertTriangle size={21} />
          </div>

          <p className="mt-5 text-3xl font-black">
            {overdueTasks}
          </p>

          <p className="mt-1 text-xs font-bold text-black/40 dark:text-white/40">
            Overdue tasks
          </p>
        </div>
      </div>

      {/* PROJECT GRID */}

      {projectStats.length === 0 ? (
        <div className="rounded-[32px] border border-dashed border-black/10 bg-white p-12 text-center dark:border-white/10 dark:bg-[#171a17]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#6f9473]/10 text-[#6f9473]">
            <FolderKanban size={28} />
          </div>

          <h2 className="mt-5 text-xl font-black">
            No projects yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-black/45 dark:text-white/45">
            Create your first project to start organizing
            your work.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/project-manager")
            }
            className="mt-6 rounded-2xl bg-[#4f6f52] px-5 py-3 text-sm font-black text-white transition hover:bg-[#3f5d43]"
          >
            Create Project
          </button>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projectStats.map((project, index) => {
            const color = getProjectColor(
              project,
              index,
            );

            const progress = Math.min(
              100,
              Math.max(
                0,
                Number(project.progress || 0),
              ),
            );

            return (
              <div
                key={project.id}
                className="group overflow-hidden rounded-[30px] border border-black/5 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-[#171a17]"
              >
                <div
                  className="h-2"
                  style={{
                    backgroundColor: color,
                  }}
                />

                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white"
                        style={{
                          backgroundColor: color,
                        }}
                      >
                        <FolderKanban size={21} />
                      </div>

                      <div className="min-w-0">
                        <h2 className="truncate text-lg font-black">
                          {project.name ||
                            project.title ||
                            "Untitled Project"}
                        </h2>

                        <p className="mt-1 text-xs font-bold text-black/35 dark:text-white/35">
                          {project.total || 0}{" "}
                          {project.total === 1
                            ? "task"
                            : "tasks"}
                        </p>
                      </div>
                    </div>

                    <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-black dark:bg-white/10">
                      {progress}%
                    </span>
                  </div>

                  <div className="mt-6">
                    <div className="mb-2 flex justify-between text-xs font-bold text-black/40 dark:text-white/40">
                      <span>Progress</span>

                      <span>
                        {project.completed || 0}/
                        {project.total || 0}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${progress}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-2">
                    <div className="rounded-2xl bg-black/[0.03] p-3 dark:bg-white/[0.04]">
                      <p className="text-[10px] font-black uppercase tracking-wider text-black/30 dark:text-white/30">
                        Tasks
                      </p>

                      <p className="mt-1 text-lg font-black">
                        {project.total || 0}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-black/[0.03] p-3 dark:bg-white/[0.04]">
                      <p className="text-[10px] font-black uppercase tracking-wider text-black/30 dark:text-white/30">
                        Done
                      </p>

                      <p className="mt-1 text-lg font-black text-[#6f9473]">
                        {project.completed || 0}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-orange-500/5 p-3">
                      <p className="text-[10px] font-black uppercase tracking-wider text-orange-500/60">
                        Late
                      </p>

                      <p className="mt-1 text-lg font-black text-orange-500">
                        {project.overdue || 0}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/project-manager?project=${encodeURIComponent(
                          project.id,
                        )}`,
                      )
                    }
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-black/5 py-3 text-sm font-black transition hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
                  >
                    Open project
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Projects;