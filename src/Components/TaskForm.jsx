import { useState } from "react";
import {
  Plus,
  X,
  CalendarDays,
  Clock3,
  Tag,
  Zap,
  ChevronLeft,
  ChevronRight,
  Check,
  FolderKanban,
} from "lucide-react";

const EMPTY_FORM = {
  title: "",
  description: "",
  priority: "Medium",
  category: "General",
  status: "backlog",
  dueDate: "",
  estimatedMinutes: 30,
  energy: "Medium",
  projectId: "",
  tags: "",
  dependencies: [],
};

function TaskForm({ onAdd, projects = [], tasks = [] }) {
  const [open, setOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showProjectMenu, setShowProjectMenu] = useState(false);

  const [calendarDate, setCalendarDate] = useState(new Date());

  // =========================================================
  // FORM
  // =========================================================

  const [form, setForm] = useState({
    ...EMPTY_FORM,
  });

  const update = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      ...EMPTY_FORM,
      title: "",
    });

    setCalendarDate(new Date());
    setShowCalendar(false);
    setShowProjectMenu(false);
  };

  const closeForm = () => {
    setOpen(false);
    setShowCalendar(false);
    setShowProjectMenu(false);
  };

  // =========================================================
  // CALENDAR
  // =========================================================

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDateKey = (date) => {
    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");
  };

  const getCalendarDays = () => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const previousMonthDays = new Date(year, month, 0).getDate();

    const days = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, previousMonthDays - i),
        currentMonth: false,
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: new Date(year, month, day),
        currentMonth: true,
      });
    }

    let nextDay = 1;

    while (days.length < 42) {
      days.push({
        date: new Date(year, month + 1, nextDay),
        currentMonth: false,
      });

      nextDay += 1;
    }

    return days;
  };

  const selectDate = (date) => {
    update("dueDate", getDateKey(date));
    setCalendarDate(date);
    setShowCalendar(false);
  };

  const goPreviousMonth = () => {
    setCalendarDate(
      (current) => new Date(current.getFullYear(), current.getMonth() - 1, 1),
    );
  };

  const goNextMonth = () => {
    setCalendarDate(
      (current) => new Date(current.getFullYear(), current.getMonth() + 1, 1),
    );
  };

  const goToday = () => {
    const today = new Date();

    setCalendarDate(today);
    update("dueDate", getDateKey(today));
    setShowCalendar(false);
  };

  const clearDate = () => {
    update("dueDate", "");
    setShowCalendar(false);
  };

  const formatSelectedDate = () => {
    if (!form.dueDate) {
      return "Choose a due date";
    }

    const [year, month, day] = form.dueDate.split("-");

    const date = new Date(Number(year), Number(month) - 1, Number(day));

    return date.toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const todayKey = getDateKey(new Date());

  // =========================================================
  // PROJECT
  // =========================================================

  const selectedProject = projects.find(
    (project) => String(project.id) === String(form.projectId),
  );

  const selectedProjectName = selectedProject
    ? selectedProject.name || selectedProject.title || "Untitled Project"
    : "No project";

  // =========================================================
  // SUBMIT
  // =========================================================

  const submit = (event) => {
    event.preventDefault();

    const title = form.title.trim();

    // Do not create a task without a title.
    if (!title) {
      return;
    }

    const cleanTask = {
      title,
      description: form.description.trim(),
      priority: form.priority,
      category: form.category.trim() || "General",
      status: form.status,
      dueDate: form.dueDate,
      estimatedMinutes: Number(form.estimatedMinutes) || 0,
      energy: form.energy,

      projectId: form.projectId ? String(form.projectId) : null,

      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),

      dependencies: Array.isArray(form.dependencies)
        ? form.dependencies.map(String)
        : [],
    };

    if (typeof onAdd === "function") {
      onAdd(cleanTask);
    }

    resetForm();
    setOpen(false);
  };

  // =========================================================
  // OPEN BUTTON
  // =========================================================

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => {
          // IMPORTANT:
          // Every time the form opens, the title is EMPTY.
          resetForm();
          setOpen(true);
        }}
        className="
          group flex items-center gap-2 rounded-2xl
          bg-[#4f6f52] px-5 py-3 text-sm font-black
          text-white shadow-lg shadow-[#4f6f52]/15
          transition hover:-translate-y-0.5
          hover:bg-[#3f5d43] hover:shadow-xl
        "
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-white/15">
          <Plus size={15} />
        </span>
        New Task
      </button>
    );
  }

  // =========================================================
  // FORM
  // =========================================================

  return (
    <div
      className="
        fixed inset-0 z-[90] bg-black/35 p-4
        backdrop-blur-[3px] dark:bg-black/60
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          closeForm();
        }
      }}
    >
      <div
        className="
          mx-auto mt-[4vh] flex max-h-[92vh] w-full
          max-w-3xl flex-col overflow-hidden
          rounded-[28px] border border-black/10
          bg-[#faf9f6] shadow-2xl
          dark:border-white/10 dark:bg-[#171a17]
        "
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* HEADER */}

        <div
          className="
            flex items-center justify-between
            border-b border-black/5 px-6 py-5
            dark:border-white/10
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex h-11 w-11 items-center
                justify-center rounded-2xl
                bg-[#4f6f52]/10 text-[#4f6f52]
                dark:bg-[#6f9473]/10
                dark:text-[#8faf91]
              "
            >
              <Plus size={21} />
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#6f9473]">
                Task management
              </p>

              <h2 className="mt-0.5 text-xl font-black">Create new task</h2>
            </div>
          </div>

          <button
            type="button"
            onClick={closeForm}
            className="
              rounded-xl p-2 text-black/35
              transition hover:bg-black/5
              hover:text-black dark:text-white/35
              dark:hover:bg-white/10
              dark:hover:text-white
            "
          >
            <X size={20} />
          </button>
        </div>

        {/* CONTENT */}

        <div className="overflow-y-auto px-6 py-5">
          <form onSubmit={submit} className="space-y-5">
            {/* TITLE */}

            <div>
              <label className="mb-2 block text-[10px] font-black uppercase tracking-wider text-black/40 dark:text-white/40">
                Task title
              </label>

              <input
                value={form.title}
                onChange={(event) => update("title", event.target.value)}
                placeholder="What needs to be done?"
                autoFocus
                className="
                  w-full rounded-2xl border
                  border-black/10 bg-white px-4
                  py-3.5 text-sm font-bold
                  outline-none transition
                  placeholder:text-black/25
                  focus:border-[#6f9473]
                  focus:ring-4
                  focus:ring-[#6f9473]/10
                  dark:border-white/10
                  dark:bg-[#1d211e]
                  dark:placeholder:text-white/20
                "
              />
            </div>

            {/* DESCRIPTION */}

            <div>
              <label className="mb-2 block text-[10px] font-black uppercase tracking-wider text-black/40 dark:text-white/40">
                Description
              </label>

              <textarea
                value={form.description}
                onChange={(event) => update("description", event.target.value)}
                placeholder="Add some details about this task..."
                rows={3}
                className="
                  w-full resize-none rounded-2xl
                  border border-black/10
                  bg-white px-4 py-3 text-sm
                  outline-none transition
                  placeholder:text-black/25
                  focus:border-[#6f9473]
                  focus:ring-4
                  focus:ring-[#6f9473]/10
                  dark:border-white/10
                  dark:bg-[#1d211e]
                  dark:placeholder:text-white/20
                "
              />
            </div>

            {/* OPTIONS */}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Select
                label="Priority"
                value={form.priority}
                onChange={(value) => update("priority", value)}
                options={["Low", "Medium", "High"]}
              />

              <Select
                label="Status"
                value={form.status}
                onChange={(value) => update("status", value)}
                options={["backlog", "in-progress", "review"]}
              />

              <Select
                label="Energy"
                value={form.energy}
                onChange={(value) => update("energy", value)}
                options={["Low", "Medium", "High"]}
              />

              {/* DATE */}

              <div className="relative">
                <label className="mb-2 block text-[10px] font-black uppercase tracking-wider text-black/40 dark:text-white/40">
                  Due date
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setShowCalendar((current) => !current);
                    setShowProjectMenu(false);
                  }}
                  className="
                    flex min-h-[46px] w-full
                    items-center gap-3 rounded-xl
                    border border-black/10
                    bg-white px-3 text-left
                    text-sm outline-none transition
                    hover:border-[#6f9473]
                    dark:border-white/10
                    dark:bg-[#1d211e]
                  "
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#6f9473]/10 text-[#6f9473]">
                    <CalendarDays size={15} />
                  </span>

                  <span
                    className={
                      form.dueDate
                        ? "font-bold"
                        : "text-black/35 dark:text-white/35"
                    }
                  >
                    {formatSelectedDate()}
                  </span>
                </button>

                {showCalendar && (
                  <div
                    className="
                      absolute left-0 top-full z-[120]
                      mt-2 w-[320px] max-w-[calc(100vw-2rem)]
                      rounded-3xl border border-black/10
                      bg-[#faf9f6] p-4 shadow-2xl
                      dark:border-white/10
                      dark:bg-[#1b1f1c]
                    "
                  >
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={goPreviousMonth}
                        className="
                          rounded-xl p-2
                          text-black/45 transition
                          hover:bg-black/5
                          dark:text-white/45
                          dark:hover:bg-white/10
                        "
                      >
                        <ChevronLeft size={18} />
                      </button>

                      <div className="text-center">
                        <p className="text-sm font-black">
                          {monthNames[calendarDate.getMonth()]}
                        </p>

                        <p className="text-[11px] font-bold text-black/35 dark:text-white/35">
                          {calendarDate.getFullYear()}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={goNextMonth}
                        className="
                          rounded-xl p-2
                          text-black/45 transition
                          hover:bg-black/5
                          dark:text-white/45
                          dark:hover:bg-white/10
                        "
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>

                    <div className="mt-4 grid grid-cols-7">
                      {weekDays.map((day) => (
                        <div
                          key={day}
                          className="
                              py-2 text-center
                              text-[9px] font-black
                              uppercase tracking-wider
                              text-black/30
                              dark:text-white/30
                            "
                        >
                          {day.charAt(0)}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {getCalendarDays().map(({ date, currentMonth }) => {
                        const dateKey = getDateKey(date);

                        const selected = dateKey === form.dueDate;

                        const isToday = dateKey === todayKey;

                        return (
                          <button
                            type="button"
                            key={`${dateKey}-${currentMonth}`}
                            onClick={() => selectDate(date)}
                            className={`
                                relative flex h-9
                                items-center
                                justify-center
                                rounded-xl text-xs
                                font-bold transition
                                ${
                                  currentMonth
                                    ? "text-black/70 hover:bg-[#6f9473]/10 dark:text-white/75"
                                    : "text-black/20 dark:text-white/20"
                                }
                                ${
                                  selected
                                    ? "bg-[#4f6f52] text-white hover:bg-[#3f5d43]"
                                    : ""
                                }
                              `}
                          >
                            {date.getDate()}

                            {isToday && !selected && (
                              <span className="absolute bottom-1 h-1 w-1 rounded-full bg-[#6f9473]" />
                            )}

                            {selected && (
                              <Check
                                size={9}
                                className="absolute right-1 top-1"
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-black/5 pt-3 dark:border-white/10">
                      <button
                        type="button"
                        onClick={clearDate}
                        className="
                          rounded-xl px-3 py-2
                          text-xs font-black
                          text-black/40
                          hover:bg-black/5
                          dark:text-white/40
                          dark:hover:bg-white/10
                        "
                      >
                        Clear
                      </button>

                      <button
                        type="button"
                        onClick={goToday}
                        className="
                          rounded-xl
                          bg-[#6f9473]/10
                          px-3 py-2 text-xs
                          font-black
                          text-[#5f8263]
                          hover:bg-[#6f9473]/20
                        "
                      >
                        Today
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* ESTIMATE */}

              <div>
                <label className="mb-2 block text-[10px] font-black uppercase tracking-wider text-black/40 dark:text-white/40">
                  Estimate
                </label>

                <div className="relative">
                  <Clock3
                    size={15}
                    className="
                      absolute left-3 top-3.5
                      text-black/25
                      dark:text-white/25
                    "
                  />

                  <input
                    type="number"
                    min="0"
                    value={form.estimatedMinutes}
                    onChange={(event) =>
                      update("estimatedMinutes", event.target.value)
                    }
                    className="
                      w-full rounded-xl border
                      border-black/10 bg-white
                      py-3 pl-9 pr-3
                      text-sm font-bold
                      outline-none transition
                      focus:border-[#6f9473]
                      focus:ring-4
                      focus:ring-[#6f9473]/10
                      dark:border-white/10
                      dark:bg-[#1d211e]
                    "
                  />
                </div>
              </div>

              {/* CATEGORY */}

              <div>
                <label className="mb-2 block text-[10px] font-black uppercase tracking-wider text-black/40 dark:text-white/40">
                  Category
                </label>

                <input
                  value={form.category}
                  onChange={(event) => update("category", event.target.value)}
                  placeholder="School, work..."
                  className="
                    w-full rounded-xl border
                    border-black/10 bg-white
                    px-3 py-3 text-sm
                    outline-none transition
                    placeholder:text-black/25
                    focus:border-[#6f9473]
                    focus:ring-4
                    focus:ring-[#6f9473]/10
                    dark:border-white/10
                    dark:bg-[#1d211e]
                    dark:placeholder:text-white/20
                  "
                />
              </div>
            </div>

            {/* PROJECT */}

            <div className="relative">
              <label className="mb-2 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-black/40 dark:text-white/40">
                <FolderKanban size={12} />
                Project
              </label>

              <button
                type="button"
                onClick={() => {
                  setShowProjectMenu((current) => !current);
                  setShowCalendar(false);
                }}
                className="
                  flex min-h-[50px] w-full
                  items-center justify-between
                  rounded-2xl border
                  border-black/10 bg-white px-3
                  transition
                  hover:border-[#6f9473]
                  dark:border-white/10
                  dark:bg-[#1d211e]
                "
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#765b6b]/10 text-[#765b6b] dark:bg-[#765b6b]/20 dark:text-[#b58fa3]">
                    <FolderKanban size={16} />
                  </span>

                  <div className="text-left">
                    <p className="text-[9px] font-black uppercase tracking-wider text-black/30 dark:text-white/30">
                      Assigned project
                    </p>

                    <p
                      className={
                        selectedProject
                          ? "text-sm font-black"
                          : "text-sm font-bold text-black/35 dark:text-white/35"
                      }
                    >
                      {selectedProjectName}
                    </p>
                  </div>
                </div>

                <span className="text-black/30 dark:text-white/30">▾</span>
              </button>

              {showProjectMenu && (
                <div
                  className="
                    absolute left-0 right-0
                    top-full z-[110] mt-2
                    max-h-60 overflow-y-auto
                    rounded-2xl border
                    border-black/10
                    bg-[#faf9f6] p-1.5
                    shadow-2xl
                    dark:border-white/10
                    dark:bg-[#1b1f1c]
                  "
                >
                  <button
                    type="button"
                    onClick={() => {
                      update("projectId", "");
                      setShowProjectMenu(false);
                    }}
                    className="
                      flex w-full items-center
                      gap-3 rounded-xl px-3
                      py-3 text-left
                      transition hover:bg-black/5
                      dark:hover:bg-white/10
                    "
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/5 text-black/35 dark:bg-white/10 dark:text-white/35">
                      <X size={14} />
                    </span>

                    <span className="text-sm font-bold">No project</span>

                    {!form.projectId && (
                      <Check size={15} className="ml-auto text-[#4f6f52]" />
                    )}
                  </button>

                  {projects.length === 0 ? (
                    <div className="px-3 py-5 text-center">
                      <FolderKanban
                        size={22}
                        className="mx-auto text-black/20 dark:text-white/20"
                      />

                      <p className="mt-2 text-xs font-bold text-black/35 dark:text-white/35">
                        No projects created yet
                      </p>
                    </div>
                  ) : (
                    projects.map((project) => {
                      const name =
                        project.name || project.title || "Untitled Project";

                      const selected =
                        String(form.projectId) === String(project.id);

                      return (
                        <button
                          type="button"
                          key={project.id}
                          onClick={() => {
                            update("projectId", String(project.id));

                            setShowProjectMenu(false);
                          }}
                          className="
                              flex w-full
                              items-center gap-3
                              rounded-xl px-3
                              py-3 text-left
                              transition
                              hover:bg-black/5
                              dark:hover:bg-white/10
                            "
                        >
                          <span
                            className="
                                flex h-8 w-8
                                items-center
                                justify-center
                                rounded-lg
                              "
                            style={{
                              backgroundColor: `${
                                project.color || "#765b6b"
                              }18`,
                              color: project.color || "#765b6b",
                            }}
                          >
                            <FolderKanban size={15} />
                          </span>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-black">
                              {name}
                            </p>

                            {project.description && (
                              <p className="truncate text-[10px] font-medium text-black/35 dark:text-white/35">
                                {project.description}
                              </p>
                            )}
                          </div>

                          {selected && (
                            <Check size={15} className="text-[#4f6f52]" />
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* TAGS */}

            <div>
              <label className="mb-2 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-black/40 dark:text-white/40">
                <Tag size={12} />
                Tags
              </label>

              <input
                value={form.tags}
                onChange={(event) => update("tags", event.target.value)}
                placeholder="frontend, urgent, school"
                className="
                  w-full rounded-xl border
                  border-black/10 bg-white
                  px-3 py-3 text-sm
                  outline-none transition
                  placeholder:text-black/25
                  focus:border-[#6f9473]
                  focus:ring-4
                  focus:ring-[#6f9473]/10
                  dark:border-white/10
                  dark:bg-[#1d211e]
                  dark:placeholder:text-white/20
                "
              />
            </div>

            {/* DEPENDENCIES */}

            {tasks.length > 0 && (
              <div>
                <label className="mb-2 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-black/40 dark:text-white/40">
                  <Zap size={12} />
                  Dependencies
                </label>

                <select
                  multiple
                  value={form.dependencies}
                  onChange={(event) =>
                    update(
                      "dependencies",
                      Array.from(
                        event.target.selectedOptions,
                        (option) => option.value,
                      ),
                    )
                  }
                  className="
                    min-h-24 w-full
                    rounded-xl border
                    border-black/10 bg-white
                    px-3 py-2 text-sm
                    outline-none
                    focus:border-[#6f9473]
                    dark:border-white/10
                    dark:bg-[#1d211e]
                  "
                >
                  {tasks
                    .filter((task) => !task.completed && !task.archived)
                    .map((task) => (
                      <option key={task.id} value={String(task.id)}>
                        {task.title}
                      </option>
                    ))}
                </select>

                <p className="mt-1.5 text-[10px] font-medium text-black/30 dark:text-white/30">
                  Hold Ctrl/Cmd to select multiple tasks.
                </p>
              </div>
            )}

            {/* FOOTER */}

            <div className="flex flex-col-reverse gap-2 border-t border-black/5 pt-5 sm:flex-row sm:justify-end dark:border-white/10">
              <button
                type="button"
                onClick={closeForm}
                className="
                  rounded-xl px-5 py-3
                  text-sm font-black
                  text-black/45 transition
                  hover:bg-black/5
                  dark:text-white/45
                  dark:hover:bg-white/10
                "
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!form.title.trim()}
                className="
                  flex items-center
                  justify-center gap-2
                  rounded-xl
                  bg-[#4f6f52] px-6 py-3
                  text-sm font-black text-white
                  shadow-lg
                  shadow-[#4f6f52]/15
                  transition
                  hover:bg-[#3f5d43]
                  hover:shadow-xl
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                <Check size={17} />
                Create Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// =========================================================
// STYLED SELECT
// =========================================================

function Select({ label, value, onChange, options = [] }) {
  const [open, setOpen] = useState(false);

  const formatOption = (option) => {
    return option
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getOptionStyle = (option) => {
    if (option === "High") {
      return "bg-rose-500/10 text-rose-600 dark:text-rose-400";
    }

    if (option === "Medium") {
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
    }

    if (option === "Low") {
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    }

    if (option === "in-progress") {
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
    }

    if (option === "review") {
      return "bg-purple-500/10 text-purple-600 dark:text-purple-400";
    }

    return "bg-black/5 text-black/60 dark:bg-white/10 dark:text-white/60";
  };

  return (
    <div className="relative">
      <label className="mb-2 block text-[10px] font-black uppercase tracking-wider text-black/40 dark:text-white/40">
        {label}
      </label>

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="
          flex min-h-[46px] w-full
          items-center justify-between
          rounded-xl border border-black/10
          bg-white px-3 text-sm font-bold
          outline-none transition
          hover:border-[#6f9473]
          dark:border-white/10
          dark:bg-[#1d211e]
        "
      >
        <span
          className={`
            rounded-lg px-2 py-1
            text-xs font-black
            ${getOptionStyle(value)}
          `}
        >
          {formatOption(value)}
        </span>

        <span className="text-black/30 dark:text-white/30">▾</span>
      </button>

      {open && (
        <div
          className="
            absolute left-0 right-0
            top-full z-[130] mt-2
            overflow-hidden rounded-2xl
            border border-black/10
            bg-[#faf9f6] p-1.5
            shadow-2xl
            dark:border-white/10
            dark:bg-[#1b1f1c]
          "
        >
          {options.map((option) => (
            <button
              type="button"
              key={option}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className="
                flex w-full items-center
                rounded-xl px-2 py-2
                text-left transition
                hover:bg-black/5
                dark:hover:bg-white/10
              "
            >
              <span
                className={`
                  rounded-lg px-2 py-1
                  text-xs font-black
                  ${getOptionStyle(option)}
                `}
              >
                {formatOption(option)}
              </span>

              {value === option && (
                <Check size={15} className="ml-auto text-[#4f6f52]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskForm;
