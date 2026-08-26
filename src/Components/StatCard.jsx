function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full rounded-3xl border border-black/5 bg-white p-5 text-left transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-[#171a17]"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-black/35 dark:text-white/30">
            {title}
          </p>

          <p className="mt-2 text-3xl font-black tracking-tight">
            {value}
          </p>

          {subtitle && (
            <p className="mt-1 text-xs font-bold text-black/35 dark:text-white/30">
              {subtitle}
            </p>
          )}
        </div>

        {Icon && (
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#6f9473]/10 text-[#5f8263] transition group-hover:scale-110">
            <Icon size={20} />
          </div>
        )}
      </div>
    </button>
  );
}

export default StatCard;