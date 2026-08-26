import { useEffect, useRef, useState } from "react";
import {
  LayoutList,
  Columns3,
  ChevronDown,
  Check,
} from "lucide-react";

import { useOutletContext } from "react-router-dom";

import TaskCard from "../Components/TaskCard";
import TaskForm from "../Components/TaskForm";
import EmptyState from "../Components/EmptyState";


// =========================================================
// CUSTOM DROPDOWN
// =========================================================

function StyledDropdown({
  value,
  onChange,
  options = [],
  placeholder = "Select",
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const selectedOption = options.find(
    (option) => option.value === value
  );

  return (
    <div
      ref={dropdownRef}
      className="relative w-full"
    >
      {/* BUTTON */}

      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        className={`
          flex
          w-full
          items-center
          justify-between
          rounded-2xl
          border
          px-4
          py-3
          text-left
          text-xs
          font-black
          outline-none
          transition-all
          duration-200

          ${
            open
              ? "border-[#765b6b] bg-[#765b6b]/5 shadow-[0_0_0_3px_rgba(118,91,107,0.08)]"
              : "border-black/10 bg-[#faf9f6] hover:border-black/20 hover:bg-white dark:border-white/10 dark:bg-[#202420] dark:hover:bg-[#252925]"
          }

          text-[#292725]
          dark:text-white
        `}
      >
        <span
          className={
            selectedOption?.value === "all"
              ? "text-black/40 dark:text-white/40"
              : "text-[#292725] dark:text-white"
          }
        >
          {selectedOption?.label || placeholder}
        </span>

        <ChevronDown
          size={16}
          className={`
            shrink-0
            transition-transform
            duration-200
            ${
              open
                ? "rotate-180 text-[#765b6b]"
                : "text-black/30 dark:text-white/30"
            }
          `}
        />
      </button>

      {/* DROPDOWN */}

      {open && (
        <div
          className="
            absolute
            left-0
            right-0
            top-[calc(100%+8px)]
            z-50
            overflow-hidden
            rounded-2xl
            border
            border-black/10
            bg-white
            p-1.5
            shadow-[0_15px_40px_rgba(0,0,0,0.12)]
            dark:border-white/10
            dark:bg-[#1b1f1c]
            dark:shadow-[0_15px_40px_rgba(0,0,0,0.35)]
          "
        >
          <div className="max-h-64 overflow-y-auto">
            {options.map((option) => {
              const selected =
                option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`
                    flex
                    w-full
                    items-center
                    justify-between
                    rounded-xl
                    px-3
                    py-2.5
                    text-left
                    text-xs
                    font-black
                    transition

                    ${
                      selected
                        ? "bg-[#765b6b]/10 text-[#765b6b] dark:bg-[#765b6b]/15 dark:text-[#c4aebe]"
                        : "text-black/60 hover:bg-black/5 hover:text-[#292725] dark:text-white/55 dark:hover:bg-white/5 dark:hover:text-white"
                    }
                  `}
                >
                  <span className="flex items-center gap-2">
                    {option.dot && (
                      <span
                        className={`h-2 w-2 rounded-full ${option.dot}`}
                      />
                    )}

                    {option.label}
                  </span>

                  {selected && (
                    <Check
                      size={15}
                      className="text-[#765b6b] dark:text-[#c4aebe]"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}


// =========================================================
// TODOS
// =========================================================

function Todos() {
  const {
    tasks = [],

    filteredTasks = [],

    tasksByStatus = {
      backlog: [],
      "in-progress": [],
      review: [],
      done: [],
    },

    addTask,
    toggleTask,
    deleteTask,
    archiveTask,
    startFocus,

    selectedTasks = [],
    toggleTaskSelection,
    selectAllVisibleTasks,
    clearTaskSelection,

    completeSelectedTasks,
    archiveSelectedTasks,
    deleteSelectedTasks,

    taskView,
    setTaskView,

    taskFilter,
    setTaskFilter,

    priorityFilter,
    setPriorityFilter,

    categoryFilter,
    setCategoryFilter,

    energyFilter,
    setEnergyFilter,

    projectFilter,
    setProjectFilter,

    projects = [],

    getTaskDependencies,
    hasBlockedDependencies,
  } = useOutletContext();

  const safeTasks = Array.isArray(tasks)
    ? tasks
    : [];

  const safeFilteredTasks =
    Array.isArray(filteredTasks)
      ? filteredTasks
      : [];

  const safeProjects = Array.isArray(projects)
    ? projects
    : [];

  const categories = [
    ...new Set(
      safeTasks
        .map((task) => task.category)
        .filter(Boolean)
    ),
  ];

  const safeTasksByStatus = {
    backlog: Array.isArray(
      tasksByStatus?.backlog
    )
      ? tasksByStatus.backlog
      : [],

    "in-progress": Array.isArray(
      tasksByStatus?.["in-progress"]
    )
      ? tasksByStatus["in-progress"]
      : [],

    review: Array.isArray(
      tasksByStatus?.review
    )
      ? tasksByStatus.review
      : [],

    done: Array.isArray(
      tasksByStatus?.done
    )
      ? tasksByStatus.done
      : [],
  };


  // =========================================================
  // DROPDOWN OPTIONS
  // =========================================================

  const priorityOptions = [
    {
      value: "all",
      label: "All priorities",
    },
    {
      value: "High",
      label: "High",
      dot: "bg-red-500",
    },
    {
      value: "Medium",
      label: "Medium",
      dot: "bg-amber-500",
    },
    {
      value: "Low",
      label: "Low",
      dot: "bg-emerald-500",
    },
  ];

  const energyOptions = [
    {
      value: "all",
      label: "All energy",
    },
    {
      value: "High",
      label: "High energy",
      dot: "bg-orange-500",
    },
    {
      value: "Medium",
      label: "Medium energy",
      dot: "bg-yellow-500",
    },
    {
      value: "Low",
      label: "Low energy",
      dot: "bg-blue-500",
    },
  ];

  const categoryOptions = [
    {
      value: "all",
      label: "All categories",
    },
    ...categories.map((category) => ({
      value: category,
      label: category,
      dot: "bg-[#765b6b]",
    })),
  ];

  const projectOptions = [
    {
      value: "all",
      label: "All projects",
    },
    ...safeProjects.map((project) => ({
      value: project.id,
      label:
        project.name ||
        project.title ||
        "Untitled Project",
      dot: "bg-[#765b6b]",
    })),
  ];


  // =========================================================
  // VIEW
  // =========================================================

  return (
    <div className="mx-auto max-w-7xl space-y-6">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#765b6b]">
            Task Management
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            Your tasks
          </h1>

          <p className="mt-2 text-sm text-black/40 dark:text-white/35">
            Plan, prioritize and execute your work.
          </p>
        </div>

        <TaskForm
          onAdd={addTask}
          projects={safeProjects}
          tasks={safeTasks}
        />
      </div>


      {/* =====================================================
          FILTER BAR
      ===================================================== */}

      <div
        className="
          rounded-[28px]
          border
          border-black/5
          bg-white
          p-4
          shadow-sm
          dark:border-white/10
          dark:bg-[#171a17]
        "
      >

        {/* TASK FILTERS */}

        <div className="flex flex-wrap gap-2">
          {[
            ["all", "All"],
            ["active", "Active"],
            ["today", "Today"],
            ["overdue", "Overdue"],
            ["in-progress", "In Progress"],
            ["review", "Review"],
            ["completed", "Completed"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() =>
                setTaskFilter(value)
              }
              className={`
                rounded-xl
                px-3.5
                py-2
                text-xs
                font-black
                transition-all
                duration-200

                ${
                  taskFilter === value
                    ? "bg-[#765b6b] text-white shadow-md shadow-[#765b6b]/20"
                    : "bg-black/5 text-black/50 hover:bg-black/10 dark:bg-white/5 dark:text-white/40 dark:hover:bg-white/10"
                }
              `}
            >
              {label}
            </button>
          ))}
        </div>


        {/* CUSTOM DROPDOWNS */}

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

          {/* PRIORITY */}

          <StyledDropdown
            value={priorityFilter}
            onChange={setPriorityFilter}
            options={priorityOptions}
            placeholder="All priorities"
          />

          {/* CATEGORY */}

          <StyledDropdown
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={categoryOptions}
            placeholder="All categories"
          />

          {/* ENERGY */}

          <StyledDropdown
            value={energyFilter}
            onChange={setEnergyFilter}
            options={energyOptions}
            placeholder="All energy"
          />

          {/* PROJECT */}

          <StyledDropdown
            value={projectFilter}
            onChange={setProjectFilter}
            options={projectOptions}
            placeholder="All projects"
          />

        </div>
      </div>


      {/* =====================================================
          TASK COUNT
      ===================================================== */}

      <div className="flex items-center justify-between">
        <p className="text-xs font-black uppercase tracking-widest text-black/30 dark:text-white/30">
          {safeFilteredTasks.length}{" "}
          {safeFilteredTasks.length === 1
            ? "task"
            : "tasks"}
        </p>

        {safeProjects.length > 0 && (
          <p className="text-xs font-bold text-black/30 dark:text-white/30">
            {safeProjects.length}{" "}
            {safeProjects.length === 1
              ? "project"
              : "projects"}
          </p>
        )}
      </div>


      {/* =====================================================
          BULK ACTIONS
      ===================================================== */}

      {safeFilteredTasks.length > 0 && (
        <div
          className="
            flex
            flex-wrap
            items-center
            gap-2
            rounded-2xl
            border
            border-black/5
            bg-white
            p-3
            dark:border-white/10
            dark:bg-[#171a17]
          "
        >

          <button
            type="button"
            onClick={selectAllVisibleTasks}
            className="
              rounded-xl
              px-3
              py-2
              text-xs
              font-black
              transition
              hover:bg-black/5
              dark:hover:bg-white/10
            "
          >
            Select all
          </button>

          {selectedTasks.length > 0 && (
            <>
              <span className="text-xs font-bold text-black/30 dark:text-white/30">
                {selectedTasks.length} selected
              </span>

              <button
                type="button"
                onClick={completeSelectedTasks}
                className="
                  rounded-xl
                  bg-[#765b6b]/10
                  px-3
                  py-2
                  text-xs
                  font-black
                  text-[#765b6b]
                  transition
                  hover:bg-[#765b6b]/15
                "
              >
                Complete
              </button>

              <button
                type="button"
                onClick={archiveSelectedTasks}
                className="
                  rounded-xl
                  bg-black/5
                  px-3
                  py-2
                  text-xs
                  font-black
                  transition
                  hover:bg-black/10
                  dark:bg-white/10
                  dark:hover:bg-white/15
                "
              >
                Archive
              </button>

              <button
                type="button"
                onClick={deleteSelectedTasks}
                className="
                  rounded-xl
                  bg-red-500/10
                  px-3
                  py-2
                  text-xs
                  font-black
                  text-red-500
                  transition
                  hover:bg-red-500/15
                "
              >
                Delete
              </button>

              <button
                type="button"
                onClick={clearTaskSelection}
                className="
                  rounded-xl
                  px-3
                  py-2
                  text-xs
                  font-black
                  text-black/40
                  hover:bg-black/5
                  dark:text-white/40
                  dark:hover:bg-white/5
                "
              >
                Clear
              </button>
            </>
          )}


          {/* VIEW BUTTONS */}

          <div className="ml-auto flex gap-1 rounded-xl bg-black/5 p-1 dark:bg-white/5">

            <button
              type="button"
              onClick={() =>
                setTaskView("list")
              }
              className={`
                rounded-lg
                p-2
                transition
                ${
                  taskView === "list"
                    ? "bg-white text-[#765b6b] shadow-sm dark:bg-[#252925]"
                    : "text-black/30 dark:text-white/30"
                }
              `}
            >
              <LayoutList size={17} />
            </button>

            <button
              type="button"
              onClick={() =>
                setTaskView("board")
              }
              className={`
                rounded-lg
                p-2
                transition
                ${
                  taskView === "board"
                    ? "bg-white text-[#765b6b] shadow-sm dark:bg-[#252925]"
                    : "text-black/30 dark:text-white/30"
                }
              `}
            >
              <Columns3 size={17} />
            </button>

          </div>
        </div>
      )}


      {/* =====================================================
          TASK LIST
      ===================================================== */}

      {taskView === "list" ? (

        safeFilteredTasks.length === 0 ? (

          <EmptyState
            title={
              safeTasks.length === 0
                ? "No tasks yet"
                : "No tasks found"
            }
            description={
              safeTasks.length === 0
                ? "Create your first task to get started."
                : "Try changing your filters or create a new task."
            }
            action={
              <TaskForm
                onAdd={addTask}
                projects={safeProjects}
                tasks={safeTasks}
              />
            }
          />

        ) : (

          <div className="space-y-3">
            {safeFilteredTasks.map((task) => {

              const dependencies =
                getTaskDependencies
                  ? getTaskDependencies(task)
                  : [];

              const blocked =
                hasBlockedDependencies
                  ? hasBlockedDependencies(task)
                  : false;

              return (
                <TaskCard
                  key={task.id}
                  task={task}
                  projects={safeProjects}
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                  onArchive={archiveTask}
                  onStartFocus={startFocus}
                  onSelect={toggleTaskSelection}
                  selected={selectedTasks.includes(
                    task.id
                  )}
                  dependencies={dependencies}
                  blocked={blocked}
                />
              );
            })}
          </div>

        )

      ) : (

        /* ===================================================
           KANBAN
        =================================================== */

        <div className="grid gap-4 xl:grid-cols-4">

          {[
            ["backlog", "Backlog"],
            ["in-progress", "In Progress"],
            ["review", "Review"],
            ["done", "Done"],
          ].map(([status, title]) => (

            <div
              key={status}
              className="
                min-h-[400px]
                rounded-3xl
                bg-black/[0.025]
                p-3
                dark:bg-white/[0.025]
              "
            >

              <div className="mb-3 flex items-center justify-between px-2">

                <h3 className="text-sm font-black">
                  {title}
                </h3>

                <span
                  className="
                    rounded-full
                    bg-black/5
                    px-2
                    py-1
                    text-[10px]
                    font-black
                    dark:bg-white/10
                  "
                >
                  {
                    safeTasksByStatus[
                      status
                    ].length
                  }
                </span>

              </div>

              <div className="space-y-3">

                {safeTasksByStatus[
                  status
                ].map((task) => {

                  const dependencies =
                    getTaskDependencies
                      ? getTaskDependencies(task)
                      : [];

                  const blocked =
                    hasBlockedDependencies
                      ? hasBlockedDependencies(task)
                      : false;

                  return (
                    <TaskCard
                      key={task.id}
                      task={task}
                      projects={safeProjects}
                      onToggle={toggleTask}
                      onDelete={deleteTask}
                      onArchive={archiveTask}
                      onStartFocus={startFocus}
                      onSelect={toggleTaskSelection}
                      selected={selectedTasks.includes(
                        task.id
                      )}
                      dependencies={dependencies}
                      blocked={blocked}
                    />
                  );
                })}

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Todos;