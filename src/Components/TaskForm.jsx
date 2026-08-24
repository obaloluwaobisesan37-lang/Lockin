import { useEffect, useState } from "react";
import {
  CalendarDays,
  Check,
  X,
  Flag,
  Briefcase,
  User,
  GraduationCap,
  Code2,
  Dumbbell,
  MoreHorizontal,
  Zap,
  Brain,
  BatteryLow,
} from "lucide-react";

const initialForm = {
  title: "",
  description: "",
  priority: "Medium",
  category: "Personal",
  dueDate: "",
  energy: "Quick",
};

function TaskForm({
  onSubmit,
  onClose,
  editingTask,
}) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD EDITING TASK
  // ==========================================

  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title || "",
        description: editingTask.description || "",
        priority: editingTask.priority || "Medium",
        category: editingTask.category || "Personal",
        dueDate: editingTask.dueDate || "",
        energy: editingTask.energy || "Quick",
      });
    } else {
      setForm(initialForm);
    }

    setError("");
  }, [editingTask]);

  // ==========================================
  // UPDATE FIELD
  // ==========================================

  const updateField = (name, value) => {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const submit = (event) => {
    event.preventDefault();

    const title = form.title.trim();

    if (!title) {
      setError("Please give your task a title.");
      return;
    }

    const taskData = {
      ...form,
      title,
    };

    if (editingTask) {
      onSubmit({
        ...editingTask,
        ...taskData,
      });
    } else {
      onSubmit(taskData);
    }
  };

  // ==========================================
  // PRIORITY OPTIONS
  // ==========================================

  const priorities = [
    {
      name: "Low",
      icon: "↓",
      description: "Can wait",
      active:
        "border-[#627b82] bg-[#e7eff0] text-[#506d72] dark:border-[#627b82] dark:bg-[#293c3e] dark:text-[#b7ced0]",
    },
    {
      name: "Medium",
      icon: "→",
      description: "Normal",
      active:
        "border-[#b58b4b] bg-[#f5ecd9] text-[#8d6a32] dark:border-[#b58b4b] dark:bg-[#514328] dark:text-[#e0c78d]",
    },
    {
      name: "High",
      icon: "↑",
      description: "Important",
      active:
        "border-[#a65d43] bg-[#f5e1dc] text-[#a34f38] dark:border-[#a65d43] dark:bg-[#5a3028] dark:text-[#e0a08e]",
    },
  ];

  // ==========================================
  // CATEGORY OPTIONS
  // ==========================================

  const categories = [
    {
      name: "Personal",
      icon: User,
    },
    {
      name: "Work",
      icon: Briefcase,
    },
    {
      name: "School",
      icon: GraduationCap,
    },
    {
      name: "Programming",
      icon: Code2,
    },
    {
      name: "Fitness",
      icon: Dumbbell,
    },
    {
      name: "Other",
      icon: MoreHorizontal,
    },
  ];

  // ==========================================
  // ENERGY OPTIONS
  // ==========================================

  const energies = [
    {
      name: "Quick",
      icon: Zap,
      description: "Easy start",
      active:
        "border-yellow-400 bg-yellow-50 text-yellow-700 dark:border-yellow-600 dark:bg-yellow-950/30 dark:text-yellow-400",
    },
    {
      name: "Deep Work",
      icon: Brain,
      description: "Full focus",
      active:
        "border-violet-400 bg-violet-50 text-violet-700 dark:border-violet-600 dark:bg-violet-950/30 dark:text-violet-400",
    },
    {
      name: "Low Energy",
      icon: BatteryLow,
      description: "Keep it simple",
      active:
        "border-sky-400 bg-sky-50 text-sky-700 dark:border-sky-600 dark:bg-sky-950/30 dark:text-sky-400",
    },
  ];

  return (
    <div
      className="w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-[#343a35] dark:bg-[#1b1f1c]"
      onClick={(event) => event.stopPropagation()}
    >
      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="relative overflow-hidden bg-[#4f6f52] px-6 py-6 text-white">
        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />

        <div className="absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-white/5" />

        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">
              {editingTask ? "Update" : "Create"}
            </p>

            <h2 className="mt-1 text-2xl font-black">
              {editingTask
                ? "Edit your task"
                : "Create a new task"}
            </h2>

            <p className="mt-2 text-sm text-white/75">
              Give your next goal some structure.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded-xl bg-white/10 p-2.5 transition hover:rotate-90 hover:bg-white/20"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* ==========================================
          FORM
      ========================================== */}

      <form
        onSubmit={submit}
        className="max-h-[75vh] space-y-6 overflow-y-auto p-6"
      >
        {/* ========================================
            TITLE
        ======================================== */}

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Task title
          </label>

          <input
            name="title"
            type="text"
            value={form.title}
            onChange={(event) =>
              updateField("title", event.target.value)
            }
            placeholder="What needs to get done?"
            autoFocus
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-[#4f6f52] focus:bg-white focus:ring-4 focus:ring-[#4f6f52]/10 dark:border-[#343a35] dark:bg-[#202521] dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-[#252a26]"
          />

          {error && (
            <p className="mt-2 text-xs font-semibold text-rose-500">
              {error}
            </p>
          )}
        </div>

        {/* ========================================
            DESCRIPTION
        ======================================== */}

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Description
          </label>

          <textarea
            name="description"
            value={form.description}
            onChange={(event) =>
              updateField(
                "description",
                event.target.value
              )
            }
            rows={3}
            placeholder="Add some context..."
            className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-[#4f6f52] focus:bg-white focus:ring-4 focus:ring-[#4f6f52]/10 dark:border-[#343a35] dark:bg-[#202521] dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-[#252a26]"
          />
        </div>

        {/* ========================================
            PRIORITY
        ======================================== */}

        <div>
          <div className="mb-3 flex items-center gap-2">
            <Flag size={15} className="text-[#a65d43]" />

            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Priority
            </label>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {priorities.map((priority) => {
              const selected =
                form.priority === priority.name;

              return (
                <button
                  key={priority.name}
                  type="button"
                  onClick={() =>
                    updateField(
                      "priority",
                      priority.name
                    )
                  }
                  className={`rounded-2xl border-2 p-3 text-left transition-all duration-200 ${
                    selected
                      ? priority.active
                      : "border-slate-200 bg-slate-50 text-slate-500 hover:-translate-y-0.5 hover:border-slate-300 dark:border-[#343a35] dark:bg-[#202521] dark:text-slate-400 dark:hover:border-[#4b514c]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black">
                      {priority.icon}
                    </span>

                    {selected && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-current text-white">
                        <Check size={12} />
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-xs font-black">
                    {priority.name}
                  </p>

                  <p className="mt-0.5 text-[10px] opacity-70">
                    {priority.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================
            CATEGORY
        ======================================== */}

        <div>
          <label className="mb-3 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Category
          </label>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {categories.map((category) => {
              const Icon = category.icon;

              const selected =
                form.category === category.name;

              return (
                <button
                  key={category.name}
                  type="button"
                  onClick={() =>
                    updateField(
                      "category",
                      category.name
                    )
                  }
                  className={`flex items-center gap-2.5 rounded-2xl border-2 px-3 py-3 text-left text-xs font-bold transition-all duration-200 ${
                    selected
                      ? "border-[#4f6f52] bg-[#eef3ec] text-[#3f5d43] shadow-sm dark:border-[#627b82] dark:bg-[#263328] dark:text-[#a8c5a5]"
                      : "border-slate-200 bg-slate-50 text-slate-500 hover:-translate-y-0.5 hover:border-slate-300 dark:border-[#343a35] dark:bg-[#202521] dark:text-slate-400 dark:hover:border-[#4b514c]"
                  }`}
                >
                  <Icon size={16} />

                  <span>{category.name}</span>

                  {selected && (
                    <Check
                      size={14}
                      className="ml-auto"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================
            ENERGY
        ======================================== */}

        <div>
          <div className="mb-3 flex items-center gap-2">
            <Zap
              size={15}
              className="text-[#b58b4b]"
            />

            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Energy
            </label>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {energies.map((item) => {
              const Icon = item.icon;

              const selected =
                form.energy === item.name;

              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() =>
                    updateField(
                      "energy",
                      item.name
                    )
                  }
                  className={`rounded-2xl border-2 p-3 text-left transition-all duration-200 ${
                    selected
                      ? item.active
                      : "border-slate-200 bg-slate-50 text-slate-500 hover:-translate-y-0.5 hover:border-slate-300 dark:border-[#343a35] dark:bg-[#202521] dark:text-slate-400 dark:hover:border-[#4b514c]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Icon size={17} />

                    {selected && (
                      <Check size={13} />
                    )}
                  </div>

                  <p className="mt-2 text-[11px] font-black">
                    {item.name}
                  </p>

                  <p className="mt-0.5 text-[10px] opacity-70">
                    {item.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================
            DUE DATE
        ======================================== */}

        <div>
          <label className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <CalendarDays size={14} />

            Due date
          </label>

          <div className="relative">
            <CalendarDays
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={(event) =>
                updateField(
                  "dueDate",
                  event.target.value
                )
              }
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-[#4f6f52] focus:bg-white focus:ring-4 focus:ring-[#4f6f52]/10 dark:border-[#343a35] dark:bg-[#202521] dark:text-white dark:focus:bg-[#252a26]"
            />
          </div>
        </div>

        {/* ========================================
            BUTTONS
        ======================================== */}

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 dark:border-[#343a35] sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-5 py-3 text-sm font-bold text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-[#252a26]"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#4f6f52] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#4f6f52]/20 transition hover:-translate-y-0.5 hover:bg-[#3f5d43] active:translate-y-0"
          >
            <Check size={17} />

            {editingTask
              ? "Save Changes"
              : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TaskForm;