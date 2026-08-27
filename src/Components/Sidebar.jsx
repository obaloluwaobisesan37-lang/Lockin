import { useEffect, useState } from "react";
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
  MoreHorizontal,
  X,
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
  const [moreOpen, setMoreOpen] = useState(false);

  const safeTasks = Array.isArray(tasks)
    ? tasks
    : [];

  const safeProjects = Array.isArray(projects)
    ? projects
    : [];

  // =========================================================
  // CLOSE MORE MENU WHEN SCREEN BECOMES DESKTOP
  // =========================================================

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMoreOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, []);

  // =========================================================
  // TASK STATS
  // =========================================================

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

  // =========================================================
  // MOBILE LINKS
  // =========================================================

  const mobileMainLinks = [
    links[0],
    links[1],
    links[2],
    links[4],
    links[5],
  ];

  const mobileMoreLinks = [
    links[3],
    links[6],
    links[7],
    links[8],
  ];

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
          w-64
          flex-col
          overflow-hidden
          border-r
          border-[#ddd8cf]
          bg-[#f7f5f0]
          transition-colors
          duration-300
          dark:border-[#393a36]
          dark:bg-[#171a17]
          lg:w-72
          md:flex
        "
      >
        {/* ===================================================
            LOGO
        =================================================== */}

        <div
          className="
            shrink-0
            px-4
            pb-5
            pt-6
            sm:px-5
            sm:pb-6
            sm:pt-7
            lg:px-6
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-[#765b6b]
                text-white
                shadow-lg
                shadow-[#765b6b]/20
                sm:h-11
                sm:w-11
              "
            >
              <Sparkles
                size={19}
                strokeWidth={2.2}
              />
            </div>

            <div className="min-w-0">
              <h1 className="text-xl font-black tracking-tight text-[#292725] sm:text-2xl dark:text-white">
                Lock
                <span className="text-[#765b6b]">
                  in
                </span>
              </h1>

              <p className="truncate text-[8px] font-bold uppercase tracking-[0.18em] text-[#918b82] sm:text-[9px] sm:tracking-[0.22em]">
                Task Management
              </p>
            </div>
          </div>
        </div>

        {/* DIVIDER */}

        <div className="mx-4 h-px shrink-0 bg-[#ddd8cf] lg:mx-5 dark:bg-[#393a36]" />

        {/* ===================================================
            DESKTOP NAVIGATION
        =================================================== */}

        <nav
          className="
            min-h-0
            flex-1
            overflow-y-auto
            overflow-x-hidden
            px-2.5
            py-4
            sm:px-3
            sm:py-5
          "
        >
          <p className="mb-3 px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-[#918b82] sm:px-4 sm:text-[10px]">
            Workspace
          </p>

          <div className="space-y-1">
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
                    gap-2.5
                    rounded-2xl
                    px-3
                    py-2.5
                    text-sm
                    font-semibold
                    transition-all
                    duration-200
                    sm:gap-3
                    sm:px-4
                    sm:py-3
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
                        size={18}
                        strokeWidth={
                          isActive ? 2.4 : 2
                        }
                        className="shrink-0 sm:h-[19px] sm:w-[19px]"
                      />

                      <span className="min-w-0 flex-1 truncate">
                        {link.name}
                      </span>

                      {link.path === "/archives" &&
                        archivedTasks > 0 && (
                          <span
                            className={`
                              flex
                              h-5
                              min-w-5
                              shrink-0
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
                          size={15}
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

        {/* ===================================================
            BOTTOM STATS
        =================================================== */}

        <div className="shrink-0 p-3 sm:p-4">
          <div
            className="
              rounded-3xl
              border
              border-[#e1dcd4]
              bg-white
              p-4
              transition-colors
              duration-300
              sm:p-5
              dark:border-[#343934]
              dark:bg-[#1d211e]
            "
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[9px] font-black uppercase tracking-wider text-[#918b82] sm:text-[10px]">
                  Workspace
                </p>

                <p className="mt-1 truncate text-sm font-black text-[#292725] dark:text-white">
                  Your progress
                </p>
              </div>

              <div
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#f0e9ee]
                  text-[#765b6b]
                  sm:h-9
                  sm:w-9
                  dark:bg-[#332a30]
                "
              >
                <BarChart3 size={16} />
              </div>
            </div>

            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-[#918b82]">
                Completion
              </span>

              <span className="text-xs font-black text-[#765b6b] dark:text-[#c9aebe]">
                {progress}%
              </span>
            </div>

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

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-[#f6f4ef] p-2.5 sm:p-3 dark:bg-[#252925]">
                <p className="text-[8px] font-bold uppercase text-[#918b82] sm:text-[9px]">
                  Pending
                </p>

                <p className="mt-1 text-base font-black text-[#292725] sm:text-lg dark:text-white">
                  {pendingTasks}
                </p>
              </div>

              <div className="rounded-xl bg-[#f6f4ef] p-2.5 sm:p-3 dark:bg-[#252925]">
                <p className="text-[8px] font-bold uppercase text-[#918b82] sm:text-[9px]">
                  Projects
                </p>

                <p className="mt-1 text-base font-black text-[#292725] sm:text-lg dark:text-white">
                  {activeProjects}
                </p>
              </div>
            </div>

            {archivedTasks > 0 && (
              <NavLink
                to="/archives"
                className="
                  mt-2
                  flex
                  items-center
                  justify-between
                  rounded-xl
                  bg-[#f0e9ee]
                  px-3
                  py-2.5
                  transition
                  hover:bg-[#e8dfe5]
                  dark:bg-[#332a30]
                  dark:hover:bg-[#3b3038]
                "
              >
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
              </NavLink>
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
          px-1.5
          pb-[max(0.4rem,env(safe-area-inset-bottom))]
          pt-1.5
          shadow-[0_-10px_30px_rgba(0,0,0,0.08)]
          backdrop-blur-xl
          transition-colors
          duration-300
          sm:px-2
          sm:pb-[max(0.5rem,env(safe-area-inset-bottom))]
          sm:pt-2
          dark:border-[#393a36]
          dark:bg-[#171a17]/95
          md:hidden
        "
      >
        {/* ===================================================
            MORE MENU
        =================================================== */}

        {moreOpen && (
          <>
            {/* BACKDROP */}

            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMoreOpen(false)}
              className="
                fixed
                inset-0
                z-[-1]
                cursor-default
                bg-black/10
                backdrop-blur-[1px]
              "
            />

            <div
              className="
                absolute
                bottom-[72px]
                right-2
                max-h-[calc(100vh-100px)]
                w-[calc(100vw-1rem)]
                max-w-80
                overflow-y-auto
                rounded-3xl
                border
                border-[#ddd8cf]
                bg-[#f7f5f0]
                p-2
                shadow-2xl
                sm:bottom-[78px]
                sm:right-3
                sm:w-56
                dark:border-[#393a36]
                dark:bg-[#1d211e]
              "
            >
              <div className="mb-1 flex items-center justify-between px-3 py-2">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#918b82]">
                  More
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setMoreOpen(false)
                  }
                  className="
                    rounded-lg
                    p-1
                    text-[#918b82]
                    transition
                    hover:bg-black/5
                    dark:hover:bg-white/10
                  "
                  aria-label="Close more menu"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="space-y-1">
                {mobileMoreLinks.map((link) => {
                  const Icon = link.icon;

                  return (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      end={link.end}
                      onClick={() =>
                        setMoreOpen(false)
                      }
                      className={({ isActive }) => `
                        flex
                        items-center
                        gap-3
                        rounded-2xl
                        px-3
                        py-3
                        text-sm
                        font-bold
                        transition
                        ${
                          isActive
                            ? "bg-[#765b6b] text-white"
                            : "text-[#716d66] hover:bg-[#e9e5de] dark:text-[#aaa69e] dark:hover:bg-[#292b29]"
                        }
                      `}
                    >
                      <Icon size={18} />

                      <span>{link.name}</span>

                      {link.path ===
                        "/archives" &&
                        archivedTasks > 0 && (
                          <span className="ml-auto rounded-full bg-[#765b6b]/10 px-2 py-1 text-[9px] font-black text-[#765b6b] dark:bg-white/10 dark:text-[#c9aebe]">
                            {archivedTasks}
                          </span>
                        )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* ===================================================
            MAIN MOBILE BUTTONS
        =================================================== */}

        <div className="mx-auto flex w-full max-w-xl items-center gap-0.5 sm:gap-1">
          {mobileMainLinks.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.end}
                className="min-w-0 flex-1"
              >
                {({ isActive }) => (
                  <div
                    className={`
                      relative
                      mx-auto
                      flex
                      min-h-[54px]
                      w-full
                      max-w-[78px]
                      flex-col
                      items-center
                      justify-center
                      gap-0.5
                      rounded-2xl
                      px-0.5
                      transition-all
                      duration-200
                      sm:min-h-[58px]
                      sm:gap-1
                      ${
                        isActive
                          ? "bg-[#765b6b] text-white shadow-md shadow-[#765b6b]/20"
                          : "text-[#817b73] hover:bg-[#e9e5de] dark:text-[#aaa69e] dark:hover:bg-[#292b29]"
                      }
                    `}
                  >
                    <Icon
                      size={18}
                      strokeWidth={
                        isActive ? 2.4 : 2
                      }
                      className="sm:h-[19px] sm:w-[19px]"
                    />

                    <span className="max-w-full truncate px-0.5 text-[7px] font-bold min-[380px]:text-[8px]">
                      {link.name}
                    </span>

                    {/* ARCHIVE BADGE */}

                    {link.path === "/archives" &&
                      archivedTasks > 0 && (
                        <span
                          className={`
                            absolute
                            right-0.5
                            top-0.5
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

          {/* =================================================
              MORE BUTTON
          ================================================= */}

          <button
            type="button"
            onClick={() =>
              setMoreOpen(
                (previous) => !previous
              )
            }
            aria-expanded={moreOpen}
            aria-label="More navigation options"
            className={`
              min-w-0
              flex-1
              rounded-2xl
              transition
              ${
                moreOpen
                  ? "bg-[#765b6b] text-white"
                  : "text-[#817b73] hover:bg-[#e9e5de] dark:text-[#aaa69e] dark:hover:bg-[#292b29]"
              }
            `}
          >
            <div className="mx-auto flex min-h-[54px] max-w-[78px] flex-col items-center justify-center gap-0.5 sm:min-h-[58px] sm:gap-1">
              <MoreHorizontal
                size={19}
              />

              <span className="text-[7px] font-bold min-[380px]:text-[8px]">
                More
              </span>
            </div>
          </button>
        </div>
      </nav>
    </>
  );
}

export default Sidebar;