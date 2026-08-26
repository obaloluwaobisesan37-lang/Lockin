import { Archive, RotateCcw, Trash2, Inbox } from "lucide-react";
import { useOutletContext } from "react-router-dom";

function Archives() {
  const {
    tasks = [],
    archiveTask,
    deleteTask,
    updateTask,
  } = useOutletContext();

  const archivedTasks = Array.isArray(tasks)
    ? tasks.filter((task) => task?.archived === true)
    : [];

  const restoreTask = (taskId) => {
    if (!updateTask) return;

    updateTask(taskId, {
      archived: false,
    });
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* HEADER */}
      <div>
        <p className="text-xs font-black uppercase tracking-[0.25em] text-[#765b6b]">
          Task Management
        </p>

        <div className="mt-2 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#765b6b]/10 text-[#765b6b]">
            <Archive size={23} />
          </div>

          <div>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Archives
            </h1>

            <p className="mt-1 text-sm text-black/40 dark:text-white/35">
              Tasks you have archived are kept here.
            </p>
          </div>
        </div>
      </div>

      {/* COUNT */}
      <div className="flex items-center justify-between rounded-2xl border border-black/5 bg-white px-5 py-4 shadow-sm dark:border-white/10 dark:bg-[#171a17]">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-black/30 dark:text-white/30">
            Archived tasks
          </p>

          <p className="mt-1 text-2xl font-black">
            {archivedTasks.length}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#765b6b]/10 text-[#765b6b]">
          <Archive size={20} />
        </div>
      </div>

      {/* EMPTY STATE */}
      {archivedTasks.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-black/10 bg-white px-6 py-16 text-center dark:border-white/10 dark:bg-[#171a17]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-black/5 text-black/30 dark:bg-white/5 dark:text-white/30">
            <Inbox size={28} />
          </div>

          <h2 className="mt-5 text-xl font-black">
            No archived tasks
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-black/40 dark:text-white/35">
            When you archive a task from My Tasks, it will appear here.
          </p>
        </div>
      ) : (
        /* ARCHIVED TASKS */
        <div className="space-y-3">
          {archivedTasks.map((task) => (
            <div
              key={task.id}
              className="
                rounded-3xl
                border
                border-black/5
                bg-white
                p-5
                shadow-sm
                transition
                hover:-translate-y-0.5
                hover:shadow-md
                dark:border-white/10
                dark:bg-[#171a17]
              "
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* TASK INFO */}
                <div className="min-w-0">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#765b6b]/10 text-[#765b6b]">
                      <Archive size={17} />
                    </div>

                    <div className="min-w-0">
                      <h2
                        className={`break-words text-base font-black ${
                          task.completed
                            ? "text-black/40 line-through dark:text-white/30"
                            : ""
                        }`}
                      >
                        {task.title || "Untitled task"}
                      </h2>

                      {task.description && (
                        <p className="mt-1 line-clamp-2 text-sm text-black/40 dark:text-white/35">
                          {task.description}
                        </p>
                      )}

                      <div className="mt-3 flex flex-wrap gap-2">
                        {task.priority && (
                          <span className="rounded-full bg-rose-500/10 px-2.5 py-1 text-[10px] font-black text-rose-500">
                            {task.priority}
                          </span>
                        )}

                        {task.energy && (
                          <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-[10px] font-black text-amber-600 dark:text-amber-400">
                            {task.energy} energy
                          </span>
                        )}

                        {task.category && (
                          <span className="rounded-full bg-[#765b6b]/10 px-2.5 py-1 text-[10px] font-black text-[#765b6b]">
                            {task.category}
                          </span>
                        )}

                        {task.completed && (
                          <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-black text-emerald-600 dark:text-emerald-400">
                            Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
                  <button
                    type="button"
                    onClick={() => restoreTask(task.id)}
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-xl
                      bg-[#765b6b]/10
                      px-4
                      py-2.5
                      text-xs
                      font-black
                      text-[#765b6b]
                      transition
                      hover:bg-[#765b6b]/20
                    "
                  >
                    <RotateCcw size={15} />
                    Restore
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteTask(task.id)}
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-xl
                      bg-red-500/10
                      px-4
                      py-2.5
                      text-xs
                      font-black
                      text-red-500
                      transition
                      hover:bg-red-500/20
                    "
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Archives;