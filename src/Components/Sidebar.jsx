
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
  // ==========================================
  // MAKE SURE TASKS IS AN ARRAY
  // ==========================================

  const safeTasks = Array.isArray(tasks)
    ? tasks
    : [];

  // ==========================================
  // TASK PROGRESS
  // ==========================================

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
    <aside
      className="
        fixed
        left-0
        top-0
        z-40
        flex
        h-screen
        w-72
        flex-col
        overflow-hidden
        border-r
        border-[#ddd8cf]
        bg-[#f7f5f0]
        dark:border-[#393a36]
        dark:bg-[#171a17]
      "
    >

      {/* ==========================================
          LOGO
      ========================================== */}

      <div className="shrink-0 px-6 pt-7 pb-5">

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

      {/* ==========================================
          NAVIGATION
      ========================================== */}

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

      {/* ==========================================
          STAY LOCKED IN
      ========================================== */}

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

          {/* ICON */}

          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
            <Sparkles size={19} />
          </div>

          {/* TITLE */}

          <h3 className="font-bold">
            Stay locked in.
          </h3>

          {/* DESCRIPTION */}

          <p className="mt-1 text-xs leading-5 text-[#f6ded5]">
            Small progress every day creates big results.
          </p>

          {/* PROGRESS HEADER */}

          <div className="mt-5 flex items-center justify-between">

            <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">
              Progress
            </span>

            <span className="text-xs font-black text-white">
              {progress}%
            </span>

          </div>

          {/* PROGRESS BAR */}

          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/20">

            <div
              className="h-full rounded-full bg-white transition-all duration-700 ease-out"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

          {/* TASK COUNT */}

          <p className="mt-2 text-[10px] font-medium text-white/70">
            {completedTasks} of {totalTasks} tasks completed
          </p>

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;