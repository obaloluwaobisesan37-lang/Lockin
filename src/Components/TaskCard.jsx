import { useEffect, useState } from "react";
import {
  Check,
  Trash2,
  Archive,
  Play,
  Clock3,
  AlertTriangle,
  ChevronRight,
  Lock,
  Pencil,
  X,
  Save,
  FolderKanban,
  Tag,
} from "lucide-react";

function TaskCard({
  task,
  projects = [],
  onToggle,
  onDelete,
  onArchive,
  onStartFocus,
  onSelect,
  onUpdate,
  selected = false,
  dependencies = [],
  blocked = false,
}) {
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    title: task.title || "",
    description: task.description || "",
    priority: task.priority || "Medium",
    dueDate: task.dueDate || "",
    dueTime: task.dueTime || "",
    category: task.category || "",
    energy: task.energy || "Medium",
    projectId: task.projectId || "",
    status: task.status || "backlog",
    progress: Number(task.progress) || 0,
  });

  useEffect(() => {
    setForm({
      title: task.title || "",
      description: task.description || "",
      priority: task.priority || "Medium",
      dueDate: task.dueDate || "",
      dueTime: task.dueTime || "",
      category: task.category || "",
      energy: task.energy || "Medium",
      projectId: task.projectId || "",
      status: task.status || "backlog",
      progress: Number(task.progress) || 0,
    });
  }, [task]);

  const priorityStyles = {
    High: "border-[#a85b5b]/20 bg-[#a85b5b]/8 text-[#a85b5b] dark:border-[#d88989]/20 dark:bg-[#d88989]/10 dark:text-[#d88989]",
    Medium:
      "border-[#b07b4d]/20 bg-[#b07b4d]/8 text-[#a66d3d] dark:border-[#d9a575]/20 dark:bg-[#d9a575]/10 dark:text-[#d9a575]",
    Low: "border-[#627b82]/20 bg-[#627b82]/8 text-[#627b82] dark:border-[#8ea8af]/20 dark:bg-[#8ea8af]/10 dark:text-[#9bb4ba]",
  };

  const statusStyles = {
    backlog:
      "bg-[#ece9e3] text-[#77736b] dark:bg-[#292e2a] dark:text-[#aaa69e]",
    "in-progress":
      "bg-[#627b82]/10 text-[#627b82] dark:bg-[#627b82]/15 dark:text-[#9bb4ba]",
    review:
      "bg-[#765b6b]/10 text-[#765b6b] dark:bg-[#765b6b]/15 dark:text-[#c9aebe]",
    done:
      "bg-[#557a62]/10 text-[#557a62] dark:bg-[#557a62]/15 dark:text-[#8faf91]",
  };

  const formatStatus = (status) =>
    status
      ?.replace("-", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

  const handleChange = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSave = () => {
    const title = form.title.trim();

    if (!title) return;

    const progress = Math.min(
      100,
      Math.max(0, Number(form.progress) || 0)
    );

    let status = form.status;

    if (progress >= 100) {
      status = "done";
    }

    onUpdate?.(task.id, {
      title,
      description: form.description.trim(),
      priority: form.priority,
      dueDate: form.dueDate,
      dueTime: form.dueTime,
      category: form.category.trim(),
      energy: form.energy,
      projectId: form.projectId || null,
      status,
      progress,
    });

    setEditing(false);
  };

  const today = new Date().toISOString().split("T")[0];

  const isOverdue =
    !task.completed &&
    task.dueDate &&
    task.dueDate < today;

  const project = projects.find(
    (item) => item.id === task.projectId
  );

  const inputClass =
    "w-full rounded-[13px] border border-[#ded9d1] bg-[#faf9f6] px-3.5 py-3 text-sm font-semibold text-[#292725] outline-none transition placeholder:text-[#aaa49b] focus:border-[#765b6b] focus:ring-2 focus:ring-[#765b6b]/10 dark:border-[#353a35] dark:bg-[#202420] dark:text-white dark:placeholder:text-[#716f69]";

  const labelClass =
    "mb-1.5 block text-[9px] font-black uppercase tracking-[0.16em] text-[#938d84]";

  /* =========================================================
     EDIT MODE
  ========================================================= */

  if (editing) {
    return (
      <div className="overflow-hidden rounded-[22px] border border-[#ded9d1] bg-white shadow-[0_10px_35px_rgba(41,39,37,0.07)] dark:border-[#353a35] dark:bg-[#1b1f1c]">
        <div className="border-b border-[#e8e3db] px-5 py-4 dark:border-[#303530]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#765b6b]/10 text-[#765b6b] dark:bg-[#765b6b]/15 dark:text-[#c9aebe]">
                  <Pencil size={14} />
                </div>

                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#765b6b] dark:text-[#c9aebe]">
                  Edit task
                </p>
              </div>

              <h3 className="mt-2 text-lg font-black tracking-[-0.025em] text-[#292725] dark:text-white">
                Update task details
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setEditing(false)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] border border-[#e3ded6] text-[#918b82] transition hover:bg-[#f3f0eb] hover:text-[#292725] dark:border-[#353a35] dark:hover:bg-[#292e2a] dark:hover:text-white"
              title="Cancel"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        <div className="p-5">
          <div className="grid gap-4">
            <div>
              <label className={labelClass}>Title</label>

              <input
                value={form.title}
                onChange={(event) =>
                  handleChange("title", event.target.value)
                }
                className={inputClass}
                placeholder="What needs to be done?"
                autoFocus
              />
            </div>

            <div>
              <label className={labelClass}>Description</label>

              <textarea
                value={form.description}
                onChange={(event) =>
                  handleChange("description", event.target.value)
                }
                rows={3}
                className={`${inputClass} resize-none`}
                placeholder="Add a little context..."
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Priority</label>

                <select
                  value={form.priority}
                  onChange={(event) =>
                    handleChange("priority", event.target.value)
                  }
                  className={inputClass}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Energy</label>

                <select
                  value={form.energy}
                  onChange={(event) =>
                    handleChange("energy", event.target.value)
                  }
                  className={inputClass}
                >
                  <option value="High">High energy</option>
                  <option value="Medium">Medium energy</option>
                  <option value="Low">Low energy</option>
                </select>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Due date</label>

                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(event) =>
                    handleChange("dueDate", event.target.value)
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Due time</label>

                <input
                  type="time"
                  value={form.dueTime}
                  onChange={(event) =>
                    handleChange("dueTime", event.target.value)
                  }
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Category</label>

                <input
                  value={form.category}
                  onChange={(event) =>
                    handleChange("category", event.target.value)
                  }
                  className={inputClass}
                  placeholder="e.g. School"
                />
              </div>

              <div>
                <label className={labelClass}>Project</label>

                <select
                  value={form.projectId}
                  onChange={(event) =>
                    handleChange("projectId", event.target.value)
                  }
                  className={inputClass}
                >
                  <option value="">No project</option>

                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name ||
                        project.title ||
                        "Untitled Project"}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Status</label>

                <select
                  value={form.status}
                  onChange={(event) =>
                    handleChange("status", event.target.value)
                  }
                  className={inputClass}
                >
                  <option value="backlog">Backlog</option>
                  <option value="in-progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className={labelClass}>Progress</label>

                  <span className="text-[11px] font-black text-[#765b6b] dark:text-[#c9aebe]">
                    {form.progress}%
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={form.progress}
                  onChange={(event) =>
                    handleChange("progress", event.target.value)
                  }
                  className="mt-3 w-full accent-[#765b6b]"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="min-h-[42px] rounded-[12px] border border-[#ded9d1] px-4 text-xs font-black text-[#77736b] transition hover:bg-[#f3f0eb] hover:text-[#292725] dark:border-[#353a35] dark:text-[#aaa69e] dark:hover:bg-[#292e2a] dark:hover:text-white"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={!form.title.trim()}
              className="flex min-h-[42px] items-center justify-center gap-2 rounded-[12px] bg-[#765b6b] px-5 text-xs font-black text-white shadow-[0_5px_15px_rgba(118,91,107,0.18)] transition hover:bg-[#674e5e] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Save size={14} />
              Save changes
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     NORMAL TASK CARD
  ========================================================= */

  return (
    <article
      className={`group relative overflow-hidden rounded-[20px] border transition-all duration-200 ${
        selected
          ? "border-[#765b6b]/30 bg-[#765b6b]/[0.035] shadow-[0_8px_25px_rgba(118,91,107,0.08)]"
          : "border-[#e2ddd5] bg-white hover:-translate-y-[1px] hover:border-[#d5cec5] hover:shadow-[0_10px_30px_rgba(41,39,37,0.06)] dark:border-[#333833] dark:bg-[#1b1f1c] dark:hover:border-[#414741] dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.16)]"
      }`}
    >
      {/* Selected indicator */}
      {selected && (
        <div className="absolute left-0 top-0 h-full w-1 bg-[#765b6b]" />
      )}

      <div className="p-4 sm:p-5">
        <div className="flex gap-3.5">
          {/* Selection */}
          <div className="pt-1">
            <input
              type="checkbox"
              checked={selected}
              onChange={() => onSelect?.(task.id)}
              className="h-4 w-4 cursor-pointer accent-[#765b6b]"
              aria-label={`Select ${task.title || "task"}`}
            />
          </div>

          {/* Completion */}
          <button
            type="button"
            onClick={() => onToggle?.(task.id)}
            disabled={blocked}
            className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] border transition-all duration-200 ${
              task.completed
                ? "border-[#557a62] bg-[#557a62] text-white shadow-[0_3px_10px_rgba(85,122,98,0.2)]"
                : blocked
                  ? "cursor-not-allowed border-[#ded9d1] bg-[#f3f0eb] text-[#aaa49b] dark:border-[#353a35] dark:bg-[#252a26] dark:text-[#686c67]"
                  : "border-[#d8d3ca] bg-[#faf9f6] text-transparent hover:border-[#765b6b] hover:bg-[#765b6b]/5 dark:border-[#3c423d] dark:bg-[#202420] dark:hover:border-[#765b6b]"
            }`}
            title={
              blocked
                ? "Complete dependencies first"
                : task.completed
                  ? "Mark incomplete"
                  : "Complete task"
            }
          >
            {blocked ? <Lock size={13} /> : <Check size={15} strokeWidth={2.8} />}
          </button>

          <div className="min-w-0 flex-1">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3
                    className={`break-words text-[15px] font-black leading-snug tracking-[-0.015em] ${
                      task.completed
                        ? "text-[#a29d95] line-through dark:text-[#686d68]"
                        : "text-[#292725] dark:text-white"
                    }`}
                  >
                    {task.title || "Untitled task"}
                  </h3>

                  {isOverdue && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#a85b5b]/8 px-2 py-1 text-[8px] font-black uppercase tracking-wider text-[#a85b5b] dark:bg-[#d88989]/10 dark:text-[#d88989]">
                      <AlertTriangle size={10} />
                      Overdue
                    </span>
                  )}
                </div>

                {task.description && (
                  <p className="mt-1.5 line-clamp-2 max-w-2xl text-[12px] leading-5 text-[#858078] dark:text-[#969b96]">
                    {task.description}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex shrink-0 items-center gap-0.5 opacity-100 sm:opacity-70 sm:transition-opacity sm:group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="flex h-8 w-8 items-center justify-center rounded-[9px] text-[#969087] transition hover:bg-[#765b6b]/8 hover:text-[#765b6b] dark:text-[#777d77] dark:hover:bg-[#765b6b]/15 dark:hover:text-[#c9aebe]"
                  title="Edit task"
                >
                  <Pencil size={14} />
                </button>

                <button
                  type="button"
                  onClick={() => onStartFocus?.(task)}
                  disabled={task.completed || blocked}
                  className="flex h-8 w-8 items-center justify-center rounded-[9px] text-[#969087] transition hover:bg-[#627b82]/10 hover:text-[#627b82] disabled:cursor-not-allowed disabled:opacity-25 dark:text-[#777d77] dark:hover:bg-[#627b82]/15 dark:hover:text-[#9bb4ba]"
                  title={
                    blocked
                      ? "Complete dependencies first"
                      : "Start focus on this task"
                  }
                >
                  <Play size={14} />
                </button>

                <button
                  type="button"
                  onClick={() => onArchive?.(task.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-[9px] text-[#969087] transition hover:bg-black/5 hover:text-[#292725] dark:text-[#777d77] dark:hover:bg-white/5 dark:hover:text-white"
                  title="Archive"
                >
                  <Archive size={14} />
                </button>

                <button
                  type="button"
                  onClick={() => onDelete?.(task.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-[9px] text-[#969087] transition hover:bg-[#a85b5b]/8 hover:text-[#a85b5b] dark:text-[#777d77] dark:hover:bg-[#d88989]/10 dark:hover:text-[#d88989]"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* Metadata */}
            <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
              {task.priority && (
                <span
                  className={`rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-wide ${
                    priorityStyles[task.priority] || priorityStyles.Low
                  }`}
                >
                  {task.priority}
                </span>
              )}

              {task.status && (
                <span
                  className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wide ${
                    statusStyles[task.status] ||
                    statusStyles.backlog
                  }`}
                >
                  {formatStatus(task.status)}
                </span>
              )}

              {task.category && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#f0ede8] px-2.5 py-1 text-[9px] font-bold text-[#77736b] dark:bg-[#292e2a] dark:text-[#aaa69e]">
                  <Tag size={10} />
                  {task.category}
                </span>
              )}

              {task.energy && (
                <span className="rounded-full bg-[#557a62]/8 px-2.5 py-1 text-[9px] font-bold text-[#557a62] dark:bg-[#557a62]/12 dark:text-[#8faf91]">
                  {task.energy} energy
                </span>
              )}

              {project && (
                <span className="inline-flex max-w-[180px] items-center gap-1 rounded-full bg-[#765b6b]/8 px-2.5 py-1 text-[9px] font-bold text-[#765b6b] dark:bg-[#765b6b]/12 dark:text-[#c9aebe]">
                  <FolderKanban size={10} />
                  <span className="truncate">
                    {project.name || project.title || "Project"}
                  </span>
                </span>
              )}
            </div>

            {/* Progress */}
            {Number(task.progress) > 0 && !task.completed && (
              <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase tracking-[0.15em] text-[#9a948b]">
                    Progress
                  </span>

                  <span className="text-[10px] font-black text-[#765b6b] dark:text-[#c9aebe]">
                    {Math.min(
                      100,
                      Math.max(0, Number(task.progress))
                    )}
                    %
                  </span>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-[#ebe7e0] dark:bg-[#303530]">
                  <div
                    className="h-full rounded-full bg-[#765b6b] transition-[width] duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(0, Number(task.progress))
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Bottom metadata */}
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-bold text-[#98928a] dark:text-[#747a75]">
              {task.dueDate && (
                <span
                  className={`flex items-center gap-1.5 ${
                    isOverdue
                      ? "font-black text-[#a85b5b] dark:text-[#d88989]"
                      : ""
                  }`}
                >
                  <Clock3 size={12} />
                  {task.dueDate}
                  {task.dueTime ? ` • ${task.dueTime}` : ""}
                </span>
              )}

              {task.estimatedMinutes > 0 && (
                <span>Est. {task.estimatedMinutes}m</span>
              )}

              {task.timeSpent > 0 && (
                <span>Spent {task.timeSpent}m</span>
              )}

              {dependencies.length > 0 && (
                <span
                  className={`flex items-center gap-1 ${
                    blocked
                      ? "font-black text-[#b07b4d] dark:text-[#d9a575]"
                      : ""
                  }`}
                >
                  {blocked ? (
                    <AlertTriangle size={12} />
                  ) : (
                    <ChevronRight size={12} />
                  )}

                  {dependencies.length}{" "}
                  {dependencies.length === 1
                    ? "dependency"
                    : "dependencies"}
                </span>
              )}
            </div>

            {/* Tags */}
            {Array.isArray(task.tags) && task.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {task.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-[7px] bg-[#f3f0eb] px-2 py-1 text-[9px] font-bold text-[#89837b] dark:bg-[#252a26] dark:text-[#7e847f]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Completed state */}
        {task.completed && (
          <div className="mt-4 flex items-center justify-between gap-3 rounded-[12px] border border-[#557a62]/10 bg-[#557a62]/7 px-3 py-2.5 dark:border-[#557a62]/15 dark:bg-[#557a62]/10">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wide text-[#557a62] dark:text-[#8faf91]">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#557a62] text-white">
                <Check size={11} strokeWidth={3} />
              </span>

              Completed
            </div>

            {task.earnedXP && (
              <span className="text-[10px] font-black text-[#557a62] dark:text-[#8faf91]">
                +{task.earnedXP} XP
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default TaskCard;