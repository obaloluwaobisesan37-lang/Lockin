import {
  Check,
  Trash2,
  Archive,
  Play,
  Clock3,
  AlertTriangle,
  ChevronRight,
  Lock,
} from "lucide-react";

function TaskCard({
  task,
  onToggle,
  onDelete,
  onArchive,
  onStartFocus,
  onSelect,
  selected = false,
  dependencies = [],
  blocked = false,
}) {
  const priorityStyles = {
    High: "bg-red-500/10 text-red-500 border-red-500/20",
    Medium:
      "bg-orange-500/10 text-orange-500 border-orange-500/20",
    Low: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  };

  const statusStyles = {
    backlog: "bg-slate-500/10 text-slate-500",
    "in-progress": "bg-blue-500/10 text-blue-500",
    review: "bg-purple-500/10 text-purple-500",
    done: "bg-green-500/10 text-green-500",
  };

  const formatStatus = (status) =>
    status
      ?.replace("-", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <div
      className={`group relative rounded-3xl border p-4 transition-all duration-200 ${
        selected
          ? "border-[#6f9473] bg-[#6f9473]/5 shadow-md"
          : "border-black/5 bg-white hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-[#171a17]"
      }`}
    >
      <div className="flex gap-3">
        {/* SELECT */}
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect?.(task.id)}
          className="mt-1 h-4 w-4 accent-[#6f9473]"
        />

        {/* COMPLETE */}
        <button
          type="button"
          onClick={() => onToggle?.(task.id)}
          disabled={blocked}
          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border transition ${
            task.completed
              ? "border-[#6f9473] bg-[#6f9473] text-white"
              : blocked
                ? "cursor-not-allowed border-black/10 text-black/20 dark:border-white/10 dark:text-white/20"
                : "border-black/10 text-transparent hover:border-[#6f9473] dark:border-white/10"
          }`}
          title={
            blocked
              ? "Complete dependencies first"
              : task.completed
                ? "Mark incomplete"
                : "Complete task"
          }
        >
          {blocked ? (
            <Lock size={14} />
          ) : (
            <Check size={16} />
          )}
        </button>

        {/* CONTENT */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              {/* TASK TITLE */}
              <h3
                className={`break-words text-base font-black tracking-tight ${
                  task.completed
                    ? "text-black/35 line-through dark:text-white/30"
                    : "text-[#4f6f52] dark:text-[#8faf91]"
                }`}
              >
                {task.title || "Untitled task"}
              </h3>

              {/* DESCRIPTION */}
              {task.description && (
                <p className="mt-1 line-clamp-2 text-sm text-black/45 dark:text-white/40">
                  {task.description}
                </p>
              )}
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onStartFocus?.(task)}
                disabled={task.completed || blocked}
                className="rounded-xl p-2 text-black/30 transition hover:bg-[#6f9473]/10 hover:text-[#6f9473] disabled:opacity-30 dark:text-white/30"
                title="Start focus"
              >
                <Play size={15} />
              </button>

              <button
                type="button"
                onClick={() => onArchive?.(task.id)}
                className="rounded-xl p-2 text-black/30 transition hover:bg-black/5 hover:text-black dark:text-white/30 dark:hover:bg-white/10 dark:hover:text-white"
                title="Archive"
              >
                <Archive size={15} />
              </button>

              <button
                type="button"
                onClick={() => onDelete?.(task.id)}
                className="rounded-xl p-2 text-black/30 transition hover:bg-red-500/10 hover:text-red-500 dark:text-white/30"
                title="Delete"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>

          {/* META */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {task.priority && (
              <span
                className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase ${
                  priorityStyles[task.priority] ||
                  priorityStyles.Low
                }`}
              >
                {task.priority}
              </span>
            )}

            {task.status && (
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${
                  statusStyles[task.status] ||
                  statusStyles.backlog
                }`}
              >
                {formatStatus(task.status)}
              </span>
            )}

            {task.category && (
              <span className="rounded-full bg-black/5 px-2.5 py-1 text-[10px] font-bold text-black/50 dark:bg-white/10 dark:text-white/50">
                {task.category}
              </span>
            )}

            {task.energy && (
              <span className="rounded-full bg-[#6f9473]/10 px-2.5 py-1 text-[10px] font-bold text-[#5f8263] dark:text-[#8faf91]">
                {task.energy} energy
              </span>
            )}
          </div>

          {/* FOOTER */}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-[11px] font-bold text-black/35 dark:text-white/30">
            {task.dueDate && (
              <span
                className={`flex items-center gap-1 ${
                  !task.completed &&
                  task.dueDate <
                    new Date()
                      .toISOString()
                      .split("T")[0]
                    ? "text-red-500"
                    : ""
                }`}
              >
                <Clock3 size={13} />
                {task.dueDate}
              </span>
            )}

            {task.estimatedMinutes > 0 && (
              <span>
                Est. {task.estimatedMinutes}m
              </span>
            )}

            {task.timeSpent > 0 && (
              <span>
                Spent {task.timeSpent}m
              </span>
            )}

            {dependencies.length > 0 && (
              <span
                className={`flex items-center gap-1 ${
                  blocked ? "text-orange-500" : ""
                }`}
              >
                {blocked ? (
                  <AlertTriangle size={13} />
                ) : (
                  <ChevronRight size={13} />
                )}

                {dependencies.length}{" "}
                {dependencies.length === 1
                  ? "dependency"
                  : "dependencies"}
              </span>
            )}
          </div>

          {/* TAGS */}
          {Array.isArray(task.tags) &&
            task.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {task.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg bg-black/[0.04] px-2 py-1 text-[10px] font-bold text-black/40 dark:bg-white/[0.05] dark:text-white/35"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
        </div>
      </div>

      {/* COMPLETED BAR */}
      {task.completed && (
        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-[#6f9473]/10 px-3 py-2 text-xs font-bold text-[#5f8263] dark:text-[#8faf91]">
          <Check size={14} />

          Completed
          {task.earnedXP
            ? ` • +${task.earnedXP} XP`
            : ""}
        </div>
      )}
    </div>
  );
}

export default TaskCard;