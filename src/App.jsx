import { useEffect, useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import Navbar from "./Components/Navbar";

function App() {
  // =========================================================
  // HELPERS
  // =========================================================

  const makeId = () =>
    `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  const getToday = () => {
    const date = new Date();

    return (
      `${date.getFullYear()}-` +
      `${String(date.getMonth() + 1).padStart(2, "0")}-` +
      `${String(date.getDate()).padStart(2, "0")}`
    );
  };

  const getStorage = (key, fallback) => {
    try {
      const saved = localStorage.getItem(key);

      if (saved === null) {
        return fallback;
      }

      return JSON.parse(saved);
    } catch {
      return fallback;
    }
  };

  // =========================================================
  // NOTIFICATION SOUND
  // =========================================================

  const playNotificationSound = () => {
    try {
      const soundEnabled =
        localStorage.getItem("lockin_sound") !== "false";

      const notificationsEnabled =
        localStorage.getItem("lockin_notifications_enabled") !==
        "false";

      if (!soundEnabled || !notificationsEnabled) {
        return;
      }

      const AudioContext =
        window.AudioContext || window.webkitAudioContext;

      if (!AudioContext) {
        return;
      }

      const audioContext = new AudioContext();

      const playTone = (
        frequency,
        startTime,
        duration,
        volume
      ) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = "sine";

        oscillator.frequency.setValueAtTime(
          frequency,
          startTime
        );

        gainNode.gain.setValueAtTime(
          0.0001,
          startTime
        );

        gainNode.gain.exponentialRampToValueAtTime(
          volume,
          startTime + 0.02
        );

        gainNode.gain.exponentialRampToValueAtTime(
          0.0001,
          startTime + duration
        );

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      };

      const now = audioContext.currentTime;

      playTone(880, now, 0.18, 0.45);
      playTone(1174.66, now + 0.16, 0.25, 0.5);

      setTimeout(() => {
        audioContext.close().catch(() => {});
      }, 700);
    } catch {
      // Ignore audio errors.
    }
  };

  // =========================================================
  // TASKS
  // =========================================================

  const [tasks, setTasks] = useState(() =>
    getStorage("lockin_tasks", [])
  );

  // =========================================================
  // PROJECTS
  // =========================================================

  const [projects, setProjects] = useState(() =>
    getStorage("lockin_projects", [])
  );

  // =========================================================
  // XP
  // =========================================================

  const [xp, setXp] = useState(() =>
    getStorage("lockin_xp", 0)
  );

  // =========================================================
  // ENERGY
  // =========================================================

  const [energy, setEnergy] = useState(() =>
    getStorage("lockin_energy", 100)
  );

  // =========================================================
  // STREAK
  // =========================================================

  const [streak, setStreak] = useState(() =>
    getStorage("lockin_streak", {
      current: 0,
      best: 0,
      lastCompletedDate: null,
    })
  );

  // =========================================================
  // BADGES
  // =========================================================

  const [badges, setBadges] = useState(() =>
    getStorage("lockin_badges", [])
  );

  // =========================================================
  // FOCUS
  // =========================================================

  const [focusMode, setFocusMode] = useState(false);

  const [focusSeconds, setFocusSeconds] = useState(25 * 60);

  const [focusPaused, setFocusPaused] = useState(false);

  const [focusDuration, setFocusDuration] = useState(25 * 60);

  const [customFocusMinutes, setCustomFocusMinutes] = useState(25);

  const [focusTask, setFocusTask] = useState(null);

  const [miniFocusVisible, setMiniFocusVisible] = useState(false);

  // =========================================================
  // THEME
  // DEFAULT = SYSTEM
  // =========================================================

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("lockin_theme");

    if (
      savedTheme === "light" ||
      savedTheme === "dark" ||
      savedTheme === "system"
    ) {
      return savedTheme;
    }

    return "system";
  });

  const [darkMode, setDarkModeState] = useState(() => {
    const savedTheme = localStorage.getItem("lockin_theme");

    if (savedTheme === "dark") {
      return true;
    }

    if (savedTheme === "light") {
      return false;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // =========================================================
  // APPLY THEME
  // =========================================================

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    const applyTheme = () => {
      let isDark = false;

      if (theme === "dark") {
        isDark = true;
      } else if (theme === "light") {
        isDark = false;
      } else {
        isDark = mediaQuery.matches;
      }

      setDarkModeState(isDark);

      document.documentElement.classList.toggle(
        "dark",
        isDark
      );

      localStorage.setItem("lockin_theme", theme);

      localStorage.setItem(
        "lockin_dark_mode",
        JSON.stringify(isDark)
      );
    };

    applyTheme();

    if (theme !== "system") {
      return undefined;
    }

    const handleSystemTheme = (event) => {
      const isDark = event.matches;

      setDarkModeState(isDark);

      document.documentElement.classList.toggle(
        "dark",
        isDark
      );

      localStorage.setItem(
        "lockin_dark_mode",
        JSON.stringify(isDark)
      );
    };

    mediaQuery.addEventListener("change", handleSystemTheme);

    return () => {
      mediaQuery.removeEventListener(
        "change",
        handleSystemTheme
      );
    };
  }, [theme]);

  // =========================================================
  // CHANGE THEME
  // =========================================================

  const changeTheme = (newTheme) => {
    if (newTheme !== undefined) {
      if (
        newTheme !== "light" &&
        newTheme !== "dark" &&
        newTheme !== "system"
      ) {
        return;
      }

      setTheme(newTheme);
      return;
    }

    setTheme(darkMode ? "light" : "dark");
  };

  // =========================================================
  // COMPATIBILITY DARK MODE
  // =========================================================

  const setDarkMode = (value) => {
    if (typeof value === "function") {
      setDarkModeState((current) => {
        const nextValue = value(current);

        setTheme(nextValue ? "dark" : "light");

        return nextValue;
      });

      return;
    }

    const nextValue = Boolean(value);

    setDarkModeState(nextValue);

    setTheme(nextValue ? "dark" : "light");
  };

  // =========================================================
  // SEARCH
  // =========================================================

  const [globalSearch, setGlobalSearch] = useState("");

  // =========================================================
  // NOTIFICATIONS
  // =========================================================

  const [notificationsList, setNotificationsList] = useState(() =>
    getStorage("lockin_notifications", [])
  );

  // =========================================================
  // ACTIVITY
  // =========================================================

  const [activity, setActivity] = useState(() =>
    getStorage("lockin_activity", [])
  );

  // =========================================================
  // MISSION
  // =========================================================

  const [missionDate, setMissionDate] = useState(() =>
    getStorage("lockin_mission_date", getToday())
  );

  // =========================================================
  // TODO FILTERS
  // =========================================================

  const [taskView, setTaskView] = useState("list");

  const [taskFilter, setTaskFilter] = useState("all");

  const [priorityFilter, setPriorityFilter] = useState("all");

  const [categoryFilter, setCategoryFilter] = useState("all");

  const [energyFilter, setEnergyFilter] = useState("all");

  const [projectFilter, setProjectFilter] = useState("all");

  // =========================================================
  // TASK SELECTION
  // =========================================================

  const [selectedTasks, setSelectedTasks] = useState([]);

  // =========================================================
  // SAVE DATA
  // =========================================================

  useEffect(() => {
    localStorage.setItem("lockin_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(
      "lockin_projects",
      JSON.stringify(projects)
    );
  }, [projects]);

  useEffect(() => {
    localStorage.setItem("lockin_xp", JSON.stringify(xp));
  }, [xp]);

  useEffect(() => {
    localStorage.setItem(
      "lockin_energy",
      JSON.stringify(energy)
    );
  }, [energy]);

  useEffect(() => {
    localStorage.setItem(
      "lockin_streak",
      JSON.stringify(streak)
    );
  }, [streak]);

  useEffect(() => {
    localStorage.setItem(
      "lockin_badges",
      JSON.stringify(badges)
    );
  }, [badges]);

  useEffect(() => {
    localStorage.setItem(
      "lockin_notifications",
      JSON.stringify(notificationsList)
    );
  }, [notificationsList]);

  useEffect(() => {
    localStorage.setItem(
      "lockin_activity",
      JSON.stringify(activity)
    );
  }, [activity]);

  useEffect(() => {
    localStorage.setItem(
      "lockin_mission_date",
      JSON.stringify(missionDate)
    );
  }, [missionDate]);

  // =========================================================
  // NOTIFICATIONS
  // =========================================================

  const addNotification = (message, type = "info") => {
    const notificationsEnabled =
      localStorage.getItem(
        "lockin_notifications_enabled"
      ) !== "false";

    if (!notificationsEnabled) {
      return;
    }

    const notification = {
      id: makeId(),
      message,
      type,
      createdAt: new Date().toISOString(),
      read: false,
    };

    setNotificationsList((previous) => [
      notification,
      ...previous,
    ]);

    playNotificationSound();
  };

  const markNotificationRead = (id) => {
    setNotificationsList((previous) =>
      previous.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              read: true,
            }
          : notification
      )
    );
  };

  const markAllNotificationsRead = () => {
    setNotificationsList((previous) =>
      previous.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  // =========================================================
  // DELETE ONE NOTIFICATION
  // =========================================================

  const deleteNotification = (id) => {
    setNotificationsList((previous) =>
      previous.filter(
        (notification) => notification.id !== id
      )
    );
  };

  // =========================================================
  // CLEAR ALL NOTIFICATIONS
  // =========================================================

  const clearNotifications = () => {
    setNotificationsList([]);
  };

  // =========================================================
  // ACTIVITY
  // =========================================================

  const addActivity = (message, type = "info") => {
    const item = {
      id: makeId(),
      message,
      type,
      createdAt: new Date().toISOString(),
    };

    setActivity((previous) =>
      [item, ...previous].slice(0, 100)
    );
  };

  // =========================================================
  // XP
  // =========================================================

  const addXp = (amount) => {
    const safeAmount = Number(amount) || 0;

    if (safeAmount <= 0) {
      return;
    }

    setXp((previous) => previous + safeAmount);
  };

  const level = Math.max(
    1,
    Math.floor(xp / 100) + 1
  );

  const xpInsideLevel = xp % 100;

  const xpProgress = Math.min(
    100,
    Math.max(0, xpInsideLevel)
  );

  // =========================================================
  // STREAK
  // =========================================================

  const updateStreak = () => {
    const today = getToday();

    setStreak((previous) => {
      if (previous.lastCompletedDate === today) {
        return previous;
      }

      let current = previous.current || 0;

      if (!previous.lastCompletedDate) {
        current = 1;
      } else {
        const previousDate = new Date(
          `${previous.lastCompletedDate}T00:00:00`
        );

        const todayDate = new Date(
          `${today}T00:00:00`
        );

        const difference = Math.round(
          (todayDate - previousDate) /
            (1000 * 60 * 60 * 24)
        );

        if (difference === 1) {
          current += 1;
        } else {
          current = 1;
        }
      }

      return {
        current,
        best: Math.max(
          previous.best || 0,
          current
        ),
        lastCompletedDate: today,
      };
    });
  };

  // =========================================================
  // ADD TASK
  // =========================================================

  const addTask = (taskData = {}) => {
    const title = String(
      taskData.title || ""
    ).trim();

    if (!title) {
      return null;
    }

    const newTask = {
      id: makeId(),

      title,

      description: taskData.description || "",

      priority: taskData.priority || "Medium",

      dueDate: taskData.dueDate || "",

      dueTime: taskData.dueTime || "",

      tags: Array.isArray(taskData.tags)
        ? taskData.tags
        : [],

      recurring: taskData.recurring || "None",

      energy: taskData.energy || "Medium",

      progress: Number(taskData.progress) || 0,

      subtasks: Array.isArray(taskData.subtasks)
        ? taskData.subtasks
        : [],

      projectId: taskData.projectId || null,

      category: taskData.category || "",

      status: taskData.status || "backlog",

      dependencies: Array.isArray(
        taskData.dependencies
      )
        ? taskData.dependencies
        : [],

      archived: taskData.archived === true,

      completed: false,

      createdAt: new Date().toISOString(),

      completedAt: null,
    };

    setTasks((previous) => [
      newTask,
      ...previous,
    ]);

    addActivity(
      `Created task "${newTask.title}"`,
      "task"
    );

    addNotification(
      `Task "${newTask.title}" was created.`,
      "success"
    );

    return newTask;
  };

  // =========================================================
  // UPDATE TASK
  // =========================================================

  const updateTask = (
    taskId,
    updates = {}
  ) => {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === taskId
          ? {
              ...task,
              ...updates,
            }
          : task
      )
    );
  };

  // =========================================================
  // DELETE TASK
  // =========================================================

  const deleteTask = (taskId) => {
    const task = tasks.find(
      (item) => item.id === taskId
    );

    setTasks((previous) =>
      previous.filter(
        (item) => item.id !== taskId
      )
    );

    setSelectedTasks((previous) =>
      previous.filter(
        (id) => id !== taskId
      )
    );

    if (task) {
      addActivity(
        `Deleted task "${task.title}"`,
        "task"
      );
    }
  };

  // =========================================================
  // TOGGLE TASK
  // =========================================================

  const toggleTask = (taskId) => {
    const task = tasks.find(
      (item) => item.id === taskId
    );

    if (!task) {
      return;
    }

    const completed = !task.completed;

    setTasks((previous) =>
      previous.map((item) =>
        item.id === taskId
          ? {
              ...item,
              completed,
              status: completed
                ? "done"
                : item.status === "done"
                ? "backlog"
                : item.status || "backlog",
              completedAt: completed
                ? new Date().toISOString()
                : null,
              progress: completed
                ? 100
                : item.progress,
            }
          : item
      )
    );

    if (completed) {
      addXp(10);

      updateStreak();

      setEnergy((previous) =>
        Math.min(100, previous + 5)
      );

      addActivity(
        `Completed task "${task.title}"`,
        "success"
      );

      addNotification(
        `Nice work! "${task.title}" completed.`,
        "success"
      );
    }
  };

  // =========================================================
  // CHANGE TASK ENERGY
  // =========================================================

  const changeTaskEnergy = (
    taskId,
    newEnergy
  ) => {
    updateTask(taskId, {
      energy: newEnergy,
    });
  };

  // =========================================================
  // ARCHIVE TASK
  // =========================================================

  const archiveTask = (taskId) => {
    const task = tasks.find(
      (item) => item.id === taskId
    );

    setTasks((previous) =>
      previous.map((item) =>
        item.id === taskId
          ? {
              ...item,
              archived: true,
            }
          : item
      )
    );

    setSelectedTasks((previous) =>
      previous.filter(
        (id) => id !== taskId
      )
    );

    if (task) {
      addActivity(
        `Archived task "${task.title}"`,
        "task"
      );
    }
  };

  // =========================================================
  // CLEAR COMPLETED
  // =========================================================

  const clearCompleted = () => {
    setTasks((previous) =>
      previous.filter(
        (task) => !task.completed
      )
    );

    setSelectedTasks((previous) =>
      previous.filter((id) =>
        tasks.some(
          (task) =>
            task.id === id &&
            !task.completed
        )
      )
    );

    addActivity(
      "Cleared completed tasks",
      "task"
    );
  };

  // =========================================================
  // CLEAR ALL
  // =========================================================

  const clearAllTasks = () => {
    setTasks([]);
    setSelectedTasks([]);

    addActivity(
      "Cleared all tasks",
      "task"
    );

    addNotification(
      "All tasks were cleared.",
      "info"
    );
  };

  // =========================================================
  // DEPENDENCIES
  // =========================================================

  const getTaskDependencies = (task) => {
    if (!task) {
      return [];
    }

    const dependencyIds = Array.isArray(
      task.dependencies
    )
      ? task.dependencies
      : [];

    return dependencyIds
      .map((id) =>
        tasks.find(
          (item) => item.id === id
        )
      )
      .filter(Boolean);
  };

  const hasBlockedDependencies = (task) => {
    const dependencies =
      getTaskDependencies(task);

    return dependencies.some(
      (dependency) =>
        !dependency.completed
    );
  };

  // =========================================================
  // FILTERING
  // =========================================================

  const filteredTasks = useMemo(() => {
    const today = getToday();

    const search = globalSearch
      .trim()
      .toLowerCase();

    return tasks.filter((task) => {
      if (task.archived) {
        return false;
      }

      if (search) {
        const matchesSearch = [
          task.title,
          task.description,
          task.priority,
          task.energy,
          task.category,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value)
              .toLowerCase()
              .includes(search)
          );

        if (!matchesSearch) {
          return false;
        }
      }

      if (
        taskFilter === "active" &&
        task.completed
      ) {
        return false;
      }

      if (
        taskFilter === "completed" &&
        !task.completed
      ) {
        return false;
      }

      if (
        taskFilter === "today" &&
        task.dueDate !== today
      ) {
        return false;
      }

      if (taskFilter === "overdue") {
        if (
          !task.dueDate ||
          task.dueDate >= today ||
          task.completed
        ) {
          return false;
        }
      }

      if (
        taskFilter === "in-progress" &&
        task.status !== "in-progress"
      ) {
        return false;
      }

      if (
        taskFilter === "review" &&
        task.status !== "review"
      ) {
        return false;
      }

      if (
        priorityFilter !== "all" &&
        task.priority !== priorityFilter
      ) {
        return false;
      }

      if (
        categoryFilter !== "all" &&
        task.category !== categoryFilter
      ) {
        return false;
      }

      if (
        energyFilter !== "all" &&
        task.energy !== energyFilter
      ) {
        return false;
      }

      if (
        projectFilter !== "all" &&
        task.projectId !== projectFilter
      ) {
        return false;
      }

      return true;
    });
  }, [
    tasks,
    globalSearch,
    taskFilter,
    priorityFilter,
    categoryFilter,
    energyFilter,
    projectFilter,
  ]);

  // =========================================================
  // TASK SELECTION
  // =========================================================

  const toggleTaskSelection = (taskId) => {
    setSelectedTasks((previous) =>
      previous.includes(taskId)
        ? previous.filter(
            (id) => id !== taskId
          )
        : [...previous, taskId]
    );
  };

  const selectAllVisibleTasks = () => {
    const visibleIds = filteredTasks.map(
      (task) => task.id
    );

    setSelectedTasks((previous) => {
      const allSelected =
        visibleIds.length > 0 &&
        visibleIds.every((id) =>
          previous.includes(id)
        );

      if (allSelected) {
        return previous.filter(
          (id) =>
            !visibleIds.includes(id)
        );
      }

      return Array.from(
        new Set([
          ...previous,
          ...visibleIds,
        ])
      );
    });
  };

  const clearTaskSelection = () => {
    setSelectedTasks([]);
  };

  // =========================================================
  // BULK COMPLETE
  // =========================================================

  const completeSelectedTasks = () => {
    if (selectedTasks.length === 0) {
      return;
    }

    let completedCount = 0;

    setTasks((previous) =>
      previous.map((task) => {
        if (
          selectedTasks.includes(task.id) &&
          !task.completed
        ) {
          completedCount += 1;

          return {
            ...task,
            completed: true,
            status: "done",
            progress: 100,
            completedAt:
              new Date().toISOString(),
          };
        }

        return task;
      })
    );

    if (completedCount > 0) {
      addXp(completedCount * 10);

      updateStreak();

      setEnergy((previous) =>
        Math.min(
          100,
          previous + completedCount * 5
        )
      );

      addActivity(
        `Completed ${completedCount} selected task${
          completedCount === 1 ? "" : "s"
        }`,
        "success"
      );

      addNotification(
        `Completed ${completedCount} selected task${
          completedCount === 1 ? "" : "s"
        }.`,
        "success"
      );
    }

    setSelectedTasks([]);
  };

  // =========================================================
  // BULK ARCHIVE
  // =========================================================

  const archiveSelectedTasks = () => {
    if (selectedTasks.length === 0) {
      return;
    }

    setTasks((previous) =>
      previous.map((task) =>
        selectedTasks.includes(task.id)
          ? {
              ...task,
              archived: true,
            }
          : task
      )
    );

    addActivity(
      `Archived ${selectedTasks.length} selected task${
        selectedTasks.length === 1
          ? ""
          : "s"
      }`,
      "task"
    );

    setSelectedTasks([]);
  };

  // =========================================================
  // BULK DELETE
  // =========================================================

  const deleteSelectedTasks = () => {
    if (selectedTasks.length === 0) {
      return;
    }

    setTasks((previous) =>
      previous.filter(
        (task) =>
          !selectedTasks.includes(task.id)
      )
    );

    addActivity(
      `Deleted ${selectedTasks.length} selected task${
        selectedTasks.length === 1
          ? ""
          : "s"
      }`,
      "task"
    );

    setSelectedTasks([]);
  };

  // =========================================================
  // PROJECTS
  // =========================================================

  const addProject = (projectData = {}) => {
    const newProject = {
      id: makeId(),

      name:
        projectData.name ||
        projectData.title ||
        "New Project",

      description:
        projectData.description || "",

      status:
        projectData.status ||
        "Not Started",

      priority:
        projectData.priority ||
        "Medium",

      dueDate:
        projectData.dueDate || "",

      color:
        projectData.color || "#765b6b",

      createdAt:
        new Date().toISOString(),
    };

    setProjects((previous) => [
      newProject,
      ...previous,
    ]);

    addActivity(
      `Created project "${newProject.name}"`,
      "project"
    );

    addNotification(
      `Project "${newProject.name}" was created.`,
      "success"
    );

    return newProject;
  };

  const updateProject = (
    projectId,
    updates = {}
  ) => {
    setProjects((previous) =>
      previous.map((project) =>
        project.id === projectId
          ? {
              ...project,
              ...updates,
            }
          : project
      )
    );
  };

  const deleteProject = (projectId) => {
    const project = projects.find(
      (item) => item.id === projectId
    );

    setProjects((previous) =>
      previous.filter(
        (item) => item.id !== projectId
      )
    );

    setTasks((previous) =>
      previous.map((task) =>
        task.projectId === projectId
          ? {
              ...task,
              projectId: null,
            }
          : task
      )
    );

    if (project) {
      addActivity(
        `Deleted project "${project.name}"`,
        "project"
      );
    }

    if (projectFilter === projectId) {
      setProjectFilter("all");
    }
  };

  // =========================================================
  // PROJECT STATS
  // =========================================================

  const projectStats = useMemo(() => {
    const today = getToday();

    return projects.map((project) => {
      const projectTasks = tasks.filter(
        (task) =>
          task.projectId === project.id &&
          !task.archived
      );

      const total = projectTasks.length;

      const completed = projectTasks.filter(
        (task) => task.completed
      ).length;

      const overdue = projectTasks.filter(
        (task) =>
          task.dueDate &&
          task.dueDate < today &&
          !task.completed
      ).length;

      const progress =
        total === 0
          ? 0
          : Math.round(
              (completed / total) * 100
            );

      return {
        ...project,
        total,
        completed,
        overdue,
        progress,
      };
    });
  }, [projects, tasks]);

  // =========================================================
  // FOCUS HELPERS
  // =========================================================

  const formatFocusTime = (seconds) => {
    const safeSeconds = Math.max(
      0,
      Number(seconds) || 0
    );

    const minutes = Math.floor(
      safeSeconds / 60
    );

    const remainingSeconds =
      safeSeconds % 60;

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(remainingSeconds).padStart(
      2,
      "0"
    )}`;
  };

  // =========================================================
  // START FOCUS
  // =========================================================

  const startFocus = (
    task = null,
    duration
  ) => {
    const selectedDuration =
      Number(duration) > 0
        ? Number(duration)
        : focusDuration > 0
        ? focusDuration
        : 25 * 60;

    setFocusDuration(selectedDuration);

    setFocusSeconds(selectedDuration);

    setFocusTask(task || null);

    setFocusMode(true);
    setMiniFocusVisible(false);
    setFocusPaused(false);

    addActivity(
      task
        ? `Started focus on "${task.title}"`
        : "Started a focus session",
      "focus"
    );

    setEnergy((previous) =>
      Math.max(0, previous - 5)
    );
  };

  // =========================================================
  // EXIT FOCUS
  // =========================================================

  const exitFocus = () => {
    setFocusMode(false);

    if (focusSeconds > 0) {
      setMiniFocusVisible(true);
    }

    addActivity(
      "Exited focus mode",
      "focus"
    );
  };

  // =========================================================
  // CANCEL MINI COUNTDOWN
  // =========================================================

  const cancelMiniFocus = () => {
    setMiniFocusVisible(false);

    setFocusMode(false);
    setFocusPaused(false);

    setFocusSeconds(
      focusDuration || 25 * 60
    );

    setFocusTask(null);

    addActivity(
      "Cancelled focus countdown",
      "focus"
    );
  };

  // =========================================================
  // RESUME MINI COUNTDOWN
  // =========================================================

  const resumeFocus = () => {
    if (focusSeconds <= 0) {
      return;
    }

    setMiniFocusVisible(false);

    setFocusMode(true);
    setFocusPaused(false);
  };

  // =========================================================
  // PAUSE FOCUS
  // =========================================================

  const pauseFocus = () => {
    setFocusPaused(
      (previous) => !previous
    );
  };

  // =========================================================
  // RESET FOCUS
  // =========================================================

  const resetFocus = () => {
    setFocusSeconds(
      focusDuration || 25 * 60
    );

    setFocusPaused(false);
  };

  // =========================================================
  // COMPLETE FOCUS
  // =========================================================

  const completeFocus = () => {
    setFocusMode(false);
    setMiniFocusVisible(false);
    setFocusPaused(false);

    setFocusSeconds(
      focusDuration || 25 * 60
    );

    addXp(25);

    addActivity(
      "Completed a focus session",
      "focus"
    );

    addNotification(
      "Focus session completed. +25 XP!",
      "success"
    );

    setFocusTask(null);
  };

  // =========================================================
  // CHANGE FOCUS DURATION
  // =========================================================

  const chooseFocusDuration = (minutes) => {
    const seconds = Number(minutes) * 60;

    if (
      !Number.isFinite(seconds) ||
      seconds <= 0
    ) {
      return;
    }

    setFocusDuration(seconds);

    setFocusSeconds(seconds);

    setCustomFocusMinutes(Number(minutes));

    setFocusPaused(false);
  };

  // =========================================================
  // CUSTOM FOCUS
  // =========================================================

  const applyCustomFocus = () => {
    const minutes = Math.min(
      180,
      Math.max(
        1,
        Number(customFocusMinutes) || 25
      )
    );

    chooseFocusDuration(minutes);
  };

  // =========================================================
  // FOCUS TIMER
  // =========================================================

  useEffect(() => {
    if (
      (!focusMode && !miniFocusVisible) ||
      focusPaused
    ) {
      return undefined;
    }

    if (focusSeconds <= 0) {
      return undefined;
    }

    const timer = setInterval(() => {
      setFocusSeconds((previous) =>
        Math.max(0, previous - 1)
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [
    focusMode,
    miniFocusVisible,
    focusPaused,
  ]);

  // =========================================================
  // AUTO COMPLETE FOCUS
  // =========================================================

  useEffect(() => {
    if (
      focusSeconds === 0 &&
      (focusMode || miniFocusVisible) &&
      !focusPaused
    ) {
      completeFocus();
    }
  }, [
    focusSeconds,
    focusMode,
    miniFocusVisible,
    focusPaused,
  ]);

  const formattedFocusTime = useMemo(
    () => formatFocusTime(focusSeconds),
    [focusSeconds]
  );

  // =========================================================
  // STATUS
  // =========================================================

  const tasksByStatus = useMemo(() => {
    const result = {
      backlog: [],
      "in-progress": [],
      review: [],
      done: [],
    };

    filteredTasks.forEach((task) => {
      let status = task.status;

      if (task.completed) {
        status = "done";
      }

      if (!result[status]) {
        status = "backlog";
      }

      result[status].push(task);
    });

    return result;
  }, [filteredTasks]);

  // =========================================================
  // STATS
  // =========================================================

  const stats = useMemo(() => {
    const today = getToday();

    const completed = tasks.filter(
      (task) => task.completed
    );

    const pending = tasks.filter(
      (task) => !task.completed
    );

    const todayTasks = tasks.filter(
      (task) =>
        task.dueDate === today &&
        !task.completed
    );

    const overdueTasks = tasks.filter(
      (task) =>
        task.dueDate &&
        task.dueDate < today &&
        !task.completed
    );

    const highPriorityTasks =
      tasks.filter(
        (task) =>
          task.priority === "High" &&
          !task.completed
      );

    return {
      total: tasks.length,

      completed: completed.length,

      pending: pending.length,

      today: todayTasks.length,

      overdue: overdueTasks.length,

      highPriority:
        highPriorityTasks.length,

      completionRate:
        tasks.length === 0
          ? 0
          : Math.round(
              (completed.length /
                tasks.length) *
                100
            ),
    };
  }, [tasks]);

  // =========================================================
  // RESET EVERYTHING
  // =========================================================

  const resetEverything = () => {
    setTasks([]);
    setProjects([]);
    setXp(0);
    setEnergy(100);

    setStreak({
      current: 0,
      best: 0,
      lastCompletedDate: null,
    });

    setBadges([]);
    setNotificationsList([]);
    setActivity([]);

    setGlobalSearch("");
    setSelectedTasks([]);

    setTaskFilter("all");
    setPriorityFilter("all");
    setCategoryFilter("all");
    setEnergyFilter("all");
    setProjectFilter("all");
    setTaskView("list");

    setFocusMode(false);
    setMiniFocusVisible(false);
    setFocusPaused(false);

    setFocusSeconds(25 * 60);

    setFocusDuration(25 * 60);

    setCustomFocusMinutes(25);

    setFocusTask(null);

    setMissionDate(getToday());

    // ALWAYS RESET THEME TO SYSTEM

    setTheme("system");

    const systemDark =
      window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

    setDarkModeState(systemDark);

    document.documentElement.classList.toggle(
      "dark",
      systemDark
    );

    const keys = [
      "lockin_tasks",
      "lockin_projects",
      "lockin_xp",
      "lockin_energy",
      "lockin_streak",
      "lockin_badges",
      "lockin_notifications",
      "lockin_activity",
      "lockin_mission_date",
      "lockin_dark_mode",
      "lockin_theme",
    ];

    keys.forEach((key) => {
      localStorage.removeItem(key);
    });

    // Restore settings defaults

    localStorage.setItem(
      "lockin_theme",
      "system"
    );

    localStorage.setItem(
      "lockin_dark_mode",
      JSON.stringify(systemDark)
    );

    localStorage.setItem(
      "lockin_notifications_enabled",
      "true"
    );

    localStorage.setItem(
      "lockin_sound",
      "true"
    );
  };

  // =========================================================
  // OUTLET CONTEXT
  // =========================================================

  const outletContext = {
    // TASKS

    tasks,
    filteredTasks,
    tasksByStatus,

    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    archiveTask,
    clearCompleted,
    clearAllTasks,
    changeTaskEnergy,

    getTaskDependencies,
    hasBlockedDependencies,

    // SELECTION

    selectedTasks,
    toggleTaskSelection,
    selectAllVisibleTasks,
    clearTaskSelection,
    completeSelectedTasks,
    archiveSelectedTasks,
    deleteSelectedTasks,

    // FILTERS

    taskView,
    setTaskView,

    taskFilter,
    setTaskFilter,

    priorityFilter,
    setPriorityFilter,

    categoryFilter,
    setCategoryFilter,

    energyFilter,
    setEnergyFilter,

    projectFilter,
    setProjectFilter,

    // PROJECTS

    projects,
    projectStats,
    addProject,
    updateProject,
    deleteProject,

    // STATS

    stats,

    // XP

    xp,
    level,
    xpProgress,
    addXp,

    // STREAK

    streak,

    // ENERGY

    energy,
    setEnergy,

    // BADGES

    badges,
    setBadges,

    // FOCUS

    focusMode,
    setFocusMode,
    focusSeconds,
    formattedFocusTime,
    focusPaused,

    startFocus,

    stopFocus: exitFocus,

    exitFocus,
    pauseFocus,
    resetFocus,
    completeFocus,

    focusDuration,
    setFocusDuration,

    customFocusMinutes,
    setCustomFocusMinutes,

    chooseFocusDuration,
    applyCustomFocus,

    focusTask,
    setFocusTask,

    miniFocusVisible,
    setMiniFocusVisible,

    cancelMiniFocus,
    resumeFocus,

    // NOTIFICATIONS

    notificationsList,
    addNotification,
    markNotificationRead,
    markAllNotificationsRead,

    // INDIVIDUAL DELETE

    deleteNotification,

    // CLEAR ALL

    clearNotifications,

    // ACTIVITY

    activity,
    addActivity,

    // SEARCH

    globalSearch,
    setGlobalSearch,

    // THEME

    theme,
    darkMode,
    setDarkMode,
    setTheme,
    changeTheme,

    // MISSION

    missionDate,
    setMissionDate,

    // RESET

    resetEverything,
  };

  // =========================================================
  // APP
  // =========================================================

  return (
    <div
      className={`
        min-h-screen
        w-full
        overflow-x-hidden
        transition-colors
        duration-300
        ${
          darkMode
            ? "bg-[#111411] text-white"
            : "bg-[#f6f4ef] text-[#292725]"
        }
      `}
    >
      <div className="flex min-h-screen w-full">
        {/* SIDEBAR */}

        <Sidebar
          tasks={tasks}
          projects={projects}
        />

        {/* MAIN CONTENT */}

        <div
          className="
            flex
            min-w-0
            flex-1
            flex-col
            md:ml-72
          "
        >
          {/* NAVBAR */}

          <Navbar
            darkMode={darkMode}
            theme={theme}
            changeTheme={changeTheme}
            globalSearch={globalSearch}
            setGlobalSearch={setGlobalSearch}
            notificationsList={notificationsList}
            markNotificationRead={
              markNotificationRead
            }
            markAllNotificationsRead={
              markAllNotificationsRead
            }
            deleteNotification={
              deleteNotification
            }
            clearNotifications={
              clearNotifications
            }
          />

          {/* PAGE CONTENT */}

          <main
            className="
              min-w-0
              w-full
              flex-1
              overflow-x-hidden
              p-3
              pb-24
              sm:p-5
              sm:pb-24
              md:p-6
              md:pb-8
              lg:p-8
              xl:p-10
            "
          >
            <div
              className="
                mx-auto
                w-full
                max-w-[1600px]
                min-w-0
              "
            >
              <Outlet context={outletContext} />
            </div>
          </main>
        </div>
      </div>

      {/* =====================================================
          FLOATING MINI FOCUS COUNTDOWN
      ===================================================== */}

      {miniFocusVisible && !focusMode && (
        <div
          className="
            fixed
            bottom-3
            left-3
            right-3
            z-[90]
            sm:left-auto
            sm:right-5
            sm:bottom-5
            md:right-6
          "
        >
          <div
            className="
              mx-auto
              flex
              w-full
              max-w-sm
              items-center
              gap-3
              rounded-2xl
              border
              border-[#765b6b]/20
              bg-white/95
              p-3
              shadow-2xl
              backdrop-blur-xl
              dark:border-white/10
              dark:bg-[#1b1f1c]/95
              sm:w-[360px]
            "
          >
            <button
              type="button"
              onClick={resumeFocus}
              className="
                min-w-0
                flex-1
                text-left
              "
            >
              <p
                className="
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.18em]
                  text-[#765b6b]
                  dark:text-[#c4aebe]
                "
              >
                Focus running
              </p>

              <div
                className="
                  mt-0.5
                  flex
                  min-w-0
                  items-center
                  gap-2
                "
              >
                <span
                  className="
                    text-xl
                    font-black
                    tracking-tight
                    text-[#292725]
                    dark:text-white
                  "
                >
                  {formattedFocusTime}
                </span>

                {focusTask && (
                  <span
                    className="
                      hidden
                      truncate
                      text-xs
                      font-bold
                      text-black/40
                      sm:block
                      dark:text-white/40
                    "
                  >
                    {focusTask.title}
                  </span>
                )}
              </div>
            </button>

            <button
              type="button"
              onClick={resumeFocus}
              className="
                shrink-0
                rounded-xl
                bg-[#765b6b]
                px-3
                py-2.5
                text-[10px]
                font-black
                text-white
                transition
                hover:bg-[#674e5e]
                sm:px-4
              "
            >
              Resume
            </button>

            <button
              type="button"
              onClick={cancelMiniFocus}
              className="
                shrink-0
                rounded-xl
                bg-black/5
                p-2.5
                text-black/40
                transition
                hover:bg-red-500/10
                hover:text-red-500
                dark:bg-white/5
                dark:text-white/40
              "
              title="Cancel countdown"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* =====================================================
          FOCUS MODE
      ===================================================== */}

      {focusMode && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            overflow-y-auto
            bg-black/50
            p-3
            backdrop-blur-sm
            sm:p-5
          "
        >
          <div
            className="
              my-auto
              max-h-[95vh]
              w-full
              max-w-md
              overflow-y-auto
              rounded-[26px]
              border
              border-[#e0dcd5]
              bg-white
              p-5
              text-center
              shadow-2xl
              sm:rounded-[32px]
              sm:p-7
              dark:border-[#343934]
              dark:bg-[#1b1f1c]
            "
          >
            <p
              className="
                text-[9px]
                font-black
                uppercase
                tracking-[0.2em]
                text-[#918b82]
                sm:text-xs
              "
            >
              Focus mode
            </p>

            <h2
              className="
                mt-2
                text-xl
                font-black
                text-[#292725]
                sm:mt-3
                sm:text-3xl
                dark:text-white
              "
            >
              Stay locked in.
            </h2>

            {focusTask && (
              <p
                className="
                  mx-auto
                  mt-2
                  max-w-xs
                  truncate
                  text-xs
                  font-bold
                  text-black/40
                  dark:text-white/40
                "
              >
                {focusTask.title}
              </p>
            )}

            <div
              className="
                my-5
                text-5xl
                font-black
                tracking-tight
                text-[#765b6b]
                sm:my-8
                sm:text-6xl
              "
            >
              {formattedFocusTime}
            </div>

            <div
              className="
                mb-5
                inline-flex
                items-center
                rounded-full
                bg-[#765b6b]/10
                px-3
                py-1.5
                text-[10px]
                font-black
                uppercase
                tracking-wider
                text-[#765b6b]
              "
            >
              {focusPaused
                ? "Paused"
                : "Focusing"}
            </div>

            <div
              className="
                grid
                grid-cols-2
                gap-2
                sm:flex
                sm:flex-wrap
                sm:justify-center
                sm:gap-3
              "
            >
              <button
                type="button"
                onClick={pauseFocus}
                className="
                  rounded-xl
                  bg-[#765b6b]
                  px-3
                  py-3
                  text-xs
                  font-black
                  text-white
                  transition
                  hover:bg-[#674e5e]
                  sm:min-w-[90px]
                  sm:px-5
                "
              >
                {focusPaused
                  ? "Resume"
                  : "Pause"}
              </button>

              <button
                type="button"
                onClick={resetFocus}
                className="
                  rounded-xl
                  bg-[#eeeae4]
                  px-3
                  py-3
                  text-xs
                  font-black
                  text-[#292725]
                  transition
                  hover:bg-[#e2ddd5]
                  dark:bg-[#303530]
                  dark:text-white
                "
              >
                Reset
              </button>

              <button
                type="button"
                onClick={completeFocus}
                className="
                  rounded-xl
                  bg-emerald-600
                  px-3
                  py-3
                  text-xs
                  font-black
                  text-white
                  transition
                  hover:bg-emerald-700
                "
              >
                Complete
              </button>

              <button
                type="button"
                onClick={exitFocus}
                className="
                  rounded-xl
                  bg-rose-50
                  px-3
                  py-3
                  text-xs
                  font-black
                  text-rose-600
                  transition
                  hover:bg-rose-100
                  dark:bg-rose-950/30
                  dark:text-rose-400
                "
              >
                Exit
              </button>
            </div>

            <p
              className="
                mt-4
                text-[10px]
                leading-relaxed
                text-black/30
                dark:text-white/30
              "
            >
              Exit keeps the countdown
              running in the corner while
              you move around Lockin.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;