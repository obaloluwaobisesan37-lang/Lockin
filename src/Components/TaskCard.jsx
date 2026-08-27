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
    High: "bg-red-500/10 text-red-500 border-red-500/20",
    Medium: "bg-orange-500/10 text-orange-500 border-orange-500/20",
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

  const handleChange = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSave = () => {
    const title = form.title.trim();

    if (!title) {
      return;
    }

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

  if (editing) {
    return (
      <div
        className="
          rounded-3xl
          border
          border-[#765b6b]/20
          bg-white
          p-5
          shadow-lg
          dark:border-white/10
          dark:bg-[#171a17]
        "
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#765b6b]">
              Edit task
            </p>

            <h3 className="mt-1 text-lg font-black dark:text-white">
              Update your task
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setEditing(false)}
            className="
              rounded-xl
              p-2
              text-black/30
              transition
              hover:bg-black/5
              hover:text-black
              dark:text-white/30
              dark:hover:bg-white/10
              dark:hover:text-white
            "
            title="Cancel"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 grid gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-black/40 dark:text-white/40">
              Title
            </label>

            <input
              value={form.title}
              onChange={(event) =>
                handleChange("title", event.target.value)
              }
              className="
                w-full
                rounded-2xl
                border
                border-black/10
                bg-[#faf9f6]
                px-4
                py-3
                text-sm
                font-bold
                outline-none
                transition
                focus:border-[#765b6b]
                dark:border-white/10
                dark:bg-[#202420]
                dark:text-white
              "
              placeholder="Task title"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-black/40 dark:text-white/40">
              Description
            </label>

            <textarea
              value={form.description}
              onChange={(event) =>
                handleChange("description", event.target.value)
              }
              rows={3}
              className="
                w-full
                resize-none
                rounded-2xl
                border
                border-black/10
                bg-[#faf9f6]
                px-4
                py-3
                text-sm
                font-medium
                outline-none
                transition
                focus:border-[#765b6b]
                dark:border-white/10
                dark:bg-[#202420]
                dark:text-white
              "
              placeholder="Add a description..."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-black/40 dark:text-white/40">
                Priority
              </label>

              <select
                value={form.priority}
                onChange={(event) =>
                  handleChange("priority", event.target.value)
                }
                className="
                  w-full
                  rounded-2xl
                  border
                  border-black/10
                  bg-[#faf9f6]
                  px-4
                  py-3
                  text-xs
                  font-black
                  outline-none
                  dark:border-white/10
                  dark:bg-[#202420]
                  dark:text-white
                "
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-black/40 dark:text-white/40">
                Energy
              </label>

              <select
                value={form.energy}
                onChange={(event) =>
                  handleChange("energy", event.target.value)
                }
                className="
                  w-full
                  rounded-2xl
                  border
                  border-black/10
                  bg-[#faf9f6]
                  px-4
                  py-3
                  text-xs
                  font-black
                  outline-none
                  dark:border-white/10
                  dark:bg-[#202420]
                  dark:text-white
                "
              >
                <option value="High">High energy</option>
                <option value="Medium">Medium energy</option>
                <option value="Low">Low energy</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-black/40 dark:text-white/40">
                Due date
              </label>

              <input
                type="date"
                value={form.dueDate}
                onChange={(event) =>
                  handleChange("dueDate", event.target.value)
                }
                className="
                  w-full
                  rounded-2xl
                  border
                  border-black/10
                  bg-[#faf9f6]
                  px-4
                  py-3
                  text-xs
                  font-bold
                  outline-none
                  focus:border-[#765b6b]
                  dark:border-white/10
                  dark:bg-[#202420]
                  dark:text-white
                "
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-black/40 dark:text-white/40">
                Due time
              </label>

              <input
                type="time"
                value={form.dueTime}
                onChange={(event) =>
                  handleChange("dueTime", event.target.value)
                }
                className="
                  w-full
                  rounded-2xl
                  border
                  border-black/10
                  bg-[#faf9f6]
                  px-4
                  py-3
                  text-xs
                  font-bold
                  outline-none
                  focus:border-[#765b6b]
                  dark:border-white/10
                  dark:bg-[#202420]
                  dark:text-white
                "
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-black/40 dark:text-white/40">
                Category
              </label>

              <input
                value={form.category}
                onChange={(event) =>
                  handleChange("category", event.target.value)
                }
                className="
                  w-full
                  rounded-2xl
                  border
                  border-black/10
                  bg-[#faf9f6]
                  px-4
                  py-3
                  text-xs
                  font-bold
                  outline-none
                  focus:border-[#765b6b]
                  dark:border-white/10
                  dark:bg-[#202420]
                  dark:text-white
                "
                placeholder="e.g. School"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-black/40 dark:text-white/40">
                Project
              </label>

              <select
                value={form.projectId}
                onChange={(event) =>
                  handleChange("projectId", event.target.value)
                }
                className="
                  w-full
                  rounded-2xl
                  border
                  border-black/10
                  bg-[#faf9f6]
                  px-4
                  py-3
                  text-xs
                  font-black
                  outline-none
                  dark:border-white/10
                  dark:bg-[#202420]
                  dark:text-white
                "
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

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-black/40 dark:text-white/40">
                Status
              </label>

              <select
                value={form.status}
                onChange={(event) =>
                  handleChange("status", event.target.value)
                }
                className="
                  w-full
                  rounded-2xl
                  border
                  border-black/10
                  bg-[#faf9f6]
                  px-4
                  py-3
                  text-xs
                  font-black
                  outline-none
                  dark:border-white/10
                  dark:bg-[#202420]
                  dark:text-white
                "
              >
                <option value="backlog">Backlog</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-black/40 dark:text-white/40">
                Progress: {form.progress}%
              </label>

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

        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="
              rounded-xl
              bg-black/5
              px-4
              py-2.5
              text-xs
              font-black
              text-black/50
              transition
              hover:bg-black/10
              dark:bg-white/5
              dark:text-white/50
              dark:hover:bg-white/10
            "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={!form.title.trim()}
            className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-[#765b6b]
              px-4
              py-2.5
              text-xs
              font-black
              text-white
              shadow-md
              shadow-[#765b6b]/20
              transition
              hover:bg-[#674e5e]
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            <Save size={14} />
            Save changes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group relative rounded-3xl border p-4 transition-all duration-200 ${
        selected
          ? "border-[#6f9473] bg-[#6f9473]/5 shadow-md"
          : "border-black/5 bg-white hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-[#171a17]"
      }`}
    >
      <div className="flex gap-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect?.(task.id)}
          className="mt-1 h-4 w-4 accent-[#6f9473]"
        />

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
          {blocked ? <Lock size={14} /> : <Check size={16} />}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3
                className={`break-words text-base font-black tracking-tight ${
                  task.completed
                    ? "text-black/35 line-through dark:text-white/30"
                    : "text-[#4f6f52] dark:text-[#8faf91]"
                }`}
              >
                {task.title || "Untitled task"}
              </h3>

              {task.description && (
                <p className="mt-1 line-clamp-2 text-sm text-black/45 dark:text-white/40">
                  {task.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="
                  rounded-xl
                  p-2
                  text-black/30
                  transition
                  hover:bg-[#765b6b]/10
                  hover:text-[#765b6b]
                  dark:text-white/30
                "
                title="Edit task"
              >
                <Pencil size={15} />
              </button>

              {/* FOCUS BUTTON */}
              <button
                type="button"
                onClick={() => onStartFocus?.(task)}
                disabled={task.completed || blocked}
                className="
                  rounded-xl
                  p-2
                  text-black/30
                  transition
                  hover:bg-[#6f9473]/10
                  hover:text-[#6f9473]
                  disabled:opacity-30
                  dark:text-white/30
                "
                title={
                  blocked
                    ? "Complete dependencies first"
                    : "Start focus on this task"
                }
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

            {project && (
              <span className="rounded-full bg-[#765b6b]/10 px-2.5 py-1 text-[10px] font-bold text-[#765b6b] dark:text-[#c4aebe]">
                {project.name || project.title || "Project"}
              </span>
            )}
          </div>

          {Number(task.progress) > 0 && !task.completed && (
            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-black/30 dark:text-white/30">
                  Progress
                </span>

                <span className="text-[10px] font-black text-[#765b6b]">
                  {Number(task.progress)}%
                </span>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
                <div
                  className="h-full rounded-full bg-[#765b6b] transition-all"
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

          <div className="mt-4 flex flex-wrap items-center gap-4 text-[11px] font-bold text-black/35 dark:text-white/30">
            {task.dueDate && (
              <span
                className={`flex items-center gap-1 ${
                  isOverdue ? "text-red-500" : ""
                }`}
              >
                <Clock3 size={13} />
                {task.dueDate}
                {task.dueTime ? ` • ${task.dueTime}` : ""}
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

      {task.completed && (
        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-[#6f9473]/10 px-3 py-2 text-xs font-bold text-[#5f8263] dark:text-[#8faf91]">
          <Check size={14} />
          Completed
          {task.earnedXP ? ` • +${task.earnedXP} XP` : ""}
        </div>
      )}
    </div>
  );
}

export default TaskCard;