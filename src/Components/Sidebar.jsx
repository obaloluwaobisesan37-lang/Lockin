import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  ListTodo,
  CircleCheckBig,
  UserRound,
  Settings,
  Sparkles,
  ChevronRight,
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
    name: "Completed",
    path: "/completed",
    icon: CircleCheckBig,
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

function Sidebar({ tasks = [] }) {
  const safeTasks = Array.isArray(tasks)
    ? tasks
    : [];

  const totalTasks = safeTasks.length;

  const completedTasks = safeTasks.filter(
    (task) => task.completed === true
  ).length;

  const progress =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks / totalTasks) * 100
        );

  return (
    <>
      {/* =====================================================
          DESKTOP SIDEBAR
      ===================================================== */}

      <aside
        className="
          fixed
          left-0
          top-0
          z-40
          hidden
          h-screen
          w-72
          flex-col
          overflow-hidden
          border-r
          border-[#ddd8cf]
          bg-[#f7f5f0]
          dark:border-[#393a36]
          dark:bg-[#171a17]
          md:flex
        "
      >
        {/* LOGO */}

        <div className="shrink-0 px-6 pb-5 pt-7">
          <h1 className="text-2xl font-black tracking-tight text-[#292725] dark:text-white">
            Lock
            <span className="text-[#765b6b]">
              in
            </span>
          </h1>

          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#918b82]">
            Productivity
          </p>
        </div>

        {/* DIVIDER */}

        <div className="mx-5 h-px shrink-0 bg-[#ddd8cf] dark:bg-[#393a36]" />

        {/* NAVIGATION */}

        <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-5">
          <p className="mb-3 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#918b82]">
            Workspace
          </p>

          <div className="space-y-2">
            {links.map((link) => {
              const Icon = link.icon;

              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.end}
                  className={({ isActive }) =>
                    `
                    group
                    flex
                    items-center
                    gap-3
                    rounded-2xl
                    px-4
                    py-3.5
                    text-sm
                    font-semibold
                    transition-all
                    duration-300
                    ${
                      isActive
                        ? "bg-[#765b6b] text-white shadow-lg shadow-[#765b6b]/20"
                        : "text-[#716d66] hover:translate-x-1 hover:bg-[#e9e5de] hover:text-[#292725] dark:text-[#aaa69e] dark:hover:bg-[#292b29] dark:hover:text-white"
                    }
                  `
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={19}
                        strokeWidth={2}
                        className="shrink-0"
                      />

                      <span className="flex-1">
                        {link.name}
                      </span>

                      {isActive && (
                        <ChevronRight
                          size={16}
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

        {/* STAY LOCKED IN */}

        <div className="shrink-0 p-4">
          <div
            className="
              rounded-3xl
              bg-[#a65d43]
              p-5
              text-white
              shadow-xl
              shadow-[#a65d43]/20
            "
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
              <Sparkles size={19} />
            </div>

            <h3 className="font-bold">
              Stay locked in.
            </h3>

            <p className="mt-1 text-xs leading-5 text-[#f6ded5]">
              Small progress every day creates big results.
            </p>

            <div className="mt-5 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">
                Progress
              </span>

              <span className="text-xs font-black text-white">
                {progress}%
              </span>
            </div>

            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-white transition-all duration-700 ease-out"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

            <p className="mt-2 text-[10px] font-medium text-white/70">
              {completedTasks} of {totalTasks} tasks completed
            </p>
          </div>
        </div>
      </aside>

      {/* =====================================================
          MOBILE BOTTOM NAVIGATION
      ===================================================== */}

      <nav
        className="
          fixed
          bottom-0
          left-0
          right-0
          z-50
          flex
          border-t
          border-[#ddd8cf]
          bg-[#f7f5f0]/95
          px-2
          pb-2
          pt-2
          shadow-[0_-10px_30px_rgba(0,0,0,0.08)]
          backdrop-blur-xl
          dark:border-[#393a36]
          dark:bg-[#171a17]/95
          md:hidden
        "
      >
        <div className="mx-auto flex w-full max-w-md items-center justify-around gap-1">
          {links.map((link) => {
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
                      mx-auto
                      flex
                      min-h-[58px]
                      w-full
                      max-w-[76px]
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
                      size={20}
                      strokeWidth={
                        isActive ? 2.4 : 2
                      }
                    />

                    <span className="max-w-full truncate text-[9px] font-bold">
                      {link.name}
                    </span>
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