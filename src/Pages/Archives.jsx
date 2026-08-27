import { useState } from "react";
import {
  Archive,
  Trash2,
  RotateCcw,
  X,
  AlertTriangle,
} from "lucide-react";
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

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const safeTasks = Array.isArray(tasks) ? tasks : [];

  const archivedTasks = safeTasks.filter(
    (task) => task?.archived === true
  );

  // =========================================================
  // RESTORE
  // =========================================================

  const restoreTask = (taskId) => {
    if (!updateTask) return;

    updateTask(taskId, {
      archived: false,
    });
  };

  // =========================================================
  // OPEN DELETE CONFIRMATION
  // =========================================================

  const requestDelete = (task) => {
    setDeleteTarget(task);
  };

  // =========================================================
  // CLOSE DELETE CONFIRMATION
  // =========================================================

  const closeDeleteModal = () => {
    if (deleting) return;

    setDeleteTarget(null);
  };

  // =========================================================
  // CONFIRM DELETE
  // =========================================================

  const confirmDelete = () => {
    if (!deleteTarget || !deleteTask) return;

    setDeleting(true);

    deleteTask(deleteTarget.id);

    setTimeout(() => {
      setDeleting(false);
      setDeleteTarget(null);
    }, 150);
  };

  return (
    <>
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
                {archivedTasks.length === 1 ? "task" : "tasks"}
              </p>
            </div>
          </div>
        </section>

        {/* ARCHIVED TASKS */}
        <section className="space-y-3">
          {archivedTasks.length > 0 ? (
            archivedTasks.map((task) => (
              <div key={task.id} className="space-y-2">
                <TaskCard
                  task={task}
                  onToggle={toggleTask}
                  onDelete={() => requestDelete(task)}
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

      {/* =====================================================
          DELETE CONFIRMATION MODAL
      ===================================================== */}

      {deleteTarget && (
        <div
          className="
            fixed
            inset-0
            z-[200]
            flex
            items-center
            justify-center
            bg-black/40
            p-4
            backdrop-blur-[4px]
            dark:bg-black/65
          "
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeDeleteModal();
            }
          }}
        >
          <div
            className="
              w-full
              max-w-md
              overflow-hidden
              rounded-[28px]
              border
              border-black/10
              bg-[#faf9f6]
              shadow-2xl
              dark:border-white/10
              dark:bg-[#171a17]
            "
            onMouseDown={(event) => event.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="flex items-start justify-between gap-4 border-b border-black/5 p-6 dark:border-white/10">
              <div className="flex items-start gap-4">
                <div
                  className="
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    bg-red-500/10
                    text-red-500
                  "
                >
                  <AlertTriangle size={23} />
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">
                    Permanent deletion
                  </p>

                  <h2 className="mt-1 text-xl font-black">
                    Delete this task?
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={deleting}
                className="
                  rounded-xl
                  p-2
                  text-black/30
                  transition
                  hover:bg-black/5
                  hover:text-black
                  disabled:cursor-not-allowed
                  dark:text-white/30
                  dark:hover:bg-white/10
                  dark:hover:text-white
                "
              >
                <X size={19} />
              </button>
            </div>

            {/* MODAL CONTENT */}
            <div className="p-6">
              <p className="text-sm leading-6 text-black/55 dark:text-white/55">
                You are about to permanently delete:
              </p>

              <div
                className="
                  mt-4
                  rounded-2xl
                  border
                  border-red-500/10
                  bg-red-500/[0.04]
                  px-4
                  py-3
                  dark:border-red-400/10
                  dark:bg-red-400/[0.04]
                "
              >
                <p className="break-words text-sm font-black text-black/75 dark:text-white/80">
                  {deleteTarget.title || "Untitled task"}
                </p>

                {deleteTarget.description && (
                  <p className="mt-1 line-clamp-2 text-xs text-black/40 dark:text-white/35">
                    {deleteTarget.description}
                  </p>
                )}
              </div>

              <p className="mt-4 text-xs font-semibold leading-5 text-black/35 dark:text-white/35">
                This action cannot be undone. The task will be
                permanently removed from your archives.
              </p>
            </div>

            {/* MODAL FOOTER */}
            <div className="flex flex-col-reverse gap-2 border-t border-black/5 bg-black/[0.015] p-5 sm:flex-row sm:justify-end dark:border-white/10 dark:bg-white/[0.015]">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={deleting}
                className="
                  rounded-xl
                  px-5
                  py-3
                  text-sm
                  font-black
                  text-black/45
                  transition
                  hover:bg-black/5
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  dark:text-white/45
                  dark:hover:bg-white/10
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-red-500
                  px-5
                  py-3
                  text-sm
                  font-black
                  text-white
                  shadow-lg
                  shadow-red-500/20
                  transition
                  hover:bg-red-600
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                <Trash2 size={16} />

                {deleting ? "Deleting..." : "Delete permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Archives;