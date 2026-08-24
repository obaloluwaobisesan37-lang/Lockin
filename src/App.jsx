import { useEffect, useMemo, useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Components/Sidebar";
import Navbar from "./Components/Navbar";

function App() {
  // ==========================================
  // SAFE LOCAL STORAGE HELPERS
  // ==========================================

  const getArray = (key) => {
    try {
      const saved = localStorage.getItem(key);

      if (!saved) return [];

      const parsed = JSON.parse(saved);

      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const getNumber = (key, fallback = 0) => {
    try {
      const saved = localStorage.getItem(key);

      if (saved === null) return fallback;

      const number = Number(saved);

      return Number.isFinite(number) ? number : fallback;
    } catch {
      return fallback;
    }
  };

  // ==========================================
  // TASKS
  // ==========================================

  const [tasks, setTasks] = useState(() =>
    getArray("lockin_tasks")
  );

  // ==========================================
  // XP
  // ==========================================

  const [xp, setXp] = useState(() =>
    getNumber("lockin_xp", 0)
  );

  // ==========================================
  // STREAK
  // ==========================================

  const [completionDays, setCompletionDays] = useState(() =>
    getArray("lockin_completion_days")
  );

  // ==========================================
  // FOCUS MODE
  // ==========================================

  const [focusMode, setFocusMode] = useState(
    () =>
      localStorage.getItem("lockin_focus_mode") === "true"
  );

  const [focusTask, setFocusTask] = useState(null);

  // ==========================================
  // ENERGY
  // ==========================================

  const [energy, setEnergy] = useState(() =>
    getNumber("lockin_energy", 100)
  );

  // ==========================================
  // BADGES
  // ==========================================

  const [badges, setBadges] = useState(() =>
    getArray("lockin_badges")
  );

  // ==========================================
  // DAILY MISSION
  // ==========================================

  const [missionDate, setMissionDate] = useState(
    () =>
      localStorage.getItem("lockin_mission_date") || ""
  );

  const [missionCompleted, setMissionCompleted] = useState(
    () =>
      localStorage.getItem("lockin_mission_completed") ===
      "true"
  );

  // ==========================================
  // THEME
  // ==========================================

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("lockin_theme");

    if (saved === "dark") return true;

    if (saved === "light") return false;

    return window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
  });

  // ==========================================
  // GLOBAL SEARCH
  // ==========================================

  const [globalSearch, setGlobalSearch] = useState("");

  // ==========================================
  // NOTIFICATIONS
  // ==========================================

  const [notificationsList, setNotificationsList] = useState(
    () => getArray("lockin_notifications")
  );

  const [notificationsRead, setNotificationsRead] = useState(
    () =>
      localStorage.getItem(
        "lockin_notifications_read"
      ) === "true"
  );

  // ==========================================
  // SETTINGS
  // ==========================================

  const notificationsEnabled =
    localStorage.getItem(
      "lockin_notifications_enabled"
    ) !== "false";

  const notificationSound =
    localStorage.getItem("lockin_sound") !== "false";

  // ==========================================
  // ADD NOTIFICATION
  // ==========================================

  const addNotification = (
    title,
    message,
    type = "info"
  ) => {
    if (!notificationsEnabled) return;

    const notification = {
      id: crypto.randomUUID(),
      title,
      message,
      type,
      createdAt: new Date().toISOString(),
      read: false,
    };

    setNotificationsList((current) => {
      const safeCurrent = Array.isArray(current)
        ? current
        : [];

      return [notification, ...safeCurrent];
    });

    setNotificationsRead(false);
  };

  // ==========================================
  // SAVE NOTIFICATIONS
  // ==========================================

  useEffect(() => {
    localStorage.setItem(
      "lockin_notifications",
      JSON.stringify(
        Array.isArray(notificationsList)
          ? notificationsList
          : []
      )
    );
  }, [notificationsList]);

  // ==========================================
  // SAVE TASKS
  // ==========================================

  useEffect(() => {
    localStorage.setItem(
      "lockin_tasks",
      JSON.stringify(tasks)
    );
  }, [tasks]);

  // ==========================================
  // SAVE XP
  // ==========================================

  useEffect(() => {
    localStorage.setItem(
      "lockin_xp",
      String(xp)
    );
  }, [xp]);

  // ==========================================
  // SAVE STREAK
  // ==========================================

  useEffect(() => {
    localStorage.setItem(
      "lockin_completion_days",
      JSON.stringify(completionDays)
    );
  }, [completionDays]);

  // ==========================================
  // SAVE FOCUS
  // ==========================================

  useEffect(() => {
    localStorage.setItem(
      "lockin_focus_mode",
      String(focusMode)
    );
  }, [focusMode]);

  // ==========================================
  // SAVE ENERGY
  // ==========================================

  useEffect(() => {
    localStorage.setItem(
      "lockin_energy",
      String(energy)
    );
  }, [energy]);

  // ==========================================
  // SAVE BADGES
  // ==========================================

  useEffect(() => {
    localStorage.setItem(
      "lockin_badges",
      JSON.stringify(badges)
    );
  }, [badges]);

  // ==========================================
  // SAVE MISSION
  // ==========================================

  useEffect(() => {
    localStorage.setItem(
      "lockin_mission_date",
      missionDate
    );

    localStorage.setItem(
      "lockin_mission_completed",
      String(missionCompleted)
    );
  }, [missionDate, missionCompleted]);

  // ==========================================
  // SAVE THEME
  // ==========================================

  useEffect(() => {
    localStorage.setItem(
      "lockin_theme",
      darkMode ? "dark" : "light"
    );

    document.documentElement.classList.toggle(
      "dark",
      darkMode
    );
  }, [darkMode]);

  // ==========================================
  // SAVE NOTIFICATION READ STATUS
  // ==========================================

  useEffect(() => {
    localStorage.setItem(
      "lockin_notifications_read",
      String(notificationsRead)
    );
  }, [notificationsRead]);

  // ==========================================
  // TODAY
  // ==========================================

  const getToday = () => {
    const date = new Date();

    return (
      `${date.getFullYear()}-` +
      `${String(date.getMonth() + 1).padStart(2, "0")}-` +
      `${String(date.getDate()).padStart(2, "0")}`
    );
  };

  // ==========================================
  // DAILY MISSION RESET
  // ==========================================

  useEffect(() => {
    const today = getToday();

    if (missionDate !== today) {
      setMissionDate(today);
      setMissionCompleted(false);
    }
  }, [missionDate]);

  // ==========================================
  // RECORD COMPLETION DAY
  // ==========================================

  const recordCompletionDay = () => {
    const today = getToday();

    setCompletionDays((current) => {
      const safeCurrent = Array.isArray(current)
        ? current
        : [];

      if (safeCurrent.includes(today)) {
        return safeCurrent;
      }

      return [...safeCurrent, today];
    });
  };

  // ==========================================
  // STREAK
  // ==========================================

  const streak = useMemo(() => {
    if (
      !Array.isArray(completionDays) ||
      completionDays.length === 0
    ) {
      return {
        current: 0,
        best: 0,
      };
    }

    const days = [
      ...new Set(completionDays),
    ].sort();

    const dateNumber = (value) => {
      const date = new Date(value);

      return Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
    };

    let best = 1;
    let running = 1;

    for (let i = 1; i < days.length; i++) {
      const difference = Math.round(
        (dateNumber(days[i]) -
          dateNumber(days[i - 1])) /
          (1000 * 60 * 60 * 24)
      );

      if (difference === 1) {
        running += 1;

        best = Math.max(
          best,
          running
        );
      } else {
        running = 1;
      }
    }

    const today = getToday();

    const yesterdayDate = new Date();

    yesterdayDate.setDate(
      yesterdayDate.getDate() - 1
    );

    const yesterday =
      `${yesterdayDate.getFullYear()}-` +
      `${String(
        yesterdayDate.getMonth() + 1
      ).padStart(2, "0")}-` +
      `${String(
        yesterdayDate.getDate()
      ).padStart(2, "0")}`;

    if (
      !days.includes(today) &&
      !days.includes(yesterday)
    ) {
      return {
        current: 0,
        best,
      };
    }

    const currentDate = new Date();

    if (!days.includes(today)) {
      currentDate.setDate(
        currentDate.getDate() - 1
      );
    }

    let current = 0;

    while (true) {
      const formatted =
        `${currentDate.getFullYear()}-` +
        `${String(
          currentDate.getMonth() + 1
        ).padStart(2, "0")}-` +
        `${String(
          currentDate.getDate()
        ).padStart(2, "0")}`;

      if (!days.includes(formatted)) {
        break;
      }

      current += 1;

      currentDate.setDate(
        currentDate.getDate() - 1
      );
    }

    return {
      current,
      best: Math.max(
        best,
        current
      ),
    };
  }, [completionDays]);

  // ==========================================
  // LEVEL
  // ==========================================

  const XP_PER_LEVEL = 100;

  const level =
    Math.floor(xp / XP_PER_LEVEL) + 1;

  const xpIntoLevel =
    xp % XP_PER_LEVEL;

  const xpNeeded =
    XP_PER_LEVEL - xpIntoLevel;

  const xpProgress =
    (xpIntoLevel / XP_PER_LEVEL) * 100;

  // ==========================================
  // BADGES
  // ==========================================

  const unlockBadge = (badge) => {
    setBadges((current) => {
      const safeCurrent = Array.isArray(current)
        ? current
        : [];

      if (safeCurrent.includes(badge)) {
        return safeCurrent;
      }

      const badgeNames = {
        "first-task": "First Task",
        "first-win": "First Win",
        "three-day": "3 Day Streak",
        "seven-day": "7 Day Streak",
        "xp-500": "500 XP",
      };

      addNotification(
        "Badge unlocked",
        badgeNames[badge] ||
          "New badge unlocked",
        "badge"
      );

      return [...safeCurrent, badge];
    });
  };

  useEffect(() => {
    if (tasks.length >= 1) {
      unlockBadge("first-task");
    }

    if (
      tasks.some(
        (task) => task.completed
      )
    ) {
      unlockBadge("first-win");
    }

    if (streak.current >= 3) {
      unlockBadge("three-day");
    }

    if (streak.current >= 7) {
      unlockBadge("seven-day");
    }

    if (xp >= 500) {
      unlockBadge("xp-500");
    }
  }, [tasks, streak.current, xp]);

  // ==========================================
  // SOUND
  // ==========================================

  const playCompletionSound = () => {
    if (
      !notificationsEnabled ||
      !notificationSound
    ) {
      return;
    }

    try {
      const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;

      if (!AudioContext) return;

      const audio = new AudioContext();

      const oscillator =
        audio.createOscillator();

      const gain = audio.createGain();

      oscillator.type = "sine";

      oscillator.frequency.setValueAtTime(
        660,
        audio.currentTime
      );

      oscillator.frequency.setValueAtTime(
        880,
        audio.currentTime + 0.08
      );

      gain.gain.setValueAtTime(
        0.0001,
        audio.currentTime
      );

      gain.gain.exponentialRampToValueAtTime(
        0.12,
        audio.currentTime + 0.02
      );

      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        audio.currentTime + 0.18
      );

      oscillator.connect(gain);

      gain.connect(audio.destination);

      oscillator.start();

      oscillator.stop(
        audio.currentTime + 0.2
      );
    } catch {
      // Ignore sound errors
    }
  };

  // ==========================================
  // STATS
  // ==========================================

  const stats = useMemo(() => {
    const completed =
      tasks.filter(
        (task) => task.completed
      ).length;

    const pending =
      tasks.length - completed;

    const highPriority =
      tasks.filter(
        (task) =>
          task.priority === "High" &&
          !task.completed
      ).length;

    const progress =
      tasks.length === 0
        ? 0
        : Math.round(
            (completed / tasks.length) * 100
          );

    return {
      total: tasks.length,
      completed,
      pending,
      highPriority,
      progress,
    };
  }, [tasks]);

  // ==========================================
  // ADD TASK
  // ==========================================

  const addTask = (task) => {
    const newTask = {
      ...task,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
    };

    setTasks((current) => [
      newTask,
      ...current,
    ]);

    addNotification(
      "Task created",
      `"${newTask.title}" was added to your tasks.`,
      "task"
    );
  };

  // ==========================================
  // DELETE TASK
  // ==========================================

  const deleteTask = (id) => {
    const task = tasks.find(
      (item) => item.id === id
    );

    setTasks((current) =>
      current.filter(
        (item) => item.id !== id
      )
    );

    if (task) {
      addNotification(
        "Task deleted",
        `"${task.title}" was removed.`,
        "delete"
      );
    }
  };

  // ==========================================
  // TOGGLE TASK
  // ==========================================

  const toggleTask = (id) => {
    const task = tasks.find(
      (item) => item.id === id
    );

    if (!task) return;

    // ========================================
    // REOPEN TASK
    // ========================================

    if (task.completed) {
      setTasks((current) =>
        current.map(
          (item) =>
            item.id === id
              ? {
                  ...item,
                  completed: false,
                  completedAt: null,
                }
              : item
        )
      );

      const deductedXP =
        task.priority === "High"
          ? 15
          : 10;

      setXp((currentXP) =>
        Math.max(
          0,
          currentXP - deductedXP
        )
      );

      addNotification(
        "Task reopened",
        `"${task.title}" is active again.`,
        "task"
      );

      addNotification(
        "XP deducted",
        `-${deductedXP} XP because the task was reopened.`,
        "xp"
      );

      return;
    }

    // ========================================
    // COMPLETE TASK
    // ========================================

    setTasks((current) =>
      current.map(
        (item) =>
          item.id === id
            ? {
                ...item,
                completed: true,
                completedAt:
                  new Date().toISOString(),
              }
            : item
      )
    );

    const earnedXP =
      task.priority === "High"
        ? 15
        : 10;

    setXp(
      (currentXP) =>
        currentXP + earnedXP
    );

    setEnergy((current) =>
      Math.max(0, current - 5)
    );

    recordCompletionDay();

    playCompletionSound();

    addNotification(
      "Task completed",
      `"${task.title}" completed. +${earnedXP} XP`,
      "success"
    );

    // ========================================
    // DAILY MISSION
    // ========================================

    if (!missionCompleted) {
      setMissionCompleted(true);

      setXp(
        (currentXP) =>
          currentXP + 25
      );

      addNotification(
        "Daily mission completed",
        "+25 bonus XP earned.",
        "mission"
      );
    }
  };

  // ==========================================
  // UPDATE TASK
  // ==========================================

  const updateTask = (updatedTask) => {
    setTasks((current) =>
      current.map(
        (task) =>
          task.id === updatedTask.id
            ? {
                ...task,
                ...updatedTask,
              }
            : task
      )
    );

    addNotification(
      "Task updated",
      `"${updatedTask.title}" was updated.`,
      "task"
    );
  };

  // ==========================================
  // CHANGE ENERGY
  // ==========================================

  const changeTaskEnergy = (
    taskId,
    newEnergy
  ) => {
    const task = tasks.find(
      (item) => item.id === taskId
    );

    setTasks((current) =>
      current.map(
        (item) =>
          item.id === taskId
            ? {
                ...item,
                energy: newEnergy,
              }
            : item
      )
    );

    if (task) {
      addNotification(
        "Task energy changed",
        `"${task.title}" is now ${newEnergy}.`,
        "energy"
      );
    }
  };

  // ==========================================
  // START FOCUS
  // ==========================================

  const startFocus = (
    task,
    minutes = 25
  ) => {
    setFocusTask({
      ...task,
      focusMinutes: minutes,
    });

    setFocusMode(true);

    addNotification(
      "Focus mode started",
      `"${task.title}" — ${minutes} minute session.`,
      "focus"
    );
  };

  // ==========================================
  // STOP FOCUS
  // ==========================================

  const stopFocus = () => {
    if (focusTask) {
      addNotification(
        "Focus mode stopped",
        `Focus session for "${focusTask.title}" ended.`,
        "focus"
      );
    }

    setFocusMode(false);
    setFocusTask(null);
  };

  // ==========================================
  // CLEAR COMPLETED
  // ==========================================

  const clearCompleted = () => {
    const completedCount =
      tasks.filter(
        (task) => task.completed
      ).length;

    setTasks((current) =>
      current.filter(
        (task) => !task.completed
      )
    );

    if (completedCount > 0) {
      addNotification(
        "Completed tasks cleared",
        `${completedCount} completed ${
          completedCount === 1
            ? "task"
            : "tasks"
        } removed.`,
        "delete"
      );
    }
  };

  // ==========================================
  // CLEAR ALL TASKS
  // ==========================================

  const clearAllTasks = () => {
    const count = tasks.length;

    setTasks([]);

    addNotification(
      "All tasks cleared",
      `${count} ${
        count === 1
          ? "task"
          : "tasks"
      } removed from Lockin.`,
      "delete"
    );
  };

  // ==========================================
  // ANTI PROCRASTINATION
  // ==========================================

  const antiProcrastination = () => {
    const nextTask = tasks.find(
      (task) => !task.completed
    );

    if (!nextTask) {
      addNotification(
        "Nothing to do",
        "All your tasks are completed.",
        "success"
      );

      return null;
    }

    startFocus(nextTask, 5);

    return nextTask;
  };

  // ==========================================
  // RESET PROGRESS
  // ==========================================

  const resetAllProgress = () => {
    setXp(0);

    setCompletionDays([]);

    setBadges([]);

    setEnergy(100);

    setMissionCompleted(false);

    setMissionDate(getToday());

    addNotification(
      "Progress reset",
      "XP, streaks, badges and energy were reset.",
      "reset"
    );
  };

  // ==========================================
  // RESET EVERYTHING
  // ==========================================

  const resetEverything = () => {
    setTasks([]);

    setXp(0);

    setCompletionDays([]);

    setBadges([]);

    setEnergy(100);

    setMissionCompleted(false);

    setMissionDate(getToday());

    setFocusMode(false);

    setFocusTask(null);

    setGlobalSearch("");

    setDarkMode(false);

    // Remove stored data

    localStorage.removeItem("lockin_tasks");

    localStorage.removeItem("lockin_xp");

    localStorage.removeItem(
      "lockin_completion_days"
    );

    localStorage.removeItem("lockin_badges");

    localStorage.removeItem("lockin_energy");

    localStorage.removeItem(
      "lockin_focus_mode"
    );

    localStorage.removeItem(
      "lockin_notifications"
    );

    localStorage.removeItem(
      "lockin_notifications_read"
    );

    localStorage.setItem(
      "lockin_theme",
      "light"
    );

    document.documentElement.classList.remove(
      "dark"
    );

    setNotificationsList([
      {
        id: crypto.randomUUID(),

        title: "Lockin reset",

        message:
          "Everything has been reset to default.",

        type: "reset",

        createdAt:
          new Date().toISOString(),

        read: false,
      },
    ]);

    setNotificationsRead(false);
  };

  // ==========================================
  // NOTIFICATION CONTROLS
  // ==========================================

  const markNotificationsRead = () => {
    setNotificationsList(
      (current) => {
        const safeCurrent =
          Array.isArray(current)
            ? current
            : [];

        return safeCurrent.map(
          (notification) => ({
            ...notification,
            read: true,
          })
        );
      }
    );

    setNotificationsRead(true);
  };

  const clearNotifications = () => {
    setNotificationsList([]);

    setNotificationsRead(true);
  };

  // ==========================================
  // MAIN LAYOUT
  // ==========================================

  return (
    <div className="min-h-screen bg-[#f4f5f2] text-[#292725] dark:bg-[#101310] dark:text-[#f5f7f5]">

      {/* SIDEBAR */}

      <Sidebar tasks={tasks} />

      {/* MAIN */}

      <div className="relative min-h-screen pb-24 lg:ml-72 lg:pb-0">

        {/* NAVBAR */}

        <Navbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          globalSearch={globalSearch}
          setGlobalSearch={setGlobalSearch}
          focusTask={focusTask}
          onStopFocus={stopFocus}
          notifications={
            Array.isArray(
              notificationsList
            )
              ? notificationsList
              : []
          }
          notificationsRead={
            notificationsRead
          }
          onMarkNotificationsRead={
            markNotificationsRead
          }
          onClearNotifications={
            clearNotifications
          }
        />

        {/* CONTENT */}

        <main className="min-h-[calc(100vh-76px)] p-4 sm:p-6 lg:p-8">

          <Outlet
            context={{
              tasks,

              stats,

              addTask,

              deleteTask,

              toggleTask,

              updateTask,

              clearCompleted,

              clearAllTasks,

              globalSearch,

              setGlobalSearch,

              darkMode,

              setDarkMode,

              notifications:
                Array.isArray(
                  notificationsList
                )
                  ? notificationsList
                  : [],

              notificationsRead,

              addNotification,

              markNotificationsRead,

              clearNotifications,

              streak,

              completionDays,

              xp,

              setXp,

              level,

              xpProgress,

              xpNeeded,

              focusMode,

              setFocusMode,

              focusTask,

              startFocus,

              stopFocus,

              changeTaskEnergy,

              energy,

              setEnergy,

              missionCompleted,

              setMissionCompleted,

              badges,

              unlockBadge,

              antiProcrastination,

              resetAllProgress,

              resetEverything,
            }}
          />

        </main>

      </div>
    </div>
  );
}

export default App;