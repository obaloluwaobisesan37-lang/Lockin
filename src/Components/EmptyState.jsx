import { ClipboardList, Plus } from "lucide-react";

function EmptyState({
title = "Nothing here yet",
description = "Create your first task and start making progress.",
action,
actionText = "Create Task",
}) {
return ( <div className="glass rounded-3xl p-10 text-center"> <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ebe6de] text-[#a65d43] dark:bg-[#332b28] dark:text-[#d18a6e]"> <ClipboardList size={30} /> </div>

```
  <h3 className="mt-5 text-lg font-bold">
    {title}
  </h3>

  <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#716d66] dark:text-[#aaa69e]">
    {description}
  </p>

  {action && (
    <button
      onClick={action}
      className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#a65d43] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#a65d43]/20 transition hover:-translate-y-0.5 hover:bg-[#8f4d38]"
    >
      <Plus size={17} />
      {actionText}
    </button>
  )}
</div>


);
}

export default EmptyState;
