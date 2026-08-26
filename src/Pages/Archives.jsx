import { Archive, Trash2, RotateCcw } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import TaskCard from "../Components/TaskCard";
import EmptyState from "../Components/EmptyState";

function Archives() {
  const {
    tasks = [],
    deleteTask,
    toggleTask,
    updateTask,
  } = useOutletContext();

  const safeTasks = Array.isArray(tasks) ? tasks : [];

  const archivedTasks = safeTasks.filter(
    (task) => task?.archived === true
  );

  const restoreTask = (taskId) => {
    if (!updateTask) return;

    updateTask(taskId, {
      archived: false,
    });
  };

  const deleteArchivedTask = (taskId) => {
    if (window.confirm("Delete this archived task permanently?")) {
      deleteTask(taskId);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {/* HEADER */}
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#765b6b]">
            Storage
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            Archives
          </h1>

          <p className="mt-2 text-sm text-[#716d66] dark:text-[#aaa69e]">
            Keep old tasks out of your workspace without deleting them.
          </p>
        </div>
      </section>

      {/* ARCHIVE COUNT */}
      <section className="rounded-3xl border border-[#e1dcd4] bg-white p-6 shadow-sm dark:border-[#343934] dark:bg-[#1d211e]">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#f0e9ee] text-[#765b6b] dark:bg-[#332a30] dark:text-[#c9aebe]">
            <Archive size={27} />
          </div>

          <div>
            <p className="text-3xl font-black">
              {archivedTasks.length}
            </p>

            <p className="text-xs font-semibold text-[#918b82]">
              archived{" "}
              {archivedTasks.length === 1
                ? "task"
                : "tasks"}
            </p>
          </div>
        </div>
      </section>

      {/* ARCHIVED TASKS */}
      <section className="space-y-3">
        {archivedTasks.length > 0 ? (
          archivedTasks.map((task) => (
            <div
              key={task.id}
              className="space-y-2"
            >
              <TaskCard
                task={task}
                onToggle={toggleTask}
                onDelete={deleteArchivedTask}
                onEdit={() => {}}
              />

              {/* RESTORE */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => restoreTask(task.id)}
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-[#765b6b]/10
                    px-3
                    py-2
                    text-xs
                    font-black
                    text-[#765b6b]
                    transition
                    hover:bg-[#765b6b]/20
                    dark:bg-[#765b6b]/20
                    dark:text-[#c9aebe]
                  "
                >
                  <RotateCcw size={14} />
                  Restore task
                </button>
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            title="No archived tasks"
            description="Tasks you archive will appear here."
          />
        )}
      </section>

      {/* INFO */}
      {archivedTasks.length > 0 && (
        <div className="flex items-start gap-3 rounded-2xl border border-[#e1dcd4] bg-[#f7f5f0] p-4 dark:border-[#343934] dark:bg-[#1d211e]">
          <Archive
            size={17}
            className="mt-0.5 shrink-0 text-[#765b6b]"
          />

          <p className="text-xs font-semibold leading-5 text-[#716d66] dark:text-[#aaa69e]">
            Archived tasks are hidden from My Tasks but are
            still saved. You can restore them whenever you
            need them again.
          </p>
        </div>
      )}
    </div>
  );
}

export default Archives;