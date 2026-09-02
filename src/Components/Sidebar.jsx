import { useEffect, useMemo, useState } from "react";
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
  Check,
  Circle,
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
  // CLOSE MOBILE MENU ON DESKTOP
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
  // CLOSE MORE MENU WITH ESCAPE
  // =========================================================

  useEffect(() => {
    if (!moreOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMoreOpen(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [moreOpen]);

  // =========================================================
  // TASK STATS
  // =========================================================

  const {
    totalTasks,
    completedTasks,
    pendingTasks,
    progress,
    archivedTasks,
    activeProjects,
  } = useMemo(() => {
    const active = safeTasks.filter(
      (task) => task?.archived !== true
    );

    const total = active.length;

    const completed = active.filter(
      (task) =>
        task?.completed === true ||
        task?.completed === "true"
    ).length;

    const pending = Math.max(
      total - completed,
      0
    );

    const completion =
      total > 0
        ? Math.round(
            (completed / total) * 100
          )
        : 0;

    const archived = safeTasks.filter(
      (task) => task?.archived === true
    ).length;

    const projects = safeProjects.filter(
      (project) =>
        project?.status !== "Completed" &&
        project?.status !== "completed"
    ).length;

    return {
      totalTasks: total,
      completedTasks: completed,
      pendingTasks: pending,
      progress: completion,
      archivedTasks: archived,
      activeProjects: projects,
    };
  }, [safeTasks, safeProjects]);

  // =========================================================
  // MOBILE NAVIGATION
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
          w-[270px]
          flex-col
          border-r
          border-[#e3ded6]
          bg-[#f8f6f1]
          md:flex
          dark:border-[#303530]
          dark:bg-[#161a17]
        "
      >
        {/* ===================================================
            BRAND
        =================================================== */}

        <div className="shrink-0 px-5 pb-5 pt-6 lg:px-6">

          <div className="flex items-center gap-3">

            {/* LOGO */}

            <div
              className="
                relative
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-[15px]
                bg-[#765b6b]
                text-white
                shadow-[0_5px_0_#594451]
              "
            >
              <Sparkles
                size={19}
                strokeWidth={2.4}
              />

              <span
                className="
                  absolute
                  -right-1
                  -top-1
                  h-2.5
                  w-2.5
                  rounded-full
                  border-2
                  border-[#f8f6f1]
                  bg-[#627b82]
                  dark:border-[#161a17]
                "
              />
            </div>

            {/* BRAND TEXT */}

            <div className="min-w-0">

              <h1 className="text-[21px] font-black tracking-[-0.04em] text-[#292725] dark:text-white">
                Lock
                <span className="text-[#765b6b] dark:text-[#c9aebe]">
                  in
                </span>
              </h1>

              <p className="mt-0.5 text-[8px] font-black uppercase tracking-[0.2em] text-[#918b82]">
                Stay focused
              </p>

            </div>

          </div>

        </div>

        {/* ===================================================
            NAVIGATION
        =================================================== */}

        <div className="mx-5 h-px bg-[#e3ded6] dark:bg-[#303530]" />

        <nav
          className="
            min-h-0
            flex-1
            overflow-y-auto
            overflow-x-hidden
            px-3
            py-5
            lg:px-4
          "
        >

          {/* MAIN */}

          <div className="mb-7">

            <p className="mb-2.5 px-3 text-[9px] font-black uppercase tracking-[0.2em] text-[#a09a91]">
              Main
            </p>

            <div className="space-y-1">

              {links
                .slice(0, 2)
                .map((link) => {
                  const Icon = link.icon;

                  return (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      end={link.end}
                      className={({ isActive }) =>
                        `
                        group
                        relative
                        flex
                        min-h-[44px]
                        w-full
                        items-center
                        gap-3
                        rounded-[14px]
                        px-3
                        text-[13px]
                        font-bold
                        transition-all
                        duration-200
                        ${
                          isActive
                            ? "bg-[#765b6b] text-white shadow-[0_5px_18px_rgba(118,91,107,0.16)]"
                            : "text-[#716d66] hover:bg-[#eeeae3] hover:text-[#292725] dark:text-[#aaa69e] dark:hover:bg-[#242925] dark:hover:text-white"
                        }
                      `
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <Icon
                            size={18}
                            strokeWidth={
                              isActive
                                ? 2.5
                                : 2
                            }
                          />

                          <span className="min-w-0 flex-1 truncate">
                            {link.name}
                          </span>

                          {isActive && (
                            <ChevronRight
                              size={15}
                              strokeWidth={2.5}
                              className="opacity-80"
                            />
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}

            </div>

          </div>

          {/* WORKSPACE */}

          <div className="mb-7">

            <p className="mb-2.5 px-3 text-[9px] font-black uppercase tracking-[0.2em] text-[#a09a91]">
              Workspace
            </p>

            <div className="space-y-1">

              {links
                .slice(2, 7)
                .map((link) => {
                  const Icon = link.icon;

                  return (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      end={link.end}
                      className={({ isActive }) =>
                        `
                        group
                        relative
                        flex
                        min-h-[44px]
                        w-full
                        items-center
                        gap-3
                        rounded-[14px]
                        px-3
                        text-[13px]
                        font-bold
                        transition-all
                        duration-200
                        ${
                          isActive
                            ? "bg-[#765b6b] text-white shadow-[0_5px_18px_rgba(118,91,107,0.16)]"
                            : "text-[#716d66] hover:bg-[#eeeae3] hover:text-[#292725] dark:text-[#aaa69e] dark:hover:bg-[#242925] dark:hover:text-white"
                        }
                      `
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <Icon
                            size={18}
                            strokeWidth={
                              isActive
                                ? 2.5
                                : 2
                            }
                          />

                          <span className="min-w-0 flex-1 truncate">
                            {link.name}
                          </span>

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
                                      : "bg-[#765b6b]/10 text-[#765b6b] dark:bg-[#c9aebe]/10 dark:text-[#c9aebe]"
                                  }
                                `}
                              >
                                {archivedTasks}
                              </span>
                            )}

                          {isActive && (
                            <ChevronRight
                              size={15}
                              strokeWidth={2.5}
                              className="opacity-80"
                            />
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}

            </div>

          </div>

          {/* ACCOUNT */}

          <div>

            <p className="mb-2.5 px-3 text-[9px] font-black uppercase tracking-[0.2em] text-[#a09a91]">
              Account
            </p>

            <div className="space-y-1">

              {links
                .slice(7)
                .map((link) => {
                  const Icon = link.icon;

                  return (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      className={({ isActive }) =>
                        `
                        group
                        flex
                        min-h-[44px]
                        w-full
                        items-center
                        gap-3
                        rounded-[14px]
                        px-3
                        text-[13px]
                        font-bold
                        transition-all
                        duration-200
                        ${
                          isActive
                            ? "bg-[#765b6b] text-white shadow-[0_5px_18px_rgba(118,91,107,0.16)]"
                            : "text-[#716d66] hover:bg-[#eeeae3] hover:text-[#292725] dark:text-[#aaa69e] dark:hover:bg-[#242925] dark:hover:text-white"
                        }
                      `
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <Icon
                            size={18}
                            strokeWidth={
                              isActive
                                ? 2.5
                                : 2
                            }
                          />

                          <span className="min-w-0 flex-1 truncate">
                            {link.name}
                          </span>

                          {isActive && (
                            <ChevronRight
                              size={15}
                              strokeWidth={2.5}
                              className="opacity-80"
                            />
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}

            </div>

          </div>

        </nav>

        {/* ===================================================
            PRODUCTIVITY CARD
        =================================================== */}

        <div className="shrink-0 px-4 pb-4 lg:px-5">

          <div
            className="
              overflow-hidden
              rounded-[22px]
              border
              border-[#e1dcd4]
              bg-white
              p-4
              shadow-[0_5px_20px_rgba(41,39,37,0.04)]
              dark:border-[#343934]
              dark:bg-[#1d211e]
            "
          >

            {/* CARD HEADER */}

            <div className="flex items-start justify-between gap-3">

              <div className="min-w-0">

                <div className="flex items-center gap-2">

                  <div className="flex h-7 w-7 items-center justify-center rounded-[9px] bg-[#f0e9ee] text-[#765b6b] dark:bg-[#332a30] dark:text-[#c9aebe]">
                    <BarChart3 size={14} />
                  </div>

                  <span className="text-[9px] font-black uppercase tracking-[0.16em] text-[#918b82]">
                    Progress
                  </span>

                </div>

                <p className="mt-2 text-sm font-black text-[#292725] dark:text-white">
                  Keep going
                </p>

              </div>

              <span className="text-lg font-black tracking-tight text-[#765b6b] dark:text-[#c9aebe]">
                {progress}%
              </span>

            </div>

            {/* PROGRESS */}

            <div className="mt-4">

              <div className="h-1.5 overflow-hidden rounded-full bg-[#eeeae5] dark:bg-[#303530]">

                <div
                  className="
                    h-full
                    rounded-full
                    bg-gradient-to-r
                    from-[#765b6b]
                    to-[#627b82]
                    transition-[width]
                    duration-700
                    ease-out
                  "
                  style={{
                    width: `${progress}%`,
                  }}
                />

              </div>

            </div>

            {/* MINI STATS */}

            <div className="mt-4 grid grid-cols-2 gap-2">

              <div className="rounded-[13px] bg-[#f7f5f0] px-3 py-2.5 dark:bg-[#252a26]">

                <div className="flex items-center gap-1.5">

                  <Circle
                    size={9}
                    className="text-[#918b82]"
                  />

                  <span className="text-[8px] font-black uppercase tracking-wider text-[#918b82]">
                    Pending
                  </span>

                </div>

                <p className="mt-1 text-base font-black text-[#292725] dark:text-white">
                  {pendingTasks}
                </p>

              </div>

              <div className="rounded-[13px] bg-[#f7f5f0] px-3 py-2.5 dark:bg-[#252a26]">

                <div className="flex items-center gap-1.5">

                  <Check
                    size={11}
                    className="text-[#557a62]"
                  />

                  <span className="text-[8px] font-black uppercase tracking-wider text-[#918b82]">
                    Done
                  </span>

                </div>

                <p className="mt-1 text-base font-black text-[#292725] dark:text-white">
                  {completedTasks}
                </p>

              </div>

            </div>

            {/* ARCHIVES */}

            {archivedTasks > 0 && (
              <NavLink
                to="/archives"
                className="
                  mt-2.5
                  flex
                  min-h-[38px]
                  items-center
                  justify-between
                  rounded-[12px]
                  bg-[#f0e9ee]
                  px-3
                  text-[#765b6b]
                  transition
                  hover:bg-[#e8dfe5]
                  dark:bg-[#332a30]
                  dark:text-[#c9aebe]
                  dark:hover:bg-[#3c3138]
                "
              >

                <div className="flex items-center gap-2">

                  <Archive size={14} />

                  <span className="text-[10px] font-black">
                    Archived tasks
                  </span>

                </div>

                <div className="flex items-center gap-1">

                  <span className="text-[10px] font-black">
                    {archivedTasks}
                  </span>

                  <ChevronRight size={13} />

                </div>

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
          bg-[#f8f6f1]/90
          px-1.5
          pb-[max(0.45rem,env(safe-area-inset-bottom))]
          pt-1.5
          shadow-[0_-12px_35px_rgba(41,39,37,0.08)]
          backdrop-blur-2xl
          md:hidden
          dark:border-[#343934]
          dark:bg-[#161a17]/92
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
              onClick={() =>
                setMoreOpen(false)
              }
              className="
                fixed
                inset-0
                z-[-1]
                cursor-default
                bg-black/10
                backdrop-blur-[2px]
                dark:bg-black/30
              "
            />

            {/* MENU */}

            <div
              className="
                absolute
                bottom-[75px]
                right-2
                w-[calc(100vw-1rem)]
                max-w-[300px]
                overflow-hidden
                rounded-[24px]
                border
                border-[#ddd8cf]
                bg-[#f8f6f1]
                p-2
                shadow-[0_20px_55px_rgba(0,0,0,0.15)]
                dark:border-[#343934]
                dark:bg-[#1d211e]
                sm:bottom-[80px]
                sm:right-3
              "
            >

              {/* MENU HEADER */}

              <div className="flex items-center justify-between px-3 py-2.5">

                <div>

                  <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#918b82]">
                    More
                  </p>

                  <p className="mt-0.5 text-xs font-bold text-[#292725] dark:text-white">
                    More Lockin tools
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setMoreOpen(false)
                  }
                  className="
                    rounded-xl
                    p-2
                    text-[#918b82]
                    transition
                    hover:bg-black/5
                    hover:text-[#292725]
                    dark:hover:bg-white/10
                    dark:hover:text-white
                  "
                  aria-label="Close more menu"
                >
                  <X size={16} />
                </button>

              </div>

              <div className="mb-1 h-px bg-[#e7e2da] dark:bg-[#303530]" />

              {/* MENU ITEMS */}

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
                      className={({ isActive }) =>
                        `
                        flex
                        min-h-[45px]
                        items-center
                        gap-3
                        rounded-[14px]
                        px-3
                        text-[13px]
                        font-bold
                        transition
                        ${
                          isActive
                            ? "bg-[#765b6b] text-white"
                            : "text-[#716d66] hover:bg-[#eeeae3] dark:text-[#aaa69e] dark:hover:bg-[#292e2a]"
                        }
                      `
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <Icon size={18} />

                          <span className="flex-1">
                            {link.name}
                          </span>

                          {link.path ===
                            "/archives" &&
                            archivedTasks > 0 && (
                              <span
                                className={`
                                  rounded-full
                                  px-2
                                  py-1
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
                              size={14}
                            />
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}

              </div>

            </div>

          </>
        )}

        {/* ===================================================
            MOBILE MAIN NAV
        =================================================== */}

        <div className="mx-auto flex w-full max-w-xl items-center justify-around gap-1">

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
                      min-h-[56px]
                      w-full
                      max-w-[76px]
                      flex-col
                      items-center
                      justify-center
                      gap-1
                      rounded-[16px]
                      transition-all
                      duration-200
                      ${
                        isActive
                          ? "bg-[#765b6b] text-white shadow-[0_5px_16px_rgba(118,91,107,0.18)]"
                          : "text-[#817b73] hover:bg-[#eeeae3] dark:text-[#aaa69e] dark:hover:bg-[#292e2a]"
                      }
                    `}
                  >

                    <Icon
                      size={18}
                      strokeWidth={
                        isActive
                          ? 2.5
                          : 2
                      }
                    />

                    <span className="max-w-full truncate px-1 text-[8px] font-black">
                      {link.name}
                    </span>

                    {/* ARCHIVE COUNT */}

                    {link.path ===
                      "/archives" &&
                      archivedTasks > 0 && (
                        <span
                          className={`
                            absolute
                            right-1
                            top-1
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
              rounded-[16px]
              transition-all
              duration-200
              ${
                moreOpen
                  ? "bg-[#765b6b] text-white shadow-[0_5px_16px_rgba(118,91,107,0.18)]"
                  : "text-[#817b73] hover:bg-[#eeeae3] dark:text-[#aaa69e] dark:hover:bg-[#292e2a]"
              }
            `}
          >

            <div className="mx-auto flex min-h-[56px] max-w-[76px] flex-col items-center justify-center gap-1">

              <MoreHorizontal
                size={19}
                strokeWidth={
                  moreOpen ? 2.5 : 2
                }
              />

              <span className="text-[8px] font-black">
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