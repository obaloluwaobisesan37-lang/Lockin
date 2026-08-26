import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  ListTodo,
  CircleCheckBig,
  Archive,
  FolderKanban,
  UserRound,
  Settings,
  BarChart3,
  CalendarDays,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const links = [
  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
    end: true,
  },
  {
    name: "My Tasks",
    path: "/todos",
    icon: ListTodo,
  },
  {
    name: "Projects",
    path: "/projects",
    icon: FolderKanban,
  },
  {
    name: "Task Overview",
    path: "/overview",
    icon: BarChart3,
  },
  {
    name: "Completed",
    path: "/completed",
    icon: CircleCheckBig,
  },
  {
    name: "Archives",
    path: "/archives",
    icon: Archive,
  },
  {
    name: "Calendar",
    path: "/calendar",
    icon: CalendarDays,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: UserRound,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

function Sidebar({
  tasks = [],
  projects = [],
}) {
  const safeTasks = Array.isArray(tasks)
    ? tasks
    : [];

  const safeProjects = Array.isArray(projects)
    ? projects
    : [];

  // Only count non-archived tasks
  // in the normal workspace statistics.
  const activeTasks = safeTasks.filter(
    (task) => task?.archived !== true
  );

  const totalTasks = activeTasks.length;

  const completedTasks = activeTasks.filter(
    (task) =>
      task?.completed === true ||
      task?.completed === "true"
  ).length;

  const pendingTasks = Math.max(
    totalTasks - completedTasks,
    0
  );

  const progress =
    totalTasks > 0
      ? Math.round(
          (completedTasks / totalTasks) * 100
        )
      : 0;

  const activeProjects = safeProjects.filter(
    (project) =>
      project?.status !== "Completed" &&
      project?.status !== "completed"
  ).length;

  const archivedTasks = safeTasks.filter(
    (task) => task?.archived === true
  ).length;

  return (
    <>
      {/* =====================================================
          DESKTOP SIDEBAR
      ===================================================== */}

      <aside
        className="
          fixed
          inset-y-0
          left-0
          z-40
          hidden
          w-72
          flex-col
          overflow-hidden
          border-r
          border-[#ddd8cf]
          bg-[#f7f5f0]
          transition-colors
          duration-300
          dark:border-[#393a36]
          dark:bg-[#171a17]
          md:flex
        "
      >
        {/* =====================================================
            LOGO
        ===================================================== */}

        <div className="shrink-0 px-6 pb-6 pt-7">
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-[#765b6b]
                text-white
                shadow-lg
                shadow-[#765b6b]/20
              "
            >
              <Sparkles
                size={20}
                strokeWidth={2.2}
              />
            </div>

            <div className="min-w-0">
              <h1 className="text-2xl font-black tracking-tight text-[#292725] dark:text-white">
                Lock
                <span className="text-[#765b6b]">
                  in
                </span>
              </h1>

              <p className="truncate text-[9px] font-bold uppercase tracking-[0.22em] text-[#918b82]">
                Task Management
              </p>
            </div>
          </div>
        </div>

        {/* DIVIDER */}

        <div className="mx-5 h-px shrink-0 bg-[#ddd8cf] dark:bg-[#393a36]" />

        {/* =====================================================
            NAVIGATION
        ===================================================== */}

        <nav
          className="
            min-h-0
            flex-1
            overflow-y-auto
            overflow-x-hidden
            px-3
            py-5
          "
        >
          <p className="mb-3 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#918b82]">
            Workspace
          </p>

          <div className="space-y-1.5">
            {links.map((link) => {
              const Icon = link.icon;

              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.end}
                  className={({ isActive }) => `
                    group
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-2xl
                    px-4
                    py-3
                    text-sm
                    font-semibold
                    transition-all
                    duration-200

                    ${
                      isActive
                        ? "bg-[#765b6b] text-white shadow-lg shadow-[#765b6b]/20"
                        : "text-[#716d66] hover:translate-x-1 hover:bg-[#e9e5de] hover:text-[#292725] dark:text-[#aaa69e] dark:hover:bg-[#292b29] dark:hover:text-white"
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={19}
                        strokeWidth={
                          isActive ? 2.4 : 2
                        }
                        className="shrink-0"
                      />

                      <span className="min-w-0 flex-1 truncate">
                        {link.name}
                      </span>

                      {/* Archive count */}
                      {link.path ===
                        "/archives" &&
                        archivedTasks > 0 && (
                          <span
                            className={`
                              flex
                              h-5
                              min-w-5
                              items-center
                              justify-center
                              rounded-full
                              px-1.5
                              text-[9px]
                              font-black

                              ${
                                isActive
                                  ? "bg-white/20 text-white"
                                  : "bg-[#765b6b]/10 text-[#765b6b] dark:bg-white/10 dark:text-[#c9aebe]"
                              }
                            `}
                          >
                            {archivedTasks}
                          </span>
                        )}

                      {isActive && (
                        <ChevronRight
                          size={16}
                          strokeWidth={2.4}
                          className="shrink-0"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* =====================================================
            BOTTOM STATS
        ===================================================== */}

        <div className="shrink-0 p-4">
          <div
            className="
              rounded-3xl
              border
              border-[#e1dcd4]
              bg-white
              p-5
              transition-colors
              duration-300
              dark:border-[#343934]
              dark:bg-[#1d211e]
            "
          >
            {/* HEADER */}

            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-wider text-[#918b82]">
                  Workspace
                </p>

                <p className="mt-1 truncate text-sm font-black text-[#292725] dark:text-white">
                  Your progress
                </p>
              </div>

              <div
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#f0e9ee]
                  text-[#765b6b]
                  dark:bg-[#332a30]
                "
              >
                <BarChart3 size={17} />
              </div>
            </div>

            {/* PROGRESS LABEL */}

            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-[#918b82]">
                Completion
              </span>

              <span className="text-xs font-black text-[#765b6b] dark:text-[#c9aebe]">
                {progress}%
              </span>
            </div>

            {/* PROGRESS BAR */}

            <div className="h-2 overflow-hidden rounded-full bg-[#ece8e2] dark:bg-[#303430]">
              <div
                className="
                  h-full
                  rounded-full
                  bg-[#765b6b]
                  transition-all
                  duration-700
                "
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

            {/* STATS */}

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-[#f6f4ef] p-3 dark:bg-[#252925]">
                <p className="text-[9px] font-bold uppercase text-[#918b82]">
                  Pending
                </p>

                <p className="mt-1 text-lg font-black text-[#292725] dark:text-white">
                  {pendingTasks}
                </p>
              </div>

              <div className="rounded-xl bg-[#f6f4ef] p-3 dark:bg-[#252925]">
                <p className="text-[9px] font-bold uppercase text-[#918b82]">
                  Projects
                </p>

                <p className="mt-1 text-lg font-black text-[#292725] dark:text-white">
                  {activeProjects}
                </p>
              </div>
            </div>

            {/* ARCHIVED COUNT */}

            {archivedTasks > 0 && (
              <div className="mt-2 flex items-center justify-between rounded-xl bg-[#f0e9ee] px-3 py-2.5 dark:bg-[#332a30]">
                <div className="flex items-center gap-2">
                  <Archive
                    size={14}
                    className="text-[#765b6b] dark:text-[#c9aebe]"
                  />

                  <span className="text-[10px] font-bold text-[#765b6b] dark:text-[#c9aebe]">
                    Archived
                  </span>
                </div>

                <span className="text-xs font-black text-[#765b6b] dark:text-[#c9aebe]">
                  {archivedTasks}
                </span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* =====================================================
          MOBILE NAVIGATION
      ===================================================== */}

      <nav
        className="
          fixed
          bottom-0
          left-0
          right-0
          z-50
          border-t
          border-[#ddd8cf]
          bg-[#f7f5f0]/95
          px-2
          pb-[max(0.5rem,env(safe-area-inset-bottom))]
          pt-2
          shadow-[0_-10px_30px_rgba(0,0,0,0.08)]
          backdrop-blur-xl
          transition-colors
          duration-300
          dark:border-[#393a36]
          dark:bg-[#171a17]/95
          md:hidden
        "
      >
        <div
          className="
            mx-auto
            flex
            w-full
            max-w-lg
            items-center
            gap-1
            overflow-x-auto
            scrollbar-none
          "
        >
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.end}
                className="min-w-[68px] flex-1"
              >
                {({ isActive }) => (
                  <div
                    className={`
                      relative
                      mx-auto
                      flex
                      min-h-[58px]
                      w-full
                      max-w-[78px]
                      flex-col
                      items-center
                      justify-center
                      gap-1
                      rounded-2xl
                      transition-all
                      duration-200

                      ${
                        isActive
                          ? "bg-[#765b6b] text-white shadow-md shadow-[#765b6b]/20"
                          : "text-[#817b73] hover:bg-[#e9e5de] dark:text-[#aaa69e] dark:hover:bg-[#292b29]"
                      }
                    `}
                  >
                    <Icon
                      size={19}
                      strokeWidth={
                        isActive ? 2.4 : 2
                      }
                    />

                    <span className="max-w-full truncate px-1 text-[8px] font-bold">
                      {link.name}
                    </span>

                    {/* MOBILE ARCHIVE BADGE */}

                    {link.path ===
                      "/archives" &&
                      archivedTasks > 0 && (
                        <span
                          className={`
                            absolute
                            right-2
                            top-1.5
                            flex
                            h-4
                            min-w-4
                            items-center
                            justify-center
                            rounded-full
                            px-1
                            text-[8px]
                            font-black

                            ${
                              isActive
                                ? "bg-white text-[#765b6b]"
                                : "bg-[#765b6b] text-white"
                            }
                          `}
                        >
                          {archivedTasks}
                        </span>
                      )}
                  </div>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </>
  );
}

export default Sidebar;