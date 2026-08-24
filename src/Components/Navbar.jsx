import {
  Bell,
  CheckCircle2,
  Clock3,
  Moon,
  Plus,
  Search,
  Sparkles,
  Sun,
  Target,
  Trash2,
  Undo2,
  X,
  Zap,
  Trophy,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar({
  darkMode,
  setDarkMode,
  globalSearch = "",
  setGlobalSearch,
  focusTask = null,
  onStopFocus,

  notifications = [],
  notificationsRead = true,
  onMarkNotificationsRead,
  onClearNotifications,
}) {
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState(globalSearch);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    setSearchInput(globalSearch);
  }, [globalSearch]);

  // ==========================================
  // SEARCH
  // ==========================================

  const handleSearchChange = (event) => {
    const value = event.target.value;

    setSearchInput(value);

    if (setGlobalSearch) {
      setGlobalSearch(value);
    }

    if (value.trim() && window.location.pathname !== "/todos") {
      navigate("/todos");
    }
  };

  const clearSearch = () => {
    setSearchInput("");

    if (setGlobalSearch) {
      setGlobalSearch("");
    }
  };

  // ==========================================
  // NEW TASK
  // ==========================================

  const handleNewTask = () => {
    navigate("/todos?new=true");
  };

  // ==========================================
  // NOTIFICATIONS
  // ==========================================

  const openNotifications = () => {
    const nextState = !showNotifications;

    setShowNotifications(nextState);

    if (nextState && onMarkNotificationsRead) {
      onMarkNotificationsRead();
    }
  };

  // ==========================================
  // NOTIFICATION ICONS
  // ==========================================

  const getNotificationStyle = (type) => {
    switch (type) {
      case "task":
        return {
          icon: CheckCircle2,
          box: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
        };

      case "success":
        return {
          icon: Sparkles,
          box: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400",
        };

      case "delete":
        return {
          icon: Trash2,
          box: "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400",
        };

      case "xp":
        return {
          icon: Zap,
          box: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
        };

      case "mission":
        return {
          icon: Target,
          box: "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400",
        };

      case "focus":
        return {
          icon: Clock3,
          box: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
        };

      case "energy":
        return {
          icon: Zap,
          box: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400",
        };

      case "badge":
        return {
          icon: Trophy,
          box: "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400",
        };

      case "reset":
        return {
          icon: Undo2,
          box: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
        };

      default:
        return {
          icon: Bell,
          box: "bg-[#eef3ec] text-[#4f6f52] dark:bg-[#263328] dark:text-[#a8c5a5]",
        };
    }
  };

  // ==========================================
  // DATE / TIME
  // ==========================================

  const formatTime = (date) => {
    if (!date) return "";

    try {
      return new Date(date).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  const formatDate = (date) => {
    if (!date) return "";

    try {
      return new Date(date).toLocaleDateString([], {
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-[#f7f7f5]/90 backdrop-blur-2xl dark:border-[#292e2b] dark:bg-[#111411]/90">

      <div className="flex min-h-[76px] items-center gap-3 px-3 sm:gap-4 sm:px-6 lg:px-8">

        {/* ===================================== */}
        {/* DESKTOP BRAND */}
        {/* ===================================== */}

        <button
          type="button"
          onClick={() => navigate("/")}
          aria-label="Go to Lockin home"
          className="group hidden shrink-0 items-center gap-3 text-left sm:flex"
        >
          <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-[15px] bg-[#4f6f52] shadow-[0_4px_0_#344a37] transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[0_6px_0_#344a37]">

            <div className="absolute -right-3 -top-3 h-9 w-9 rounded-full bg-white/10" />

            <div className="absolute -bottom-4 -left-3 h-8 w-8 rounded-full bg-black/5" />

            <span className="relative text-xl font-black tracking-[-0.09em] text-white">
              L
            </span>
          </div>

          <div className="leading-none">
            <div className="flex items-center gap-1.5">
              <span className="text-[21px] font-black tracking-[-0.05em] text-slate-900 dark:text-white">
                Lockin
              </span>

              <span className="h-1.5 w-1.5 rounded-full bg-[#6f9274]" />
            </div>

            <span className="mt-1.5 block text-[8px] font-black uppercase tracking-[0.28em] text-[#6f9274]">
              Productivity
            </span>
          </div>
        </button>

        {/* ===================================== */}
        {/* MOBILE BRAND */}
        {/* ===================================== */}

        <button
          type="button"
          onClick={() => navigate("/")}
          aria-label="Go to Lockin home"
          className="flex shrink-0 items-center sm:hidden"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-[#4f6f52] shadow-[0_3px_0_#344a37] transition-transform duration-200 active:translate-y-0.5">
            <span className="text-lg font-black tracking-[-0.08em] text-white">
              L
            </span>
          </div>
        </button>

        {/* ===================================== */}
        {/* SEARCH */}
        {/* ===================================== */}

        <div className="relative min-w-0 max-w-xl flex-1">

          <Search
            size={18}
            strokeWidth={2.2}
            className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-400 transition-colors"
          />

          <input
            type="text"
            value={searchInput}
            onChange={handleSearchChange}
            placeholder="Search tasks..."
            className="w-full rounded-[15px] border border-slate-200/90 bg-white/80 py-3 pl-11 pr-11 text-sm font-medium text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-[#4f6f52] focus:bg-white focus:ring-4 focus:ring-[#4f6f52]/10 dark:border-[#343a35] dark:bg-[#1b1f1c]/80 dark:text-white dark:placeholder:text-slate-500 dark:hover:border-[#444b45] dark:focus:border-[#6f9274] dark:focus:bg-[#1b1f1c]"
          />

          {searchInput && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-700 active:scale-95 dark:hover:bg-[#252a26] dark:hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* ===================================== */}
        {/* RIGHT CONTROLS */}
        {/* ===================================== */}

        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">

          {/* FOCUS MODE */}

          {focusTask && (
            <button
              type="button"
              onClick={onStopFocus}
              className="hidden items-center gap-2 rounded-xl bg-[#4f6f52] px-3 py-2.5 text-xs font-black text-white shadow-[0_4px_0_#344a37] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#3f5d43] hover:shadow-[0_6px_0_#344a37] active:translate-y-0 sm:flex"
            >
              <Zap size={15} fill="currentColor" />
              Locked in
            </button>
          )}

          {/* NEW TASK */}

          <button
            type="button"
            onClick={handleNewTask}
            className="group inline-flex items-center gap-2 rounded-xl bg-[#4f6f52] px-3 py-2.5 text-sm font-bold text-white shadow-[0_4px_0_#344a37] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#3f5d43] hover:shadow-[0_6px_0_#344a37] active:translate-y-0.5 sm:px-4"
          >
            <Plus
              size={18}
              strokeWidth={2.5}
              className="transition-transform duration-200 group-hover:rotate-90"
            />

            <span className="hidden sm:inline">
              New Task
            </span>
          </button>

          {/* ================================= */}
          {/* NOTIFICATIONS */}
          {/* ================================= */}

          <div className="relative">

            <button
              type="button"
              onClick={openNotifications}
              aria-label="Notifications"
              className={`relative rounded-xl p-2.5 transition-all duration-200 ${
                unreadCount > 0
                  ? "bg-[#eef3ec] text-[#4f6f52] dark:bg-[#263328] dark:text-[#a8c5a5]"
                  : "text-slate-500 hover:bg-slate-200 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-[#252a26] dark:hover:text-white"
              }`}
            >
              <Bell
                size={20}
                strokeWidth={2.1}
                className={
                  unreadCount > 0
                    ? "animate-[pulse_2s_ease-in-out_infinite]"
                    : ""
                }
              />

              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-black text-white ring-2 ring-[#f7f7f5] dark:ring-[#111411]">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* NOTIFICATION POPUP */}

            {showNotifications && (
              <div className="absolute right-0 top-14 z-[100] w-[360px] max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-[24px] border border-slate-200/80 bg-white/95 shadow-[0_24px_70px_rgba(0,0,0,0.18)] backdrop-blur-xl dark:border-[#343a35] dark:bg-[#1b1f1c]/95">

                {/* HEADER */}

                <div className="border-b border-slate-200/80 px-5 py-4 dark:border-[#343a35]">

                  <div className="flex items-center justify-between">

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-black tracking-tight text-slate-900 dark:text-white">
                          Notifications
                        </h3>

                        {unreadCount > 0 && (
                          <span className="rounded-full bg-[#4f6f52] px-2 py-0.5 text-[10px] font-black text-white">
                            {unreadCount} new
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-xs text-slate-400">
                        Everything happening in Lockin
                      </p>
                    </div>

                    {notifications.length > 0 && (
                      <button
                        type="button"
                        onClick={onClearNotifications}
                        className="rounded-lg px-2 py-1 text-[10px] font-bold text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-950/30"
                      >
                        Clear
                      </button>
                    )}

                  </div>
                </div>

                {/* LIST */}

                {notifications.length > 0 ? (
                  <div className="max-h-[430px] overflow-y-auto">

                    {notifications.map((notification) => {
                      const style = getNotificationStyle(
                        notification.type
                      );

                      const Icon = style.icon;

                      return (
                        <div
                          key={notification.id}
                          className={`group relative flex gap-3 border-b border-slate-100 p-4 transition-all duration-200 last:border-b-0 dark:border-[#343a35] ${
                            notification.read
                              ? "opacity-70"
                              : "bg-[#fafcf9] dark:bg-[#1e241f]"
                          } hover:bg-slate-50 dark:hover:bg-[#252a26]`}
                        >
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition duration-200 group-hover:scale-105 ${style.box}`}
                          >
                            <Icon
                              size={19}
                              strokeWidth={2.2}
                            />
                          </div>

                          <div className="min-w-0 flex-1">

                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-black text-slate-800 dark:text-white">
                                {notification.title}
                              </p>

                              {!notification.read && (
                                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#5f8565]" />
                              )}
                            </div>

                            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                              {notification.message}
                            </p>

                            <div className="mt-2 flex items-center gap-2">
                              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                                {formatTime(notification.createdAt)}
                              </span>

                              <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600" />

                              <span className="text-[10px] font-semibold text-slate-400">
                                {formatDate(notification.createdAt)}
                              </span>
                            </div>

                          </div>
                        </div>
                      );
                    })}

                  </div>
                ) : (
                  <div className="p-8 text-center">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#eef3ec] text-[#4f6f52] dark:bg-[#263328] dark:text-[#a8c5a5]">
                      <Bell size={25} />
                    </div>

                    <p className="mt-4 text-sm font-black text-slate-800 dark:text-white">
                      You're all caught up
                    </p>

                    <p className="mx-auto mt-1.5 max-w-[240px] text-xs leading-5 text-slate-400">
                      Everything you do in Lockin will appear here.
                    </p>

                  </div>
                )}

              </div>
            )}
          </div>

          {/* ================================= */}
          {/* DARK MODE */}
          {/* ================================= */}

          <button
            type="button"
            onClick={() =>
              setDarkMode((current) => !current)
            }
            aria-label={
              darkMode
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
            className="rounded-xl p-2.5 text-slate-500 transition-all duration-200 hover:bg-slate-200 hover:text-slate-800 active:scale-95 dark:text-slate-400 dark:hover:bg-[#252a26] dark:hover:text-white"
          >
            {darkMode ? (
              <Sun size={20} />
            ) : (
              <Moon size={20} />
            )}
          </button>

        </div>
      </div>
    </header>
  );
}

export default Navbar;
