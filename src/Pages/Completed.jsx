import { CheckCircle2, Trash2, ArrowUpRight } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import TaskCard from "../Components/TaskCard";
import EmptyState from "../Components/EmptyState";

function Completed() {
  const {
    tasks = [],
    projects = [],
    deleteTask,
    toggleTask,
    clearCompleted,
    updateTask,
  } = useOutletContext();

  const completedTasks = Array.isArray(tasks)
    ? tasks.filter((task) => task.completed)
    : [];

  const totalCompleted = completedTasks.length;

  return (
    <div className="space-y-6">
      {/* =========================================================
          HEADER
      ========================================================= */}
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#557a62]" />

            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#557a62] dark:text-[#8faf91]">
              Progress archive
            </p>
          </div>

          <h1 className="mt-2 text-3xl font-black tracking-[-0.035em] text-[#292725] sm:text-4xl dark:text-white">
            Completed
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-[#77736b] dark:text-[#aaa69e]">
            A record of the work you've finished and the progress you've made.
          </p>
        </div>

        {totalCompleted > 0 && (
          <button
            type="button"
            onClick={clearCompleted}
            className="group inline-flex min-h-[42px] w-fit items-center gap-2 rounded-[12px] border border-[#dfc9c3] bg-white px-4 text-xs font-black text-[#a85b5b] shadow-[0_3px_12px_rgba(41,39,37,0.03)] transition hover:border-[#d7aaa1] hover:bg-[#fbf7f5] dark:border-[#493331] dark:bg-[#1b1f1c] dark:text-[#d88989] dark:hover:bg-[#25201f]"
          >
            <Trash2
              size={14}
              className="transition-transform duration-200 group-hover:-translate-y-px"
            />
            Clear completed
          </button>
        )}
      </section>

      {/* =========================================================
          SUMMARY
      ========================================================= */}
      <section className="overflow-hidden rounded-[22px] border border-[#e2ddd5] bg-white shadow-[0_8px_25px_rgba(41,39,37,0.04)] dark:border-[#333833] dark:bg-[#1b1f1c]">
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] border border-[#557a62]/10 bg-[#557a62]/8 text-[#557a62] dark:border-[#557a62]/15 dark:bg-[#557a62]/10 dark:text-[#8faf91]">
              <CheckCircle2 size={24} strokeWidth={2} />
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-black tracking-[-0.04em] text-[#292725] dark:text-white">
                  {totalCompleted}
                </p>

                <p className="text-xs font-bold text-[#918b82] dark:text-[#777d77]">
                  completed
                </p>
              </div>

              <p className="mt-0.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#aaa49b] dark:text-[#686d68]">
                Task{totalCompleted !== 1 ? "s" : ""} finished
              </p>
            </div>
          </div>

          {totalCompleted > 0 && (
            <div className="flex items-center gap-2 text-[10px] font-bold text-[#918b82] dark:text-[#777d77]">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f0ede8] text-[#77736b] dark:bg-[#292e2a] dark:text-[#aaa69e]">
                <ArrowUpRight size={12} />
              </span>

              Keep building your streak
            </div>
          )}
        </div>

        {totalCompleted > 0 && (
          <div className="h-1 w-full bg-[#f0ede8] dark:bg-[#292e2a]">
            <div className="h-full w-full bg-[#557a62]" />
          </div>
        )}
      </section>

      {/* =========================================================
          COMPLETED TASKS
      ========================================================= */}
      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#9a948b]">
              Finished work
            </p>

            <h2 className="mt-1 text-sm font-black text-[#292725] dark:text-white">
              Your completed tasks
            </h2>
          </div>

          {totalCompleted > 0 && (
            <span className="rounded-full bg-[#557a62]/8 px-2.5 py-1 text-[9px] font-black uppercase tracking-wide text-[#557a62] dark:bg-[#557a62]/12 dark:text-[#8faf91]">
              {totalCompleted} done
            </span>
          )}
        </div>

        {totalCompleted > 0 ? (
          <div className="space-y-3">
            {completedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                projects={projects}
                onToggle={toggleTask}
                onDelete={deleteTask}
                onUpdate={updateTask}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No completed tasks yet"
            description="Finish a task and it will appear here as part of your progress history."
          />
        )}
      </section>
    </div>
  );
}

export default Completed;