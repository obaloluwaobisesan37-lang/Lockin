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
    progress = 0,
    total = 0,
  } = stats;

  const level =
    completed >= 10
      ? "Pro"
      : completed >= 5
      ? "Focused"
      : "Rising";

  return (
    <div className="space-y-6 pb-8">

  


      <section className="lockin-depth relative overflow-hidden rounded-4xl border border-[#ddd7ce] bg-[#f3f0e9] p-6 shadow-sm dark:border-[#343a35] dark:bg-[#1b1f1c] sm:p-8">

        
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#a8c5a5]/20 blur-3xl" />

        <div className="relative">

          <div className="flex flex-wrap items-center gap-3">

            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#4f6f52] text-2xl font-black text-white shadow-[0_7px_0_#344a37]">
              L
            </div>

            <div>

              <div className="flex flex-wrap items-center gap-2">

                <h1 className="text-3xl font-black tracking-tight">
                  Lockin User
                </h1>

                <span className="rounded-full bg-[#4f6f52] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white">
                  {level}
                </span>

              </div>

              <p className="mt-2 text-sm text-[#6f756e] dark:text-[#b1b7b1]">
                Building better habits, one task at a time.
              </p>

            </div>

          </div>

          <div className="mt-5 flex flex-wrap gap-3 text-xs text-[#6f756e] dark:text-[#aaa69e]">

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

  

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        

        <div className="profile-shine-card lockin-depth rounded-3xl border border-[#ddd7ce] bg-white p-5 shadow-sm dark:border-[#343a35] dark:bg-[#1b1f1c]">

          <div className="relative z-10">

            <Trophy
              size={22}
              className="text-[#b58b4b]"
            />

            <p className="mt-5 text-2xl font-black">
              {completed}
            </p>

            <p className="mt-1 text-xs text-[#918b82] dark:text-[#aaa69e]">
              Tasks completed
            </p>

          </div>

        </div>

        

        <div className="profile-shine-card lockin-depth rounded-3xl border border-[#ddd7ce] bg-white p-5 shadow-sm dark:border-[#343a35] dark:bg-[#1b1f1c]">

          <div className="relative z-10">

            <Target
              size={22}
              className="text-[#765b6b]"
            />

            <p className="mt-5 text-2xl font-black">
              {progress}%
            </p>

            <p className="mt-1 text-xs text-[#918b82] dark:text-[#aaa69e]">
              Completion rate
            </p>

          </div>

        </div>

        {/* TOTAL TASKS */}

        <div className="profile-shine-card lockin-depth rounded-3xl border border-[#ddd7ce] bg-white p-5 shadow-sm dark:border-[#343a35] dark:bg-[#1b1f1c]">

          <div className="relative z-10">

            <CheckCircle2
              size={22}
              className="text-[#627b82]"
            />

            <p className="mt-5 text-2xl font-black">
              {total}
            </p>

            <p className="mt-1 text-xs text-[#918b82] dark:text-[#aaa69e]">
              Total tasks
            </p>

          </div>

        </div>

        {/* CURRENT LEVEL */}

        <div className="profile-shine-card lockin-depth rounded-3xl border border-[#ddd7ce] bg-white p-5 shadow-sm dark:border-[#343a35] dark:bg-[#1b1f1c]">

          <div className="relative z-10">

            <Award
              size={22}
              className="text-[#a65d43]"
            />

            <p className="mt-5 text-2xl font-black">
              {level}
            </p>

            <p className="mt-1 text-xs text-[#918b82] dark:text-[#aaa69e]">
              Current level
            </p>

          </div>

        </div>

      </section>

      {/* ===================================== */}
      {/* PRODUCTIVITY */}
      {/* ===================================== */}

      <section className="profile-shine-card lockin-depth rounded-3xl border border-[#ddd7ce] bg-white p-6 shadow-sm dark:border-[#343a35] dark:bg-[#1b1f1c]">

        <div className="relative z-10">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-lg font-black">
                Productivity level
              </h2>

              <p className="mt-1 text-xs text-[#918b82] dark:text-[#aaa69e]">
                Keep completing tasks to level up.
              </p>

            </div>

            <span className="text-sm font-black text-[#a65d43]">
              {progress}%
            </span>

          </div>

          <div className="mt-5 h-4 overflow-hidden rounded-full bg-[#ebe6de] dark:bg-[#292a27]">

            <div
              className="h-full rounded-full bg-[#a65d43] transition-all duration-700"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>

      </section>

      {/* ===================================== */}
      {/* PROFILE SHINE ANIMATION */}
      {/* ===================================== */}

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
            rgba(255, 255, 255, 0.05) 25%,
            rgba(255, 255, 255, 0.65) 50%,
            rgba(255, 255, 255, 0.05) 75%,
            transparent 100%
          );

          transform: rotate(24deg);

          pointer-events: none;

          z-index: 5;

          /*
            Total cycle:
            2.5 seconds = complete sweep
            30 seconds = wait
            32.5 seconds = complete cycle
          */

          animation: profile-shine-cycle 32.5s linear infinite;
        }

        @keyframes profile-shine-cycle {

          /*
            Start outside the left side.
          */
          0% {
            left: -90%;
          }

          /*
            Complete the entire sweep.
          */
          7.69% {
            left: 140%;
          }

          /*
            Remain completely off-screen
            for the remaining 30 seconds.
          */
          100% {
            left: 140%;
          }
        }

        /*
          Slight delay between cards so they don't
          all flash at exactly the same time.
        */

        .profile-shine-card:nth-child(2)::after {
          animation-delay: 0.35s;
        }

        .profile-shine-card:nth-child(3)::after {
          animation-delay: 0.7s;
        }

        .profile-shine-card:nth-child(4)::after {
          animation-delay: 1.05s;
        }

        /*
          Productivity card gets a later shine so
          the whole page feels more organic.
        */

        .profile-shine-card:last-child::after {
          animation-delay: 1.4s;
        }

        /*
          Keep the animation from interfering with
          clicks or text.
        */

        .profile-shine-card > * {
          position: relative;
          z-index: 6;
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

