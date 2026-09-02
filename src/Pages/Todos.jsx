import { useEffect, useMemo, useRef, useState } from "react";

import {
  LayoutList,
  Columns3,
  ChevronDown,
  Check,
  ListFilter,
  CheckCheck,
  Archive,
  Trash2,
  X,
  Search,
  CircleDot,
  SlidersHorizontal,
  Sparkles,
  FolderKanban,
  ArrowDownUp,
} from "lucide-react";

import {
  useOutletContext,
  useSearchParams,
} from "react-router-dom";

import TaskCard from "../Components/TaskCard";
import TaskForm from "../Components/TaskForm";
import EmptyState from "../Components/EmptyState";

/* =========================================================
   STYLED DROPDOWN
========================================================= */

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
    (option) =>
      String(option.value) === String(value)
  );

  return (
    <div
      ref={dropdownRef}
      className="relative w-full"
    >
      <button
        type="button"
        onClick={() =>
          setOpen((previous) => !previous)
        }
        className={`group flex min-h-[42px] w-full items-center justify-between gap-3 rounded-[10px] border px-3 text-left text-[10px] font-black outline-none transition-all duration-200 ${
          open
            ? "border-[#765b6b]/40 bg-[#765b6b]/5 ring-2 ring-[#765b6b]/8"
            : "border-[#e1dcd4] bg-[#faf9f6] hover:border-[#d1cac1] hover:bg-white dark:border-[#343934] dark:bg-[#202420] dark:hover:border-[#474c47]"
        }`}
      >
        <span className="flex min-w-0 items-center gap-2">
          {selectedOption?.dot && (
            <span
              className={`h-1.5 w-1.5 shrink-0 rounded-full ${selectedOption.dot}`}
            />
          )}

          <span
            className={`truncate ${
              selectedOption?.value === "all"
                ? "text-[#99938a] dark:text-[#7c827d]"
                : "text-[#4f4b46] dark:text-[#d0cdc7]"
            }`}
          >
            {selectedOption?.label || placeholder}
          </span>
        </span>

        <ChevronDown
          size={13}
          className={`shrink-0 text-[#aaa49b] transition-transform duration-200 ${
            open
              ? "rotate-180 text-[#765b6b]"
              : "group-hover:text-[#765b6b]"
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+7px)] z-[70] overflow-hidden rounded-[13px] border border-[#ddd8d0] bg-[#f8f6f1] p-1.5 shadow-[0_18px_45px_rgba(41,39,37,0.14)] dark:border-[#353a35] dark:bg-[#1d211e] dark:shadow-[0_18px_45px_rgba(0,0,0,0.32)]">
          <div className="max-h-60 overflow-y-auto">
            {options.map((option) => {
              const selected =
                String(option.value) ===
                String(value);

              return (
                <button
                  key={String(option.value)}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-[8px] px-2.5 py-2.5 text-left text-[10px] font-black transition ${
                    selected
                      ? "bg-[#765b6b]/8 text-[#765b6b] dark:bg-[#765b6b]/12 dark:text-[#c9aebe]"
                      : "text-[#77736b] hover:bg-[#ebe7e0] hover:text-[#292725] dark:text-[#aaa69e] dark:hover:bg-[#292e2a] dark:hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {option.dot && (
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${option.dot}`}
                      />
                    )}

                    {option.label}
                  </span>

                  {selected && (
                    <Check
                      size={13}
                      className="text-[#765b6b] dark:text-[#c9aebe]"
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

/* =========================================================
   TODOS
========================================================= */

function Todos() {
  const outletContext = useOutletContext() || {};

  const [searchParams, setSearchParams] =
    useSearchParams();

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
    updateTask,
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

    taskView = "list",
    setTaskView,

    taskFilter = "all",
    setTaskFilter,

    priorityFilter = "all",
    setPriorityFilter,

    categoryFilter = "all",
    setCategoryFilter,

    energyFilter = "all",
    setEnergyFilter,

    projectFilter = "all",
    setProjectFilter,

    projects = [],

    getTaskDependencies,
    hasBlockedDependencies,
  } = outletContext;

  /* =========================================================
     SAFE ARRAYS
  ========================================================= */

  const safeTasks = Array.isArray(tasks)
    ? tasks
    : [];

  const safeFilteredTasks = Array.isArray(
    filteredTasks
  )
    ? filteredTasks
    : [];

  const safeProjects = Array.isArray(projects)
    ? projects
    : [];

  const safeSelectedTasks = Array.isArray(
    selectedTasks
  )
    ? selectedTasks
    : [];

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

    done: Array.isArray(tasksByStatus?.done)
      ? tasksByStatus.done
      : [],
  };

  /* =========================================================
     LOCAL SEARCH
  ========================================================= */

  const [localSearch, setLocalSearch] =
    useState("");

  /* =========================================================
     URL PROJECT / TASK / FILTER HANDLING
  ========================================================= */

  useEffect(() => {
    const projectId =
      searchParams.get("project");

    const taskId =
      searchParams.get("task");

    const urlFilter =
      searchParams.get("filter");

    /*
      Dashboard:
      /todos?filter=today

      When this URL is opened, activate
      the Today filter automatically.
    */

    if (
      urlFilter === "today" &&
      typeof setTaskFilter === "function" &&
      taskFilter !== "today"
    ) {
      setTaskFilter("today");
    }

    if (projectId) {
      const projectExists = safeProjects.some(
        (project) =>
          String(project.id) ===
          String(projectId)
      );

      if (
        projectExists &&
        typeof setProjectFilter === "function"
      ) {
        setProjectFilter(
          String(projectId)
        );
      }
    }

    if (taskId) {
      const targetTask = safeTasks.find(
        (task) =>
          String(task.id) ===
          String(taskId)
      );

      if (targetTask) {
        if (
          typeof setTaskFilter === "function"
        ) {
          setTaskFilter("all");
        }

        if (
          targetTask.projectId != null &&
          typeof setProjectFilter ===
            "function"
        ) {
          setProjectFilter(
            String(targetTask.projectId)
          );
        }
      }
    }
  }, [
    searchParams,
    safeProjects,
    safeTasks,
    setProjectFilter,
    setTaskFilter,
    taskFilter,
  ]);

  /* =========================================================
     URL CLEAR
  ========================================================= */

  const clearUrlSelection = () => {
    const nextParams =
      new URLSearchParams(searchParams);

    nextParams.delete("project");
    nextParams.delete("task");
    nextParams.delete("filter");

    setSearchParams(nextParams, {
      replace: true,
    });
  };

  /* =========================================================
     SEARCH
  ========================================================= */

  const visibleTasks = useMemo(() => {
    const query = localSearch
      .trim()
      .toLowerCase();

    if (!query) {
      return safeFilteredTasks;
    }

    return safeFilteredTasks.filter(
      (task) => {
        const title =
          task?.title?.toLowerCase() || "";

        const description =
          task?.description?.toLowerCase() ||
          "";

        const category =
          task?.category?.toLowerCase() ||
          "";

        const tags = Array.isArray(
          task?.tags
        )
          ? task.tags
              .join(" ")
              .toLowerCase()
          : "";

        return (
          title.includes(query) ||
          description.includes(query) ||
          category.includes(query) ||
          tags.includes(query)
        );
      }
    );
  }, [
    safeFilteredTasks,
    localSearch,
  ]);

  /* =========================================================
     CATEGORIES
  ========================================================= */

  const categories = useMemo(
    () => [
      ...new Set(
        safeTasks
          .map(
            (task) => task?.category
          )
          .filter(Boolean)
      ),
    ],
    [safeTasks]
  );

  /* =========================================================
     FILTER OPTIONS
  ========================================================= */

  const priorityOptions = [
    {
      value: "all",
      label: "All priorities",
    },
    {
      value: "High",
      label: "High",
      dot: "bg-[#a85b5b]",
    },
    {
      value: "Medium",
      label: "Medium",
      dot: "bg-[#b07b4d]",
    },
    {
      value: "Low",
      label: "Low",
      dot: "bg-[#627b82]",
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
      dot: "bg-[#b07b4d]",
    },
    {
      value: "Medium",
      label: "Medium energy",
      dot: "bg-[#c09a55]",
    },
    {
      value: "Low",
      label: "Low energy",
      dot: "bg-[#627b82]",
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
      value: String(project.id),
      label:
        project.name ||
        project.title ||
        "Untitled Project",
      dot: "bg-[#765b6b]",
    })),
  ];

  /* =========================================================
     STATS
  ========================================================= */

  const activeCount = safeTasks.filter(
    (task) =>
      !task.completed &&
      !task.archived
  ).length;

  const completedCount = safeTasks.filter(
    (task) => task.completed === true
  ).length;

  const overdueCount = safeTasks.filter(
    (task) => {
      if (
        task.completed ||
        task.archived ||
        !task.dueDate
      ) {
        return false;
      }

      return (
        task.dueDate <
        new Date()
          .toISOString()
          .split("T")[0]
      );
    }
  ).length;

  const completionRate =
    safeTasks.length > 0
      ? Math.round(
          (completedCount /
            safeTasks.length) *
            100
        )
      : 0;

  /* =========================================================
     PROJECT CONTEXT
  ========================================================= */

  const activeProjectId =
    searchParams.get("project");

  const activeProject =
    safeProjects.find(
      (project) =>
        String(project.id) ===
        String(activeProjectId)
    );

  /* =========================================================
     ACTIVE FILTERS
  ========================================================= */

  const hasProjectFilter =
    projectFilter !== "all" &&
    projectFilter !== null &&
    projectFilter !== undefined;

  const hasActiveFilters =
    taskFilter !== "all" ||
    priorityFilter !== "all" ||
    categoryFilter !== "all" ||
    energyFilter !== "all" ||
    hasProjectFilter ||
    Boolean(localSearch);

  /* =========================================================
     CLEAR FILTERS
  ========================================================= */

  const clearAllFilters = () => {
    if (
      typeof setTaskFilter === "function"
    ) {
      setTaskFilter("all");
    }

    if (
      typeof setPriorityFilter ===
      "function"
    ) {
      setPriorityFilter("all");
    }

    if (
      typeof setCategoryFilter ===
      "function"
    ) {
      setCategoryFilter("all");
    }

    if (
      typeof setEnergyFilter === "function"
    ) {
      setEnergyFilter("all");
    }

    if (
      typeof setProjectFilter ===
      "function"
    ) {
      setProjectFilter("all");
    }

    setLocalSearch("");
    clearUrlSelection();
  };

  /* =========================================================
     VIEW
  ========================================================= */

  const handleTaskView = (view) => {
    if (
      typeof setTaskView === "function"
    ) {
      setTaskView(view);
    }
  };

  /* =========================================================
     TASK FILTER
  ========================================================= */

  const handleTaskFilter = (filter) => {
    if (
      typeof setTaskFilter === "function"
    ) {
      setTaskFilter(filter);
    }

    const nextParams =
      new URLSearchParams(searchParams);

    /*
      Manual filter changes remove the
      dashboard URL filter.
    */

    nextParams.delete("filter");

    if (
      searchParams.has("project") &&
      filter !== taskFilter
    ) {
      nextParams.delete("project");
    }

    setSearchParams(nextParams, {
      replace: true,
    });
  };

  /* =========================================================
     TASK CARD
  ========================================================= */

  const renderTaskCard = (task) => {
    if (!task) {
      return null;
    }

    const dependencies =
      typeof getTaskDependencies ===
      "function"
        ? getTaskDependencies(task)
        : [];

    const blocked =
      typeof hasBlockedDependencies ===
      "function"
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
        onUpdate={updateTask}
        selected={safeSelectedTasks.some(
          (id) =>
            String(id) ===
            String(task.id)
        )}
        dependencies={dependencies}
        blocked={blocked}
      />
    );
  };

  /* =========================================================
     FILTER BUTTONS
  ========================================================= */

  const filters = [
    ["all", "All"],
    ["active", "Active"],
    ["today", "Today"],
    ["overdue", "Overdue"],
    ["in-progress", "In progress"],
    ["review", "Review"],
    ["completed", "Completed"],
  ];

  /* =========================================================
     KANBAN FILTER
  ========================================================= */

  const getBoardTasks = (status) => {
    const query = localSearch
      .trim()
      .toLowerCase();

    return safeTasksByStatus[
      status
    ].filter((task) => {
      if (!query) {
        return true;
      }

      const title =
        task?.title?.toLowerCase() || "";

      const description =
        task?.description?.toLowerCase() ||
        "";

      const category =
        task?.category?.toLowerCase() ||
        "";

      const tags = Array.isArray(
        task?.tags
      )
        ? task.tags
            .join(" ")
            .toLowerCase()
        : "";

      return (
        title.includes(query) ||
        description.includes(query) ||
        category.includes(query) ||
        tags.includes(query)
      );
    });
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="mx-auto max-w-[1320px] space-y-5 pb-8">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="relative overflow-hidden rounded-[20px] border border-[#e3ded6] bg-white px-5 py-5 shadow-[0_5px_22px_rgba(41,39,37,0.035)] dark:border-[#333833] dark:bg-[#1b1f1c] sm:px-6 sm:py-6">
        <div className="pointer-events-none absolute right-[-70px] top-[-90px] h-52 w-52 rounded-full bg-[#765b6b]/5 blur-3xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#765b6b]" />

              <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#765b6b] dark:text-[#c9aebe]">
                Task workspace
              </p>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2.5">
              <h1 className="text-[30px] font-black tracking-[-0.04em] text-[#292725] dark:text-white sm:text-[36px]">
                Your tasks
              </h1>

              {activeProject && (
                <>
                  <span className="text-[#c1bbb2]">
                    /
                  </span>

                  <span className="flex max-w-full items-center gap-1.5 rounded-[8px] bg-[#765b6b]/8 px-2.5 py-1.5 text-[9px] font-black text-[#765b6b] dark:bg-[#765b6b]/12 dark:text-[#c9aebe]">
                    <FolderKanban size={11} />

                    <span className="max-w-[180px] truncate">
                      {activeProject.name ||
                        activeProject.title ||
                        "Project"}
                    </span>
                  </span>
                </>
              )}
            </div>

            <p className="mt-1.5 max-w-xl text-[12px] leading-5 text-[#8c867e] dark:text-[#858b86]">
              Keep the work visible, focused, and moving.
            </p>
          </div>

          <div className="shrink-0">
            <TaskForm
              onAdd={addTask}
              projects={safeProjects}
              tasks={safeTasks}
            />
          </div>
        </div>
      </header>

      {/* =====================================================
          PROJECT CONTEXT
      ===================================================== */}

      {activeProject && (
        <section className="flex flex-col gap-3 rounded-[15px] border border-[#765b6b]/15 bg-[#765b6b]/[0.035] px-4 py-3.5 dark:border-[#765b6b]/20 dark:bg-[#765b6b]/[0.06] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-[#765b6b]/10 text-[#765b6b] dark:bg-[#765b6b]/15 dark:text-[#c9aebe]">
              <CircleDot size={14} />
            </div>

            <div className="min-w-0">
              <p className="text-[8px] font-black uppercase tracking-[0.16em] text-[#765b6b] dark:text-[#c9aebe]">
                Project filter
              </p>

              <p className="truncate text-[11px] font-black text-[#4f4b46] dark:text-[#d0cdc7]">
                Showing tasks from{" "}
                {activeProject.name ||
                  activeProject.title ||
                  "this project"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (
                typeof setProjectFilter ===
                "function"
              ) {
                setProjectFilter("all");
              }

              const nextParams =
                new URLSearchParams(
                  searchParams
                );

              nextParams.delete("project");

              setSearchParams(
                nextParams,
                {
                  replace: true,
                }
              );
            }}
            className="flex shrink-0 items-center justify-center gap-1.5 rounded-[8px] border border-[#d8cdd3] bg-white px-3 py-2 text-[9px] font-black text-[#765b6b] transition hover:border-[#765b6b]/30 hover:bg-[#faf7f9] dark:border-[#4a3d45] dark:bg-[#202420] dark:text-[#c9aebe] dark:hover:bg-[#292e2a]"
          >
            <X size={11} />
            Clear project
          </button>
        </section>
      )}

      {/* =====================================================
          QUICK STATS
      ===================================================== */}

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <MiniStat
          label="Total"
          value={safeTasks.length}
        />

        <MiniStat
          label="Active"
          value={activeCount}
          accent
        />

        <MiniStat
          label="Overdue"
          value={overdueCount}
          warning={overdueCount > 0}
        />

        <MiniStat
          label="Completed"
          value={`${completionRate}%`}
          success
        />
      </div>

      {/* =====================================================
          FILTER WORKSPACE
      ===================================================== */}

      <section className="overflow-visible rounded-[18px] border border-[#e1dcd4] bg-white shadow-[0_5px_20px_rgba(41,39,37,0.035)] dark:border-[#333833] dark:bg-[#1b1f1c]">
        <div className="flex flex-col gap-3 border-b border-[#ebe7e0] p-3.5 dark:border-[#303530] lg:flex-row lg:items-center">
          <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto pb-0.5 scrollbar-none">
            <div className="mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-[#f0ede8] text-[#77736b] dark:bg-[#292e2a] dark:text-[#aaa69e]">
              <ListFilter size={14} />
            </div>

            {filters.map(
              ([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    handleTaskFilter(value)
                  }
                  className={`shrink-0 rounded-[9px] px-3 py-2 text-[10px] font-black transition-all duration-200 ${
                    taskFilter === value
                      ? "bg-[#765b6b] text-white shadow-[0_4px_12px_rgba(118,91,107,0.16)]"
                      : "text-[#8b857d] hover:bg-[#f1eee9] hover:text-[#292725] dark:text-[#858b86] dark:hover:bg-[#292e2a] dark:hover:text-white"
                  }`}
                >
                  {label}
                </button>
              )
            )}
          </div>

          <div className="relative flex shrink-0 items-center">
            <Search
              size={13}
              className="absolute left-3 text-[#aaa49b]"
            />

            <input
              value={localSearch}
              onChange={(event) =>
                setLocalSearch(
                  event.target.value
                )
              }
              placeholder="Search tasks..."
              className="h-9 w-full rounded-[10px] border border-[#e1dcd4] bg-[#faf9f6] pl-8 pr-8 text-[10px] font-bold text-[#292725] outline-none transition placeholder:text-[#aaa49b] focus:border-[#765b6b] focus:ring-2 focus:ring-[#765b6b]/10 dark:border-[#353a35] dark:bg-[#202420] dark:text-white dark:placeholder:text-[#686d68] sm:w-[205px]"
            />

            {localSearch && (
              <button
                type="button"
                onClick={() =>
                  setLocalSearch("")
                }
                className="absolute right-2 flex h-5 w-5 items-center justify-center rounded-full text-[#aaa49b] hover:bg-black/5 dark:hover:bg-white/5"
                aria-label="Clear search"
              >
                <X size={11} />
              </button>
            )}
          </div>
        </div>

        {/* FILTER CONTROLS */}

        <div className="grid gap-2.5 p-3.5 sm:grid-cols-2 lg:grid-cols-4">
          <StyledDropdown
            value={priorityFilter}
            onChange={setPriorityFilter}
            options={priorityOptions}
            placeholder="All priorities"
          />

          <StyledDropdown
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={categoryOptions}
            placeholder="All categories"
          />

          <StyledDropdown
            value={energyFilter}
            onChange={setEnergyFilter}
            options={energyOptions}
            placeholder="All energy"
          />

          <StyledDropdown
            value={
              projectFilter == null
                ? "all"
                : String(projectFilter)
            }
            onChange={setProjectFilter}
            options={projectOptions}
            placeholder="All projects"
          />
        </div>

        {/* FILTER STATUS */}

        {hasActiveFilters && (
          <div className="flex flex-col gap-2 border-t border-[#ebe7e0] px-3.5 py-2.5 dark:border-[#303530] sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-[9px] font-bold text-[#99938a] dark:text-[#686d68]">
              <SlidersHorizontal size={11} />
              Filters are active
            </div>

            <button
              type="button"
              onClick={clearAllFilters}
              className="self-start text-[9px] font-black text-[#765b6b] transition hover:underline dark:text-[#c9aebe] sm:self-auto"
            >
              Clear all
            </button>
          </div>
        )}
      </section>

      {/* =====================================================
          RESULT TOOLBAR
      ===================================================== */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-[#765b6b]/8 text-[#765b6b] dark:bg-[#765b6b]/12 dark:text-[#c9aebe]">
            <CircleDot size={12} />
          </div>

          <div>
            <p className="text-[10px] font-black text-[#55514c] dark:text-[#d0cdc7]">
              {visibleTasks.length}{" "}
              {visibleTasks.length === 1
                ? "task"
                : "tasks"}
            </p>

            {localSearch && (
              <p className="max-w-[220px] truncate text-[8px] font-bold text-[#aaa49b]">
                Matching “{localSearch}”
              </p>
            )}

            {taskFilter === "today" &&
              !localSearch && (
                <p className="text-[8px] font-bold text-[#765b6b] dark:text-[#c9aebe]">
                  Tasks due today
                </p>
              )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 sm:justify-end">
          {safeProjects.length > 0 && (
            <p className="text-[9px] font-bold text-[#aaa49b] dark:text-[#686d68]">
              {safeProjects.length}{" "}
              {safeProjects.length === 1
                ? "project"
                : "projects"}
            </p>
          )}

          <div className="flex items-center gap-1 rounded-[10px] border border-[#e1dcd4] bg-[#faf9f6] p-1 dark:border-[#353a35] dark:bg-[#202420]">
            <button
              type="button"
              onClick={() =>
                handleTaskView("list")
              }
              className={`flex h-7 w-8 items-center justify-center rounded-[7px] transition ${
                taskView === "list"
                  ? "bg-white text-[#765b6b] shadow-sm dark:bg-[#292e2a] dark:text-[#c9aebe]"
                  : "text-[#aaa49b] hover:text-[#55514c] dark:hover:text-white"
              }`}
              title="List view"
              aria-label="List view"
            >
              <LayoutList size={14} />
            </button>

            <button
              type="button"
              onClick={() =>
                handleTaskView("board")
              }
              className={`flex h-7 w-8 items-center justify-center rounded-[7px] transition ${
                taskView === "board"
                  ? "bg-white text-[#765b6b] shadow-sm dark:bg-[#292e2a] dark:text-[#c9aebe]"
                  : "text-[#aaa49b] hover:text-[#55514c] dark:hover:text-white"
              }`}
              title="Board view"
              aria-label="Board view"
            >
              <Columns3 size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          BULK ACTIONS
      ===================================================== */}

      {visibleTasks.length > 0 && (
        <section
          className={`rounded-[15px] border p-3 transition ${
            safeSelectedTasks.length > 0
              ? "border-[#765b6b]/15 bg-[#765b6b]/[0.035] dark:border-[#765b6b]/20 dark:bg-[#765b6b]/[0.06]"
              : "border-[#e3ded6] bg-white dark:border-[#333833] dark:bg-[#1b1f1c]"
          }`}
        >
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={
                selectAllVisibleTasks
              }
              className="flex items-center gap-1.5 rounded-[9px] border border-[#e1dcd4] bg-[#faf9f6] px-3 py-2 text-[9px] font-black text-[#77736b] transition hover:border-[#d4cec5] hover:text-[#292725] dark:border-[#353a35] dark:bg-[#202420] dark:text-[#aaa69e] dark:hover:text-white"
            >
              <CheckCheck size={12} />
              Select all
            </button>

            {safeSelectedTasks.length >
              0 && (
              <>
                <span className="text-[9px] font-black uppercase tracking-[0.12em] text-[#765b6b] dark:text-[#c9aebe]">
                  {safeSelectedTasks.length}{" "}
                  selected
                </span>

                <div className="hidden h-4 w-px bg-[#ddd8d0] dark:bg-[#353a35] sm:block" />

                <button
                  type="button"
                  onClick={
                    completeSelectedTasks
                  }
                  className="flex items-center gap-1.5 rounded-[9px] bg-[#557a62]/9 px-3 py-2 text-[9px] font-black text-[#557a62] transition hover:bg-[#557a62]/14 dark:bg-[#557a62]/12 dark:text-[#8faf91]"
                >
                  <Check size={12} />
                  Complete
                </button>

                <button
                  type="button"
                  onClick={
                    archiveSelectedTasks
                  }
                  className="flex items-center gap-1.5 rounded-[9px] bg-[#627b82]/9 px-3 py-2 text-[9px] font-black text-[#627b82] transition hover:bg-[#627b82]/14 dark:bg-[#627b82]/12 dark:text-[#9bb4ba]"
                >
                  <Archive size={12} />
                  Archive
                </button>

                <button
                  type="button"
                  onClick={
                    deleteSelectedTasks
                  }
                  className="flex items-center gap-1.5 rounded-[9px] bg-[#a85b5b]/8 px-3 py-2 text-[9px] font-black text-[#a85b5b] transition hover:bg-[#a85b5b]/13 dark:bg-[#d88989]/10 dark:text-[#d88989]"
                >
                  <Trash2 size={12} />
                  Delete
                </button>

                <button
                  type="button"
                  onClick={
                    clearTaskSelection
                  }
                  className="flex items-center gap-1.5 rounded-[9px] px-3 py-2 text-[9px] font-black text-[#99938a] transition hover:bg-black/5 hover:text-[#55514c] dark:hover:bg-white/5 dark:hover:text-white"
                >
                  <X size={12} />
                  Clear
                </button>
              </>
            )}
          </div>
        </section>
      )}

      {/* =====================================================
          EMPTY / LIST
      ===================================================== */}

      {taskView === "list" ? (
        visibleTasks.length === 0 ? (
          <EmptyState
            title={
              taskFilter === "today"
                ? "No tasks for today"
                : safeTasks.length === 0
                  ? "No tasks yet"
                  : "No tasks found"
            }
            description={
              taskFilter === "today"
                ? "You don't have any tasks due today."
                : safeTasks.length === 0
                  ? "Create your first task and give your day somewhere to start."
                  : localSearch
                    ? "Nothing matches your search. Try another term."
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
            {visibleTasks.map(
              renderTaskCard
            )}
          </div>
        )
      ) : (
        /* =====================================================
           KANBAN
        ===================================================== */

        <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-4">
          {[
            {
              status: "backlog",
              title: "Backlog",
              subtitle: "Waiting to start",
              icon: CircleDot,
            },
            {
              status: "in-progress",
              title: "In progress",
              subtitle: "Currently working",
              icon: Sparkles,
            },
            {
              status: "review",
              title: "Review",
              subtitle: "Needs attention",
              icon: ArrowDownUp,
            },
            {
              status: "done",
              title: "Done",
              subtitle: "Completed work",
              icon: Check,
            },
          ].map(
            ({
              status,
              title,
              subtitle,
              icon: Icon,
            }) => {
              const columnTasks =
                getBoardTasks(status);

              return (
                <section
                  key={status}
                  className="min-h-[330px] overflow-hidden rounded-[17px] border border-[#e3ded6] bg-[#f3f0eb] dark:border-[#303530] dark:bg-[#202420]"
                >
                  <div className="border-b border-[#ded8cf] px-3.5 py-3 dark:border-[#343934]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-white shadow-sm dark:bg-[#292e2a]">
                          <Icon
                            size={12}
                            className={
                              status === "done"
                                ? "text-[#557a62]"
                                : status ===
                                    "in-progress"
                                  ? "text-[#627b82]"
                                  : status ===
                                      "review"
                                    ? "text-[#765b6b]"
                                    : "text-[#77736b]"
                            }
                          />
                        </div>

                        <div>
                          <h3 className="text-[10px] font-black text-[#55514c] dark:text-[#d0cdc7]">
                            {title}
                          </h3>

                          <p className="mt-0.5 text-[8px] font-bold text-[#aaa49b] dark:text-[#686d68]">
                            {subtitle}
                          </p>
                        </div>
                      </div>

                      <span className="flex h-6 min-w-6 items-center justify-center rounded-[7px] bg-white px-1.5 text-[8px] font-black text-[#89837b] shadow-sm dark:bg-[#292e2a] dark:text-[#aaa69e]">
                        {columnTasks.length}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2.5 p-2.5">
                    {columnTasks.length > 0 ? (
                      columnTasks.map(
                        renderTaskCard
                      )
                    ) : (
                      <div className="flex min-h-[145px] flex-col items-center justify-center rounded-[12px] border border-dashed border-[#d9d3ca] bg-white/35 px-4 text-center dark:border-[#383e39] dark:bg-black/5">
                        <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-[8px] bg-white/70 text-[#aaa49b] dark:bg-[#292e2a] dark:text-[#686d68]">
                          <CircleDot size={12} />
                        </div>

                        <p className="text-[9px] font-bold text-[#aaa49b] dark:text-[#686d68]">
                          Nothing here yet
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}

/* =============================================================
   MINI STAT
============================================================= */

function MiniStat({
  label,
  value,
  accent = false,
  warning = false,
  success = false,
}) {
  let valueClass =
    "text-[#292725] dark:text-white";

  if (accent) {
    valueClass =
      "text-[#765b6b] dark:text-[#c9aebe]";
  }

  if (warning) {
    valueClass =
      "text-[#a85b5b] dark:text-[#d88989]";
  }

  if (success) {
    valueClass =
      "text-[#557a62] dark:text-[#8faf91]";
  }

  return (
    <div className="group flex items-center justify-between rounded-[13px] border border-[#e3ded6] bg-white px-3.5 py-3 transition-all duration-200 hover:-translate-y-[1px] hover:border-[#d6d0c8] hover:shadow-[0_6px_18px_rgba(41,39,37,0.045)] dark:border-[#333833] dark:bg-[#1b1f1c] dark:hover:border-[#424742]">
      <p className="text-[8px] font-black uppercase tracking-[0.14em] text-[#aaa49b] dark:text-[#686d68]">
        {label}
      </p>

      <p
        className={`text-[15px] font-black tracking-[-0.02em] ${valueClass}`}
      >
        {value}
      </p>
    </div>
  );
}

export default Todos;