import React, { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
} from "lucide-react";
import { useOutletContext } from "react-router-dom";

function Calendar() {
  const { tasks = [], toggleTask } =
    useOutletContext();

  const [currentDate, setCurrentDate] =
    useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString(
    "default",
    {
      month: "long",
      year: "numeric",
    },
  );

  const days = useMemo(() => {
    const firstDay = new Date(
      year,
      month,
      1,
    ).getDay();

    const daysInMonth = new Date(
      year,
      month + 1,
      0,
    ).getDate();

    const result = [];

    for (let i = 0; i < firstDay; i++) {
      result.push(null);
    }

    for (
      let day = 1;
      day <= daysInMonth;
      day++
    ) {
      result.push(day);
    }

    return result;
  }, [year, month]);

  const dateKey = (day) => {
    if (!day) return "";

    return `${year}-${String(
      month + 1,
    ).padStart(2, "0")}-${String(day).padStart(
      2,
      "0",
    )}`;
  };

  const todayKey = new Date()
    .toISOString()
    .slice(0, 10);

  const getTasksForDay = (day) => {
    if (!day) return [];

    const key = dateKey(day);

    return tasks.filter(
      (task) =>
        !task.archived &&
        task.dueDate === key,
    );
  };

  const previousMonth = () => {
    setCurrentDate(
      new Date(year, month - 1, 1),
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(year, month + 1, 1),
    );
  };

  const goToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      {/* HEADER */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#6f9473]">
            Planning
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            Calendar
          </h1>

          <p className="mt-2 text-sm font-bold text-black/40 dark:text-white/40">
            See your deadlines and planned work.
          </p>
        </div>

        <button
          type="button"
          onClick={goToday}
          className="rounded-2xl border border-black/5 bg-white px-5 py-3 text-sm font-black shadow-sm transition hover:bg-black/5 dark:border-white/10 dark:bg-[#171a17] dark:hover:bg-white/5"
        >
          Today
        </button>
      </div>

      {/* CALENDAR */}
      <div className="overflow-hidden rounded-[32px] border border-black/5 bg-white shadow-sm dark:border-white/10 dark:bg-[#171a17]">
        {/* MONTH HEADER */}
        <div className="flex items-center justify-between border-b border-black/5 p-5 dark:border-white/10 sm:p-6">
          <button
            type="button"
            onClick={previousMonth}
            className="flex h-10 w-10 items-center justify-center rounded-xl transition hover:bg-black/5 dark:hover:bg-white/5"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex items-center gap-3">
            <CalendarDays
              size={20}
              className="text-[#6f9473]"
            />

            <h2 className="text-lg font-black sm:text-xl">
              {monthName}
            </h2>
          </div>

          <button
            type="button"
            onClick={nextMonth}
            className="flex h-10 w-10 items-center justify-center rounded-xl transition hover:bg-black/5 dark:hover:bg-white/5"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* WEEK DAYS */}
        <div className="grid grid-cols-7 border-b border-black/5 dark:border-white/10">
          {[
            "Sun",
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
          ].map((day) => (
            <div
              key={day}
              className="p-3 text-center text-[10px] font-black uppercase tracking-wider text-black/35 dark:text-white/35 sm:p-4"
            >
              {day}
            </div>
          ))}
        </div>

        {/* DAYS */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const key = dateKey(day);
            const dayTasks =
              getTasksForDay(day);

            const isToday =
              key === todayKey;

            return (
              <div
                key={index}
                className="min-h-[120px] border-b border-r border-black/5 p-2 dark:border-white/10 sm:min-h-[150px] sm:p-3"
              >
                {day && (
                  <>
                    <div className="flex items-center justify-between">
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-black ${
                          isToday
                            ? "bg-[#4f6f52] text-white"
                            : "text-black/50 dark:text-white/50"
                        }`}
                      >
                        {day}
                      </span>

                      {dayTasks.length >
                        0 && (
                        <span className="text-[10px] font-black text-black/30 dark:text-white/30">
                          {dayTasks.length}
                        </span>
                      )}
                    </div>

                    <div className="mt-2 space-y-1.5">
                      {dayTasks
                        .slice(0, 3)
                        .map((task) => (
                          <button
                            key={task.id}
                            type="button"
                            onClick={() =>
                              toggleTask(
                                task.id,
                              )
                            }
                            className={`w-full truncate rounded-xl px-2 py-1.5 text-left text-[10px] font-black transition ${
                              task.completed
                                ? "bg-emerald-500/10 text-emerald-600 line-through"
                                : "bg-[#6f9473]/10 text-[#4f6f52] hover:bg-[#6f9473]/20"
                            }`}
                            title={
                              task.title
                            }
                          >
                            {task.title}
                          </button>
                        ))}

                      {dayTasks.length >
                        3 && (
                        <p className="px-2 text-[9px] font-bold text-black/30 dark:text-white/30">
                          +
                          {dayTasks.length -
                            3}{" "}
                          more
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* UPCOMING */}
      <div className="rounded-[30px] border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#171a17]">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#6f9473]/10 text-[#6f9473]">
            <Clock3 size={20} />
          </div>

          <div>
            <h2 className="font-black">
              Upcoming deadlines
            </h2>

            <p className="text-xs font-bold text-black/35 dark:text-white/35">
              Your next scheduled tasks
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {tasks
            .filter(
              (task) =>
                !task.archived &&
                !task.completed &&
                task.dueDate,
            )
            .sort(
              (a, b) =>
                new Date(a.dueDate) -
                new Date(b.dueDate),
            )
            .slice(0, 6)
            .map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between gap-4 rounded-2xl bg-black/[0.03] p-4 dark:bg-white/[0.04]"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-black">
                    {task.title}
                  </p>

                  <p className="mt-1 text-xs font-bold text-black/35 dark:text-white/35">
                    Due {task.dueDate}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    toggleTask(task.id)
                  }
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-black/30 transition hover:bg-emerald-500/10 hover:text-emerald-500 dark:text-white/30"
                >
                  <CheckCircle2
                    size={18}
                  />
                </button>
              </div>
            ))}

          {tasks.filter(
            (task) =>
              !task.archived &&
              !task.completed &&
              task.dueDate,
          ).length === 0 && (
            <p className="py-8 text-center text-sm font-bold text-black/35 dark:text-white/35">
              No upcoming deadlines.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Calendar;