import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Database,
  Monitor,
  Moon,
  Palette,
  RotateCcw,
  Sun,
  Trophy,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";

function Settings() {
  const context = useOutletContext() || {};

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
    theme = "system",
    changeTheme,
    resetEverything,
  } = context;

  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const safeBadges = Array.isArray(badges) ? badges : [];

  // =========================================================
  // LOCAL SETTINGS
  // =========================================================

  const [notifications, setNotifications] = useState(() => {
    return (
      localStorage.getItem("lockin_notifications_enabled") !==
      "false"
    );
  });

  const [sound, setSound] = useState(() => {
    return localStorage.getItem("lockin_sound") !== "false";
  });

  // =========================================================
  // MODALS
  // =========================================================

  const [deleteTasksModal, setDeleteTasksModal] = useState(false);
  const [resetEverythingModal, setResetEverythingModal] =
    useState(false);

  // =========================================================
  // DERIVED DATA
  // =========================================================

  const completedTasks = useMemo(
    () => safeTasks.filter((task) => task.completed).length,
    [safeTasks],
  );

  const pendingTasks = Math.max(
    0,
    safeTasks.length - completedTasks,
  );

  // =========================================================
  // SAVE NOTIFICATIONS
  // =========================================================

  useEffect(() => {
    localStorage.setItem(
      "lockin_notifications_enabled",
      String(notifications),
    );
  }, [notifications]);

  // =========================================================
  // SAVE SOUND
  // =========================================================

  useEffect(() => {
    localStorage.setItem("lockin_sound", String(sound));
  }, [sound]);

  // =========================================================
  // THEME
  // =========================================================

  const applyTheme = (selectedTheme) => {
    if (!["light", "dark", "system"].includes(selectedTheme)) {
      return;
    }

    changeTheme?.(selectedTheme);
  };

  // =========================================================
  // CLEAR COMPLETED
  // =========================================================

  const handleClearCompleted = () => {
    clearCompleted?.();
  };

  // =========================================================
  // DELETE ALL TASKS
  // =========================================================

  const handleDeleteAllTasks = () => {
    clearAllTasks?.();
    setDeleteTasksModal(false);
  };

  // =========================================================
  // RESET EVERYTHING
  // =========================================================

  const handleResetEverything = () => {
    resetEverything?.();

    setNotifications(true);
    setSound(true);

    localStorage.setItem(
      "lockin_notifications_enabled",
      "true",
    );

    localStorage.setItem("lockin_sound", "true");
    localStorage.setItem("lockin_theme", "system");

    sessionStorage.removeItem("lockin_archive_unlocked");

    setResetEverythingModal(false);
  };

  // =========================================================
  // THEME OPTIONS
  // =========================================================

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

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 pb-10">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="relative overflow-hidden rounded-[24px] border border-[#d9c9d2] bg-gradient-to-br from-[#f4edf2] via-[#f8f6f1] to-[#eaf0f1] p-6 shadow-sm dark:border-[#343934] dark:bg-[#1b1f1c] dark:bg-none sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#765b6b]/15 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-[#627b82]/10 blur-3xl" />

        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-xl border border-[#765b6b]/15 bg-white/60 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#765b6b] backdrop-blur-sm dark:border-[#765b6b]/20 dark:bg-[#765b6b]/10 dark:text-[#c7aebe]">
            <Palette size={14} />
            Customize Lockin
          </div>

          <h1 className="mt-4 text-3xl font-black tracking-tight text-[#292725] dark:text-white sm:text-4xl">
            Settings
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6f6861] dark:text-[#aaa69e]">
            Control your Lockin experience, appearance,
            notifications, focus preferences, and task data.
          </p>
        </div>
      </section>

      {/* =====================================================
          FOCUS MODE
      ===================================================== */}

      <section className="rounded-[24px] border border-[#d8dfe0] bg-gradient-to-r from-white to-[#f1f5f5] shadow-sm dark:border-[#343934] dark:bg-[#1b1f1c] dark:bg-none">
        <div className="flex items-center justify-between gap-5 p-5 sm:p-6">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#765b6b]/10 text-[#765b6b] dark:bg-[#765b6b]/15 dark:text-[#c7aebe]">
              <Zap size={18} />
            </div>

            <div>
              <h2 className="text-sm font-black text-[#292725] dark:text-white">
                Focus Mode
              </h2>

              <p className="mt-1 max-w-xl text-xs leading-5 text-[#918b82] dark:text-[#aaa69e]">
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
              setFocusMode?.((current) => !current)
            }
            className={[
              "relative h-7 w-12 shrink-0 rounded-full transition-colors",
              focusMode
                ? "bg-[#765b6b]"
                : "bg-[#d6d2ca] dark:bg-[#444a45]",
            ].join(" ")}
          >
            <span
              className={[
                "absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all",
                focusMode ? "left-6" : "left-1",
              ].join(" ")}
            />
          </button>
        </div>
      </section>

      {/* =====================================================
          NOTIFICATIONS
      ===================================================== */}

      <section className="overflow-hidden rounded-[24px] border border-[#d8dfe0] bg-white shadow-sm dark:border-[#343934] dark:bg-[#1b1f1c]">
        <div className="flex items-center gap-3 border-b border-[#dfe6e7] bg-[#eef4f4] p-5 dark:border-[#30352f] dark:bg-[#1b2323] sm:p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#627b82]/15 text-[#627b82] dark:text-[#9bb1b7]">
            <Bell size={18} />
          </div>

          <div>
            <h2 className="text-sm font-black text-[#292725] dark:text-white">
              Notifications
            </h2>

            <p className="mt-1 text-xs text-[#918b82] dark:text-[#aaa69e]">
              Control Lockin alerts and sounds.
            </p>
          </div>
        </div>

        <div className="divide-y divide-[#eeeae4] dark:divide-[#30352f]">
          <SettingToggle
            icon={<Bell size={18} />}
            title="Task notifications"
            description="Receive notifications when important task events happen."
            enabled={notifications}
            onToggle={() =>
              setNotifications((current) => !current)
            }
          />

          <SettingToggle
            icon={
              sound ? <Volume2 size={18} /> : <VolumeX size={18} />
            }
            title="Notification sounds"
            description="Play sounds when notifications appear."
            enabled={sound}
            onToggle={() =>
              setSound((current) => !current)
            }
          />
        </div>
      </section>

      {/* =====================================================
          INTERFACE
      ===================================================== */}

      <section className="overflow-hidden rounded-[24px] border border-[#d9c9d2] bg-white shadow-sm dark:border-[#343934] dark:bg-[#1b1f1c]">
        <div className="flex items-center gap-3 border-b border-[#eadfe5] bg-[#f4edf2] p-5 dark:border-[#30352f] dark:bg-[#211d20] sm:p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#765b6b]/10 text-[#765b6b] dark:bg-[#765b6b]/15 dark:text-[#c7aebe]">
            <Palette size={18} />
          </div>

          <div>
            <h2 className="text-sm font-black text-[#292725] dark:text-white">
              Interface
            </h2>

            <p className="mt-1 text-xs text-[#918b82] dark:text-[#aaa69e]">
              Choose how Lockin looks.
            </p>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="grid gap-3 sm:grid-cols-3">
            {themeOptions.map((option) => {
              const Icon = option.icon;
              const selected = theme === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => applyTheme(option.id)}
                  className={[
                    "relative rounded-2xl border p-4 text-left transition-all duration-200",
                    selected
                      ? "border-[#765b6b] bg-[#765b6b]/[0.08] ring-2 ring-[#765b6b]/10 dark:bg-[#765b6b]/10"
                      : "border-[#e4dfd8] bg-[#faf9f6] hover:border-[#cfc3cb] hover:bg-[#f5f0f3] dark:border-[#30352f] dark:bg-[#151815] dark:hover:bg-[#202420]",
                  ].join(" ")}
                >
                  {selected && (
                    <span className="absolute right-4 top-4 h-2.5 w-2.5 rounded-full bg-[#765b6b]" />
                  )}

                  <Icon
                    size={20}
                    className={
                      selected
                        ? "text-[#765b6b] dark:text-[#c7aebe]"
                        : "text-[#918b82]"
                    }
                  />

                  <p className="mt-4 text-sm font-black text-[#292725] dark:text-white">
                    {option.title}
                  </p>

                  <p className="mt-1 text-xs text-[#918b82] dark:text-[#888f88]">
                    {option.description}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-[#d9e2e3] bg-[#eef4f4] p-4 dark:border-[#30352f] dark:bg-[#151c1c]">
            <Monitor
              size={16}
              className="mt-0.5 shrink-0 text-[#627b82]"
            />

            <div>
              <p className="text-xs font-black text-[#292725] dark:text-white">
                Current theme:{" "}
                <span className="text-[#765b6b] dark:text-[#c7aebe]">
                  {theme}
                </span>
              </p>

              <p className="mt-1 text-[10px] leading-4 text-[#918b82]">
                System follows your device's light or dark
                preference automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          PRODUCTIVITY
      ===================================================== */}

      <section className="rounded-[24px] border border-[#dfd7c9] bg-white shadow-sm dark:border-[#343934] dark:bg-[#1b1f1c]">
        <div className="flex items-center gap-3 border-b border-[#eeeae4] bg-[#f6f0e5] p-5 dark:border-[#30352f] dark:bg-[#211f1b] sm:p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#b07b4d]/10 text-[#a06e43] dark:text-[#d8aa7e]">
            <Trophy size={18} />
          </div>

          <div>
            <h2 className="text-sm font-black text-[#292725] dark:text-white">
              Your Progress
            </h2>

            <p className="mt-1 text-xs text-[#918b82] dark:text-[#aaa69e]">
              Track your productivity progress.
            </p>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <ProgressStat label="Level" value={level} />
            <ProgressStat label="XP" value={xp} />
            <ProgressStat
              label="Badges"
              value={safeBadges.length}
            />
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#d8dfe0] bg-[#f1f5f5] p-4 dark:border-[#30352f] dark:bg-[#151815]">
              <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#627b82]">
                Energy
              </p>

              <div className="mt-3 flex items-end justify-between">
                <p className="text-2xl font-black text-[#292725] dark:text-white">
                  {energy}
                </p>

                <span className="text-[10px] font-bold text-[#918b82]">
                  / 100
                </span>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#dce4e4] dark:bg-[#292e2a]">
                <div
                  className="h-full rounded-full bg-[#627b82] transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(0, Number(energy) || 0),
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-[#d9dfd8] bg-[#eff4ef] p-4 dark:border-[#30352f] dark:bg-[#151815]">
              <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#557a62]">
                Task progress
              </p>

              <div className="mt-3 flex items-end justify-between">
                <p className="text-2xl font-black text-[#292725] dark:text-white">
                  {completedTasks}
                </p>

                <span className="text-[10px] font-bold text-[#918b82]">
                  / {safeTasks.length}
                </span>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#dce5dc] dark:bg-[#292e2a]">
                <div
                  className="h-full rounded-full bg-[#557a62] transition-all"
                  style={{
                    width:
                      safeTasks.length > 0
                        ? `${(completedTasks / safeTasks.length) * 100}%`
                        : "0%",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          TASK DATA
      ===================================================== */}

      <section className="overflow-hidden rounded-[24px] border border-[#d8dfe0] bg-white shadow-sm dark:border-[#343934] dark:bg-[#1b1f1c]">
        <div className="flex items-center gap-3 border-b border-[#dfe6e7] bg-[#eef4f4] p-5 dark:border-[#30352f] dark:bg-[#1b2323] sm:p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#627b82]/15 text-[#627b82] dark:text-[#9bb1b7]">
            <Database size={18} />
          </div>

          <div>
            <h2 className="text-sm font-black text-[#292725] dark:text-white">
              Task Data
            </h2>

            <p className="mt-1 text-xs text-[#918b82] dark:text-[#aaa69e]">
              Manage your existing task data.
            </p>
          </div>
        </div>

        <div className="divide-y divide-[#eeeae4] dark:divide-[#30352f]">
          <button
            type="button"
            onClick={handleClearCompleted}
            disabled={completedTasks === 0}
            className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-[#f1f6f1] disabled:cursor-not-allowed disabled:opacity-45 dark:hover:bg-[#202420]"
          >
            <div className="flex min-w-0 items-center gap-3">
              <CheckCircle2
                size={19}
                className="shrink-0 text-[#557a62]"
              />

              <div>
                <p className="text-sm font-black text-[#292725] dark:text-white">
                  Clear completed tasks
                </p>

                <p className="mt-1 text-xs text-[#918b82] dark:text-[#aaa69e]">
                  Remove tasks that you've already completed.
                </p>
              </div>
            </div>

            <span className="shrink-0 rounded-full bg-[#557a62]/10 px-2.5 py-1 text-[10px] font-black text-[#557a62]">
              {completedTasks}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setDeleteTasksModal(true)}
            disabled={safeTasks.length === 0}
            className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-[#fbf0f0] disabled:cursor-not-allowed disabled:opacity-45"
          >
            <div className="flex min-w-0 items-center gap-3">
              <TrashIcon />

              <div>
                <p className="text-sm font-black text-[#a85b5b] dark:text-[#d99a9a]">
                  Delete all tasks
                </p>

                <p className="mt-1 text-xs text-[#918b82] dark:text-[#aaa69e]">
                  Permanently remove every task.
                </p>
              </div>
            </div>

            <span className="shrink-0 rounded-full bg-[#a85b5b]/10 px-2.5 py-1 text-[10px] font-black text-[#a85b5b]">
              {safeTasks.length}
            </span>
          </button>
        </div>
      </section>

      {/* =====================================================
          DANGER ZONE
      ===================================================== */}

      <section className="rounded-[24px] border border-red-200 bg-gradient-to-br from-red-50 to-[#fff7f5] p-5 shadow-sm dark:border-red-900/40 dark:bg-red-950/20 dark:bg-none sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400">
            <AlertTriangle size={18} />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-black text-red-700 dark:text-red-400">
              Danger Zone
            </h2>

            <p className="mt-1 max-w-xl text-xs leading-5 text-[#777169] dark:text-[#aaa69e]">
              Reset your entire Lockin workspace. Tasks,
              projects, XP, energy, streaks, badges and
              focus progress will return to their defaults.
            </p>

            <button
              type="button"
              onClick={() => setResetEverythingModal(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-red-300 bg-red-600 px-4 py-2.5 text-xs font-black text-white shadow-sm transition hover:bg-red-700 dark:border-red-800 dark:bg-red-600 dark:hover:bg-red-700"
            >
              <RotateCcw size={15} />
              Reset Everything
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================
          DELETE ALL TASKS MODAL
      ===================================================== */}

      {deleteTasksModal && (
        <ModalOverlay
          onClose={() => setDeleteTasksModal(false)}
        >
          <ModalHeader
            eyebrow="Task Data"
            title="Delete all tasks?"
            icon={<AlertTriangle size={19} />}
          />

          <div className="p-6">
            <p className="text-sm leading-6 text-[#777169] dark:text-[#aaa69e]">
              You are about to permanently delete{" "}
              <strong className="text-[#292725] dark:text-white">
                {safeTasks.length}
              </strong>{" "}
              {safeTasks.length === 1 ? "task" : "tasks"}.
            </p>

            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-950/20">
              <p className="text-xs font-black text-red-700 dark:text-red-400">
                This action cannot be undone.
              </p>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <ModalButton
                onClick={() => setDeleteTasksModal(false)}
              >
                Cancel
              </ModalButton>

              <button
                type="button"
                onClick={handleDeleteAllTasks}
                className="rounded-xl bg-red-600 px-5 py-2.5 text-xs font-black text-white transition hover:bg-red-700"
              >
                Delete All Tasks
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* =====================================================
          RESET EVERYTHING MODAL
      ===================================================== */}

      {resetEverythingModal && (
        <ModalOverlay
          onClose={() => setResetEverythingModal(false)}
        >
          <ModalHeader
            eyebrow="Full Reset"
            title="Reset everything?"
            icon={<RotateCcw size={19} />}
            dark
          />

          <div className="p-6">
            <p className="text-sm leading-6 text-[#777169] dark:text-[#aaa69e]">
              This will reset your Lockin workspace,
              including tasks, projects, XP, level, energy,
              streaks, badges and focus progress.
            </p>

            <div className="mt-4 space-y-2 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-950/20">
              <p className="text-xs font-black text-red-700 dark:text-red-400">
                Everything will return to its default state.
              </p>

              <p className="text-[10px] leading-4 text-[#918b82]">
                Theme → System
              </p>

              <p className="text-[10px] leading-4 text-[#918b82]">
                Notifications → On
              </p>

              <p className="text-[10px] leading-4 text-[#918b82]">
                Notification sounds → On
              </p>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <ModalButton
                onClick={() =>
                  setResetEverythingModal(false)
                }
              >
                Cancel
              </ModalButton>

              <button
                type="button"
                onClick={handleResetEverything}
                className="rounded-xl border border-red-700 bg-red-600 px-5 py-2.5 text-xs font-black text-white shadow-sm transition hover:bg-red-700"
              >
                Yes, Reset Everything
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}
    </div>
  );
}

/* =========================================================
   REUSABLE UI
========================================================= */

function SettingToggle({
  icon,
  title,
  description,
  enabled,
  onToggle,
}) {
  return (
    <div className="flex items-center justify-between gap-5 p-5 transition hover:bg-[#faf9f6] dark:hover:bg-[#202420]">
      <div className="flex min-w-0 items-start gap-3">
        <div className="mt-0.5 shrink-0 text-[#627b82]">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-black text-[#292725] dark:text-white">
            {title}
          </p>

          <p className="mt-1 text-xs leading-5 text-[#918b82] dark:text-[#aaa69e]">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={onToggle}
        className={[
          "relative h-7 w-12 shrink-0 rounded-full transition-colors",
          enabled
            ? "bg-[#765b6b]"
            : "bg-[#d6d2ca] dark:bg-[#444a45]",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all",
            enabled ? "left-6" : "left-1",
          ].join(" ")}
        />
      </button>
    </div>
  );
}

function ProgressStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-[#ddd4da] bg-[#f5f0f3] p-4 dark:border-[#30352f] dark:bg-[#151815]">
      <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#765b6b] dark:text-[#aaa69e]">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black text-[#292725] dark:text-white">
        {value}
      </p>
    </div>
  );
}

function TrashIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-[#a85b5b]"
      aria-hidden="true"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
    </svg>
  );
}

function ModalOverlay({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-[24px] border border-[#e2ddd5] bg-white shadow-2xl dark:border-[#343934] dark:bg-[#1b1f1c]"
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function ModalHeader({
  eyebrow,
  title,
  icon,
  dark = false,
}) {
  return (
    <div
      className={[
        "flex items-start gap-3 p-6",
        dark
          ? "bg-[#292725] text-white dark:bg-black"
          : "bg-red-600 text-white",
      ].join(" ")}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
        {icon}
      </div>

      <div>
        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/55">
          {eyebrow}
        </p>

        <h2 className="mt-1 text-xl font-black">
          {title}
        </h2>
      </div>
    </div>
  );
}

function ModalButton({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl px-5 py-2.5 text-xs font-black text-[#777169] transition hover:bg-[#f1eee8] dark:text-[#aaa69e] dark:hover:bg-[#292e2a]"
    >
      {children}
    </button>
  );
}

export default Settings;