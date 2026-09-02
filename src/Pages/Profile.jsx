import {
  Award,
  CalendarDays,
  CheckCircle2,
  Flame,
  Mail,
  Target,
  Trophy,
  TrendingUp,
  UserRound,
} from "lucide-react";

import { useOutletContext } from "react-router-dom";

function getSavedAccount() {
  try {
    const saved = localStorage.getItem("lockin_auth_user");

    if (!saved) {
      return {};
    }

    return JSON.parse(saved);
  } catch {
    return {};
  }
}

function Profile() {
  const context = useOutletContext() || {};
  const { stats = {} } = context;

  const account = getSavedAccount();

  const profileName =
    account?.name?.trim() || "Lockin User";

  const profileEmail = account?.email || "";

  const {
    completed = 0,
    completionRate = 0,
    total = 0,
  } = stats;

  const progress = Math.min(
    100,
    Math.max(0, Number(completionRate) || 0),
  );

  const getLevel = () => {
    if (completed >= 20) {
      return {
        name: "Pro",
        description:
          "You're building a strong and consistent workflow.",
        next: null,
        remaining: 0,
      };
    }

    if (completed >= 10) {
      return {
        name: "Focused",
        description:
          "You're developing a reliable productivity rhythm.",
        next: 20,
        remaining: 20 - completed,
      };
    }

    return {
      name: "Rising",
      description:
        "Every completed task is helping you build momentum.",
      next: 10,
      remaining: 10 - completed,
    };
  };

  const level = getLevel();

  const avatarLetter =
    profileName.charAt(0).toUpperCase();

  const memberYear = account?.createdAt
    ? new Date(account.createdAt).getFullYear()
    : new Date().getFullYear();

  const remainingTasks = Math.max(
    0,
    total - completed,
  );

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-10">
      {/* PROFILE HEADER */}
      <section className="relative overflow-hidden rounded-[24px] border border-[#e2ddd5] bg-[#f6f4ef] p-6 shadow-sm dark:border-[#343934] dark:bg-[#1b1f1c] sm:p-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#765b6b]/10 blur-3xl dark:bg-[#765b6b]/15" />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            {/* AVATAR */}
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#765b6b] text-2xl font-black uppercase text-white shadow-[0_5px_0_#594451] sm:h-20 sm:w-20 sm:text-3xl">
              {avatarLetter}
            </div>

            {/* DETAILS */}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="max-w-full truncate text-2xl font-black tracking-tight text-[#292725] dark:text-white sm:text-3xl">
                  {profileName}
                </h1>

                <span className="rounded-full bg-[#765b6b] px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-white">
                  {level.name}
                </span>
              </div>

              {profileEmail && (
                <div className="mt-2 flex min-w-0 items-center gap-1.5 text-xs text-[#777169] dark:text-[#aaa69e]">
                  <Mail size={14} />

                  <span className="truncate">
                    {profileEmail}
                  </span>
                </div>
              )}

              <p className="mt-2 text-xs text-[#918b82] dark:text-[#888f88]">
                Building better habits, one task at a time.
              </p>
            </div>
          </div>

          {/* MEMBER INFO */}
          <div className="flex flex-wrap gap-3 text-xs text-[#777169] dark:text-[#aaa69e]">
            <span className="flex items-center gap-1.5 rounded-xl border border-[#ded9d1] bg-white/70 px-3 py-2 dark:border-[#343934] dark:bg-[#202420]">
              <CalendarDays size={14} />
              Member since {memberYear}
            </span>

            <span className="flex items-center gap-1.5 rounded-xl border border-[#ded9d1] bg-white/70 px-3 py-2 dark:border-[#343934] dark:bg-[#202420]">
              <Flame size={14} />
              Productivity mode
            </span>
          </div>
        </div>
      </section>

      {/* QUICK STATS */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="group rounded-2xl border border-[#e2ddd5] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-[#343934] dark:bg-[#1b1f1c]">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#b07b4d]/10 text-[#a06e43] dark:text-[#d8aa7e]">
              <Trophy size={19} />
            </div>

            <span className="text-[9px] font-black uppercase tracking-wider text-[#918b82]">
              Completed
            </span>
          </div>

          <p className="mt-6 text-3xl font-black text-[#292725] dark:text-white">
            {completed}
          </p>

          <p className="mt-1 text-xs text-[#918b82] dark:text-[#aaa69e]">
            Tasks completed
          </p>
        </div>

        <div className="group rounded-2xl border border-[#e2ddd5] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-[#343934] dark:bg-[#1b1f1c]">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#765b6b]/10 text-[#765b6b] dark:text-[#c7aebe]">
              <Target size={19} />
            </div>

            <span className="text-[9px] font-black uppercase tracking-wider text-[#918b82]">
              Rate
            </span>
          </div>

          <p className="mt-6 text-3xl font-black text-[#292725] dark:text-white">
            {progress}%
          </p>

          <p className="mt-1 text-xs text-[#918b82] dark:text-[#aaa69e]">
            Completion rate
          </p>
        </div>

        <div className="group rounded-2xl border border-[#e2ddd5] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-[#343934] dark:bg-[#1b1f1c]">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#627b82]/10 text-[#627b82] dark:text-[#9bb1b7]">
              <CheckCircle2 size={19} />
            </div>

            <span className="text-[9px] font-black uppercase tracking-wider text-[#918b82]">
              Workload
            </span>
          </div>

          <p className="mt-6 text-3xl font-black text-[#292725] dark:text-white">
            {total}
          </p>

          <p className="mt-1 text-xs text-[#918b82] dark:text-[#aaa69e]">
            Total tasks
          </p>
        </div>

        <div className="group rounded-2xl border border-[#e2ddd5] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-[#343934] dark:bg-[#1b1f1c]">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#557a62]/10 text-[#557a62] dark:text-[#91b49b]">
              <Award size={19} />
            </div>

            <span className="text-[9px] font-black uppercase tracking-wider text-[#918b82]">
              Level
            </span>
          </div>

          <p className="mt-6 text-2xl font-black text-[#292725] dark:text-white">
            {level.name}
          </p>

          <p className="mt-1 text-xs text-[#918b82] dark:text-[#aaa69e]">
            Current level
          </p>
        </div>
      </section>

      {/* PRODUCTIVITY OVERVIEW */}
      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        {/* LEVEL PROGRESS */}
        <div className="rounded-[24px] border border-[#e2ddd5] bg-white p-6 shadow-sm dark:border-[#343934] dark:bg-[#1b1f1c]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp
                  size={18}
                  className="text-[#765b6b]"
                />

                <h2 className="text-lg font-black text-[#292725] dark:text-white">
                  Productivity level
                </h2>
              </div>

              <p className="mt-1 max-w-lg text-xs leading-5 text-[#918b82] dark:text-[#aaa69e]">
                {level.description}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-2xl font-black text-[#765b6b] dark:text-[#c7aebe]">
                {level.name}
              </p>

              <p className="text-[10px] font-bold text-[#918b82]">
                {completed} completed
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between text-[10px] font-black text-[#918b82]">
              <span>Current progress</span>

              <span>{progress}%</span>
            </div>

            <div className="mt-2 h-3 overflow-hidden rounded-full bg-[#ebe7e0] dark:bg-[#292e2a]">
              <div
                className="h-full rounded-full bg-[#765b6b] transition-all duration-700"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>

          {level.next !== null ? (
            <div className="mt-5 flex items-center justify-between rounded-xl border border-[#eeeae4] bg-[#faf9f6] px-4 py-3 dark:border-[#30352f] dark:bg-[#151815]">
              <div>
                <p className="text-xs font-black text-[#292725] dark:text-white">
                  Next milestone
                </p>

                <p className="mt-0.5 text-[10px] text-[#918b82]">
                  Reach {level.next} completed tasks
                </p>
              </div>

              <span className="text-sm font-black text-[#765b6b] dark:text-[#c7aebe]">
                {Math.max(level.remaining, 0)} to go
              </span>
            </div>
          ) : (
            <div className="mt-5 flex items-center gap-3 rounded-xl border border-[#557a62]/15 bg-[#557a62]/10 px-4 py-3">
              <CheckCircle2
                size={17}
                className="text-[#557a62]"
              />

              <p className="text-xs font-bold text-[#557a62] dark:text-[#91b49b]">
                You've reached the Pro level.
              </p>
            </div>
          )}
        </div>

        {/* WORKLOAD */}
        <div className="rounded-[24px] border border-[#e2ddd5] bg-[#f6f4ef] p-6 shadow-sm dark:border-[#343934] dark:bg-[#202420]">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#627b82]/10 text-[#627b82] dark:text-[#9bb1b7]">
            <ListIcon />
          </div>

          <h2 className="mt-5 text-lg font-black text-[#292725] dark:text-white">
            Workload
          </h2>

          <p className="mt-1 text-xs leading-5 text-[#918b82] dark:text-[#aaa69e]">
            A quick view of the work still waiting for you.
          </p>

          <div className="mt-6">
            <p className="text-3xl font-black text-[#292725] dark:text-white">
              {remainingTasks}
            </p>

            <p className="mt-1 text-xs text-[#918b82]">
              tasks remaining
            </p>
          </div>

          <div className="mt-5 h-px bg-[#ded9d1] dark:bg-[#343934]" />

          <div className="mt-4 flex items-center gap-2 text-xs font-bold text-[#777169] dark:text-[#aaa69e]">
            <UserRound size={14} />
            Keep your queue manageable.
          </div>
        </div>
      </section>

      {/* ACCOUNT */}
      <section className="rounded-[24px] border border-[#e2ddd5] bg-white p-6 shadow-sm dark:border-[#343934] dark:bg-[#1b1f1c]">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#765b6b]/10 text-[#765b6b] dark:text-[#c7aebe]">
            <UserRound size={18} />
          </div>

          <div>
            <h2 className="text-lg font-black text-[#292725] dark:text-white">
              Account
            </h2>

            <p className="mt-1 text-xs text-[#918b82] dark:text-[#aaa69e]">
              Your Lockin account information.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#eeeae4] bg-[#faf9f6] p-4 dark:border-[#30352f] dark:bg-[#151815]">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#918b82]">
              Name
            </p>

            <div className="mt-3 flex items-center gap-2">
              <UserRound
                size={15}
                className="text-[#765b6b]"
              />

              <p className="min-w-0 truncate text-sm font-bold text-[#292725] dark:text-white">
                {profileName}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#eeeae4] bg-[#faf9f6] p-4 dark:border-[#30352f] dark:bg-[#151815]">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#918b82]">
              Email
            </p>

            <div className="mt-3 flex items-center gap-2">
              <Mail
                size={15}
                className="shrink-0 text-[#627b82]"
              />

              <p className="min-w-0 break-all text-sm font-bold text-[#292725] dark:text-white">
                {profileEmail || "No email available"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PROFILE FOOTER */}
      <section className="rounded-[24px] border border-[#765b6b]/15 bg-[#765b6b]/[0.04] p-5 dark:border-[#765b6b]/20 dark:bg-[#765b6b]/10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black text-[#292725] dark:text-white">
              Keep locking in.
            </p>

            <p className="mt-1 text-xs text-[#918b82] dark:text-[#aaa69e]">
              Small completed tasks add up to meaningful progress.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-black text-[#765b6b] dark:text-[#c7aebe]">
            <Flame size={16} />
            Stay consistent
          </div>
        </div>
      </section>
    </div>
  );
}

/* Small local icon wrapper keeps the JSX readable. */
function ListIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 6h13" />
      <path d="M8 12h13" />
      <path d="M8 18h13" />
      <path d="M3 6h.01" />
      <path d="M3 12h.01" />
      <path d="M3 18h.01" />
    </svg>
  );
}

export default Profile;