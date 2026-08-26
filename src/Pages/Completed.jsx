import { CheckCircle2, Trash2 } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import TaskCard from "../Components/TaskCard";
import EmptyState from "../Components/EmptyState";

function Completed() {
  const { tasks, deleteTask, toggleTask, clearCompleted } = useOutletContext();

  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <div className="space-y-6">
      {/* Header */}{" "}
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        {" "}
        <div>
          {" "}
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a65d43]">
            Progress{" "}
          </p>
          
          <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">
            Completed
          </h1>
          <p className="mt-2 text-sm text-[#716d66] dark:text-[#aaa69e]">
            Look back at everything you've accomplished.
          </p>
        </div>
        {completedTasks.length > 0 && (
          <button
            onClick={clearCompleted}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#dfb9ad] px-4 py-3 text-sm font-bold text-[#a34f38] transition hover:bg-[#f5e1dc] dark:border-[#694238] dark:hover:bg-[#3b2925]"
          >
            <Trash2 size={16} />
            Clear completed
          </button>
        )}
      </section>
      {/* Completed count */}
      <section className="glass overflow-hidden rounded-3xl p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#dfe8e6] text-[#506d72] dark:bg-[#293c3e] dark:text-[#a6c2c4]">
            <CheckCircle2 size={27} />
          </div>

          <div>
            <p className="text-3xl font-black">{completedTasks.length}</p>

            <p className="text-xs font-semibold text-[#918b82]">
              completed task
              {completedTasks.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </section>
      {/* Completed tasks */}
      <section className="space-y-3">
        {completedTasks.length > 0 ? (
          completedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onEdit={() => {}}
            />
          ))
        ) : (
          <EmptyState
            title="No completed tasks"
            description="Complete a task and it will appear here."
          />
        )}
      </section>
    </div>
  );
}

export default Completed;
