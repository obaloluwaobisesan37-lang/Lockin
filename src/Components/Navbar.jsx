import { useState } from "react";
import {
  Bell,
  Check,
  LogOut,
  Moon,
  Search,
  Sun,
  Trash2,
  X,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function getSavedAccount() {
  try {
    const saved = localStorage.getItem("lockin_auth_user");

    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function Navbar({
  darkMode,
  theme,
  changeTheme,
  globalSearch,
  setGlobalSearch,
  notificationsList = [],
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  clearNotifications,
}) {
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] =
    useState(false);

  const account = getSavedAccount();

  const profileName =
    account?.name?.trim() || "Account";

  const avatarLetter =
    profileName.charAt(0).toUpperCase();

  const unreadCount = notificationsList.filter(
    (notification) => !notification.read
  ).length;

  const handleThemeToggle = () => {
    changeTheme?.();
  };

  const handleNotificationToggle = () => {
    setShowNotifications((current) => !current);
  };

  const handleMarkNotificationRead = (id) => {
    markNotificationRead?.(id);
  };

  const handleMarkAllRead = () => {
    markAllNotificationsRead?.();
  };

  const handleDeleteNotification = (id) => {
    deleteNotification?.(id);
  };

  const handleClearNotifications = () => {
    clearNotifications?.();
  };

  const handleSignOut = () => {
    localStorage.removeItem("lockin_session");

    sessionStorage.removeItem(
      "lockin_archive_unlocked"
    );

    navigate("/signin", {
      replace: true,
    });
  };

  return (
    <header
      className="
        sticky
        top-0
        z-40
        border-b
        border-[#e3ded6]
        bg-[#f6f4ef]/90
        backdrop-blur-2xl
        dark:border-[#303530]
        dark:bg-[#111411]/90
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
        {/* =====================================================
            SEARCH
        ===================================================== */}

        <div className="min-w-0 flex-1">
          <div
            className="
              group
              flex
              h-11
              w-full
              max-w-[560px]
              items-center
              gap-3
              rounded-[15px]
              border
              border-[#ded9d1]
              bg-white
              px-3.5
              transition-all
              duration-200
              focus-within:border-[#765b6b]/50
              focus-within:shadow-[0_0_0_4px_rgba(118,91,107,0.07)]
              dark:border-[#343934]
              dark:bg-[#1b1f1c]
              dark:focus-within:border-[#c9aebe]/40
              dark:focus-within:shadow-[0_0_0_4px_rgba(201,174,190,0.05)]
            "
          >
            <Search
              size={18}
              strokeWidth={2}
              className="
                shrink-0
                text-[#918b82]
                transition-colors
                group-focus-within:text-[#765b6b]
                dark:group-focus-within:text-[#c9aebe]
              "
            />

            <input
              type="text"
              value={globalSearch}
              onChange={(event) =>
                setGlobalSearch?.(
                  event.target.value
                )
              }
              placeholder="Search your workspace..."
              className="
                min-w-0
                flex-1
                bg-transparent
                text-[13px]
                font-semibold
                tracking-[-0.01em]
                text-[#292725]
                outline-none
                placeholder:text-[#aaa49c]
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
                  flex
                  h-7
                  w-7
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  text-[#918b82]
                  transition
                  hover:bg-[#eeeae4]
                  hover:text-[#292725]
                  dark:hover:bg-[#303530]
                  dark:hover:text-white
                "
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}

            {!globalSearch && (
              <span
                className="
                  hidden
                  rounded-md
                  border
                  border-[#e5e0d8]
                  bg-[#f8f6f1]
                  px-1.5
                  py-0.5
                  text-[9px]
                  font-black
                  tracking-wide
                  text-[#aaa49c]
                  lg:block
                  dark:border-[#343934]
                  dark:bg-[#252a26]
                "
              >
                SEARCH
              </span>
            )}
          </div>
        </div>

        {/* =====================================================
            RIGHT CONTROLS
        ===================================================== */}

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {/* =================================================
              ACCOUNT
          ================================================= */}

          <button
            type="button"
            onClick={() => navigate("/profile")}
            title="Open profile"
            className="
              hidden
              items-center
              gap-2.5
              rounded-[14px]
              border
              border-[#ded9d1]
              bg-white
              px-2
              py-1.5
              text-left
              transition-all
              duration-200
              hover:border-[#765b6b]/25
              hover:bg-[#faf9f6]
              sm:flex
              dark:border-[#343934]
              dark:bg-[#1b1f1c]
              dark:hover:border-[#c9aebe]/25
              dark:hover:bg-[#202520]
            "
          >
            <div
              className="
                relative
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-[10px]
                bg-[#765b6b]
                text-[11px]
                font-black
                uppercase
                text-white
                shadow-[0_3px_0_#594451]
              "
            >
              {avatarLetter}

              <span
                className="
                  absolute
                  -bottom-0.5
                  -right-0.5
                  h-2
                  w-2
                  rounded-full
                  border-2
                  border-white
                  bg-[#557a62]
                  dark:border-[#1b1f1c]
                "
              />
            </div>

            <div className="hidden min-w-0 md:block">
              <p
                className="
                  max-w-[120px]
                  truncate
                  text-[11px]
                  font-black
                  text-[#292725]
                  dark:text-white
                "
              >
                {profileName}
              </p>

              <p
                className="
                  mt-0.5
                  text-[8px]
                  font-black
                  uppercase
                  tracking-[0.14em]
                  text-[#a09a91]
                "
              >
                Account
              </p>
            </div>
          </button>

          {/* =================================================
              THEME
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
              h-10
              w-10
              items-center
              justify-center
              rounded-[13px]
              border
              border-[#ded9d1]
              bg-white
              text-[#765b6b]
              transition-all
              duration-200
              hover:border-[#765b6b]/30
              hover:bg-[#f5eef2]
              dark:border-[#343934]
              dark:bg-[#1b1f1c]
              dark:text-[#c9aebe]
              dark:hover:bg-[#252a26]
            "
          >
            {darkMode ? (
              <Sun
                size={18}
                strokeWidth={2.2}
              />
            ) : (
              <Moon
                size={18}
                strokeWidth={2.2}
              />
            )}
          </button>

          {/* =================================================
              NOTIFICATIONS
          ================================================= */}

          <div className="relative">
            <button
              type="button"
              title="Notifications"
              aria-label="Notifications"
              aria-expanded={showNotifications}
              onClick={handleNotificationToggle}
              className={`
                relative
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-[13px]
                border
                transition-all
                duration-200
                ${
                  showNotifications
                    ? `
                      border-[#765b6b]/30
                      bg-[#f5eef2]
                      text-[#765b6b]
                      dark:border-[#c9aebe]/25
                      dark:bg-[#30282e]
                      dark:text-[#c9aebe]
                    `
                    : `
                      border-[#ded9d1]
                      bg-white
                      text-[#716d66]
                      hover:border-[#765b6b]/25
                      hover:bg-[#faf9f6]
                      hover:text-[#765b6b]
                      dark:border-[#343934]
                      dark:bg-[#1b1f1c]
                      dark:text-[#a6ada6]
                      dark:hover:bg-[#252a26]
                      dark:hover:text-[#c9aebe]
                    `
                }
              `}
            >
              <Bell
                size={18}
                strokeWidth={
                  showNotifications ? 2.3 : 2
                }
              />

              {unreadCount > 0 && (
                <span
                  className="
                    absolute
                    -right-0.5
                    -top-0.5
                    flex
                    h-[17px]
                    min-w-[17px]
                    items-center
                    justify-center
                    rounded-full
                    border-2
                    border-[#f6f4ef]
                    bg-[#765b6b]
                    px-1
                    text-[8px]
                    font-black
                    text-white
                    dark:border-[#111411]
                  "
                >
                  {unreadCount > 9
                    ? "9+"
                    : unreadCount}
                </span>
              )}
            </button>

            {/* ===============================================
                NOTIFICATION PANEL
            =============================================== */}

            {showNotifications && (
              <>
                <button
                  type="button"
                  aria-label="Close notifications"
                  onClick={() =>
                    setShowNotifications(false)
                  }
                  className="
                    fixed
                    inset-0
                    z-40
                    cursor-default
                    bg-black/10
                    backdrop-blur-[2px]
                    sm:hidden
                  "
                />

                <div
                  className="
                    fixed
                    left-3
                    right-3
                    top-[80px]
                    z-50
                    overflow-hidden
                    rounded-[22px]
                    border
                    border-[#ded9d1]
                    bg-[#f8f6f1]
                    shadow-[0_24px_70px_rgba(41,39,37,0.16)]
                    sm:absolute
                    sm:left-auto
                    sm:right-0
                    sm:top-[calc(100%+10px)]
                    sm:w-[390px]
                    dark:border-[#343934]
                    dark:bg-[#1b1f1c]
                    dark:shadow-[0_24px_70px_rgba(0,0,0,0.35)]
                  "
                >
                  {/* PANEL HEADER */}

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      border-b
                      border-[#e5e0d8]
                      px-4
                      py-3.5
                      dark:border-[#303530]
                    "
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-[11px]
                          bg-[#f0e9ee]
                          text-[#765b6b]
                          dark:bg-[#332a30]
                          dark:text-[#c9aebe]
                        "
                      >
                        <Bell
                          size={16}
                          strokeWidth={2.2}
                        />
                      </div>

                      <div>
                        <p
                          className="
                            text-[13px]
                            font-black
                            tracking-[-0.01em]
                            text-[#292725]
                            dark:text-white
                          "
                        >
                          Notifications
                        </p>

                        <p
                          className="
                            mt-0.5
                            text-[9px]
                            font-bold
                            text-[#9b958d]
                          "
                        >
                          {unreadCount === 0
                            ? "You're all caught up"
                            : `${unreadCount} unread`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5">
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={
                            handleMarkAllRead
                          }
                          title="Mark all as read"
                          aria-label="Mark all as read"
                          className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-lg
                            text-[#765b6b]
                            transition
                            hover:bg-[#f0e9ee]
                            dark:text-[#c9aebe]
                            dark:hover:bg-[#332a30]
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
                            handleClearNotifications
                          }
                          title="Clear all notifications"
                          aria-label="Clear all notifications"
                          className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-lg
                            text-[#a39b92]
                            transition
                            hover:bg-rose-50
                            hover:text-rose-500
                            dark:hover:bg-rose-950/20
                            dark:hover:text-rose-400
                          "
                        >
                          <Trash2 size={14} />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          setShowNotifications(
                            false
                          )
                        }
                        title="Close"
                        aria-label="Close notifications"
                        className="
                          flex
                          h-8
                          w-8
                          items-center
                          justify-center
                          rounded-lg
                          text-[#a39b92]
                          transition
                          hover:bg-[#eeeae4]
                          hover:text-[#292725]
                          dark:hover:bg-[#303530]
                          dark:hover:text-white
                        "
                      >
                        <X size={15} />
                      </button>
                    </div>
                  </div>

                  {/* NOTIFICATION LIST */}

                  <div
                    className="
                      max-h-[65vh]
                      overflow-y-auto
                      sm:max-h-[360px]
                    "
                  >
                    {notificationsList.length ===
                    0 ? (
                      <div
                        className="
                          px-6
                          py-12
                          text-center
                        "
                      >
                        <div
                          className="
                            mx-auto
                            flex
                            h-14
                            w-14
                            items-center
                            justify-center
                            rounded-[17px]
                            border
                            border-[#e6e0d8]
                            bg-white
                            text-[#765b6b]
                            shadow-sm
                            dark:border-[#343934]
                            dark:bg-[#222722]
                            dark:text-[#c9aebe]
                          "
                        >
                          <Bell size={22} />
                        </div>

                        <p
                          className="
                            mt-4
                            text-[12px]
                            font-black
                            text-[#292725]
                            dark:text-white
                          "
                        >
                          Nothing new
                        </p>

                        <p
                          className="
                            mx-auto
                            mt-1
                            max-w-[220px]
                            text-[10px]
                            leading-5
                            text-[#918b82]
                          "
                        >
                          New task activity and
                          important updates will
                          appear here.
                        </p>
                      </div>
                    ) : (
                      notificationsList
                        .slice(0, 20)
                        .map((notification) => (
                          <div
                            key={
                              notification.id
                            }
                            className={`
                              group
                              flex
                              items-start
                              gap-3
                              border-b
                              border-[#eeeae4]
                              px-4
                              py-3.5
                              transition
                              last:border-b-0
                              dark:border-[#303530]
                              ${
                                notification.read
                                  ? "bg-transparent"
                                  : "bg-[#765b6b]/[0.045] dark:bg-[#765b6b]/[0.08]"
                              }
                            `}
                          >
                            {/* STATUS DOT */}

                            <div className="pt-1.5">
                              <span
                                className={`
                                  block
                                  h-2
                                  w-2
                                  rounded-full
                                  ${
                                    notification.read
                                      ? "bg-[#d2cec7]"
                                      : "bg-[#765b6b]"
                                  }
                                `}
                              />
                            </div>

                            {/* MESSAGE */}

                            <button
                              type="button"
                              onClick={() =>
                                handleMarkNotificationRead(
                                  notification.id
                                )
                              }
                              className="
                                min-w-0
                                flex-1
                                text-left
                                outline-none
                              "
                            >
                              <p
                                className={`
                                  text-[11px]
                                  leading-[1.65]
                                  ${
                                    notification.read
                                      ? "font-medium text-[#817b73] dark:text-[#929a92]"
                                      : "font-bold text-[#292725] dark:text-white"
                                  }
                                `}
                              >
                                {
                                  notification.message
                                }
                              </p>

                              {notification.createdAt && (
                                <p
                                  className="
                                    mt-1.5
                                    text-[8px]
                                    font-bold
                                    tracking-wide
                                    text-[#aaa49c]
                                  "
                                >
                                  {new Date(
                                    notification.createdAt
                                  ).toLocaleString()}
                                </p>
                              )}
                            </button>

                            {/* NEW */}

                            {!notification.read && (
                              <span
                                className="
                                  mt-0.5
                                  rounded-full
                                  bg-[#f0e9ee]
                                  px-2
                                  py-1
                                  text-[7px]
                                  font-black
                                  tracking-[0.12em]
                                  text-[#765b6b]
                                  dark:bg-[#332a30]
                                  dark:text-[#c9aebe]
                                "
                              >
                                NEW
                              </span>
                            )}

                            {/* DELETE */}

                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteNotification(
                                  notification.id
                                )
                              }
                              title="Delete notification"
                              aria-label={`Delete notification: ${notification.message}`}
                              className="
                                flex
                                h-7
                                w-7
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                text-[#b0aaa2]
                                opacity-60
                                transition
                                hover:bg-rose-50
                                hover:text-rose-500
                                hover:opacity-100
                                dark:hover:bg-rose-950/20
                                dark:hover:text-rose-400
                              "
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ))
                    )}
                  </div>

                  {/* FOOTER */}

                  {notificationsList.length >
                    20 && (
                    <div
                      className="
                        border-t
                        border-[#e5e0d8]
                        px-4
                        py-2.5
                        text-center
                        dark:border-[#303530]
                      "
                    >
                      <p
                        className="
                          text-[9px]
                          font-bold
                          text-[#918b82]
                        "
                      >
                        Showing the latest 20
                        notifications
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* =================================================
              SIGN OUT
          ================================================= */}

          <button
            type="button"
            onClick={handleSignOut}
            title="Sign out"
            aria-label="Sign out"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-[13px]
              border
              border-[#ded9d1]
              bg-white
              text-[#716d66]
              transition-all
              duration-200
              hover:border-rose-200
              hover:bg-rose-50
              hover:text-rose-500
              dark:border-[#343934]
              dark:bg-[#1b1f1c]
              dark:text-[#a6ada6]
              dark:hover:border-rose-900
              dark:hover:bg-rose-950/20
              dark:hover:text-rose-400
            "
          >
            <LogOut
              size={17}
              strokeWidth={2}
            />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;