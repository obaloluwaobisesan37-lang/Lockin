import { useEffect, useMemo, useState } from "react";

import {
  CheckCircle2,
  Clock3,
  Flame,
  ListTodo,
  Target,
  Trophy,
  Zap,
  X,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";

import { useOutletContext } from "react-router-dom";

function Dashboard() {
  const {
    tasks = [],
    stats = {},
    streak = {
      current: 0,
      best: 0,
    },
    xp = 0,
    level = 1,
    xpProgress = 0,
    xpNeeded = 100,
  } = useOutletContext();

  const {
    total = 0,
    completed = 0,
    pending = 0,
    highPriority = 0,
    progress = 0,
  } = stats;

  // ==========================================
  // ANTI-PROCRASTINATION
  // ==========================================

  const [showAntiProcrastination, setShowAntiProcrastination] =
    useState(false);

  const [focusStarted, setFocusStarted] = useState(false);

  const [timeLeft, setTimeLeft] = useState(300);

  const [isPaused, setIsPaused] = useState(false);

  const [focusFinished, setFocusFinished] = useState(false);

  // ==========================================
  // NEXT TASK
  // ==========================================

  const nextTask = useMemo(() => {
    return tasks.find((task) => !task.completed) || null;
  }, [tasks]);

  // ==========================================
  // TIMER
  // ==========================================

  useEffect(() => {
    if (
      !focusStarted ||
      isPaused ||
      focusFinished
    ) {
      return;
    }

    if (timeLeft <= 0) {
      setFocusFinished(true);
      setFocusStarted(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          clearInterval(timer);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [
    focusStarted,
    isPaused,
    focusFinished,
    timeLeft,
  ]);

  // ==========================================
  // FORMAT TIMER
  // ==========================================

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(remainingSeconds).padStart(
      2,
      "0"
    )}`;
  };

  // ==========================================
  // START LOCK IN
  // ==========================================

  const startLockIn = () => {
    setTimeLeft(300);
    setFocusStarted(true);
    setIsPaused(false);
    setFocusFinished(false);
  };

  // ==========================================
  // PAUSE / RESUME
  // ==========================================

  const togglePause = () => {
    setIsPaused((current) => !current);
  };

  // ==========================================
  // RESET TIMER
  // ==========================================

  const resetTimer = () => {
    setTimeLeft(300);
    setFocusStarted(false);
    setIsPaused(false);
    setFocusFinished(false);
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeModal = () => {
    setShowAntiProcrastination(false);

    setFocusStarted(false);

    setIsPaused(false);

    setFocusFinished(false);

    setTimeLeft(300);
  };

  return (
    <div className="space-y-6">

      {/* ===================================== */}
      {/* HEADER */}
      {/* ===================================== */}

      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#4f6f52]">
          Your workspace
        </p>

        <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">
          Dashboard
        </h1>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Stay focused and keep making progress.
        </p>
      </div>

      {/* ===================================== */}
      {/* BASIC STATS */}
      {/* ===================================== */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {/* TOTAL */}

        <div className="dashboard-shine-card lockin-depth rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#343a35] dark:bg-[#1b1f1c]">

          <div className="dashboard-card-content">

            <div className="flex items-center justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 dark:bg-[#252a26] dark:text-slate-300">
                <ListTodo size={21} />
              </div>

              <span className="text-xs font-bold text-slate-400">
                TOTAL
              </span>

            </div>

            <p className="mt-5 text-3xl font-black">
              {total}
            </p>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Total tasks
            </p>

          </div>

        </div>

        {/* COMPLETED */}

        <div className="dashboard-shine-card lockin-depth rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#343a35] dark:bg-[#1b1f1c]">

          <div className="dashboard-card-content">

            <div className="flex items-center justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef3ec] text-[#4f6f52] dark:bg-[#263328] dark:text-[#a8c5a5]">
                <CheckCircle2 size={21} />
              </div>

              <span className="text-xs font-bold text-[#4f6f52]">
                DONE
              </span>

            </div>

            <p className="mt-5 text-3xl font-black">
              {completed}
            </p>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Completed tasks
            </p>

          </div>

        </div>

        {/* PENDING */}

        <div className="dashboard-shine-card lockin-depth rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#343a35] dark:bg-[#1b1f1c]">

          <div className="dashboard-card-content">

            <div className="flex items-center justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400">
                <Clock3 size={21} />
              </div>

              <span className="text-xs font-bold text-amber-600">
                PENDING
              </span>

            </div>

            <p className="mt-5 text-3xl font-black">
              {pending}
            </p>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Tasks remaining
            </p>

          </div>

        </div>

        {/* HIGH PRIORITY */}

        <div className="dashboard-shine-card lockin-depth rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#343a35] dark:bg-[#1b1f1c]">

          <div className="dashboard-card-content">

            <div className="flex items-center justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400">
                <Target size={21} />
              </div>

              <span className="text-xs font-bold text-rose-600">
                HIGH
              </span>

            </div>

            <p className="mt-5 text-3xl font-black">
              {highPriority}
            </p>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              High priority
            </p>

          </div>

        </div>

      </div>

      {/* ===================================== */}
      {/* ANTI-PROCRASTINATION */}
      {/* ===================================== */}

      <section className="dashboard-shine-card relative overflow-hidden rounded-3xl border border-[#dfe7dc] bg-[#f4f7f1] p-6 shadow-sm dark:border-[#344034] dark:bg-[#1b211c]">

        <div className="dashboard-card-content">

          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#a8c5a5]/20 blur-3xl" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-xl shadow-sm dark:bg-[#252d26]">
                🔒
              </div>

              <div>

                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4f6f52] dark:text-[#a8c5a5]">
                  Need a push?
                </p>

                <h2 className="mt-1 text-xl font-black">
                  Time to lock in.
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Beat the procrastination before it beats you. 💀
                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={() =>
                setShowAntiProcrastination(true)
              }
              className="lockin-3d inline-flex items-center justify-center gap-2 rounded-2xl bg-[#4f6f52] px-5 py-3 text-sm font-black text-white shadow-[0_5px_0_#344a37] transition hover:bg-[#456448] active:translate-y-1 active:shadow-[0_2px_0_#344a37]"
            >
              <Zap size={17} />
              Anti-Procrastination
            </button>

          </div>

        </div>

      </section>

      {/* ===================================== */}
      {/* STREAK CARDS */}
      {/* ===================================== */}

      <div className="grid gap-4 lg:grid-cols-2">

        {/* CURRENT STREAK */}

        <div className="dashboard-shine-card lockin-depth relative overflow-hidden rounded-3xl border border-orange-200 bg-gradient-to-br from-orange-50 to-white p-6 shadow-sm dark:border-orange-900/40 dark:from-orange-950/30 dark:to-[#1b1f1c]">

          <div className="dashboard-card-content">

            <div className="relative">

              <div className="flex items-center justify-between">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400">
                  <Flame size={25} />
                </div>

                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-600 dark:bg-orange-900/40 dark:text-orange-400">
                  CURRENT
                </span>

              </div>

              <div className="mt-6">

                <p className="text-5xl font-black tracking-tight">
                  {streak.current}
                </p>

                <p className="mt-1 text-lg font-bold">
                  Day Streak
                </p>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {streak.current === 0
                    ? "Complete a task today to start your streak."
                    : streak.current === 1
                    ? "Great start. Come back tomorrow!"
                    : "Keep going. Don't break the streak!"}
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* BEST STREAK */}

        <div className="dashboard-shine-card lockin-depth relative overflow-hidden rounded-3xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-white p-6 shadow-sm dark:border-yellow-900/40 dark:from-yellow-950/30 dark:to-[#1b1f1c]">

          <div className="dashboard-card-content">

            <div className="relative">

              <div className="flex items-center justify-between">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-400">
                  <Trophy size={25} />
                </div>

                <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-400">
                  BEST
                </span>

              </div>

              <div className="mt-6">

                <p className="text-5xl font-black tracking-tight">
                  {streak.best}
                </p>

                <p className="mt-1 text-lg font-bold">
                  Day Record
                </p>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Your longest streak so far.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ===================================== */}
      {/* XP & LEVEL */}
      {/* ===================================== */}

      <div className="dashboard-shine-card lockin-depth relative overflow-hidden rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-6 shadow-sm dark:border-violet-900/40 dark:from-violet-950/30 dark:to-[#1b1f1c]">

        <div className="dashboard-card-content">

          <div className="relative">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400">
                  <Zap size={26} />
                </div>

                <div>

                  <p className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                    XP & Level
                  </p>

                  <h2 className="mt-1 text-2xl font-black">
                    Level {level}
                  </h2>

                </div>

              </div>

              <div className="sm:text-right">

                <p className="text-2xl font-black">
                  {xp} XP
                </p>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {xpNeeded} XP until next level
                </p>

              </div>

            </div>

            <div className="mt-6">

              <div className="mb-2 flex justify-between text-xs font-bold">

                <span>
                  Level {level}
                </span>

                <span>
                  {xpProgress}%
                </span>

              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-[#252a26]">

                <div
                  className="h-full rounded-full bg-violet-500 transition-all duration-500"
                  style={{
                    width: `${xpProgress}%`,
                  }}
                />

              </div>

            </div>

            <div className="mt-5 rounded-2xl bg-white/70 p-4 dark:bg-[#202521]/70">

              <p className="font-bold">
                How to earn XP
              </p>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Normal task = +10 XP · High priority = +15 XP
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* ===================================== */}
      {/* OVERALL PROGRESS */}
      {/* ===================================== */}

      <div className="dashboard-shine-card lockin-depth rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-[#343a35] dark:bg-[#1b1f1c]">

        <div className="dashboard-card-content">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <div className="flex items-center gap-2">

                <Target
                  size={19}
                  className="text-[#4f6f52]"
                />

                <h2 className="font-black">
                  Overall Progress
                </h2>

              </div>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Keep completing tasks to reach 100%.
              </p>

            </div>

            <span className="text-2xl font-black text-[#4f6f52]">
              {progress}%
            </span>

          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-[#252a26]">

            <div
              className="h-full rounded-full bg-[#4f6f52] transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>

      </div>

      {/* ===================================== */}
      {/* RECENT TASKS */}
      {/* ===================================== */}

      <div className="dashboard-shine-card lockin-depth rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-[#343a35] dark:bg-[#1b1f1c]">

        <div className="dashboard-card-content">

          <div className="border-b border-slate-200 p-5 dark:border-[#343a35]">

            <h2 className="font-black">
              Recent Tasks
            </h2>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Your latest tasks.
            </p>

          </div>

          {tasks.length === 0 ? (

            <div className="p-8 text-center">

              <ListTodo
                size={32}
                className="mx-auto text-slate-300"
              />

              <p className="mt-3 font-bold">
                No tasks yet
              </p>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Create your first task to get started.
              </p>

            </div>

          ) : (

            <div className="divide-y divide-slate-200 dark:divide-[#343a35]">

              {tasks
                .slice(0, 5)
                .map((task) => (

                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-4 transition hover:bg-[#f4f7f1] dark:hover:bg-[#202720]"
                  >

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#eef3ec] text-[#4f6f52]">
                      <CheckCircle2 size={18} />
                    </div>

                    <div className="min-w-0 flex-1">

                      <p
                        className={`truncate text-sm font-bold ${
                          task.completed
                            ? "text-[#8fa08d] line-through"
                            : "text-[#4f6f52]"
                        }`}
                      >
                        {task.title || "Untitled task"}
                      </p>

                      {task.priority && (
                        <p className="mt-1 text-xs text-slate-400">
                          {task.priority} priority
                        </p>
                      )}

                    </div>

                  </div>

                ))}

            </div>

          )}

        </div>

      </div>

      {/* ===================================== */}
      {/* ANTI-PROCRASTINATION MODAL */}
      {/* ===================================== */}

      {showAntiProcrastination && (

        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {

            if (
              event.target === event.currentTarget
            ) {
              closeModal();
            }

          }}
        >

          <div className="relative w-full max-w-md overflow-hidden rounded-[32px] border border-white/10 bg-[#171c18] text-white shadow-[0_30px_100px_rgba(0,0,0,0.45)]">

            {/* CLOSE */}

            <button
              type="button"
              onClick={closeModal}
              className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white"
            >
              <X size={19} />
            </button>

            {!focusStarted && !focusFinished && (

              <div className="p-7 text-center">

                <span className="inline-flex rounded-full bg-[#263528] px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#a8c5a5]">
                  Lockin check
                </span>

                <div className="mx-auto mt-7 flex h-20 w-20 items-center justify-center rounded-[26px] border border-white/10 bg-[#202720] text-4xl">
                  😭
                </div>

                <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-[#9eb09b]">
                  Be honest...
                </p>

                <h2 className="mt-2 text-3xl font-black">
                  Are we locking in?
                </h2>

                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-400">
                  You came here for a reason.
                  Don't let the next 5 minutes disappear.
                </p>

                {/* NEXT TASK */}

                <div className="mt-6 rounded-[22px] border border-white/10 bg-[#202720] p-4 text-left">

                  <p className="text-[10px] font-black uppercase tracking-wider text-[#a8c5a5]">
                    Your next move
                  </p>

                  {nextTask ? (

                    <div className="mt-2">

                      <p className="font-bold text-white">
                        {nextTask.title}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Pick this task and work on it for 5 minutes.
                      </p>

                    </div>

                  ) : (

                    <div className="mt-2">

                      <p className="font-bold text-white">
                        No unfinished tasks 🎉
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Add a task first, then come back here.

                      </p>

                    </div>

                  )}

                </div>

                {/* START */}

                <button
                  type="button"
                  disabled={!nextTask}
                  onClick={startLockIn}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#4f6f52] px-5 py-4 text-sm font-black text-white shadow-[0_5px_0_#344a37] transition hover:bg-[#456448] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none active:translate-y-1"
                >
                  <Play size={17} fill="currentColor" />
                  LOCK IN FOR 5 MINUTES
                </button>

                <button
                  type="button"
                  onClick={closeModal}
                  className="mt-2 w-full rounded-2xl px-5 py-3 text-xs font-bold text-slate-500 transition hover:bg-white/5 hover:text-slate-300"
                >
                  I'm choosing chaos 💀
                </button>

              </div>

            )}

            {/* ================================= */}
            {/* ACTIVE TIMER */}
            {/* ================================= */}

            {focusStarted && !focusFinished && (

              <div className="p-7 text-center">

                <span className="inline-flex rounded-full bg-[#263528] px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#a8c5a5]">
                  LOCKED IN 🔒
                </span>

                <p className="mt-8 text-xs font-black uppercase tracking-[0.2em] text-[#9eb09b]">
                  Focus session
                </p>

                <div className="mt-3 text-7xl font-black tracking-tight tabular-nums">
                  {formatTime(timeLeft)}
                </div>

                <div className="mx-auto mt-6 h-3 max-w-sm overflow-hidden rounded-full bg-white/10">

                  <div
                    className="h-full rounded-full bg-[#6f9772] transition-all duration-1000"
                    style={{
                      width: `${Math.max(
                        0,
                        Math.min(
                          100,
                          ((300 - timeLeft) / 300) *
                            100
                        )
                      )}%`,
                    }}
                  />

                </div>

                {nextTask && (

                  <div className="mt-7 rounded-2xl bg-[#202720] p-4 text-left">

                    <p className="text-[10px] font-black uppercase tracking-wider text-[#a8c5a5]">
                      Working on
                    </p>

                    <p className="mt-1 font-bold">
                      {nextTask.title}
                    </p>

                  </div>

                )}

                <div className="mt-6 flex gap-2">

                  <button
                    type="button"
                    onClick={togglePause}
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#4f6f52] px-4 py-3 font-bold text-white transition hover:bg-[#456448]"
                  >
                    {isPaused ? (
                      <>
                        <Play
                          size={16}
                          fill="currentColor"
                        />
                        Resume
                      </>
                    ) : (
                      <>
                        <Pause size={16} />
                        Pause
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={resetTimer}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-white/5 px-4 py-3 font-bold text-slate-300 transition hover:bg-white/10"
                  >
                    <RotateCcw size={16} />
                    Reset
                  </button>

                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="mt-3 w-full rounded-2xl px-4 py-3 text-xs font-bold text-slate-500 transition hover:bg-white/5 hover:text-slate-300"
                >
                  Give up
                </button>

              </div>

            )}

            {/* ================================= */}
            {/* FINISHED */}
            {/* ================================= */}

            {focusFinished && (

              <div className="p-8 text-center">

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#263c29] text-4xl">
                  🎉
                </div>

                <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-[#a8c5a5]">
                  Session complete
                </p>

                <h2 className="mt-2 text-3xl font-black">
                  You locked in!
                </h2>

                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-400">
                  Five minutes done. That's how momentum starts.
                  Now you can keep going or finish the task.
                </p>

                <button
                  type="button"
                  onClick={closeModal}
                  className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#4f6f52] px-5 py-4 text-sm font-black text-white transition hover:bg-[#456448]"
                >
                  KEEP GOING →
                </button>

              </div>

            )}

          </div>

        </div>

      )}

      {/* ===================================== */}
      {/* DASHBOARD ANIMATIONS */}
      {/* ===================================== */}

      <style>{`

        .dashboard-shine-card {
          position: relative;
          overflow: hidden;
          isolation: isolate;
        }

        .dashboard-shine-card::after {
          content: "";

          position: absolute;

          top: -70%;
          left: -90%;

          width: 28%;
          height: 240%;

          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.04) 25%,
            rgba(255, 255, 255, 0.65) 50%,
            rgba(255, 255, 255, 0.04) 75%,
            transparent 100%
          );

          transform: rotate(24deg);

          pointer-events: none;

          z-index: 20;

          animation: dashboard-shine-cycle 32.5s linear infinite;
        }

        @keyframes dashboard-shine-cycle {

          0% {
            left: -90%;
          }

          7.69% {
            left: 140%;
          }

          100% {
            left: 140%;
          }

        }

        .dashboard-card-content {
          position: relative;
          z-index: 30;
        }

        @media (prefers-reduced-motion: reduce) {

          .dashboard-shine-card::after {
            animation: none;
          }

        }

      `}</style>

    </div>
  );
}

export default Dashboard;