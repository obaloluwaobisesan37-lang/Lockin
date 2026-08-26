import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Database,
  Moon,
  Monitor,
  Palette,
  RotateCcw,
  Sun,
  Trash2,
  Trophy,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";

function Settings() {
  const {
    darkMode,
    tasks = [],
    clearCompleted,
    clearAllTasks,
    xp = 0,
    level = 1,
    energy = 100,
    badges = [],
    focusMode = false,
    setFocusMode,
    theme = "light",
    changeTheme,
    resetEverything,
  } = useOutletContext();

  // =====================================================
  // LOCAL SETTINGS
  // =====================================================

  const [notifications, setNotifications] =
    useState(() => {
      return (
        localStorage.getItem(
          "lockin_notifications_enabled"
        ) !== "false"
      );
    });

  const [sound, setSound] = useState(() => {
    return (
      localStorage.getItem(
        "lockin_sound"
      ) !== "false"
    );
  });

  // =====================================================
  // MODALS
  // =====================================================

  const [resetProgressModal, setResetProgressModal] =
    useState(false);

  const [deleteTasksModal, setDeleteTasksModal] =
    useState(false);

  const [
    resetEverythingModal,
    setResetEverythingModal,
  ] = useState(false);

  // =====================================================
  // SAVE NOTIFICATIONS
  // =====================================================

  useEffect(() => {
    localStorage.setItem(
      "lockin_notifications_enabled",
      String(notifications)
    );
  }, [notifications]);

  // =====================================================
  // SAVE SOUND
  // =====================================================

  useEffect(() => {
    localStorage.setItem(
      "lockin_sound",
      String(sound)
    );
  }, [sound]);

  // =====================================================
  // APPLY THEME FROM SETTINGS
  //
  // ONLY SETTINGS CAN SELECT:
  //
  // Light
  // Dark
  // System
  //
  // =====================================================

  const applyTheme = (selectedTheme) => {
    if (
      selectedTheme !== "light" &&
      selectedTheme !== "dark" &&
      selectedTheme !== "system"
    ) {
      return;
    }

    changeTheme?.(selectedTheme);
  };

  // =====================================================
  // CLEAR COMPLETED
  // =====================================================

  const handleClearCompleted = () => {
    clearCompleted?.();
  };

  // =====================================================
  // RESET PROGRESS
  // =====================================================

  const handleResetProgress = () => {
    setResetProgressModal(false);
  };

  // =====================================================
  // DELETE ALL TASKS
  // =====================================================

  const handleDeleteAllTasks = () => {
    clearAllTasks?.();
    setDeleteTasksModal(false);
  };

  // =====================================================
  // RESET EVERYTHING
  // =====================================================

  const handleResetEverything = () => {
    resetEverything?.();

    setNotifications(true);
    setSound(true);

    localStorage.setItem(
      "lockin_notifications_enabled",
      "true"
    );

    localStorage.setItem(
      "lockin_sound",
      "true"
    );

    setResetEverythingModal(false);
  };

  // =====================================================
  // THEME OPTIONS
  // =====================================================

  const themeOptions = [
    {
      id: "light",
      title: "Light",
      description: "Bright and clean.",
      icon: Sun,
    },
    {
      id: "dark",
      title: "Dark",
      description: "Easy on the eyes.",
      icon: Moon,
    },
    {
      id: "system",
      title: "System",
      description: "Follow your device.",
      icon: Monitor,
    },
  ];

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="mx-auto w-full max-w-5xl pb-10">
      {/* HEADER */}

      <div className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#765b6b]/10 px-3 py-1.5 text-xs font-black text-[#765b6b] dark:bg-[#765b6b]/20 dark:text-[#c7aebe]">
          <Palette size={14} />
          Customize Lockin
        </div>

        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
          Settings
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
          Control your Lockin experience,
          productivity preferences, appearance and
          data.
        </p>
      </div>

      {/* =================================================
          FOCUS MODE
      ================================================= */}

      <section className="mb-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-[#343a35] dark:bg-[#1b1f1c]">
        <div className="flex items-center justify-between gap-5 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#765b6b]/10 text-[#765b6b] dark:bg-[#765b6b]/20 dark:text-[#c7aebe]">
              <Zap size={19} />
            </div>

            <div>
              <h2 className="font-black">
                Focus Mode
              </h2>

              <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                Go full lock-in when you need maximum
                concentration.
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
                ? "bg-[#765b6b]"
                : "bg-slate-300 dark:bg-slate-700"
            }`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
                focusMode
                  ? "left-6"
                  : "left-1"
              }`}
            />
          </button>
        </div>
      </section>

      {/* =================================================
          NOTIFICATIONS
      ================================================= */}

      <section className="mb-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-[#343a35] dark:bg-[#1b1f1c]">
        <div className="flex items-center gap-3 border-b border-slate-200 p-5 dark:border-[#343a35]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#765b6b]/10 text-[#765b6b] dark:bg-[#765b6b]/20 dark:text-[#c7aebe]">
            <Bell size={19} />
          </div>

          <div>
            <h2 className="font-black">
              Notifications
            </h2>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Control Lockin alerts and sounds.
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-[#343a35]">
          {/* TASK NOTIFICATIONS */}

          <div className="flex items-center justify-between gap-5 p-5">
            <div className="flex items-start gap-3">
              <Bell
                size={19}
                className="mt-0.5 shrink-0 text-slate-400"
              />

              <div>
                <p className="text-sm font-bold">
                  Task notifications
                </p>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Receive notifications when important
                  task events happen.
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
                  ? "bg-[#765b6b]"
                  : "bg-slate-300 dark:bg-slate-700"
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
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
                  className="mt-0.5 shrink-0 text-slate-400"
                />
              ) : (
                <VolumeX
                  size={19}
                  className="mt-0.5 shrink-0 text-slate-400"
                />
              )}

              <div>
                <p className="text-sm font-bold">
                  Notification sounds
                </p>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Play sounds when tasks are completed.
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
                  ? "bg-[#765b6b]"
                  : "bg-slate-300 dark:bg-slate-700"
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
                  sound
                    ? "left-6"
                    : "left-1"
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* =================================================
          INTERFACE
      ================================================= */}

      <section className="mb-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-[#343a35] dark:bg-[#1b1f1c]">
        <div className="flex items-center gap-3 border-b border-slate-200 p-5 dark:border-[#343a35]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#765b6b]/10 text-[#765b6b] dark:bg-[#765b6b]/20 dark:text-[#c7aebe]">
            <Palette size={19} />
          </div>

          <div>
            <h2 className="font-black">
              Interface
            </h2>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Choose how Lockin looks.
            </p>
          </div>
        </div>

        <div className="p-5">
          <div className="grid gap-3 sm:grid-cols-3">
            {themeOptions.map((option) => {
              const Icon = option.icon;

              const selected =
                theme === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() =>
                    applyTheme(option.id)
                  }
                  className={`relative rounded-2xl border p-4 text-left transition-all duration-200 ${
                    selected
                      ? "border-[#765b6b] bg-[#765b6b]/10 ring-2 ring-[#765b6b]/20 dark:bg-[#765b6b]/20"
                      : "border-slate-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 dark:border-[#343a35] dark:hover:bg-[#232823]"
                  }`}
                >
                  {selected && (
                    <div className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-[#765b6b]" />
                  )}

                  <Icon
                    size={21}
                    className={
                      selected
                        ? "text-[#765b6b] dark:text-[#c7aebe]"
                        : "text-slate-400"
                    }
                  />

                  <p className="mt-3 text-sm font-black">
                    {option.title}
                  </p>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {option.description}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="mt-4 rounded-2xl bg-slate-50 p-4 dark:bg-[#232823]">
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
              Current theme:{" "}
              <span className="capitalize text-[#765b6b] dark:text-[#c7aebe]">
                {theme}
              </span>
            </p>

            <p className="mt-1 text-[11px] text-slate-400">
              Navbar button switches between Light and
              Dark without changing System selection.
            </p>
          </div>
        </div>
      </section>

      {/* =================================================
          PROGRESS
      ================================================= */}

      <section className="mb-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-[#343a35] dark:bg-[#1b1f1c]">
        <div className="flex items-center gap-3 border-b border-slate-200 p-5 dark:border-[#343a35]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-500">
            <Trophy size={19} />
          </div>

          <div>
            <h2 className="font-black">
              Your Progress
            </h2>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Level {level} · {xp} XP · {energy} energy
            </p>
          </div>
        </div>

        <div className="p-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-[#232823]">
              <p className="text-xs font-bold text-slate-400">
                LEVEL
              </p>

              <p className="mt-1 text-2xl font-black">
                {level}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-[#232823]">
              <p className="text-xs font-bold text-slate-400">
                XP
              </p>

              <p className="mt-1 text-2xl font-black">
                {xp}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-[#232823]">
              <p className="text-xs font-bold text-slate-400">
                BADGES
              </p>

              <p className="mt-1 text-2xl font-black">
                {badges.length}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setResetProgressModal(true)
            }
            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-white px-4 py-3 text-sm font-black text-violet-700 transition hover:bg-violet-50 dark:border-violet-900/50 dark:bg-[#1b1f1c] dark:text-violet-400 dark:hover:bg-violet-950/20"
          >
            <RotateCcw size={16} />
            Reset XP & Progress
          </button>

          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            Your tasks will remain safe.
          </p>
        </div>
      </section>

      {/* =================================================
          TASK DATA
      ================================================= */}

      <section className="mb-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-[#343a35] dark:bg-[#1b1f1c]">
        <div className="flex items-center gap-3 border-b border-slate-200 p-5 dark:border-[#343a35]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#765b6b]/10 text-[#765b6b] dark:bg-[#765b6b]/20 dark:text-[#c7aebe]">
            <Database size={19} />
          </div>

          <div>
            <h2 className="font-black">
              Task Data
            </h2>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Manage your task data.
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-[#343a35]">
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
                  Remove all completed tasks.
                </p>
              </div>
            </div>

            <span className="text-xs font-bold text-slate-400">
              {
                tasks.filter(
                  (task) =>
                    task.completed
                ).length
              }
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              setDeleteTasksModal(true)
            }
            className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-rose-50 dark:hover:bg-rose-950/20"
          >
            <div className="flex items-center gap-3">
              <Trash2
                size={20}
                className="text-rose-500"
              />

              <div>
                <p className="text-sm font-bold text-rose-600 dark:text-rose-400">
                  Delete all tasks
                </p>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Permanently remove every task.
                </p>
              </div>
            </div>

            <span className="text-xs font-bold text-rose-400">
              {tasks.length}
            </span>
          </button>
        </div>
      </section>

      {/* =================================================
          DANGER ZONE
      ================================================= */}

      <section className="rounded-3xl border border-rose-200 bg-rose-50/60 p-5 dark:border-rose-900/40 dark:bg-rose-950/10">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500">
            <AlertTriangle size={19} />
          </div>

          <div className="flex-1">
            <h2 className="font-black text-rose-700 dark:text-rose-400">
              Danger Zone
            </h2>

            <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500 dark:text-slate-400">
              Reset your entire Lockin workspace. This
              deletes tasks and projects and resets your
              productivity progress.
            </p>

            <button
              type="button"
              onClick={() =>
                setResetEverythingModal(true)
              }
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-rose-600/20 transition hover:bg-rose-700"
            >
              <RotateCcw size={16} />
              Reset Everything
            </button>
          </div>
        </div>
      </section>

      {/* =================================================
          RESET PROGRESS MODAL
      ================================================= */}

      {resetProgressModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() =>
            setResetProgressModal(false)
          }
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-[2rem] bg-white shadow-2xl dark:bg-[#1b1f1c]"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="bg-violet-600 p-6 text-white">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-white/70">
                Progress Reset
              </p>

              <h2 className="mt-1 text-2xl font-black">
                Reset your progress?
              </h2>
            </div>

            <div className="p-6">
              <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                Your tasks are safe. The progress reset
                function can be connected to App.jsx later.
              </p>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={handleResetProgress}
                  className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-black text-white hover:bg-violet-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================
          DELETE TASKS MODAL
      ================================================= */}

      {deleteTasksModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() =>
            setDeleteTasksModal(false)
          }
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-[2rem] bg-white shadow-2xl dark:bg-[#1b1f1c]"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="bg-rose-500 p-6 text-white">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-white/70">
                Danger Zone
              </p>

              <h2 className="mt-1 text-2xl font-black">
                Delete all tasks?
              </h2>
            </div>

            <div className="p-6">
              <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                You are about to delete{" "}
                <strong className="text-slate-900 dark:text-white">
                  {tasks.length}
                </strong>{" "}
                {tasks.length === 1
                  ? "task"
                  : "tasks"}.
              </p>

              <div className="mt-4 rounded-2xl bg-rose-50 p-4 dark:bg-rose-950/20">
                <p className="text-sm font-black text-rose-700 dark:text-rose-400">
                  This cannot be undone.
                </p>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() =>
                    setDeleteTasksModal(false)
                  }
                  className="rounded-xl px-5 py-3 text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={
                    handleDeleteAllTasks
                  }
                  className="rounded-xl bg-rose-500 px-5 py-3 text-sm font-black text-white hover:bg-rose-600"
                >
                  Delete All Tasks
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================
          RESET EVERYTHING MODAL
      ================================================= */}

      {resetEverythingModal && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
          onClick={() =>
            setResetEverythingModal(false)
          }
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-[2rem] bg-white shadow-2xl dark:bg-[#1b1f1c]"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="bg-slate-950 p-6 text-white dark:bg-black">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-white/50">
                Full Reset
              </p>

              <h2 className="mt-1 text-2xl font-black">
                Reset everything?
              </h2>
            </div>

            <div className="p-6">
              <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                This will delete your tasks and projects
                and reset XP, level, energy, streaks,
                badges and focus mode.
              </p>

              <div className="mt-4 rounded-2xl bg-rose-50 p-4 dark:bg-rose-950/20">
                <p className="text-sm font-black text-rose-700 dark:text-rose-400">
                  Everything will return to its default
                  state.
                </p>

                <p className="mt-1 text-xs text-rose-600/70 dark:text-rose-400/70">
                  Your theme will also return to Light
                  mode.
                </p>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() =>
                    setResetEverythingModal(false)
                  }
                  className="rounded-xl px-5 py-3 text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={
                    handleResetEverything
                  }
                  className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white hover:bg-black dark:bg-white dark:text-black"
                >
                  Yes, Reset Everything
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