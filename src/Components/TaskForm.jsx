import { useEffect, useRef, useState } from "react";
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
  ListChecks,
  Sparkles,
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

  const [form, setForm] = useState({
    ...EMPTY_FORM,
  });

  const modalRef = useRef(null);

  /* =========================================================
     FORM HELPERS
  ========================================================= */

  const update = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      ...EMPTY_FORM,
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

  /* =========================================================
     ESCAPE KEY
  ========================================================= */

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeForm();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  /* =========================================================
     CALENDAR
  ========================================================= */

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
        date: new Date(
          year,
          month - 1,
          previousMonthDays - i,
        ),
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
      (current) =>
        new Date(
          current.getFullYear(),
          current.getMonth() - 1,
          1,
        ),
    );
  };

  const goNextMonth = () => {
    setCalendarDate(
      (current) =>
        new Date(
          current.getFullYear(),
          current.getMonth() + 1,
          1,
        ),
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

    const date = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
    );

    return date.toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const todayKey = getDateKey(new Date());

  /* =========================================================
     PROJECT
  ========================================================= */

  const selectedProject = projects.find(
    (project) =>
      String(project.id) === String(form.projectId),
  );

  const selectedProjectName = selectedProject
    ? selectedProject.name ||
      selectedProject.title ||
      "Untitled Project"
    : "No project";

  /* =========================================================
     SUBMIT
  ========================================================= */

  const submit = (event) => {
    event.preventDefault();

    const title = form.title.trim();

    if (!title) {
      return;
    }

    const cleanTask = {
      title,
      description: form.description.trim(),
      priority: form.priority,
      category: form.category || "General",
      status: form.status,
      dueDate: form.dueDate,
      estimatedMinutes:
        Number(form.estimatedMinutes) || 0,
      energy: form.energy,

      projectId: form.projectId
        ? String(form.projectId)
        : null,

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

  /* =========================================================
     OPEN BUTTON
  ========================================================= */

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => {
          resetForm();
          setOpen(true);
        }}
        className="group flex min-h-[42px] items-center gap-2 rounded-[12px] bg-[#765b6b] px-4 text-xs font-black text-white shadow-[0_5px_16px_rgba(118,91,107,0.16)] transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#674e5e] hover:shadow-[0_8px_22px_rgba(118,91,107,0.2)] active:translate-y-0"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-[7px] bg-white/15">
          <Plus size={14} strokeWidth={2.8} />
        </span>

        New task
      </button>
    );
  }

  /* =========================================================
     FORM MODAL
  ========================================================= */

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-[#181716]/45 p-3 backdrop-blur-[5px] sm:p-5 dark:bg-black/65"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          closeForm();
        }
      }}
    >
      <div
        ref={modalRef}
        onMouseDown={(event) => event.stopPropagation()}
        className="flex max-h-[94vh] w-full max-w-[760px] flex-col overflow-hidden rounded-[24px] border border-[#ddd8d0] bg-[#f8f6f1] shadow-[0_25px_80px_rgba(0,0,0,0.18)] dark:border-[#363b36] dark:bg-[#181c19]"
      >
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="shrink-0 border-b border-[#e3ded6] px-5 py-4 dark:border-[#303530] sm:px-6 sm:py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#765b6b] text-white shadow-[0_4px_12px_rgba(118,91,107,0.18)]">
                <Plus size={19} strokeWidth={2.6} />

                <span className="absolute -right-1 -top-1 flex h-3 w-3 items-center justify-center rounded-full border-2 border-[#f8f6f1] bg-[#627b82] dark:border-[#181c19]" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[9px] font-black uppercase tracking-[0.19em] text-[#765b6b] dark:text-[#c9aebe]">
                    New task
                  </p>
                </div>

                <h2 className="mt-1 truncate text-[19px] font-black tracking-[-0.025em] text-[#292725] dark:text-white">
                  What are you working on?
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={closeForm}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-[#e0dbd3] text-[#938d84] transition hover:bg-[#eeeae7] hover:text-[#292725] dark:border-[#353a35] dark:hover:bg-[#292e2a] dark:hover:text-white"
              aria-label="Close task form"
            >
              <X size={17} />
            </button>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-[#e8e3dc] dark:bg-[#303530]">
              <div className="h-full w-1/3 rounded-full bg-[#765b6b]" />
            </div>

            <span className="text-[8px] font-black uppercase tracking-[0.15em] text-[#aaa39a]">
              Task setup
            </span>
          </div>
        </div>

        {/* =====================================================
            CONTENT
        ===================================================== */}

        <div className="min-h-0 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
          <form onSubmit={submit} className="space-y-6">
            {/* =================================================
                BASICS
            ================================================= */}

            <section>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-[7px] bg-[#765b6b]/10 text-[#765b6b] dark:bg-[#765b6b]/15 dark:text-[#c9aebe]">
                  <Sparkles size={12} />
                </div>

                <p className="text-[9px] font-black uppercase tracking-[0.17em] text-[#938d84]">
                  Basics
                </p>
              </div>

              <div className="space-y-3">
                <FieldLabel>Task title</FieldLabel>

                <input
                  value={form.title}
                  onChange={(event) =>
                    update("title", event.target.value)
                  }
                  placeholder="e.g. Finish science assignment"
                  autoFocus
                  className="w-full rounded-[13px] border border-[#ded9d1] bg-white px-4 py-3.5 text-[14px] font-bold text-[#292725] outline-none transition placeholder:text-[#aaa49b] focus:border-[#765b6b] focus:ring-2 focus:ring-[#765b6b]/10 dark:border-[#353a35] dark:bg-[#202420] dark:text-white dark:placeholder:text-[#686d68]"
                />

                <div className="pt-1">
                  <FieldLabel>Description</FieldLabel>

                  <textarea
                    value={form.description}
                    onChange={(event) =>
                      update(
                        "description",
                        event.target.value,
                      )
                    }
                    placeholder="Add context, notes, or the outcome you want..."
                    rows={3}
                    className="w-full resize-none rounded-[13px] border border-[#ded9d1] bg-white px-4 py-3 text-[13px] font-medium leading-5 text-[#292725] outline-none transition placeholder:text-[#aaa49b] focus:border-[#765b6b] focus:ring-2 focus:ring-[#765b6b]/10 dark:border-[#353a35] dark:bg-[#202420] dark:text-white dark:placeholder:text-[#686d68]"
                  />
                </div>
              </div>
            </section>

            {/* =================================================
                PLANNING
            ================================================= */}

            <section>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-[7px] bg-[#627b82]/10 text-[#627b82] dark:bg-[#627b82]/15 dark:text-[#9bb4ba]">
                  <ListChecks size={12} />
                </div>

                <p className="text-[9px] font-black uppercase tracking-[0.17em] text-[#938d84]">
                  Planning
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Select
                  label="Priority"
                  value={form.priority}
                  onChange={(value) =>
                    update("priority", value)
                  }
                  options={["Low", "Medium", "High"]}
                />

                <Select
                  label="Status"
                  value={form.status}
                  onChange={(value) =>
                    update("status", value)
                  }
                  options={[
                    "backlog",
                    "in-progress",
                    "review",
                  ]}
                />

                <Select
                  label="Energy"
                  value={form.energy}
                  onChange={(value) =>
                    update("energy", value)
                  }
                  options={["Low", "Medium", "High"]}
                />

                {/* DATE */}

                <div className="relative">
                  <FieldLabel>Due date</FieldLabel>

                  <button
                    type="button"
                    onClick={() => {
                      setShowCalendar(
                        (current) => !current,
                      );
                      setShowProjectMenu(false);
                    }}
                    className="flex min-h-[46px] w-full items-center gap-2.5 rounded-[13px] border border-[#ded9d1] bg-white px-3 text-left transition hover:border-[#765b6b] dark:border-[#353a35] dark:bg-[#202420]"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-[#765b6b]/10 text-[#765b6b] dark:bg-[#765b6b]/15 dark:text-[#c9aebe]">
                      <CalendarDays size={14} />
                    </span>

                    <span
                      className={`truncate text-[11px] ${
                        form.dueDate
                          ? "font-bold text-[#292725] dark:text-white"
                          : "font-semibold text-[#aaa49b] dark:text-[#686d68]"
                      }`}
                    >
                      {formatSelectedDate()}
                    </span>
                  </button>

                  {showCalendar && (
                    <CalendarPicker
                      calendarDate={calendarDate}
                      monthNames={monthNames}
                      weekDays={weekDays}
                      todayKey={todayKey}
                      selectedDate={form.dueDate}
                      getCalendarDays={getCalendarDays}
                      getDateKey={getDateKey}
                      onPrevious={goPreviousMonth}
                      onNext={goNextMonth}
                      onSelect={selectDate}
                      onToday={goToday}
                      onClear={clearDate}
                    />
                  )}
                </div>

                {/* ESTIMATE */}

                <div>
                  <FieldLabel>Estimate</FieldLabel>

                  <div className="relative">
                    <Clock3
                      size={14}
                      className="absolute left-3 top-[15px] text-[#aaa49b] dark:text-[#686d68]"
                    />

                    <input
                      type="number"
                      min="0"
                      value={form.estimatedMinutes}
                      onChange={(event) =>
                        update(
                          "estimatedMinutes",
                          event.target.value,
                        )
                      }
                      className="w-full rounded-[13px] border border-[#ded9d1] bg-white py-3 pl-9 pr-3 text-[12px] font-bold text-[#292725] outline-none transition focus:border-[#765b6b] focus:ring-2 focus:ring-[#765b6b]/10 dark:border-[#353a35] dark:bg-[#202420] dark:text-white"
                    />
                  </div>
                </div>

                {/* CATEGORY */}

                <Select
                  label="Category"
                  value={form.category}
                  onChange={(value) =>
                    update("category", value)
                  }
                  options={[
                    "General",
                    "School",
                    "Coding",
                    "Work",
                    "Personal",
                    "Health",
                    "Fitness",
                    "Finance",
                    "Project",
                    "Other",
                  ]}
                />
              </div>
            </section>

            {/* =================================================
                PROJECT
            ================================================= */}

            <section>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-[7px] bg-[#765b6b]/10 text-[#765b6b] dark:bg-[#765b6b]/15 dark:text-[#c9aebe]">
                  <FolderKanban size={12} />
                </div>

                <p className="text-[9px] font-black uppercase tracking-[0.17em] text-[#938d84]">
                  Workspace
                </p>
              </div>

              <div className="relative">
                <FieldLabel>Project</FieldLabel>

                <button
                  type="button"
                  onClick={() => {
                    setShowProjectMenu(
                      (current) => !current,
                    );
                    setShowCalendar(false);
                  }}
                  className="flex min-h-[52px] w-full items-center justify-between gap-3 rounded-[13px] border border-[#ded9d1] bg-white px-3 transition hover:border-[#765b6b] dark:border-[#353a35] dark:bg-[#202420]"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-[#765b6b]/10 text-[#765b6b] dark:bg-[#765b6b]/15 dark:text-[#c9aebe]">
                      <FolderKanban size={15} />
                    </span>

                    <div className="min-w-0 text-left">
                      <p className="truncate text-[12px] font-black text-[#292725] dark:text-white">
                        {selectedProjectName}
                      </p>

                      <p className="mt-0.5 text-[8px] font-black uppercase tracking-[0.12em] text-[#aaa49b]">
                        {selectedProject
                          ? "Assigned project"
                          : "No project selected"}
                      </p>
                    </div>
                  </div>

                  <ChevronRight
                    size={15}
                    className={`shrink-0 text-[#aaa49b] transition-transform ${
                      showProjectMenu
                        ? "rotate-90"
                        : ""
                    }`}
                  />
                </button>

                {showProjectMenu && (
                  <ProjectMenu
                    projects={projects}
                    selectedProjectId={form.projectId}
                    onSelect={(value) => {
                      update("projectId", value);
                      setShowProjectMenu(false);
                    }}
                  />
                )}
              </div>
            </section>

            {/* =================================================
                TAGS + DEPENDENCIES
            ================================================= */}

            <section>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-[7px] bg-[#627b82]/10 text-[#627b82] dark:bg-[#627b82]/15 dark:text-[#9bb4ba]">
                  <Tag size={12} />
                </div>

                <p className="text-[9px] font-black uppercase tracking-[0.17em] text-[#938d84]">
                  Details
                </p>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                {/* TAGS */}

                <div>
                  <FieldLabel icon={<Tag size={11} />}>
                    Tags
                  </FieldLabel>

                  <input
                    value={form.tags}
                    onChange={(event) =>
                      update("tags", event.target.value)
                    }
                    placeholder="frontend, urgent, school"
                    className="w-full rounded-[13px] border border-[#ded9d1] bg-white px-3 py-3 text-[12px] font-semibold text-[#292725] outline-none transition placeholder:text-[#aaa49b] focus:border-[#765b6b] focus:ring-2 focus:ring-[#765b6b]/10 dark:border-[#353a35] dark:bg-[#202420] dark:text-white dark:placeholder:text-[#686d68]"
                  />

                  <p className="mt-1.5 text-[9px] font-medium text-[#aaa49b] dark:text-[#686d68]">
                    Separate tags with commas.
                  </p>
                </div>

                {/* DEPENDENCIES */}

                {tasks.length > 0 && (
                  <div>
                    <FieldLabel icon={<Zap size={11} />}>
                      Dependencies
                    </FieldLabel>

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
                      className="min-h-[92px] w-full rounded-[13px] border border-[#ded9d1] bg-white px-3 py-2 text-[11px] font-semibold text-[#292725] outline-none focus:border-[#765b6b] dark:border-[#353a35] dark:bg-[#202420] dark:text-white"
                    >
                      {tasks
                        .filter(
                          (task) =>
                            !task.completed &&
                            !task.archived,
                        )
                        .map((task) => (
                          <option
                            key={task.id}
                            value={String(task.id)}
                          >
                            {task.title}
                          </option>
                        ))}
                    </select>

                    <p className="mt-1.5 text-[9px] font-medium text-[#aaa49b] dark:text-[#686d68]">
                      Hold Ctrl/Cmd to select multiple.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* =================================================
                FOOTER
            ================================================= */}

            <div className="flex flex-col-reverse gap-2 border-t border-[#e3ded6] pt-5 dark:border-[#303530] sm:flex-row sm:items-center sm:justify-between">
              <p className="hidden text-[9px] font-bold text-[#aaa49b] dark:text-[#686d68] sm:block">
                You can edit these details later.
              </p>

              <div className="flex flex-col-reverse gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={closeForm}
                  className="min-h-[42px] rounded-[12px] border border-[#ded9d1] px-5 text-xs font-black text-[#77736b] transition hover:bg-[#eeeae7] hover:text-[#292725] dark:border-[#353a35] dark:text-[#aaa69e] dark:hover:bg-[#292e2a] dark:hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!form.title.trim()}
                  className="flex min-h-[42px] items-center justify-center gap-2 rounded-[12px] bg-[#765b6b] px-5 text-xs font-black text-white shadow-[0_5px_16px_rgba(118,91,107,0.17)] transition hover:bg-[#674e5e] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Check size={14} strokeWidth={2.8} />
                  Create task
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* =============================================================
   FIELD LABEL
============================================================= */

function FieldLabel({ children, icon }) {
  return (
    <label className="mb-1.5 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.15em] text-[#938d84]">
      {icon}
      {children}
    </label>
  );
}

/* =============================================================
   CALENDAR PICKER
============================================================= */

function CalendarPicker({
  calendarDate,
  monthNames,
  weekDays,
  todayKey,
  selectedDate,
  getCalendarDays,
  getDateKey,
  onPrevious,
  onNext,
  onSelect,
  onToday,
  onClear,
}) {
  return (
    <div className="absolute left-0 top-full z-[120] mt-2 w-[320px] max-w-[calc(100vw-1.5rem)] rounded-[20px] border border-[#ddd8d0] bg-[#f8f6f1] p-4 shadow-[0_18px_50px_rgba(0,0,0,0.16)] dark:border-[#353a35] dark:bg-[#1d211e]">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onPrevious}
          className="flex h-8 w-8 items-center justify-center rounded-[9px] text-[#8f8981] transition hover:bg-[#ebe7e0] hover:text-[#292725] dark:hover:bg-[#292e2a] dark:hover:text-white"
          aria-label="Previous month"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="text-center">
          <p className="text-[12px] font-black text-[#292725] dark:text-white">
            {monthNames[calendarDate.getMonth()]}
          </p>

          <p className="mt-0.5 text-[9px] font-bold text-[#aaa49b]">
            {calendarDate.getFullYear()}
          </p>
        </div>

        <button
          type="button"
          onClick={onNext}
          className="flex h-8 w-8 items-center justify-center rounded-[9px] text-[#8f8981] transition hover:bg-[#ebe7e0] hover:text-[#292725] dark:hover:bg-[#292e2a] dark:hover:text-white"
          aria-label="Next month"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="mt-3 grid grid-cols-7 border-b border-[#e8e3dc] pb-1 dark:border-[#303530]">
        {weekDays.map((day) => (
          <div
            key={day}
            className="py-1.5 text-center text-[8px] font-black uppercase tracking-wider text-[#aaa49b]"
          >
            {day.charAt(0)}
          </div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {getCalendarDays().map(
          ({ date, currentMonth }) => {
            const dateKey = getDateKey(date);
            const selected = dateKey === selectedDate;
            const isToday = dateKey === todayKey;

            return (
              <button
                type="button"
                key={`${dateKey}-${currentMonth}`}
                onClick={() => onSelect(date)}
                className={`relative flex h-8 items-center justify-center rounded-[8px] text-[10px] font-bold transition ${
                  currentMonth
                    ? "text-[#625e58] hover:bg-[#765b6b]/8 dark:text-[#bbb8b2] dark:hover:bg-[#765b6b]/15"
                    : "text-[#c4bfb7] dark:text-[#4e534f]"
                } ${
                  selected
                    ? "bg-[#765b6b] font-black text-white hover:bg-[#674e5e] dark:text-white"
                    : ""
                }`}
              >
                {date.getDate()}

                {isToday && !selected && (
                  <span className="absolute bottom-1 h-1 w-1 rounded-full bg-[#627b82]" />
                )}

                {selected && (
                  <Check
                    size={8}
                    strokeWidth={3}
                    className="absolute right-1 top-1"
                  />
                )}
              </button>
            );
          },
        )}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-[#e8e3dc] pt-3 dark:border-[#303530]">
        <button
          type="button"
          onClick={onClear}
          className="rounded-[9px] px-2.5 py-1.5 text-[9px] font-black text-[#938d84] transition hover:bg-[#ebe7e0] hover:text-[#292725] dark:hover:bg-[#292e2a] dark:hover:text-white"
        >
          Clear
        </button>

        <button
          type="button"
          onClick={onToday}
          className="rounded-[9px] bg-[#627b82]/10 px-3 py-1.5 text-[9px] font-black text-[#627b82] transition hover:bg-[#627b82]/15 dark:bg-[#627b82]/15 dark:text-[#9bb4ba]"
        >
          Today
        </button>
      </div>
    </div>
  );
}

/* =============================================================
   PROJECT MENU
============================================================= */

function ProjectMenu({
  projects,
  selectedProjectId,
  onSelect,
}) {
  return (
    <div className="absolute left-0 right-0 top-full z-[110] mt-2 max-h-64 overflow-y-auto rounded-[18px] border border-[#ddd8d0] bg-[#f8f6f1] p-1.5 shadow-[0_18px_50px_rgba(0,0,0,0.15)] dark:border-[#353a35] dark:bg-[#1d211e]">
      <button
        type="button"
        onClick={() => onSelect("")}
        className="flex w-full items-center gap-3 rounded-[11px] px-3 py-2.5 text-left transition hover:bg-[#ebe7e0] dark:hover:bg-[#292e2a]"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-[#ebe7e0] text-[#918b82] dark:bg-[#292e2a]">
          <X size={13} />
        </span>

        <span className="flex-1 text-[11px] font-bold text-[#55514c] dark:text-[#d1cec8]">
          No project
        </span>

        {!selectedProjectId && (
          <Check size={14} className="text-[#765b6b]" />
        )}
      </button>

      {projects.length === 0 ? (
        <div className="px-4 py-7 text-center">
          <FolderKanban
            size={22}
            className="mx-auto text-[#c0bbb3] dark:text-[#555b56]"
          />

          <p className="mt-2 text-[10px] font-bold text-[#aaa49b] dark:text-[#686d68]">
            No projects created yet
          </p>
        </div>
      ) : (
        projects.map((project) => {
          const name =
            project.name ||
            project.title ||
            "Untitled Project";

          const selected =
            String(selectedProjectId) ===
            String(project.id);

          const projectColor =
            project.color || "#765b6b";

          return (
            <button
              type="button"
              key={project.id}
              onClick={() =>
                onSelect(String(project.id))
              }
              className={`flex w-full items-center gap-3 rounded-[11px] px-3 py-2.5 text-left transition ${
                selected
                  ? "bg-[#765b6b]/7 dark:bg-[#765b6b]/12"
                  : "hover:bg-[#ebe7e0] dark:hover:bg-[#292e2a]"
              }`}
            >
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px]"
                style={{
                  backgroundColor: `${projectColor}18`,
                  color: projectColor,
                }}
              >
                <FolderKanban size={13} />
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-black text-[#292725] dark:text-white">
                  {name}
                </p>

                {project.description && (
                  <p className="mt-0.5 truncate text-[8px] font-medium text-[#aaa49b] dark:text-[#686d68]">
                    {project.description}
                  </p>
                )}
              </div>

              {selected && (
                <Check
                  size={14}
                  className="shrink-0 text-[#765b6b] dark:text-[#c9aebe]"
                />
              )}
            </button>
          );
        })
      )}
    </div>
  );
}

/* =============================================================
   STYLED SELECT
============================================================= */

function Select({
  label,
  value,
  onChange,
  options = [],
}) {
  const [open, setOpen] = useState(false);

  const formatOption = (option) => {
    return option
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getOptionStyle = (option) => {
    /* PRIORITY */

    if (option === "High") {
      return "bg-[#a85b5b]/8 text-[#a85b5b] dark:bg-[#d88989]/10 dark:text-[#d88989]";
    }

    if (option === "Medium") {
      return "bg-[#b07b4d]/8 text-[#a66d3d] dark:bg-[#d9a575]/10 dark:text-[#d9a575]";
    }

    if (option === "Low") {
      return "bg-[#627b82]/8 text-[#627b82] dark:bg-[#627b82]/12 dark:text-[#9bb4ba]";
    }

    /* STATUS */

    if (option === "in-progress") {
      return "bg-[#627b82]/8 text-[#627b82] dark:bg-[#627b82]/12 dark:text-[#9bb4ba]";
    }

    if (option === "review") {
      return "bg-[#765b6b]/8 text-[#765b6b] dark:bg-[#765b6b]/12 dark:text-[#c9aebe]";
    }

    /* CATEGORY */

    if (option === "General") {
      return "bg-[#ebe7e0] text-[#77736b] dark:bg-[#292e2a] dark:text-[#aaa69e]";
    }

    if (option === "School") {
      return "bg-[#627b82]/10 text-[#627b82] dark:bg-[#627b82]/15 dark:text-[#9bb4ba]";
    }

    if (option === "Coding") {
      return "bg-[#765b6b]/10 text-[#765b6b] dark:bg-[#765b6b]/15 dark:text-[#c9aebe]";
    }

    if (option === "Work") {
      return "bg-[#b07b4d]/10 text-[#a66d3d] dark:bg-[#b07b4d]/15 dark:text-[#d9a575]";
    }

    if (option === "Personal") {
      return "bg-[#a85b5b]/10 text-[#a85b5b] dark:bg-[#a85b5b]/15 dark:text-[#d88989]";
    }

    if (option === "Health") {
      return "bg-[#557a62]/10 text-[#557a62] dark:bg-[#557a62]/15 dark:text-[#9bb89f]";
    }

    if (option === "Fitness") {
      return "bg-[#627b82]/10 text-[#627b82] dark:bg-[#627b82]/15 dark:text-[#9bb4ba]";
    }

    if (option === "Finance") {
      return "bg-[#b07b4d]/10 text-[#a66d3d] dark:bg-[#b07b4d]/15 dark:text-[#d9a575]";
    }

    if (option === "Project") {
      return "bg-[#765b6b]/10 text-[#765b6b] dark:bg-[#765b6b]/15 dark:text-[#c9aebe]";
    }

    if (option === "Other") {
      return "bg-[#737773]/10 text-[#737773] dark:bg-[#737773]/15 dark:text-[#b5b8b5]";
    }

    return "bg-[#ebe7e0] text-[#77736b] dark:bg-[#292e2a] dark:text-[#aaa69e]";
  };

  return (
    <div className="relative">
      <FieldLabel>{label}</FieldLabel>

      <button
        type="button"
        onClick={() =>
          setOpen((current) => !current)
        }
        className="flex min-h-[46px] w-full items-center justify-between gap-2 rounded-[13px] border border-[#ded9d1] bg-white px-3 transition hover:border-[#765b6b] dark:border-[#353a35] dark:bg-[#202420]"
      >
        <span
          className={`rounded-[8px] px-2 py-1 text-[9px] font-black uppercase tracking-wide ${getOptionStyle(
            value,
          )}`}
        >
          {formatOption(value)}
        </span>

        <ChevronRight
          size={14}
          className={`text-[#aaa49b] transition-transform ${
            open ? "rotate-90" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-[130] mt-2 overflow-hidden rounded-[16px] border border-[#ddd8d0] bg-[#f8f6f1] p-1.5 shadow-[0_16px_45px_rgba(0,0,0,0.15)] dark:border-[#353a35] dark:bg-[#1d211e]">
          {options.map((option) => (
            <button
              type="button"
              key={option}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className="flex w-full items-center rounded-[10px] px-2 py-2 text-left transition hover:bg-[#ebe7e0] dark:hover:bg-[#292e2a]"
            >
              <span
                className={`rounded-[8px] px-2 py-1 text-[9px] font-black uppercase tracking-wide ${getOptionStyle(
                  option,
                )}`}
              >
                {formatOption(option)}
              </span>

              {value === option && (
                <Check
                  size={14}
                  className="ml-auto text-[#765b6b] dark:text-[#c9aebe]"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskForm;