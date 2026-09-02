import {
  FolderKanban,
  Plus,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  ArrowRight,
  Layers3,
} from "lucide-react";
import {
  useNavigate,
  useOutletContext,
} from "react-router-dom";

function Projects() {
  const navigate = useNavigate();

  const {
    projects = [],
    tasks = [],
  } = useOutletContext();

  const safeProjects = Array.isArray(projects)
    ? projects
    : [];

  const safeTasks = Array.isArray(tasks)
    ? tasks
    : [];

  // =========================================================
  // PROJECT COLORS
  // =========================================================

  const projectColors = {
    sage: "#6f9473",
    blue: "#627b82",
    purple: "#765b6b",
    orange: "#b07b4d",
    rose: "#a85b5b",
    cyan: "#627b82",
  };

  const fallbackColors = [
    "#765b6b",
    "#627b82",
    "#6f9473",
    "#b07b4d",
    "#8b7180",
  ];

  const getProjectColor = (project, index) => {
    const color = project?.color;

    if (projectColors[color]) {
      return projectColors[color];
    }

    if (
      typeof color === "string" &&
      color.startsWith("#")
    ) {
      return color;
    }

    return fallbackColors[
      index % fallbackColors.length
    ];
  };

  // =========================================================
  // TODAY
  // =========================================================

  const today = new Date();

  const todayString =
    `${today.getFullYear()}-` +
    `${String(today.getMonth() + 1).padStart(2, "0")}-` +
    `${String(today.getDate()).padStart(2, "0")}`;

  // =========================================================
  // PROJECT STATS
  // =========================================================

  const projectStats = safeProjects.map((project) => {
    const projectTasks = safeTasks.filter(
      (task) =>
        task.projectId === project.id &&
        !task.archived
    );

    const completed = projectTasks.filter(
      (task) => task.completed
    ).length;

    const total = projectTasks.length;

    const overdue = projectTasks.filter(
      (task) =>
        !task.completed &&
        task.dueDate &&
        task.dueDate < todayString
    ).length;

    const progress =
      total === 0
        ? 0
        : Math.round((completed / total) * 100);

    return {
      ...project,
      total,
      completed,
      overdue,
      progress,
    };
  });

  // =========================================================
  // OVERALL STATS
  // =========================================================

  const activeTasks = safeTasks.filter(
    (task) => !task.archived
  );

  const totalTasks = activeTasks.length;

  const completedTasks = activeTasks.filter(
    (task) => task.completed
  ).length;

  const activeTaskCount =
    totalTasks - completedTasks;

  const overdueTasks = projectStats.reduce(
    (total, project) =>
      total + Number(project.overdue || 0),
    0
  );

  // =========================================================
  // OPEN PROJECT
  // =========================================================

  const openProject = (projectId) => {
    navigate(
      `/project-manager?project=${encodeURIComponent(
        projectId
      )}`
    );
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#765b6b]" />

            <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#765b6b] dark:text-[#c9aebe]">
              Workspace
            </p>
          </div>

          <h1 className="mt-2 text-3xl font-black tracking-[-0.035em] text-[#292725] sm:text-4xl dark:text-white">
            Projects
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#77736b] dark:text-[#aaa69e]">
            Organize your tasks into focused projects and
            keep your work moving from one place.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/project-manager")}
          className="group inline-flex min-h-[42px] w-fit items-center justify-center gap-2 rounded-[12px] bg-[#765b6b] px-4 text-xs font-black text-white shadow-[0_4px_0_#594451] transition hover:-translate-y-0.5 hover:bg-[#674e5e] hover:shadow-[0_5px_0_#594451] active:translate-y-0 active:shadow-[0_2px_0_#594451]"
        >
          <Plus
            size={15}
            className="transition-transform duration-200 group-hover:rotate-90"
          />
          Manage projects
        </button>
      </section>

      {/* =====================================================
          OVERVIEW
      ===================================================== */}

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* TOTAL PROJECTS */}

        <div className="rounded-[18px] border border-[#e2ddd5] bg-white p-5 shadow-[0_5px_18px_rgba(41,39,37,0.03)] dark:border-[#333833] dark:bg-[#1b1f1c]">
          <div className="flex items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-[11px] bg-[#765b6b]/8 text-[#765b6b] dark:bg-[#765b6b]/12 dark:text-[#c9aebe]">
              <FolderKanban size={19} />
            </div>

            <span className="text-[8px] font-black uppercase tracking-[0.15em] text-[#aaa49b] dark:text-[#686d68]">
              Total
            </span>
          </div>

          <p className="mt-5 text-2xl font-black tracking-[-0.03em] text-[#292725] dark:text-white">
            {safeProjects.length}
          </p>

          <p className="mt-1 text-[10px] font-bold text-[#918b82] dark:text-[#777d77]">
            Project{safeProjects.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* ACTIVE TASKS */}

        <div className="rounded-[18px] border border-[#e2ddd5] bg-white p-5 shadow-[0_5px_18px_rgba(41,39,37,0.03)] dark:border-[#333833] dark:bg-[#1b1f1c]">
          <div className="flex h-10 w-10 items-center justify-center rounded-[11px] bg-[#627b82]/8 text-[#627b82] dark:bg-[#627b82]/12 dark:text-[#9bb4ba]">
            <Clock3 size={19} />
          </div>

          <p className="mt-5 text-2xl font-black tracking-[-0.03em] text-[#292725] dark:text-white">
            {activeTaskCount}
          </p>

          <p className="mt-1 text-[10px] font-bold text-[#918b82] dark:text-[#777d77]">
            Active tasks
          </p>
        </div>

        {/* COMPLETED */}

        <div className="rounded-[18px] border border-[#e2ddd5] bg-white p-5 shadow-[0_5px_18px_rgba(41,39,37,0.03)] dark:border-[#333833] dark:bg-[#1b1f1c]">
          <div className="flex h-10 w-10 items-center justify-center rounded-[11px] bg-[#557a62]/8 text-[#557a62] dark:bg-[#557a62]/12 dark:text-[#8faf91]">
            <CheckCircle2 size={19} />
          </div>

          <p className="mt-5 text-2xl font-black tracking-[-0.03em] text-[#292725] dark:text-white">
            {completedTasks}
          </p>

          <p className="mt-1 text-[10px] font-bold text-[#918b82] dark:text-[#777d77]">
            Completed tasks
          </p>
        </div>

        {/* OVERDUE */}

        <div className="rounded-[18px] border border-[#e2ddd5] bg-white p-5 shadow-[0_5px_18px_rgba(41,39,37,0.03)] dark:border-[#333833] dark:bg-[#1b1f1c]">
          <div className="flex h-10 w-10 items-center justify-center rounded-[11px] bg-[#b07b4d]/8 text-[#b07b4d] dark:bg-[#b07b4d]/12 dark:text-[#d9a575]">
            <AlertTriangle size={19} />
          </div>

          <p className="mt-5 text-2xl font-black tracking-[-0.03em] text-[#292725] dark:text-white">
            {overdueTasks}
          </p>

          <p className="mt-1 text-[10px] font-bold text-[#918b82] dark:text-[#777d77]">
            Overdue tasks
          </p>
        </div>
      </section>

      {/* =====================================================
          SECTION LABEL
      ===================================================== */}

      {projectStats.length > 0 && (
        <div className="flex items-end justify-between gap-3 pt-1">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#9a948b]">
              Project workspace
            </p>

            <h2 className="mt-1 text-sm font-black text-[#292725] dark:text-white">
              Your projects
            </h2>
          </div>

          <span className="rounded-full bg-[#765b6b]/8 px-2.5 py-1 text-[9px] font-black uppercase tracking-wide text-[#765b6b] dark:bg-[#765b6b]/12 dark:text-[#c9aebe]">
            {projectStats.length} active
          </span>
        </div>
      )}

      {/* =====================================================
          EMPTY STATE
      ===================================================== */}

      {projectStats.length === 0 ? (
        <section className="rounded-[22px] border border-dashed border-[#d8d2c9] bg-white px-6 py-14 text-center dark:border-[#3b403b] dark:bg-[#1b1f1c]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[15px] bg-[#765b6b]/8 text-[#765b6b] dark:bg-[#765b6b]/12 dark:text-[#c9aebe]">
            <FolderKanban size={25} />
          </div>

          <h2 className="mt-5 text-lg font-black tracking-[-0.02em] text-[#292725] dark:text-white">
            No projects yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-[#918b82] dark:text-[#777d77]">
            Create your first project to give your tasks
            a clear place to live.
          </p>

          <button
            type="button"
            onClick={() => navigate("/project-manager")}
            className="mt-6 inline-flex min-h-[40px] items-center gap-2 rounded-[11px] bg-[#765b6b] px-4 text-xs font-black text-white transition hover:bg-[#674e5e]"
          >
            <Plus size={14} />
            Create project
          </button>
        </section>
      ) : (
        /* =====================================================
           PROJECT GRID
        ===================================================== */

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projectStats.map((project, index) => {
            const color = getProjectColor(
              project,
              index
            );

            const progress = Math.min(
              100,
              Math.max(
                0,
                Number(project.progress || 0)
              )
            );

            return (
              <article
                key={project.id}
                className="group overflow-hidden rounded-[20px] border border-[#e2ddd5] bg-white shadow-[0_7px_22px_rgba(41,39,37,0.035)] transition-all duration-200 hover:-translate-y-[2px] hover:border-[#d5cec5] hover:shadow-[0_12px_32px_rgba(41,39,37,0.07)] dark:border-[#333833] dark:bg-[#1b1f1c] dark:hover:border-[#414741] dark:hover:shadow-[0_12px_32px_rgba(0,0,0,0.16)]"
              >
                {/* COLOR LINE */}

                <div
                  className="h-1"
                  style={{
                    backgroundColor: color,
                  }}
                />

                <div className="p-5">
                  {/* HEADER */}

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] text-white shadow-sm"
                        style={{
                          backgroundColor: color,
                        }}
                      >
                        <FolderKanban size={18} />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-[15px] font-black tracking-[-0.015em] text-[#292725] dark:text-white">
                          {project.name ||
                            project.title ||
                            "Untitled Project"}
                        </h3>

                        <p className="mt-1 text-[9px] font-bold text-[#918b82] dark:text-[#777d77]">
                          {project.total || 0}{" "}
                          {project.total === 1
                            ? "task"
                            : "tasks"}
                        </p>
                      </div>
                    </div>

                    <span
                      className="shrink-0 rounded-full px-2.5 py-1 text-[9px] font-black"
                      style={{
                        color,
                        backgroundColor: `${color}12`,
                      }}
                    >
                      {progress}%
                    </span>
                  </div>

                  {/* DESCRIPTION */}

                  {project.description && (
                    <p className="mt-4 line-clamp-2 text-[11px] leading-5 text-[#858078] dark:text-[#969b96]">
                      {project.description}
                    </p>
                  )}

                  {/* PROGRESS */}

                  <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase tracking-[0.14em] text-[#9a948b]">
                        Progress
                      </span>

                      <span className="text-[9px] font-black text-[#77736b] dark:text-[#aaa69e]">
                        {project.completed || 0}/
                        {project.total || 0}
                      </span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-[#ebe7e0] dark:bg-[#303530]">
                      <div
                        className="h-full rounded-full transition-[width] duration-500"
                        style={{
                          width: `${progress}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                  </div>

                  {/* MINI STATS */}

                  <div className="mt-5 grid grid-cols-3 gap-2">
                    <div className="rounded-[11px] border border-[#ebe7e0] bg-[#faf9f6] px-3 py-2.5 dark:border-[#303530] dark:bg-[#202420]">
                      <div className="flex items-center gap-1.5">
                        <Layers3
                          size={11}
                          className="text-[#918b82]"
                        />

                        <p className="text-[8px] font-black uppercase tracking-[0.12em] text-[#918b82]">
                          Tasks
                        </p>
                      </div>

                      <p className="mt-1 text-base font-black text-[#292725] dark:text-white">
                        {project.total || 0}
                      </p>
                    </div>

                    <div className="rounded-[11px] border border-[#557a62]/10 bg-[#557a62]/[0.035] px-3 py-2.5 dark:border-[#557a62]/15 dark:bg-[#557a62]/10">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2
                          size={11}
                          className="text-[#557a62] dark:text-[#8faf91]"
                        />

                        <p className="text-[8px] font-black uppercase tracking-[0.12em] text-[#557a62] dark:text-[#8faf91]">
                          Done
                        </p>
                      </div>

                      <p className="mt-1 text-base font-black text-[#557a62] dark:text-[#8faf91]">
                        {project.completed || 0}
                      </p>
                    </div>

                    <div className="rounded-[11px] border border-[#b07b4d]/10 bg-[#b07b4d]/[0.035] px-3 py-2.5 dark:border-[#b07b4d]/15 dark:bg-[#b07b4d]/10">
                      <div className="flex items-center gap-1.5">
                        <AlertTriangle
                          size={11}
                          className="text-[#b07b4d] dark:text-[#d9a575]"
                        />

                        <p className="text-[8px] font-black uppercase tracking-[0.12em] text-[#b07b4d] dark:text-[#d9a575]">
                          Late
                        </p>
                      </div>

                      <p className="mt-1 text-base font-black text-[#b07b4d] dark:text-[#d9a575]">
                        {project.overdue || 0}
                      </p>
                    </div>
                  </div>

                  {/* OPEN */}

                  <button
                    type="button"
                    onClick={() =>
                      openProject(project.id)
                    }
                    className="group/open mt-5 flex min-h-[40px] w-full items-center justify-center gap-2 rounded-[11px] border border-[#ded9d1] bg-[#faf9f6] text-[10px] font-black text-[#292725] transition hover:border-[#765b6b]/25 hover:bg-[#765b6b]/6 hover:text-[#765b6b] dark:border-[#353a35] dark:bg-[#202420] dark:text-[#d7d5cf] dark:hover:border-[#765b6b]/25 dark:hover:bg-[#765b6b]/10 dark:hover:text-[#c9aebe]"
                  >
                    Open project

                    <ArrowRight
                      size={14}
                      className="transition-transform duration-200 group-hover/open:translate-x-1"
                    />
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}

export default Projects;