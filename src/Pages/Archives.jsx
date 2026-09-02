import { useEffect, useState } from "react";
import {
  Archive,
  Trash2,
  RotateCcw,
  X,
  AlertTriangle,
  LockKeyhole,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useOutletContext } from "react-router-dom";
import TaskCard from "../Components/TaskCard";
import EmptyState from "../Components/EmptyState";

// =========================================================
// PASSWORD HASH
// =========================================================

async function hashPassword(password) {
  if (!window.crypto?.subtle) {
    throw new Error("Secure password hashing is not available.");
  }

  const data = new TextEncoder().encode(password);

  const hashBuffer = await window.crypto.subtle.digest(
    "SHA-256",
    data
  );

  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

// =========================================================
// GET SAVED ACCOUNT
// =========================================================

function getSavedAccount() {
  try {
    const saved = localStorage.getItem("lockin_auth_user");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

// =========================================================
// ARCHIVES
// =========================================================

function Archives() {
  const {
    tasks = [],
    projects = [],
    deleteTask,
    toggleTask,
    updateTask,
  } = useOutletContext();

  // =======================================================
  // ARCHIVE SECURITY
  // =======================================================

  const [unlocked, setUnlocked] = useState(
    () =>
      sessionStorage.getItem("lockin_archive_unlocked") === "true"
  );

  const [archivePasswordExists, setArchivePasswordExists] =
    useState(false);

  const [archivePassword, setArchivePassword] = useState("");
  const [confirmArchivePassword, setConfirmArchivePassword] =
    useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [passwordError, setPasswordError] = useState("");
  const [unlocking, setUnlocking] = useState(false);

  // =======================================================
  // DELETE STATE
  // =======================================================

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // =======================================================
  // CHECK ARCHIVE PASSWORD
  // =======================================================

  useEffect(() => {
    const account = getSavedAccount();

    setArchivePasswordExists(
      Boolean(account?.archivePasswordHash)
    );
  }, []);

  // =======================================================
  // LOCK ARCHIVES WHEN LEAVING
  // =======================================================

  useEffect(() => {
    return () => {
      sessionStorage.removeItem("lockin_archive_unlocked");
    };
  }, []);

  // =======================================================
  // SAFE DATA
  // =======================================================

  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const safeProjects = Array.isArray(projects) ? projects : [];

  const archivedTasks = safeTasks.filter(
    (task) => task?.archived === true
  );

  // =======================================================
  // CREATE / UNLOCK ARCHIVE
  // =======================================================

  const handleArchivePassword = async (event) => {
    event.preventDefault();
    setPasswordError("");

    // -------------------------------------------------------
    // CREATE PASSWORD
    // -------------------------------------------------------

    if (!archivePasswordExists) {
      if (archivePassword.length < 6) {
        setPasswordError(
          "Your archive password must be at least 6 characters."
        );
        return;
      }

      if (archivePassword !== confirmArchivePassword) {
        setPasswordError(
          "Your archive passwords do not match."
        );
        return;
      }

      setUnlocking(true);

      try {
        const account = getSavedAccount();

        if (!account) {
          setPasswordError("Your account could not be found.");
          return;
        }

        const archivePasswordHash = await hashPassword(
          archivePassword
        );

        const updatedAccount = {
          ...account,
          archivePasswordHash,
        };

        localStorage.setItem(
          "lockin_auth_user",
          JSON.stringify(updatedAccount)
        );

        sessionStorage.setItem(
          "lockin_archive_unlocked",
          "true"
        );

        setArchivePasswordExists(true);
        setUnlocked(true);

        setArchivePassword("");
        setConfirmArchivePassword("");
        setShowPassword(false);
        setShowConfirmPassword(false);
      } catch {
        setPasswordError(
          "Unable to secure your archives. Please try again."
        );
      } finally {
        setUnlocking(false);
      }

      return;
    }

    // -------------------------------------------------------
    // UNLOCK EXISTING ARCHIVE
    // -------------------------------------------------------

    if (!archivePassword) {
      setPasswordError("Enter your archive password.");
      return;
    }

    setUnlocking(true);

    try {
      const account = getSavedAccount();

      if (!account?.archivePasswordHash) {
        setArchivePasswordExists(false);
        setPasswordError(
          "No archive password is set. Please create one."
        );
        return;
      }

      const passwordHash = await hashPassword(archivePassword);

      if (passwordHash !== account.archivePasswordHash) {
        setPasswordError("Incorrect archive password.");
        return;
      }

      sessionStorage.setItem(
        "lockin_archive_unlocked",
        "true"
      );

      setUnlocked(true);
      setArchivePassword("");
      setShowPassword(false);
    } catch {
      setPasswordError("Unable to unlock your archives.");
    } finally {
      setUnlocking(false);
    }
  };

  // =======================================================
  // RESTORE
  // =======================================================

  const restoreTask = (taskId) => {
    if (!updateTask) return;

    updateTask(taskId, {
      archived: false,
    });
  };

  // =======================================================
  // DELETE
  // =======================================================

  const requestDelete = (task) => {
    setDeleteTarget(task);
  };

  const closeDeleteModal = () => {
    if (deleting) return;
    setDeleteTarget(null);
  };

  const confirmDelete = () => {
    if (!deleteTarget || !deleteTask) return;

    setDeleting(true);

    deleteTask(deleteTarget.id);

    setTimeout(() => {
      setDeleting(false);
      setDeleteTarget(null);
    }, 150);
  };

  // =======================================================
  // LOCK SCREEN
  // =======================================================

  if (!unlocked) {
    return (
      <div className="mx-auto flex min-h-[72vh] w-full max-w-2xl items-center justify-center py-8">
        <div className="w-full">
          {/* HEADER */}
          <div className="mb-7 text-center">
            <div className="relative mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-[22px] bg-[#765b6b] text-white shadow-[0_5px_0_#594451]">
              <LockKeyhole size={27} strokeWidth={2.2} />

              <div className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border-4 border-[#f6f4ef] bg-[#627b82] dark:border-[#111411]">
                <ShieldCheck size={12} strokeWidth={3} />
              </div>
            </div>

            <p className="mt-6 text-[9px] font-black uppercase tracking-[0.22em] text-[#765b6b] dark:text-[#c9aebe]">
              Protected storage
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-[-0.035em] text-[#292725] sm:text-4xl dark:text-white">
              {archivePasswordExists
                ? "Unlock Archives"
                : "Secure your Archives"}
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#77736b] dark:text-[#aaa69e]">
              {archivePasswordExists
                ? "Enter your Archive password to view your archived tasks."
                : "Create a separate password for archived tasks. You'll need it whenever you open Archives."}
            </p>
          </div>

          {/* PASSWORD PANEL */}
          <div className="overflow-hidden rounded-[22px] border border-[#e2ddd5] bg-white shadow-[0_18px_50px_rgba(41,39,37,0.07)] dark:border-[#333833] dark:bg-[#1b1f1c]">
            <div className="border-b border-[#ebe7e0] px-6 py-5 dark:border-[#303530] sm:px-7">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-[#765b6b]/10 text-[#765b6b] dark:bg-[#765b6b]/15 dark:text-[#c9aebe]">
                  <Archive size={16} />
                </div>

                <div>
                  <p className="text-sm font-black text-[#292725] dark:text-white">
                    Archive protection
                  </p>

                  <p className="mt-0.5 text-[10px] font-semibold text-[#918b82] dark:text-[#777d77]">
                    Separate from your login password
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleArchivePassword}
              className="space-y-5 px-6 py-6 sm:px-7 sm:py-7"
            >
              {/* PASSWORD */}
              <div>
                <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.14em] text-[#77736b] dark:text-[#aaa69e]">
                  {archivePasswordExists
                    ? "Archive password"
                    : "Create Archive password"}
                </label>

                <div className="group flex h-12 items-center gap-3 rounded-[13px] border border-[#ded9d1] bg-[#faf9f6] px-3.5 transition focus-within:border-[#765b6b] focus-within:ring-4 focus-within:ring-[#765b6b]/10 dark:border-[#353a35] dark:bg-[#202420]">
                  <LockKeyhole
                    size={16}
                    className="shrink-0 text-[#918b82] transition group-focus-within:text-[#765b6b] dark:group-focus-within:text-[#c9aebe]"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    value={archivePassword}
                    onChange={(event) => {
                      setArchivePassword(event.target.value);
                      setPasswordError("");
                    }}
                    placeholder={
                      archivePasswordExists
                        ? "Enter archive password"
                        : "At least 6 characters"
                    }
                    autoFocus
                    autoComplete={
                      archivePasswordExists
                        ? "current-password"
                        : "new-password"
                    }
                    className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#292725] outline-none placeholder:text-[#aaa49c] dark:text-white dark:placeholder:text-[#716f69]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((current) => !current)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="rounded-[9px] p-2 text-[#918b82] transition hover:bg-[#765b6b]/8 hover:text-[#765b6b] dark:hover:bg-[#765b6b]/15 dark:hover:text-[#c9aebe]"
                  >
                    {showPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>

              {/* CONFIRM */}
              {!archivePasswordExists && (
                <div>
                  <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.14em] text-[#77736b] dark:text-[#aaa69e]">
                    Confirm password
                  </label>

                  <div className="group flex h-12 items-center gap-3 rounded-[13px] border border-[#ded9d1] bg-[#faf9f6] px-3.5 transition focus-within:border-[#765b6b] focus-within:ring-4 focus-within:ring-[#765b6b]/10 dark:border-[#353a35] dark:bg-[#202420]">
                    <LockKeyhole
                      size={16}
                      className="shrink-0 text-[#918b82] transition group-focus-within:text-[#765b6b] dark:group-focus-within:text-[#c9aebe]"
                    />

                    <input
                      type={
                        showConfirmPassword ? "text" : "password"
                      }
                      value={confirmArchivePassword}
                      onChange={(event) => {
                        setConfirmArchivePassword(
                          event.target.value
                        );
                        setPasswordError("");
                      }}
                      placeholder="Repeat your password"
                      autoComplete="new-password"
                      className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#292725] outline-none placeholder:text-[#aaa49c] dark:text-white dark:placeholder:text-[#716f69]"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (current) => !current
                        )
                      }
                      aria-label={
                        showConfirmPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      className="rounded-[9px] p-2 text-[#918b82] transition hover:bg-[#765b6b]/8 hover:text-[#765b6b] dark:hover:bg-[#765b6b]/15 dark:hover:text-[#c9aebe]"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* SECURITY NOTE */}
              <div className="flex items-start gap-3 rounded-[13px] border border-[#e3dce1] bg-[#f8f4f7] px-3.5 py-3 dark:border-[#40363d] dark:bg-[#241f22]">
                <ShieldCheck
                  size={16}
                  className="mt-0.5 shrink-0 text-[#765b6b] dark:text-[#c9aebe]"
                />

                <p className="text-[10px] leading-5 text-[#77736b] dark:text-[#aaa69e]">
                  Your Archive password is separate from
                  your Lockin login password.
                </p>
              </div>

              {/* ERROR */}
              {passwordError && (
                <div
                  role="alert"
                  className="rounded-[13px] border border-[#e6c8c3] bg-[#fcf5f3] px-3.5 py-3 text-xs font-bold leading-5 text-[#a85b5b] dark:border-[#493331] dark:bg-[#2b2020] dark:text-[#d88989]"
                >
                  {passwordError}
                </div>
              )}

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={unlocking}
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-[12px] bg-[#765b6b] px-5 text-xs font-black text-white shadow-[0_4px_0_#594451] transition hover:-translate-y-0.5 hover:bg-[#674e5e] hover:shadow-[0_5px_0_#594451] active:translate-y-0 active:shadow-[0_2px_0_#594451] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {unlocking
                  ? "Please wait..."
                  : archivePasswordExists
                    ? "Unlock Archives"
                    : "Set password & unlock"}

                {!unlocking && (
                  <ArrowRight
                    size={15}
                    className="transition-transform group-hover:translate-x-1"
                  />
                )}
              </button>
            </form>
          </div>

          <p className="mt-4 text-center text-[9px] font-semibold leading-5 text-[#918b82] dark:text-[#716f69]">
            Your Archive password is stored as a hash on this device.
          </p>
        </div>
      </div>
    );
  }

  // =======================================================
  // UNLOCKED ARCHIVES
  // =======================================================

  return (
    <>
      <div className="mx-auto w-full max-w-7xl space-y-6">
        {/* HEADER */}
        <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#765b6b]" />

              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#765b6b] dark:text-[#c9aebe]">
                Storage
              </p>

              <span className="inline-flex items-center gap-1 rounded-full bg-[#557a62]/8 px-2 py-1 text-[8px] font-black uppercase tracking-wider text-[#557a62] dark:bg-[#557a62]/12 dark:text-[#8faf91]">
                <ShieldCheck size={10} />
                Unlocked
              </span>
            </div>

            <h1 className="mt-2 text-3xl font-black tracking-[-0.035em] text-[#292725] sm:text-4xl dark:text-white">
              Archives
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-[#77736b] dark:text-[#aaa69e]">
              Keep old tasks out of your workspace without
              permanently deleting them.
            </p>
          </div>
        </section>

        {/* SUMMARY */}
        <section className="overflow-hidden rounded-[22px] border border-[#e2ddd5] bg-white shadow-[0_8px_25px_rgba(41,39,37,0.04)] dark:border-[#333833] dark:bg-[#1b1f1c]">
          <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] border border-[#765b6b]/10 bg-[#765b6b]/8 text-[#765b6b] dark:border-[#765b6b]/15 dark:bg-[#765b6b]/10 dark:text-[#c9aebe]">
                <Archive size={23} />
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-black tracking-[-0.04em] text-[#292725] dark:text-white">
                    {archivedTasks.length}
                  </p>

                  <p className="text-xs font-bold text-[#918b82] dark:text-[#777d77]">
                    archived
                  </p>
                </div>

                <p className="mt-0.5 text-[9px] font-black uppercase tracking-[0.14em] text-[#aaa49b] dark:text-[#686d68]">
                  Stored safely
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-bold text-[#918b82] dark:text-[#777d77]">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#557a62]/8 text-[#557a62] dark:bg-[#557a62]/12 dark:text-[#8faf91]">
                <CheckCircle2 size={12} />
              </span>

              Archive unlocked
            </div>
          </div>

          {archivedTasks.length > 0 && (
            <div className="h-1 w-full bg-[#f0ede8] dark:bg-[#292e2a]">
              <div className="h-full w-full bg-[#765b6b]" />
            </div>
          )}
        </section>

        {/* TASKS */}
        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#9a948b]">
                Archived work
              </p>

              <h2 className="mt-1 text-sm font-black text-[#292725] dark:text-white">
                Your archived tasks
              </h2>
            </div>

            {archivedTasks.length > 0 && (
              <span className="rounded-full bg-[#765b6b]/8 px-2.5 py-1 text-[9px] font-black uppercase tracking-wide text-[#765b6b] dark:bg-[#765b6b]/12 dark:text-[#c9aebe]">
                {archivedTasks.length} stored
              </span>
            )}
          </div>

          {archivedTasks.length > 0 ? (
            <div className="space-y-4">
              {archivedTasks.map((task) => (
                <div key={task.id} className="space-y-2.5">
                  <TaskCard
                    task={task}
                    projects={safeProjects}
                    onToggle={toggleTask}
                    onDelete={() => requestDelete(task)}
                    onUpdate={updateTask}
                  />

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => restoreTask(task.id)}
                      className="group inline-flex items-center gap-2 rounded-[11px] border border-[#765b6b]/15 bg-[#765b6b]/6 px-3.5 py-2 text-[10px] font-black text-[#765b6b] transition hover:border-[#765b6b]/25 hover:bg-[#765b6b]/12 dark:border-[#765b6b]/20 dark:bg-[#765b6b]/10 dark:text-[#c9aebe] dark:hover:bg-[#765b6b]/15"
                    >
                      <RotateCcw
                        size={13}
                        className="transition-transform duration-200 group-hover:-rotate-45"
                      />
                      Restore task
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No archived tasks"
              description="Tasks you archive will appear here."
            />
          )}
        </section>

        {/* INFO */}
        {archivedTasks.length > 0 && (
          <div className="flex items-start gap-3 rounded-[14px] border border-[#e2ddd5] bg-[#f8f6f2] p-4 dark:border-[#333833] dark:bg-[#1b1f1c]">
            <Archive
              size={16}
              className="mt-0.5 shrink-0 text-[#765b6b] dark:text-[#c9aebe]"
            />

            <p className="text-[10px] font-semibold leading-5 text-[#77736b] dark:text-[#aaa69e]">
              Archived tasks are hidden from My Tasks but remain
              saved. Restore a task whenever you want to bring it
              back into your active workspace.
            </p>
          </div>
        )}
      </div>

      {/* =====================================================
          DELETE CONFIRMATION
      ===================================================== */}

      {deleteTarget && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/45 p-4 backdrop-blur-[5px] dark:bg-black/70"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeDeleteModal();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-task-title"
            className="w-full max-w-md overflow-hidden rounded-[22px] border border-[#e2ddd5] bg-[#faf9f6] shadow-[0_25px_80px_rgba(0,0,0,0.18)] dark:border-[#333833] dark:bg-[#1b1f1c]"
            onMouseDown={(event) => event.stopPropagation()}
          >
            {/* HEADER */}
            <div className="flex items-start justify-between gap-4 border-b border-[#e8e3db] p-5 dark:border-[#303530] sm:p-6">
              <div className="flex items-start gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] bg-[#a85b5b]/8 text-[#a85b5b] dark:bg-[#d88989]/10 dark:text-[#d88989]">
                  <AlertTriangle size={21} />
                </div>

                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#a85b5b] dark:text-[#d88989]">
                    Permanent deletion
                  </p>

                  <h2
                    id="delete-task-title"
                    className="mt-1 text-lg font-black tracking-[-0.02em] text-[#292725] dark:text-white"
                  >
                    Delete this task?
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={deleting}
                aria-label="Close delete dialog"
                className="flex h-8 w-8 items-center justify-center rounded-[9px] text-[#918b82] transition hover:bg-black/5 hover:text-[#292725] disabled:cursor-not-allowed dark:hover:bg-white/5 dark:hover:text-white"
              >
                <X size={17} />
              </button>
            </div>

            {/* CONTENT */}
            <div className="p-5 sm:p-6">
              <p className="text-xs leading-5 text-[#77736b] dark:text-[#aaa69e]">
                You are about to permanently delete:
              </p>

              <div className="mt-3 rounded-[13px] border border-[#a85b5b]/10 bg-[#a85b5b]/[0.035] px-4 py-3 dark:border-[#d88989]/10 dark:bg-[#d88989]/[0.04]">
                <p className="break-words text-sm font-black text-[#292725] dark:text-white">
                  {deleteTarget.title || "Untitled task"}
                </p>

                {deleteTarget.description && (
                  <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-[#918b82] dark:text-[#777d77]">
                    {deleteTarget.description}
                  </p>
                )}
              </div>

              <p className="mt-3 text-[10px] font-semibold leading-5 text-[#918b82] dark:text-[#777d77]">
                This cannot be undone. The task will be permanently
                removed from your archives.
              </p>
            </div>

            {/* FOOTER */}
            <div className="flex flex-col-reverse gap-2 border-t border-[#e8e3db] bg-black/[0.012] p-4 dark:border-[#303530] dark:bg-white/[0.012] sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={deleting}
                className="min-h-[40px] rounded-[11px] px-4 text-xs font-black text-[#77736b] transition hover:bg-black/5 hover:text-[#292725] disabled:cursor-not-allowed disabled:opacity-50 dark:text-[#aaa69e] dark:hover:bg-white/5 dark:hover:text-white"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="flex min-h-[40px] items-center justify-center gap-2 rounded-[11px] bg-[#a85b5b] px-4 text-xs font-black text-white shadow-[0_4px_12px_rgba(168,91,91,0.16)] transition hover:bg-[#964e4e] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 size={14} />

                {deleting
                  ? "Deleting..."
                  : "Delete permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Archives;