import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Filter,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
} from "lucide-react";

import {
  useOutletContext,
  useSearchParams,
} from "react-router-dom";

import TaskCard from "../Components/TaskCard";
import TaskForm from "../Components/TaskForm";

function Todos() {
  const {
    tasks = [],
    addTask,
    deleteTask,
    toggleTask,
    updateTask,
    clearAllTasks,
    globalSearch = "",
    setGlobalSearch,
  } = useOutletContext();

  const [searchParams, setSearchParams] =
    useSearchParams();

  const [showForm, setShowForm] =
    useState(false);

  const [editingTask, setEditingTask] =
    useState(null);

  const [showClearModal, setShowClearModal] =
    useState(false);

  const [searchInput, setSearchInput] =
    useState("");

  const [filter, setFilter] =
    useState("All");

  const [sort, setSort] =
    useState("Newest");

  // ==========================================
  // OPEN NEW TASK FROM NAVBAR
  // ==========================================

  useEffect(() => {
    const shouldOpen =
      searchParams.get("new") === "true";

    const urlSearch =
      searchParams.get("search") || "";

    if (urlSearch) {
      setSearchInput(urlSearch);

      if (setGlobalSearch) {
        setGlobalSearch(urlSearch);
      }
    }

    if (shouldOpen) {
      setEditingTask(null);
      setShowForm(true);

      setSearchParams(
        urlSearch
          ? { search: urlSearch }
          : {},
        { replace: true }
      );
    }
  }, [
    searchParams,
    setSearchParams,
    setGlobalSearch,
  ]);

  // ==========================================
  // SEARCH
  // ==========================================

  const handleSearch = () => {
    const query = searchInput.trim();

    if (setGlobalSearch) {
      setGlobalSearch(query);
    }

    if (query) {
      setSearchParams(
        { search: query },
        { replace: true }
      );
    } else {
      setSearchParams(
        {},
        { replace: true }
      );
    }
  };

  const clearSearch = () => {
    setSearchInput("");

    if (setGlobalSearch) {
      setGlobalSearch("");
    }

    setSearchParams(
      {},
      { replace: true }
    );
  };

  // ==========================================
  // FILTER + SEARCH + SORT
  // ==========================================

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    const query =
      globalSearch.trim().toLowerCase();

    if (query) {
      result = result.filter((task) => {
        const title =
          task.title?.toLowerCase() || "";

        const description =
          task.description?.toLowerCase() || "";

        const category =
          task.category?.toLowerCase() || "";

        const priority =
          task.priority?.toLowerCase() || "";

        return (
          title.includes(query) ||
          description.includes(query) ||
          category.includes(query) ||
          priority.includes(query)
        );
      });
    }

    if (filter === "Active") {
      result = result.filter(
        (task) => !task.completed
      );
    }

    if (filter === "Completed") {
      result = result.filter(
        (task) => task.completed
      );
    }

    if (filter === "High") {
      result = result.filter(
        (task) => task.priority === "High"
      );
    }

    if (sort === "Newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
      );
    }

    if (sort === "Oldest") {
      result.sort(
        (a, b) =>
          new Date(a.createdAt || 0) -
          new Date(b.createdAt || 0)
      );
    }

    if (sort === "Priority") {
      const levels = {
        High: 3,
        Medium: 2,
        Low: 1,
      };

      result.sort(
        (a, b) =>
          (levels[b.priority] || 0) -
          (levels[a.priority] || 0)
      );
    }

    return result;
  }, [
    tasks,
    globalSearch,
    filter,
    sort,
  ]);

  // ==========================================
  // CREATE
  // ==========================================

  const openCreate = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  // ==========================================
  // EDIT
  // ==========================================

  const openEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  // ==========================================
  // SAVE TASK
  // ==========================================

  const saveTask = (task) => {
    if (editingTask) {
      updateTask(task);
    } else {
      addTask(task);
    }

    setShowForm(false);
    setEditingTask(null);
  };

  // ==========================================
  // CLOSE FORM
  // ==========================================

  const closeForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  // ==========================================
  // CLEAR ALL
  // ==========================================

  const handleClearAll = () => {
    if (tasks.length === 0) {
      return;
    }

    setShowClearModal(true);
  };

  const confirmClearAll = () => {
    if (clearAllTasks) {
      clearAllTasks();
    }

    setShowClearModal(false);
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="space-y-6">

      {/* ====================================== */}
      {/* HEADER */}
      {/* ====================================== */}

      <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#4f6f52]">
            Workspace
          </p>

          <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            My Tasks
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Organize your work, prioritize what matters,
            and keep moving.
          </p>
        </div>

        {/* ==================================== */}
        {/* HEADER ACTIONS */}
        {/* ==================================== */}

        <div className="flex flex-wrap gap-3">

          {/* ================================== */}
          {/* CLEAR ALL */}
          {/* ================================== */}

          <button
            type="button"
            onClick={handleClearAll}
            disabled={tasks.length === 0}
            className="
              group
              relative
              inline-flex
              items-center
              gap-3
              overflow-hidden
              rounded-2xl
              border
              border-rose-200
              bg-white
              px-4
              py-2.5
              text-left
              shadow-sm
              transition-all
              duration-300

              hover:-translate-y-1
              hover:border-rose-300
              hover:bg-rose-50
              hover:shadow-lg
              hover:shadow-rose-500/10

              disabled:cursor-not-allowed
              disabled:opacity-40
              disabled:hover:translate-y-0

              dark:border-rose-500/30
              dark:bg-[#211918]
              dark:shadow-[inset_0_0_20px_rgba(244,63,94,0.03)]

              dark:hover:border-rose-500/60
              dark:hover:bg-[#2d1b1a]
              dark:hover:shadow-[0_0_25px_rgba(244,63,94,0.15)]
            "
          >

            {/* HOVER GLOW */}

            <span
              className="
                absolute
                -right-8
                -top-8
                h-20
                w-20
                rounded-full
                bg-rose-500/10
                blur-2xl
                transition-all
                duration-500
                group-hover:scale-150
                dark:bg-rose-500/15
              "
            />

            {/* ICON */}

            <span
              className="
                relative
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-rose-50
                text-rose-500
                transition-all
                duration-300

                group-hover:rotate-[-8deg]
                group-hover:bg-rose-100

                dark:bg-rose-500/10
                dark:text-rose-400
                dark:ring-1
                dark:ring-rose-500/20

                dark:group-hover:bg-rose-500/20
                dark:group-hover:ring-rose-500/40
              "
            >
              <Trash2 size={17} />
            </span>

            {/* TEXT */}

            <span className="relative flex flex-col">

              <span
                className="
                  text-sm
                  font-black
                  leading-tight
                  text-rose-600
                  dark:text-rose-300
                "
              >
                Clear All
              </span>

              <span
                className="
                  mt-0.5
                  text-[10px]
                  font-semibold
                  text-rose-400
                  dark:text-rose-500/80
                "
              >
                {tasks.length}{" "}
                {tasks.length === 1
                  ? "task"
                  : "tasks"}
              </span>

            </span>
          </button>

          {/* ================================== */}
          {/* NEW TASK */}
          {/* ================================== */}

          <button
            type="button"
            onClick={openCreate}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-2xl
              bg-[#4f6f52]
              px-5
              py-3
              text-sm
              font-bold
              text-white
              shadow-md
              transition-all
              duration-200

              hover:-translate-y-1
              hover:bg-[#3f5d43]
              hover:shadow-lg

              active:translate-y-0
            "
          >
            <Plus size={18} />

            New Task
          </button>

        </div>
      </section>

      {/* ====================================== */}
      {/* SEARCH + FILTER */}
      {/* ====================================== */}

      <section className="glass rounded-3xl p-4">

        <div className="flex flex-col gap-3 lg:flex-row">

          {/* SEARCH */}

          <div className="flex flex-1 gap-2">

            <div className="relative flex-1">

              <Search
                size={17}
                className="
                  pointer-events-none
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                type="text"
                value={searchInput}
                onChange={(event) =>
                  setSearchInput(
                    event.target.value
                  )
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSearch();
                  }
                }}
                placeholder="Search tasks..."
                className="
                  w-full
                  rounded-2xl
                  border
                  border-[#e2e5df]
                  bg-[#f7f7f5]
                  py-3
                  pl-11
                  pr-4
                  text-sm
                  text-slate-800
                  outline-none
                  transition

                  placeholder:text-slate-400

                  focus:border-[#4f6f52]
                  focus:ring-2
                  focus:ring-[#d8e2d5]

                  dark:border-[#343a35]
                  dark:bg-[#1b1f1c]
                  dark:text-white
                  dark:placeholder:text-slate-500
                  dark:focus:border-[#5f8565]
                  dark:focus:ring-[#304433]
                "
              />

            </div>

            <button
              type="button"
              onClick={handleSearch}
              className="
                flex
                shrink-0
                items-center
                gap-2
                rounded-2xl
                bg-[#4f6f52]
                px-4
                py-3
                text-sm
                font-bold
                text-white
                transition
                hover:bg-[#3f5d43]
              "
            >
              <Search size={17} />

              <span className="hidden sm:inline">
                Search
              </span>
            </button>

          </div>

          {/* ================================= */}
          {/* FILTERS */}
          {/* ================================= */}

          <div className="flex gap-2 overflow-x-auto">

            {/* FILTER */}

            <div
              className="
                flex
                shrink-0
                items-center
                gap-2
                rounded-2xl
                border
                border-[#e2e5df]
                bg-[#f7f7f5]
                px-3

                dark:border-[#343a35]
                dark:bg-[#202520]
              "
            >
              <Filter
                size={15}
                className="text-slate-400"
              />

              <select
                value={filter}
                onChange={(event) =>
                  setFilter(
                    event.target.value
                  )
                }
                className="
                  cursor-pointer
                  appearance-none
                  bg-transparent
                  py-3
                  text-sm
                  font-semibold
                  text-slate-700
                  outline-none

                  dark:bg-[#202520]
                  dark:text-white

                  [&>option]:bg-white
                  [&>option]:text-slate-800

                  dark:[&>option]:bg-[#202520]
                  dark:[&>option]:text-white
                "
              >
                <option value="All">
                  All
                </option>

                <option value="Active">
                  Active
                </option>

                <option value="Completed">
                  Completed
                </option>

                <option value="High">
                  High Priority
                </option>
              </select>
            </div>

            {/* SORT */}

            <div
              className="
                flex
                shrink-0
                items-center
                gap-2
                rounded-2xl
                border
                border-[#e2e5df]
                bg-[#f7f7f5]
                px-3

                dark:border-[#343a35]
                dark:bg-[#202520]
              "
            >
              <SlidersHorizontal
                size={15}
                className="text-slate-400"
              />

              <select
                value={sort}
                onChange={(event) =>
                  setSort(
                    event.target.value
                  )
                }
                className="
                  cursor-pointer
                  appearance-none
                  bg-transparent
                  py-3
                  text-sm
                  font-semibold
                  text-slate-700
                  outline-none

                  dark:bg-[#202520]
                  dark:text-white

                  [&>option]:bg-white
                  [&>option]:text-slate-800

                  dark:[&>option]:bg-[#202520]
                  dark:[&>option]:text-white
                "
              >
                <option value="Newest">
                  Newest
                </option>

                <option value="Oldest">
                  Oldest
                </option>

                <option value="Priority">
                  Priority
                </option>
              </select>
            </div>

          </div>
        </div>
      </section>

      {/* ====================================== */}
      {/* SEARCH STATUS */}
      {/* ====================================== */}

      {globalSearch.trim() && (
        <div
          className="
            flex
            flex-wrap
            items-center
            justify-between
            gap-3
            rounded-2xl
            border
            border-[#d8e2d5]
            bg-[#eef3ec]
            px-4
            py-3

            dark:border-[#3f5d43]
            dark:bg-[#1d291f]
          "
        >
          <p className="text-sm text-[#3f5d43] dark:text-[#a8c5a5]">
            Searching for{" "}
            <span className="font-bold">
              "{globalSearch}"
            </span>
          </p>

          <button
            type="button"
            onClick={clearSearch}
            className="
              text-xs
              font-bold
              text-[#4f6f52]
              hover:underline
              dark:text-[#a8c5a5]
            "
          >
            Clear Search
          </button>
        </div>
      )}

      {/* ====================================== */}
      {/* COUNT */}
      {/* ====================================== */}

      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
        {filteredTasks.length}{" "}
        {filteredTasks.length === 1
          ? "task"
          : "tasks"}
      </p>

      {/* ====================================== */}
      {/* TASKS */}
      {/* ====================================== */}

      <section className="space-y-3">

        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onEdit={openEdit}
            />
          ))
        ) : (
          <div className="glass rounded-3xl p-10 text-center">

            <div
              className="
                mx-auto
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-[#eef3ec]
                text-[#4f6f52]

                dark:bg-[#263328]
                dark:text-[#a8c5a5]
              "
            >
              <Search size={24} />
            </div>

            <h2 className="mt-4 text-lg font-black text-slate-900 dark:text-white">
              {globalSearch.trim() ||
              filter !== "All"
                ? "No matching tasks"
                : "No tasks yet"}
            </h2>

            <p
              className="
                mx-auto
                mt-2
                max-w-md
                text-sm
                leading-6
                text-slate-500
                dark:text-slate-400
              "
            >
              {globalSearch.trim() ||
              filter !== "All"
                ? "Try changing your search or filter."
                : "Create your first task and start getting things done."}
            </p>

            {!globalSearch.trim() &&
              filter === "All" && (
                <button
                  type="button"
                  onClick={openCreate}
                  className="
                    mt-5
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-[#4f6f52]
                    px-5
                    py-3
                    text-sm
                    font-bold
                    text-white
                    shadow-md
                    transition

                    hover:-translate-y-0.5
                    hover:bg-[#3f5d43]
                  "
                >
                  <Plus size={17} />
                  Create Task
                </button>
              )}

          </div>
        )}

      </section>

      {/* ====================================== */}
      {/* CREATE / EDIT MODAL */}
      {/* ====================================== */}

      {showForm && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            overflow-y-auto
            bg-black/50
            p-4
            backdrop-blur-sm
          "
          onClick={closeForm}
        >
          <TaskForm
            editingTask={editingTask}
            onSubmit={saveTask}
            onClose={closeForm}
          />
        </div>
      )}

      {/* ====================================== */}
      {/* CLEAR ALL MODAL */}
      {/* ====================================== */}

      {showClearModal && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/60
            p-4
            backdrop-blur-sm
          "
          onClick={() =>
            setShowClearModal(false)
          }
        >
          <div
            className="
              w-full
              max-w-md
              overflow-hidden
              rounded-3xl
              border
              border-slate-200
              bg-white
              shadow-2xl

              dark:border-[#343a35]
              dark:bg-[#171b18]
              dark:shadow-[0_20px_70px_rgba(0,0,0,0.55)]
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div
              className="
                relative
                overflow-hidden
                bg-[#4f6f52]
                px-6
                py-7
                text-white

                dark:bg-[#40201e]
              "
            >
              <div
                className="
                  absolute
                  -right-8
                  -top-8
                  h-28
                  w-28
                  rounded-full
                  bg-white/10
                "
              />

              <div
                className="
                  absolute
                  -bottom-12
                  -left-8
                  h-32
                  w-32
                  rounded-full
                  bg-white/5
                "
              />

              <button
                type="button"
                onClick={() =>
                  setShowClearModal(false)
                }
                className="
                  absolute
                  right-4
                  top-4
                  rounded-xl
                  p-2
                  text-white/70
                  transition

                  hover:bg-white/10
                  hover:text-white
                "
              >
                <X size={18} />
              </button>

              <div className="relative">

                <div
                  className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    bg-white/15
                    shadow-lg
                    backdrop-blur
                  "
                >
                  <Trash2 size={27} />
                </div>

                <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-white/70">
                  Danger Zone
                </p>

                <h2 className="mt-1 text-2xl font-black">
                  Clear everything?
                </h2>

              </div>
            </div>

            {/* MODAL BODY */}

            <div className="p-6">

              <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                You're about to delete{" "}
                <span className="font-bold text-slate-800 dark:text-white">
                  all {tasks.length}{" "}
                  {tasks.length === 1
                    ? "task"
                    : "tasks"}
                </span>
                .
              </p>

              <div
                className="
                  mt-4
                  rounded-2xl
                  border
                  border-rose-100
                  bg-rose-50
                  p-4

                  dark:border-rose-900/60
                  dark:bg-[#2a1918]
                "
              >
                <p className="text-sm font-bold text-rose-700 dark:text-rose-400">
                  This can't be undone
                </p>

                <p className="mt-1 text-xs leading-5 text-rose-600/80 dark:text-rose-400/70">
                  All your active and completed tasks
                  will be removed from Lockin.
                </p>
              </div>

              {/* MODAL BUTTONS */}

              <div
                className="
                  mt-6
                  flex
                  flex-col-reverse
                  gap-2
                  sm:flex-row
                  sm:justify-end
                "
              >

                <button
                  type="button"
                  onClick={() =>
                    setShowClearModal(false)
                  }
                  className="
                    rounded-xl
                    px-5
                    py-3
                    text-sm
                    font-bold
                    text-slate-500
                    transition

                    hover:bg-slate-100

                    dark:text-slate-400
                    dark:hover:bg-[#252a26]
                    dark:hover:text-white
                  "
                >
                  Keep My Tasks
                </button>

                <button
                  type="button"
                  onClick={confirmClearAll}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-rose-500
                    px-5
                    py-3
                    text-sm
                    font-bold
                    text-white
                    shadow-lg
                    shadow-rose-500/20
                    transition

                    hover:-translate-y-0.5
                    hover:bg-rose-600
                    hover:shadow-rose-500/30
                  "
                >
                  <Trash2 size={16} />
                  Yes, Clear All
                </button>

              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Todos;