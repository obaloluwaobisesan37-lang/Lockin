import {
  Award,
  CalendarDays,
  CheckCircle2,
  Flame,
  Target,
  Trophy,
} from "lucide-react";

import { useOutletContext } from "react-router-dom";

function Profile() {
  const { stats = {} } = useOutletContext();

  const {
    completed = 0,
    completionRate = 0,
    total = 0,
  } = stats;

  const progress = Math.min(
    100,
    Math.max(0, completionRate)
  );

  const level =
    completed >= 10
      ? "Pro"
      : completed >= 5
      ? "Focused"
      : "Rising";

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-10">

      {/* =====================================================
          PROFILE HEADER
      ===================================================== */}

      <section className="profile-card relative overflow-hidden rounded-[2rem] border border-[#e2ddd5] bg-[#f6f4ef] p-6 shadow-sm dark:border-[#343934] dark:bg-[#1b1f1c] sm:p-8">

        <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#765b6b]/10 blur-3xl dark:bg-[#765b6b]/20" />

        <div className="relative">

          <div className="flex flex-wrap items-center gap-4">

            {/* AVATAR */}

            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-[#765b6b] text-2xl font-black text-white shadow-[0_6px_0_#594451]">
              L
            </div>

            {/* NAME */}

            <div>

              <div className="flex flex-wrap items-center gap-2">

                <h1 className="text-3xl font-black tracking-tight text-[#292725] dark:text-white">
                  Lockin User
                </h1>

                <span className="rounded-full bg-[#765b6b] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white">
                  {level}
                </span>

              </div>

              <p className="mt-2 text-sm text-[#777169] dark:text-[#aaa69e]">
                Building better habits, one task at a time.
              </p>

            </div>
          </div>

          {/* MEMBER INFO */}

          <div className="mt-5 flex flex-wrap gap-4 text-xs text-[#777169] dark:text-[#aaa69e]">

            <span className="flex items-center gap-1.5">
              <CalendarDays size={14} />
              Member since 2026
            </span>

            <span className="flex items-center gap-1.5">
              <Flame size={14} />
              Productivity mode
            </span>

          </div>

        </div>
      </section>


      {/* =====================================================
          STATS
      ===================================================== */}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {/* COMPLETED */}

        <div className="profile-shine-card rounded-3xl border border-[#e2ddd5] bg-white p-5 shadow-sm dark:border-[#343934] dark:bg-[#1b1f1c]">

          <div className="relative z-10">

            <Trophy
              size={22}
              className="text-[#a87938] dark:text-[#c59a59]"
            />

            <p className="mt-5 text-2xl font-black text-[#292725] dark:text-white">
              {completed}
            </p>

            <p className="mt-1 text-xs text-[#918b82] dark:text-[#aaa69e]">
              Tasks completed
            </p>

          </div>

        </div>


        {/* COMPLETION RATE */}

        <div className="profile-shine-card rounded-3xl border border-[#e2ddd5] bg-white p-5 shadow-sm dark:border-[#343934] dark:bg-[#1b1f1c]">

          <div className="relative z-10">

            <Target
              size={22}
              className="text-[#765b6b] dark:text-[#c7aebe]"
            />

            <p className="mt-5 text-2xl font-black text-[#292725] dark:text-white">
              {progress}%
            </p>

            <p className="mt-1 text-xs text-[#918b82] dark:text-[#aaa69e]">
              Completion rate
            </p>

          </div>

        </div>


        {/* TOTAL */}

        <div className="profile-shine-card rounded-3xl border border-[#e2ddd5] bg-white p-5 shadow-sm dark:border-[#343934] dark:bg-[#1b1f1c]">

          <div className="relative z-10">

            <CheckCircle2
              size={22}
              className="text-[#627b82] dark:text-[#91aeb5]"
            />

            <p className="mt-5 text-2xl font-black text-[#292725] dark:text-white">
              {total}
            </p>

            <p className="mt-1 text-xs text-[#918b82] dark:text-[#aaa69e]">
              Total tasks
            </p>

          </div>

        </div>


        {/* LEVEL */}

        <div className="profile-shine-card rounded-3xl border border-[#e2ddd5] bg-white p-5 shadow-sm dark:border-[#343934] dark:bg-[#1b1f1c]">

          <div className="relative z-10">

            <Award
              size={22}
              className="text-[#a65d43] dark:text-[#d58b6d]"
            />

            <p className="mt-5 text-2xl font-black text-[#292725] dark:text-white">
              {level}
            </p>

            <p className="mt-1 text-xs text-[#918b82] dark:text-[#aaa69e]">
              Current level
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          PRODUCTIVITY
      ===================================================== */}

      <section className="profile-shine-card rounded-3xl border border-[#e2ddd5] bg-white p-6 shadow-sm dark:border-[#343934] dark:bg-[#1b1f1c]">

        <div className="relative z-10">

          <div className="flex items-center justify-between gap-4">

            <div>

              <h2 className="text-lg font-black text-[#292725] dark:text-white">
                Productivity level
              </h2>

              <p className="mt-1 text-xs text-[#918b82] dark:text-[#aaa69e]">
                Keep completing tasks to level up.
              </p>

            </div>

            <span className="text-sm font-black text-[#765b6b] dark:text-[#c7aebe]">
              {progress}%
            </span>

          </div>


          {/* PROGRESS BAR */}

          <div className="mt-5 h-4 overflow-hidden rounded-full bg-[#ebe7e0] dark:bg-[#292e2a]">

            <div
              className="h-full rounded-full bg-[#765b6b] transition-all duration-700"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>

      </section>


      {/* =====================================================
          SHINE ANIMATION
      ===================================================== */}

      <style>{`

        .profile-shine-card {
          position: relative;
          overflow: hidden;
          isolation: isolate;
        }

        .profile-shine-card::after {
          content: "";
          position: absolute;

          top: -70%;
          left: -90%;

          width: 28%;
          height: 240%;

          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.02) 25%,
            rgba(255, 255, 255, 0.45) 50%,
            rgba(255, 255, 255, 0.02) 75%,
            transparent 100%
          );

          transform: rotate(24deg);

          pointer-events: none;

          z-index: 5;

          animation: profile-shine-cycle 32.5s linear infinite;
        }

        @keyframes profile-shine-cycle {

          0% {
            left: -90%;
          }

          7.69% {
            left: 140%;
          }

          100% {
            left: 140%;
          }

        }

        .profile-shine-card:nth-child(2)::after {
          animation-delay: 0.35s;
        }

        .profile-shine-card:nth-child(3)::after {
          animation-delay: 0.7s;
        }

        .profile-shine-card:nth-child(4)::after {
          animation-delay: 1.05s;
        }

        @media (prefers-reduced-motion: reduce) {

          .profile-shine-card::after {
            animation: none;
          }

        }

      `}</style>

    </div>
  );
}

export default Profile;
