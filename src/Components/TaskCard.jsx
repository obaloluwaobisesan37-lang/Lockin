import {
  CalendarDays,
  Check,
  Clock3,
  Pencil,
  Tag,
  Trash2,
  Zap,
  AlertTriangle,
} from "lucide-react";

import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";

function TaskCard({
  task,
  onToggle,
  onDelete,
  onEdit,
}) {
  const {
    startFocus,
    changeTaskEnergy,
    setXp,
  } = useOutletContext();

  // ==========================================
  // PRIORITY
  // ==========================================

  const priority = {
    High: {
      badge:
        "bg-[#f5e1dc] text-[#a34f38] dark:bg-[#5a3028] dark:text-[#f0a58f]",
      dot: "bg-[#a65d43]",
    },

    Medium: {
      badge:
        "bg-[#f3ead5] text-[#9a7538] dark:bg-[#514328] dark:text-[#e2c27c]",
      dot: "bg-[#b58b4b]",
    },

    Low: {
      badge:
        "bg-[#dfe8e6] text-[#506d72] dark:bg-[#293c3e] dark:text-[#a6c2c4]",
      dot: "bg-[#627b82]",
    },
  };

  const style =
    priority[task.priority] || priority.Medium;

  // ==========================================
  // ENERGY
  // ==========================================

  const energy = task.energy || "Quick";

  const energyData = {
    Quick: {
      icon: "⚡",
      text: "Quick",
      style:
        "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400",
    },

    "Deep Work": {
      icon: "🧠",
      text: "Deep Work",
      style:
        "bg-violet-50 text-violet-700 dark:bg-violet-950/30 dark:text-violet-400",
    },

    "Low Energy": {
      icon: "💤",
      text: "Low Energy",
      style:
        "bg-sky-50 text-sky-700 dark:bg-sky-950/30 dark:text-sky-400",
    },
  };

  const currentEnergy =
    energyData[energy] || energyData.Quick;

  // ==========================================
  // TODAY
  // ==========================================

  const getToday = () => {
    const date = new Date();

    return (
      `${date.getFullYear()}-` +
      `${String(date.getMonth() + 1).padStart(2, "0")}-` +
      `${String(date.getDate()).padStart(2, "0")}`
    );
  };

  // ==========================================
  // OVERDUE CHECK
  // ==========================================

  const isOverdue =
    Boolean(task.dueDate) &&
    !task.completed &&
    task.dueDate < getToday();

  // ==========================================
  // DEDUCT XP FOR OVERDUE TASK
  // ==========================================

  useEffect(() => {
    if (!isOverdue) {
      return;
    }

    const deductionKey =
      `lockin_overdue_xp_${task.id}`;

    const alreadyDeducted =
      localStorage.getItem(deductionKey);

    if (alreadyDeducted === "true") {
      return;
    }

    // Deduct 10 XP only once
    if (setXp) {
      setXp((currentXP) =>
        Math.max(0, currentXP - 10)
      );
    }

    localStorage.setItem(
      deductionKey,
      "true"
    );
  }, [
    isOverdue,
    task.id,
    setXp,
  ]);

  // ==========================================
  // CHANGE ENERGY
  // ==========================================

  const cycleEnergy = () => {
    const values = [
      "Quick",
      "Deep Work",
      "Low Energy",
    ];

    const currentIndex =
      values.indexOf(energy);

    const next =
      values[
        (currentIndex + 1) %
          values.length
      ];

    if (changeTaskEnergy) {
      changeTaskEnergy(
        task.id,
        next
      );
    }
  };

  // ==========================================
  // START FOCUS
  // ==========================================

  const handleFocus = () => {
    if (!startFocus) {
      console.error(
        "startFocus is not available."
      );
      return;
    }

    startFocus(task, 25);
  };

  // ==========================================
  // ANTI PROCRASTINATION
  // ==========================================

  const handleAntiProcrastination = () => {
    if (!startFocus) {
      console.error(
        "startFocus is not available."
      );
      return;
    }

    startFocus(task, 5);
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (dateString) => {
    if (!dateString) {
      return "";
    }

    const date = new Date(
      `${dateString}T00:00:00`
    );

    return date.toLocaleDateString(
      undefined,
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <article
      className={`rounded-2xl border p-4 transition-all duration-300 sm:p-5 ${
        isOverdue
          ? "border-rose-200 bg-rose-50/60 shadow-sm dark:border-rose-900/60 dark:bg-rose-950/20"
          : "border-[#e4e5df] bg-white dark:border-[#343a35] dark:bg-[#1b1f1c]"
      }`}
    >
      <div className="flex gap-3">

        {/* ================================= */}
        {/* COMPLETE */}
        {/* ================================= */}

        <button
          type="button"
          onClick={() =>
            onToggle(task.id)
          }
          aria-label={
            task.completed
              ? "Mark task as incomplete"
              : "Mark task as complete"
          }
          className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border-2 transition-all duration-300 ${
            task.completed
              ? "border-[#627b82] bg-[#627b82] text-white shadow-lg shadow-[#627b82]/20"
              : "border-[#aaa69e] hover:border-[#5f8565] hover:bg-[#edf4ed] dark:border-[#687269] dark:hover:bg-[#273229]"
          }`}
        >
          {task.completed && (
            <Check size={15} />
          )}
        </button>

        {/* ================================= */}
        {/* TASK CONTENT */}
        {/* ================================= */}

        <div className="min-w-0 flex-1">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

            <div className="min-w-0">

              {/* TASK TITLE */}

              <h3
                className={`text-base font-black tracking-wide transition ${
                  task.completed
                    ? "text-[#8d948e] line-through"
                    : isOverdue
                    ? "text-[#a34f38] dark:text-[#f0a58f]"
                    : "text-[#292725] dark:text-[#f5f7f5]"
                }`}
              >
                {task.title}
              </h3>

              {/* DESCRIPTION */}

              {task.description && (
                <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-[#716d66] dark:text-[#b9c2ba]">
                  {task.description}
                </p>
              )}

            </div>

            {/* PRIORITY */}

            <span
              className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold ${style.badge}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${style.dot}`}
              />

              {task.priority}
            </span>

          </div>

          {/* ================================= */}
          {/* TAGS */}
          {/* ================================= */}

          <div className="mt-5 flex flex-wrap items-center gap-2">

            {/* CATEGORY */}

            <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#ebe6de] px-2.5 py-1.5 text-[11px] font-semibold text-[#716d66] dark:bg-[#292f2b] dark:text-[#c0c9c1]">
              <Tag size={12} />

              {task.category ||
                "General"}
            </span>

            {/* DUE DATE */}

            {task.dueDate && (
              <span
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold ${
                  isOverdue
                    ? "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
                    : "bg-[#ebe6de] text-[#716d66] dark:bg-[#292f2b] dark:text-[#c0c9c1]"
                }`}
              >
                {isOverdue ? (
                  <AlertTriangle size={12} />
                ) : (
                  <CalendarDays size={12} />
                )}

                {isOverdue
                  ? `Overdue • ${formatDate(
                      task.dueDate
                    )}`
                  : formatDate(
                      task.dueDate
                    )}
              </span>
            )}

            {/* STATUS */}

            <span
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold ${
                isOverdue
                  ? "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
                  : "bg-[#ebe6de] text-[#716d66] dark:bg-[#292f2b] dark:text-[#c0c9c1]"
              }`}
            >
              <Clock3 size={12} />

              {task.completed
                ? "Done"
                : isOverdue
                ? "Overdue"
                : "In progress"}
            </span>

            {/* ENERGY */}

            <button
              type="button"
              onClick={cycleEnergy}
              title="Change task energy"
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition hover:-translate-y-0.5 ${currentEnergy.style}`}
            >
              <span>
                {currentEnergy.icon}
              </span>

              {currentEnergy.text}
            </button>

          </div>

          {/* ================================= */}
          {/* OVERDUE WARNING */}
          {/* ================================= */}

          {isOverdue && (
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-100/70 p-3 dark:border-rose-900/60 dark:bg-rose-950/30">

              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-200 text-rose-700 dark:bg-rose-900/50 dark:text-rose-400">
                <AlertTriangle
                  size={16}
                />
              </div>

              <div>
                <p className="text-xs font-black text-rose-700 dark:text-rose-400">
                  Task overdue
                </p>

                <p className="mt-0.5 text-[11px] leading-5 text-rose-600/80 dark:text-rose-400/70">
                  This task passed its due date.
                  10 XP has been deducted.
                  Complete it to get back on track.
                </p>
              </div>

            </div>
          )}

          {/* ================================= */}
          {/* QUICK ACTIONS */}
          {/* ================================= */}

          {!task.completed && (
            <div className="mt-4 flex flex-wrap gap-2">

              {/* FOCUS */}

              <button
                type="button"
                onClick={handleFocus}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#5f8565] px-3 py-2 text-[11px] font-black text-white transition hover:-translate-y-0.5 hover:bg-[#709776]"
              >
                <Zap size={13} />
                Focus
              </button>

              {/* ANTI PROCRASTINATION */}

              <button
                type="button"
                onClick={
                  handleAntiProcrastination
                }
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#5f8565] bg-transparent px-3 py-2 text-[11px] font-bold text-[#5f8565] transition hover:-translate-y-0.5 hover:bg-[#5f8565] hover:text-white dark:text-[#a9c5ad]"
              >
                <Zap size={13} />
                Anti-Procrastination
              </button>

            </div>
          )}

        </div>

        {/* ================================= */}
        {/* EDIT / DELETE */}
        {/* ================================= */}

        <div className="flex shrink-0 gap-1">

          <button
            type="button"
            onClick={() =>
              onEdit(task)
            }
            aria-label="Edit task"
            className="h-9 w-9 rounded-xl text-[#918b82] transition hover:bg-[#f5e1dc] hover:text-[#a65d43] dark:hover:bg-[#5a3028] dark:hover:text-[#e0a08e]"
          >
            <Pencil
              size={16}
              className="mx-auto"
            />
          </button>

          <button
            type="button"
            onClick={() =>
              onDelete(task.id)
            }
            aria-label="Delete task"
            className="h-9 w-9 rounded-xl text-[#918b82] transition hover:bg-[#f5e1dc] hover:text-[#a34f38] dark:hover:bg-[#5a3028] dark:hover:text-[#e0a08e]"
          >
            <Trash2
              size={16}
              className="mx-auto"
            />
          </button>

        </div>

      </div>
    </article>
  );
}

export default TaskCard;