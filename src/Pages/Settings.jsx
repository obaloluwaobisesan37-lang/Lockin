
import {
  Bell,
  CheckCircle2,
  ChevronRight,
  Database,
  Moon,
  Palette,
  RotateCcw,
  Sun,
  Trash2,
  Volume2,
  VolumeX,
  Zap,
  Trophy,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

function Settings() {
  const {
    darkMode,
    setDarkMode,
    tasks = [],
    clearCompleted,
    clearAllTasks,

    xp = 0,
    level = 1,
    energy = 100,

    focusMode = false,
    setFocusMode,

    badges = [],

    resetAllProgress,
    resetEverything,
  } = useOutletContext();

  const [notifications, setNotifications] = useState(() => {
    return (
      localStorage.getItem("lockin_notifications") !== "false"
    );
  });

  const [sound, setSound] = useState(() => {
    return localStorage.getItem("lockin_sound") !== "false";
  });

  const [showResetProgress, setShowResetProgress] =
    useState(false);

  const [showDeleteAll, setShowDeleteAll] =
    useState(false);

  const [showResetEverything, setShowResetEverything] =
    useState(false);

  // =========================
  // SAVE NOTIFICATION SETTING
  // =========================

  useEffect(() => {
    localStorage.setItem(
      "lockin_notifications",
      String(notifications)
    );
  }, [notifications]);

  // =========================
  // SAVE SOUND SETTING
  // =========================

  useEffect(() => {
    localStorage.setItem(
      "lockin_sound",
      String(sound)
    );
  }, [sound]);

  // =========================
  // CHANGE THEME
  // =========================

  const changeTheme = (theme) => {
    if (theme === "dark") {
      setDarkMode(true);

      localStorage.setItem(
        "lockin_theme",
        "dark"
      );
    }

    if (theme === "light") {
      setDarkMode(false);

      localStorage.setItem(
        "lockin_theme",
        "light"
      );
    }

    if (theme === "system") {
      const prefersDark = window
        .matchMedia("(prefers-color-scheme: dark)")
        .matches;

      setDarkMode(prefersDark);

      localStorage.setItem(
        "lockin_theme",
        "system"
      );
    }
  };

  const currentTheme =
    localStorage.getItem("lockin_theme") ||
    (darkMode ? "dark" : "light");

  // =========================
  // CLEAR COMPLETED TASKS
  // =========================

  const handleClearCompleted = () => {
    if (tasks.length === 0) return;

    const confirmed = window.confirm(
      "Remove all completed tasks?"
    );

    if (confirmed) {
      clearCompleted?.();
    }
  };

  // =========================
  // RESET PROGRESS
  // =========================

  const confirmResetProgress = () => {
    resetAllProgress?.();
    setShowResetProgress(false);
  };

  // =========================
  // DELETE ALL TASKS
  // =========================

  const confirmDeleteAll = () => {
    clearAllTasks?.();
    setShowDeleteAll(false);
  };

  // =========================
  // RESET EVERYTHING
  // =========================

  const confirmResetEverything = () => {
    if (typeof resetEverything === "function") {
      resetEverything();
    }

    setShowResetEverything(false);
  };

  return (
    <div className="mx-auto w-full max-w-5xl pb-10">

      {/* =========================
          HEADER
      ========================= */}

      <div className="mb-8">
        <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">
          Settings
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
          Customize Lockin without messing with
          your actual tasks.
        </p>
      </div>

      {/* =========================
          FOCUS MODE
      ========================= */}

      <section className="mb-5 overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-[#343a35] dark:bg-[#1b1f1c]">

        <div className="flex items-center justify-between gap-5 p-5">

          <div className="flex items-start gap-3">

            <Zap
              size={20}
              className="mt-0.5 text-[#4f6f52]"
            />

            <div>
              <h2 className="font-black">
                Focus Mode
              </h2>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Go full lock-in when you need it.
              </p>
            </div>

          </div>

          <button
            type="button"
            aria-label="Toggle Focus Mode"
            aria-pressed={focusMode}
            onClick={() =>
              setFocusMode?.(
                (current) => !current
              )
            }
            className={`relative h-7 w-12 shrink-0 rounded-full transition ${
              focusMode
                ? "bg-[#4f6f52]"
                : "bg-slate-300 dark:bg-slate-700"
            }`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
                focusMode
                  ? "left-6"
                  : "left-1"
              }`}
            />
          </button>

        </div>
      </section>

      {/* =========================
          NOTIFICATIONS
      ========================= */}

      <section className="mb-5 overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-[#343a35] dark:bg-[#1b1f1c]">

        <div className="flex items-center gap-3 border-b border-slate-200 p-5 dark:border-[#343a35]">

          <Bell
            size={20}
            className="text-[#4f6f52]"
          />

          <div>
            <h2 className="font-black">
              Notifications
            </h2>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Control Lockin alerts.
            </p>
          </div>

        </div>

        <div className="divide-y divide-slate-200 dark:divide-[#343a35]">

          {/* TASK NOTIFICATIONS */}

          <div className="flex items-center justify-between gap-5 p-5">

            <div className="flex items-start gap-3">

              <Bell
                size={19}
                className="mt-0.5 text-slate-400"
              />

              <div>
                <p className="text-sm font-bold">
                  Task notifications
                </p>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Enable task reminders.
                </p>
              </div>

            </div>

            <button
              type="button"
              role="switch"
              aria-checked={notifications}
              onClick={() =>
                setNotifications(
                  (current) => !current
                )
              }
              className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                notifications
                  ? "bg-[#4f6f52]"
                  : "bg-slate-300 dark:bg-slate-700"
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
                  notifications
                    ? "left-6"
                    : "left-1"
                }`}
              />
            </button>

          </div>

          {/* SOUND */}

          <div className="flex items-center justify-between gap-5 p-5">

            <div className="flex items-start gap-3">

              {sound ? (
                <Volume2
                  size={19}
                  className="mt-0.5 text-slate-400"
                />
              ) : (
                <VolumeX
                  size={19}
                  className="mt-0.5 text-slate-400"
                />
              )}

              <div>
                <p className="text-sm font-bold">
                  Notification sounds
                </p>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Play sounds for notifications.
                </p>
              </div>

            </div>

            <button
              type="button"
              role="switch"
              aria-checked={sound}
              onClick={() =>
                setSound(
                  (current) => !current
                )
              }
              className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                sound
                  ? "bg-[#4f6f52]"
                  : "bg-slate-300 dark:bg-slate-700"
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
                  sound
                    ? "left-6"
                    : "left-1"
                }`}
              />
            </button>

          </div>

        </div>
      </section>

      {/* =========================
          INTERFACE
      ========================= */}

      <section className="mb-5 overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-[#343a35] dark:bg-[#1b1f1c]">

        <div className="flex items-center gap-3 border-b border-slate-200 p-5 dark:border-[#343a35]">

          <Palette
            size={20}
            className="text-[#4f6f52]"
          />

          <div>
            <h2 className="font-black">
              Interface
            </h2>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Choose your vibe.
            </p>
          </div>

        </div>

        <div className="p-5">

          <div className="grid gap-3 sm:grid-cols-3">

            {[
              {
                name: "light",
                label: "Light",
                icon: Sun,
                text: "Bright and clean.",
              },
              {
                name: "dark",
                label: "Dark",
                icon: Moon,
                text: "Easy on the eyes.",
              },
              {
                name: "system",
                label: "System",
                icon: Palette,
                text: "Follow your device.",
              },
            ].map((theme) => {

              const Icon = theme.icon;

              return (
                <button
                  key={theme.name}
                  type="button"
                  onClick={() =>
                    changeTheme(theme.name)
                  }
                  className={`rounded-2xl border p-4 text-left transition ${
                    currentTheme === theme.name
                      ? "border-[#4f6f52] bg-[#eef3ec] ring-2 ring-[#4f6f52]/20 dark:bg-[#263328]"
                      : "border-slate-200 hover:border-slate-300 dark:border-[#343a35]"
                  }`}
                >

                  <Icon
                    size={21}
                    className="text-[#4f6f52]"
                  />

                  <p className="mt-3 text-sm font-black">
                    {theme.label}
                  </p>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {theme.text}
                  </p>

                </button>
              );
            })}

          </div>

        </div>
      </section>

      {/* =========================
          XP / PROGRESS
      ========================= */}

      <section className="mb-5 overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-[#343a35] dark:bg-[#1b1f1c]">

        <div className="flex items-center gap-3 border-b border-slate-200 p-5 dark:border-[#343a35]">

          <Trophy
            size={20}
            className="text-yellow-500"
          />

          <div>
            <h2 className="font-black">
              Your Progress
            </h2>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Level {level} · {xp} XP · {energy} energy
            </p>
          </div>

        </div>

        <div className="p-5">

          <button
            type="button"
            onClick={() =>
              setShowResetProgress(true)
            }
            className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-white px-4 py-3 text-sm font-black text-violet-700 transition hover:bg-violet-100 dark:border-violet-900/50 dark:bg-[#1b1f1c] dark:text-violet-400"
          >
            <RotateCcw size={16} />
            Reset XP & Progress
          </button>

          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            This resets XP, level, energy,
            streaks and badges. Your tasks stay safe.
          </p>

          <div className="mt-5 flex items-center gap-2">

            <Trophy
              size={17}
              className="text-yellow-500"
            />

            <span className="text-xs font-bold">
              {badges.length} badge
              {badges.length === 1 ? "" : "s"} unlocked
            </span>

          </div>

        </div>
      </section>

      {/* =========================
          TASK DATA
      ========================= */}

      <section className="mb-5 overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-[#343a35] dark:bg-[#1b1f1c]">

        <div className="flex items-center gap-3 border-b border-slate-200 p-5 dark:border-[#343a35]">

          <Database
            size={20}
            className="text-[#4f6f52]"
          />

          <div>
            <h2 className="font-black">
              Task Data
            </h2>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage your tasks.
            </p>
          </div>

        </div>

        <div className="divide-y divide-slate-200 dark:divide-[#343a35]">

          {/* CLEAR COMPLETED */}

          <button
            type="button"
            onClick={handleClearCompleted}
            className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-slate-50 dark:hover:bg-[#202521]"
          >

            <div className="flex items-center gap-3">

              <CheckCircle2
                size={20}
                className="text-slate-400"
              />

              <div>
                <p className="text-sm font-bold">
                  Clear completed tasks
                </p>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Remove completed tasks only.
                </p>
              </div>

            </div>

            <ChevronRight
              size={18}
              className="text-slate-400"
            />

          </button>

          {/* DELETE ALL */}

          <button
            type="button"
            onClick={() =>
              setShowDeleteAll(true)
            }
            className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-rose-50 dark:hover:bg-rose-950/20"
          >

            <div className="flex items-center gap-3">

              <Trash2
                size={20}
                className="text-rose-500"
              />

              <div>
                <p className="text-sm font-bold text-rose-600">
                  Delete all tasks
                </p>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Permanently remove every task.
                </p>
              </div>

            </div>

            <ChevronRight
              size={18}
              className="text-rose-400"
            />

          </button>

        </div>
      </section>

      {/* =========================
          RESET EVERYTHING
      ========================= */}

      <section className="rounded-3xl border border-rose-200 bg-rose-50/50 p-5 dark:border-rose-900/40 dark:bg-rose-950/10">

        <div className="flex items-start gap-3">

          <RotateCcw
            size={20}
            className="mt-0.5 text-rose-500"
          />

          <div className="flex-1">

            <h2 className="font-black text-rose-700 dark:text-rose-400">
              Reset Everything
            </h2>

            <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500 dark:text-slate-400">
              Delete all tasks and reset your XP,
              level, energy, streaks and badges.
            </p>

            <button
              type="button"
              onClick={() =>
                setShowResetEverything(true)
              }
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-600 transition hover:bg-slate-50 dark:border-[#343a35] dark:bg-[#1b1f1c] dark:text-slate-300 dark:hover:bg-[#252a26]"
            >
              <RotateCcw size={16} />
              Reset Everything
            </button>

          </div>

        </div>

      </section>

      {/* =========================
          RESET PROGRESS MODAL
      ========================= */}

      {showResetProgress && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md"
          onClick={() =>
            setShowResetProgress(false)
          }
        >

          <div
            className="w-full max-w-md overflow-hidden rounded-[2rem] border border-violet-200 bg-white shadow-2xl dark:border-violet-900/50 dark:bg-[#1b1f1c]"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="bg-violet-600 p-6 text-white">

              <p className="text-xs font-black uppercase tracking-[0.2em] text-white/70">
                Progress Reset
              </p>

              <h2 className="mt-1 text-2xl font-black">
                Back to level 1?
              </h2>

            </div>

            <div className="p-6">

              <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                This will reset your XP, level,
                energy, streaks and badges.
              </p>

              <div className="mt-4 rounded-2xl bg-violet-50 p-4 dark:bg-violet-950/20">

                <p className="text-sm font-black text-violet-700 dark:text-violet-400">
                  Your tasks are safe 🛡️
                </p>

                <p className="mt-1 text-xs text-violet-600/70 dark:text-violet-400/70">
                  Nothing in your task list will be deleted.
                </p>

              </div>

              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={() =>
                    setShowResetProgress(false)
                  }
                  className="rounded-xl px-5 py-3 text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Keep Progress
                </button>

                <button
                  type="button"
                  onClick={confirmResetProgress}
                  className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-black text-white hover:bg-violet-700"
                >
                  Reset Progress
                </button>

              </div>

            </div>

          </div>
        </div>
      )}

      {/* =========================
          DELETE ALL MODAL
      ========================= */}

      {showDeleteAll && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md"
          onClick={() =>
            setShowDeleteAll(false)
          }
        >

          <div
            className="w-full max-w-md overflow-hidden rounded-[2rem] border border-rose-200 bg-white shadow-2xl dark:border-rose-900/50 dark:bg-[#1b1f1c]"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="bg-rose-500 p-6 text-white">

              <p className="text-xs font-black uppercase tracking-[0.2em] text-white/70">
                Danger Zone
              </p>

              <h2 className="mt-1 text-2xl font-black">
                Delete everything?
              </h2>

            </div>

            <div className="p-6">

              <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                You're about to delete{" "}
                <span className="font-black text-slate-800 dark:text-white">
                  {tasks.length}{" "}
                  {tasks.length === 1
                    ? "task"
                    : "tasks"}
                </span>
                .
              </p>

              <div className="mt-4 rounded-2xl bg-rose-50 p-4 dark:bg-rose-950/20">

                <p className="text-sm font-black text-rose-700 dark:text-rose-400">
                  This cannot be undone 💀
                </p>

                <p className="mt-1 text-xs text-rose-600/70 dark:text-rose-400/70">
                  Your tasks will be permanently removed.
                </p>

              </div>

              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={() =>
                    setShowDeleteAll(false)
                  }
                  className="rounded-xl px-5 py-3 text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Keep Tasks
                </button>

                <button
                  type="button"
                  onClick={confirmDeleteAll}
                  className="rounded-xl bg-rose-500 px-5 py-3 text-sm font-black text-white hover:bg-rose-600"
                >
                  Delete Everything
                </button>

              </div>

            </div>

          </div>
        </div>
      )}

      {/* =========================
          RESET EVERYTHING MODAL
      ========================= */}

      {showResetEverything && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
          onClick={() =>
            setShowResetEverything(false)
          }
        >

          <div
            className="w-full max-w-md overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl dark:border-[#343a35] dark:bg-[#1b1f1c]"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="bg-slate-900 p-6 text-white dark:bg-black">

              <p className="text-xs font-black uppercase tracking-[0.2em] text-white/50">
                Full Reset
              </p>

              <h2 className="mt-1 text-2xl font-black">
                Nuclear option? 💀
              </h2>

            </div>

            <div className="p-6">

              <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                This removes your tasks AND resets
                your XP, level, streaks, energy and
                badges.
              </p>

              <div className="mt-4 rounded-2xl bg-slate-100 p-4 dark:bg-[#252a26]">

                <p className="text-sm font-black">
                  Everything goes back to zero.
                </p>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Only use this if you really mean it.
                </p>

              </div>

              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={() =>
                    setShowResetEverything(false)
                  }
                  className="rounded-xl px-5 py-3 text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={confirmResetEverything}
                  className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-black text-white hover:bg-black dark:bg-white dark:text-black"
                >
                  Reset Everything
                </button>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Settings;
