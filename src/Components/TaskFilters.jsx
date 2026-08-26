import { Search, SlidersHorizontal, X, ArrowDownUp } from "lucide-react";

function TaskFilters({
  search = "",
  setSearch,
  status = "all",
  setStatus,
  priority = "all",
  setPriority,
  sortBy = "newest",
  setSortBy,
}) {
  const hasFilters =
    search || status !== "all" || priority !== "all" || sortBy !== "newest";

  const clearFilters = () => {
    setSearch("");
    setStatus("all");
    setPriority("all");
    setSortBy("newest");
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-[#343a35] dark:bg-[#1b1f1c]">
      {/* TOP ROW */}

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        {/* SEARCH */}

        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search your tasks..."
            className="
              w-full
              rounded-2xl
              border
              border-slate-200
              bg-slate-50
              py-3
              pl-11
              pr-10
              text-sm
              font-medium
              outline-none
              transition
              focus:border-[#4f6f52]
              focus:ring-2
              focus:ring-[#4f6f52]/10

              dark:border-[#343a35]
              dark:bg-[#202521]
              dark:text-white
              dark:placeholder:text-slate-500
            "
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-[#343a35] dark:hover:text-white"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* FILTER LABEL */}

        <div className="hidden items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-400 xl:flex">
          <SlidersHorizontal size={15} />
          Filters
        </div>

        {/* STATUS */}

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="
            rounded-2xl
            border
            border-slate-200
            bg-slate-50
            px-4
            py-3
            text-sm
            font-bold
            text-slate-700
            outline-none
            transition
            focus:border-[#4f6f52]

            dark:border-[#343a35]
            dark:bg-[#202521]
            dark:text-slate-200
          "
        >
          <option value="all">All Status</option>

          <option value="pending">Pending</option>

          <option value="completed">Completed</option>
        </select>

        {/* PRIORITY */}

        <select
          value={priority}
          onChange={(event) => setPriority(event.target.value)}
          className="
            rounded-2xl
            border
            border-slate-200
            bg-slate-50
            px-4
            py-3
            text-sm
            font-bold
            text-slate-700
            outline-none
            transition
            focus:border-[#4f6f52]

            dark:border-[#343a35]
            dark:bg-[#202521]
            dark:text-slate-200
          "
        >
          <option value="all">All Priorities</option>

          <option value="High">High Priority</option>

          <option value="Medium">Medium Priority</option>

          <option value="Low">Low Priority</option>
        </select>

        {/* SORT */}

        <div className="relative">
          <ArrowDownUp
            size={15}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="
              w-full
              appearance-none
              rounded-2xl
              border
              border-slate-200
              bg-slate-50
              py-3
              pl-10
              pr-9
              text-sm
              font-bold
              text-slate-700
              outline-none
              transition
              focus:border-[#4f6f52]

              dark:border-[#343a35]
              dark:bg-[#202521]
              dark:text-slate-200
            "
          >
            <option value="newest">Newest First</option>

            <option value="oldest">Oldest First</option>

            <option value="priority">Highest Priority</option>

            <option value="dueDate">Due Date</option>

            <option value="alphabetical">A → Z</option>
          </select>
        </div>

        {/* CLEAR */}

        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-2xl
              bg-slate-100
              px-4
              py-3
              text-xs
              font-black
              text-slate-600
              transition
              hover:bg-slate-200

              dark:bg-[#252a26]
              dark:text-slate-300
              dark:hover:bg-[#343a35]
            "
          >
            <X size={15} />
            Clear
          </button>
        )}
      </div>

      {/* ACTIVE FILTERS */}

      {hasFilters && (
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 dark:border-[#343a35]">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            Active:
          </span>

          {search && (
            <span className="rounded-full bg-[#eef3ec] px-3 py-1 text-[11px] font-bold text-[#4f6f52] dark:bg-[#263328] dark:text-[#a8c5a5]">
              Search: "{search}"
            </span>
          )}

          {status !== "all" && (
            <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">
              {status === "pending" ? "Pending" : "Completed"}
            </span>
          )}

          {priority !== "all" && (
            <span className="rounded-full bg-rose-50 px-3 py-1 text-[11px] font-bold text-rose-600 dark:bg-rose-950/30 dark:text-rose-400">
              {priority} Priority
            </span>
          )}

          {sortBy !== "newest" && (
            <span className="rounded-full bg-violet-50 px-3 py-1 text-[11px] font-bold text-violet-600 dark:bg-violet-950/30 dark:text-violet-400">
              Sorted
            </span>
          )}
        </div>
      )}
    </section>
  );
}

export default TaskFilters;
