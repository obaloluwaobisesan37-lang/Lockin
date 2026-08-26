import {
  Bell,
  Check,
  Moon,
  Search,
  Sun,
  Trash2,
  X,
} from "lucide-react";

function Navbar({
  darkMode,
  theme,
  changeTheme,
  globalSearch,
  setGlobalSearch,
  notificationsList = [],
  markNotificationRead,
  markAllNotificationsRead,
  clearNotifications,
}) {
  const unreadCount = notificationsList.filter(
    (notification) => !notification.read
  ).length;

  const handleThemeToggle = () => {
    // IMPORTANT:
    // Navbar only switches LIGHT <-> DARK.
    //
    // It does NOT select System.
    //
    // If Settings currently has System selected,
    // this uses the currently displayed mode.

    changeTheme?.();
  };

  return (
    <header
      className="
        sticky
        top-0
        z-40
        border-b
        border-[#e4e0d9]
        bg-[#f6f4ef]/95
        backdrop-blur-xl
        dark:border-[#30352f]
        dark:bg-[#111411]/95
      "
    >
      <div
        className="
          flex
          min-h-[72px]
          items-center
          gap-3
          px-4
          sm:px-6
          lg:px-8
        "
      >
        {/* =================================================
            SEARCH
        ================================================= */}

        <div className="min-w-0 flex-1">
          <div
            className="
              flex
              h-11
              max-w-xl
              items-center
              gap-3
              rounded-2xl
              border
              border-[#ded9d1]
              bg-white
              px-3.5
              transition
              focus-within:border-[#765b6b]
              focus-within:ring-2
              focus-within:ring-[#765b6b]/10
              dark:border-[#343934]
              dark:bg-[#1b1f1c]
            "
          >
            <Search
              size={18}
              className="shrink-0 text-[#918b82]"
            />

            <input
              type="text"
              value={globalSearch}
              onChange={(event) =>
                setGlobalSearch?.(
                  event.target.value
                )
              }
              placeholder="Search tasks..."
              className="
                min-w-0
                flex-1
                bg-transparent
                text-sm
                font-semibold
                text-[#292725]
                outline-none
                placeholder:text-[#a6a097]
                dark:text-white
                dark:placeholder:text-[#777d77]
              "
            />

            {globalSearch && (
              <button
                type="button"
                onClick={() =>
                  setGlobalSearch?.("")
                }
                className="
                  rounded-lg
                  p-1.5
                  text-[#918b82]
                  transition
                  hover:bg-[#eeeae4]
                  hover:text-[#292725]
                  dark:hover:bg-[#303530]
                  dark:hover:text-white
                "
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <div className="flex shrink-0 items-center gap-2">
          {/* =================================================
              THEME BUTTON

              LIGHT -> DARK
              DARK -> LIGHT

              SYSTEM IS NEVER SELECTED HERE.
          ================================================= */}

          <button
            type="button"
            onClick={handleThemeToggle}
            title={
              darkMode
                ? "Switch to Light mode"
                : "Switch to Dark mode"
            }
            aria-label={
              darkMode
                ? "Switch to Light mode"
                : "Switch to Dark mode"
            }
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              border
              border-[#ded9d1]
              bg-white
              text-[#765b6b]
              shadow-sm
              transition
              hover:-translate-y-0.5
              hover:border-[#765b6b]/40
              hover:bg-[#765b6b]/5
              dark:border-[#343934]
              dark:bg-[#1b1f1c]
              dark:text-[#c7aebe]
              dark:hover:bg-[#232823]
            "
          >
            {darkMode ? (
              <Sun size={19} />
            ) : (
              <Moon size={19} />
            )}
          </button>

          {/* =================================================
              NOTIFICATIONS
          ================================================= */}

          <div className="group relative">
            <button
              type="button"
              title="Notifications"
              aria-label="Notifications"
              className="
                relative
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                border
                border-[#ded9d1]
                bg-white
                text-[#6f6a63]
                shadow-sm
                transition
                hover:-translate-y-0.5
                hover:border-[#765b6b]/30
                hover:text-[#765b6b]
                dark:border-[#343934]
                dark:bg-[#1b1f1c]
                dark:text-[#a6ada6]
                dark:hover:bg-[#232823]
                dark:hover:text-[#c7aebe]
              "
            >
              <Bell size={19} />

              {unreadCount > 0 && (
                <span
                  className="
                    absolute
                    right-1.5
                    top-1.5
                    flex
                    h-4
                    min-w-4
                    items-center
                    justify-center
                    rounded-full
                    bg-[#765b6b]
                    px-1
                    text-[9px]
                    font-black
                    text-white
                  "
                >
                  {unreadCount > 9
                    ? "9+"
                    : unreadCount}
                </span>
              )}
            </button>

            {/* Notification dropdown */}

            <div
              className="
                invisible
                absolute
                right-0
                top-[calc(100%+10px)]
                z-50
                w-[min(360px,calc(100vw-2rem))]
                translate-y-2
                overflow-hidden
                rounded-2xl
                border
                border-[#ded9d1]
                bg-white
                opacity-0
                shadow-2xl
                transition-all
                duration-200
                group-hover:visible
                group-hover:translate-y-0
                group-hover:opacity-100
                dark:border-[#343934]
                dark:bg-[#1b1f1c]
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  border-b
                  border-[#e8e4dd]
                  px-4
                  py-3
                  dark:border-[#343934]
                "
              >
                <div>
                  <p className="text-sm font-black">
                    Notifications
                  </p>

                  <p className="text-[11px] text-[#918b82]">
                    {unreadCount} unread
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={
                        markAllNotificationsRead
                      }
                      title="Mark all as read"
                      className="
                        rounded-lg
                        p-2
                        text-[#765b6b]
                        transition
                        hover:bg-[#765b6b]/10
                      "
                    >
                      <Check size={15} />
                    </button>
                  )}

                  {notificationsList.length >
                    0 && (
                    <button
                      type="button"
                      onClick={
                        clearNotifications
                      }
                      title="Clear notifications"
                      className="
                        rounded-lg
                        p-2
                        text-rose-500
                        transition
                        hover:bg-rose-50
                        dark:hover:bg-rose-950/20
                      "
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notificationsList.length ===
                0 ? (
                  <div className="px-5 py-8 text-center">
                    <Bell
                      size={24}
                      className="mx-auto text-[#b2ada5]"
                    />

                    <p className="mt-2 text-xs font-bold text-[#918b82]">
                      No notifications
                    </p>
                  </div>
                ) : (
                  notificationsList
                    .slice(0, 20)
                    .map((notification) => (
                      <button
                        key={notification.id}
                        type="button"
                        onClick={() =>
                          markNotificationRead?.(
                            notification.id
                          )
                        }
                        className={`
                          flex
                          w-full
                          gap-3
                          border-b
                          border-[#eeeae4]
                          px-4
                          py-3
                          text-left
                          transition
                          last:border-b-0
                          dark:border-[#30352f]
                          ${
                            notification.read
                              ? "bg-transparent"
                              : "bg-[#765b6b]/5 dark:bg-[#765b6b]/10"
                          }
                        `}
                      >
                        <span
                          className={`
                            mt-1.5
                            h-2
                            w-2
                            shrink-0
                            rounded-full
                            ${
                              notification.read
                                ? "bg-[#d2cec7]"
                                : "bg-[#765b6b]"
                            }
                          `}
                        />

                        <div className="min-w-0">
                          <p
                            className={`
                              text-xs
                              leading-5
                              ${
                                notification.read
                                  ? "text-[#77716a] dark:text-[#929a92]"
                                  : "font-bold text-[#292725] dark:text-white"
                              }
                            `}
                          >
                            {
                              notification.message
                            }
                          </p>
                        </div>
                      </button>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;