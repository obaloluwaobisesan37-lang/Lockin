import { Inbox } from "lucide-react";

function EmptyState({
  title = "Nothing here yet",
  description = "Create something to get started.",
  action,
}) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-black/10 bg-white/50 p-8 text-center dark:border-white/10 dark:bg-white/[0.02]">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#6f9473]/10 text-[#6f9473]">
        <Inbox size={28} />
      </div>

      <h3 className="mt-5 text-lg font-black">
        {title}
      </h3>

      <p className="mt-2 max-w-sm text-sm text-black/40 dark:text-white/35">
        {description}
      </p>

      {action && (
        <div className="mt-5">
          {action}
        </div>
      )}
    </div>
  );
}

export default EmptyState;