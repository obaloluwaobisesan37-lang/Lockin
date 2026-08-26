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
  const [focusSeconds, setFocusSeconds] = useState(5 * 60);
  const [focusPaused, setFocusPaused] = useState(false);

  // =========================================================
  // THEME
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

    return "light";
  });

  const [darkMode, setDarkModeState] = useState(() => {
    const savedTheme = localStorage.getItem("lockin_theme");

    if (savedTheme === "dark") {
      return true;
    }

    if (savedTheme === "system") {
      return window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
    }

    return false;
  });

  // =========================================================
  // APPLY THEME
  // =========================================================

  useEffect(() => {
    const applyTheme = () => {
      let isDark = false;

      if (theme === "dark") {
        isDark = true;
      }

      if (theme === "system") {
        isDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
      }

      setDarkModeState(isDark);

      document.documentElement.classList.toggle(
        "dark",
        isDark
      );

      localStorage.setItem(
        "lockin_theme",
        theme
      );

      localStorage.setItem(
        "lockin_dark_mode",
        JSON.stringify(isDark)
      );
    };

    applyTheme();

    if (theme !== "system") {
      return undefined;
    }

    const mediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

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

    mediaQuery.addEventListener(
      "change",
      handleSystemTheme
    );

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

    setTheme(
      darkMode
        ? "light"
        : "dark"
    );
  };

  // =========================================================
  // COMPATIBILITY SET DARK MODE
  // =========================================================

  const setDarkMode = (value) => {
    if (typeof value === "function") {
      setDarkModeState((current) => {
        const nextValue = value(current);

        setTheme(
          nextValue
            ? "dark"
            : "light"
        );

        return nextValue;
      });

      return;
    }

    const nextValue = Boolean(value);

    setDarkModeState(nextValue);

    setTheme(
      nextValue
        ? "dark"
        : "light"
    );
  };

  // =========================================================
  // SEARCH
  // =========================================================

  const [globalSearch, setGlobalSearch] =
    useState("");

  // =========================================================
  // NOTIFICATIONS
  // =========================================================

  const [notificationsList, setNotificationsList] =
    useState(() =>
      getStorage(
        "lockin_notifications",
        []
      )
    );

  // =========================================================
  // ACTIVITY
  // =========================================================

  const [activity, setActivity] =
    useState(() =>
      getStorage(
        "lockin_activity",
        []
      )
    );

  // =========================================================
  // MISSION
  // =========================================================

  const [missionDate, setMissionDate] =
    useState(() =>
      getStorage(
        "lockin_mission_date",
        getToday()
      )
    );

  // =========================================================
  // TODO FILTERS
  // =========================================================

  const [taskView, setTaskView] =
    useState("list");

  const [taskFilter, setTaskFilter] =
    useState("all");

  const [priorityFilter, setPriorityFilter] =
    useState("all");

  const [categoryFilter, setCategoryFilter] =
    useState("all");

  const [energyFilter, setEnergyFilter] =
    useState("all");

  const [projectFilter, setProjectFilter] =
    useState("all");

  // =========================================================
  // TASK SELECTION
  // =========================================================

  const [selectedTasks, setSelectedTasks] =
    useState([]);

  // =========================================================
  // SAVE DATA
  // =========================================================

  useEffect(() => {
    localStorage.setItem(
      "lockin_tasks",
      JSON.stringify(tasks)
    );
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(
      "lockin_projects",
      JSON.stringify(projects)
    );
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(
      "lockin_xp",
      JSON.stringify(xp)
    );
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
      JSON.stringify(
        notificationsList
      )
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

  const addNotification = (
    message,
    type = "info"
  ) => {
    const notification = {
      id: makeId(),
      message,
      type,
      createdAt:
        new Date().toISOString(),
      read: false,
    };

    setNotificationsList(
      (previous) => [
        notification,
        ...previous,
      ]
    );
  };

  const markNotificationRead = (id) => {
    setNotificationsList(
      (previous) =>
        previous.map(
          (notification) =>
            notification.id === id
              ? {
                  ...notification,
                  read: true,
                }
              : notification
        )
    );
  };

  const markAllNotificationsRead =
    () => {
      setNotificationsList(
        (previous) =>
          previous.map(
            (notification) => ({
              ...notification,
              read: true,
            })
          )
      );
    };

  const clearNotifications = () => {
    setNotificationsList([]);
  };

  // =========================================================
  // ACTIVITY
  // =========================================================

  const addActivity = (
    message,
    type = "info"
  ) => {
    const item = {
      id: makeId(),
      message,
      type,
      createdAt:
        new Date().toISOString(),
    };

    setActivity((previous) =>
      [item, ...previous].slice(
        0,
        100
      )
    );
  };

  // =========================================================
  // XP
  // =========================================================

  const addXp = (amount) => {
    const safeAmount =
      Number(amount) || 0;

    if (safeAmount <= 0) {
      return;
    }

    setXp(
      (previous) =>
        previous + safeAmount
    );
  };

  const level = Math.max(
    1,
    Math.floor(xp / 100) + 1
  );

  const xpInsideLevel =
    xp % 100;

  const xpProgress = Math.min(
    100,
    Math.max(
      0,
      xpInsideLevel
    )
  );

  // =========================================================
  // STREAK
  // =========================================================

  const updateStreak = () => {
    const today = getToday();

    setStreak((previous) => {
      if (
        previous.lastCompletedDate ===
        today
      ) {
        return previous;
      }

      let current =
        previous.current || 0;

      if (
        !previous.lastCompletedDate
      ) {
        current = 1;
      } else {
        const previousDate =
          new Date(
            `${previous.lastCompletedDate}T00:00:00`
          );

        const todayDate =
          new Date(
            `${today}T00:00:00`
          );

        const difference =
          Math.round(
            (todayDate -
              previousDate) /
              (1000 *
                60 *
                60 *
                24)
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
        lastCompletedDate:
          today,
      };
    });
  };

  // =========================================================
  // ADD TASK
  // =========================================================

  const addTask = (
    taskData = {}
  ) => {
    const newTask = {
      id: makeId(),
      title:
        taskData.title ||
        "New task",
      description:
        taskData.description ||
        "",
      priority:
        taskData.priority ||
        "Medium",
      dueDate:
        taskData.dueDate || "",
      dueTime:
        taskData.dueTime || "",
      tags: Array.isArray(
        taskData.tags
      )
        ? taskData.tags
        : [],
      recurring:
        taskData.recurring ||
        "None",
      energy:
        taskData.energy ||
        "Medium",
      progress:
        Number(
          taskData.progress
        ) || 0,
      subtasks:
        Array.isArray(
          taskData.subtasks
        )
          ? taskData.subtasks
          : [],
      projectId:
        taskData.projectId ||
        null,
      category:
        taskData.category ||
        "",
      status:
        taskData.status ||
        "backlog",
      dependencies:
        Array.isArray(
          taskData.dependencies
        )
          ? taskData.dependencies
          : [],
      archived:
        taskData.archived === true,
      completed: false,
      createdAt:
        new Date().toISOString(),
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

  const deleteTask = (
    taskId
  ) => {
    const task = tasks.find(
      (item) =>
        item.id === taskId
    );

    setTasks((previous) =>
      previous.filter(
        (item) =>
          item.id !== taskId
      )
    );

    setSelectedTasks(
      (previous) =>
        previous.filter(
          (id) =>
            id !== taskId
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

  const toggleTask = (
    taskId
  ) => {
    const task = tasks.find(
      (item) =>
        item.id === taskId
    );

    if (!task) {
      return;
    }

    const completed =
      !task.completed;

    setTasks((previous) =>
      previous.map((item) =>
        item.id === taskId
          ? {
              ...item,
              completed,
              status: completed
                ? "done"
                : item.status ===
                  "done"
                ? "backlog"
                : item.status ||
                  "backlog",
              completedAt:
                completed
                  ? new Date().toISOString()
                  : null,
              progress:
                completed
                  ? 100
                  : item.progress,
            }
          : item
      )
    );

    if (completed) {
      addXp(10);
      updateStreak();

      setEnergy(
        (previous) =>
          Math.min(
            100,
            previous + 5
          )
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

  const archiveTask = (
    taskId
  ) => {
    const task = tasks.find(
      (item) =>
        item.id === taskId
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

    setSelectedTasks(
      (previous) =>
        previous.filter(
          (id) =>
            id !== taskId
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

  const clearCompleted =
    () => {
      setTasks((previous) =>
        previous.filter(
          (task) =>
            !task.completed
        )
      );

      setSelectedTasks(
        (previous) =>
          previous.filter(
            (id) =>
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

  const clearAllTasks =
    () => {
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

  const getTaskDependencies =
    (task) => {
      if (!task) {
        return [];
      }

      const dependencyIds =
        Array.isArray(
          task.dependencies
        )
          ? task.dependencies
          : [];

      return dependencyIds
        .map((id) =>
          tasks.find(
            (item) =>
              item.id === id
          )
        )
        .filter(Boolean);
    };

  const hasBlockedDependencies =
    (task) => {
      const dependencies =
        getTaskDependencies(
          task
        );

      return dependencies.some(
        (dependency) =>
          !dependency.completed
      );
    };

  // =========================================================
  // FILTERING
  // =========================================================

  const filteredTasks =
    useMemo(() => {
      const today =
        getToday();

      const search =
        globalSearch
          .trim()
          .toLowerCase();

      return tasks.filter(
        (task) => {
          if (task.archived) {
            return false;
          }

          if (search) {
            const matchesSearch =
              [
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
                    .includes(
                      search
                    )
                );

            if (!matchesSearch) {
              return false;
            }
          }

          if (
            taskFilter ===
              "active" &&
            task.completed
          ) {
            return false;
          }

          if (
            taskFilter ===
              "completed" &&
            !task.completed
          ) {
            return false;
          }

          if (
            taskFilter ===
              "today" &&
            task.dueDate !== today
          ) {
            return false;
          }

          if (
            taskFilter ===
            "overdue"
          ) {
            if (
              !task.dueDate ||
              task.dueDate >=
                today ||
              task.completed
            ) {
              return false;
            }
          }

          if (
            taskFilter ===
              "in-progress" &&
            task.status !==
              "in-progress"
          ) {
            return false;
          }

          if (
            taskFilter ===
              "review" &&
            task.status !==
              "review"
          ) {
            return false;
          }

          if (
            priorityFilter !==
              "all" &&
            task.priority !==
              priorityFilter
          ) {
            return false;
          }

          if (
            categoryFilter !==
              "all" &&
            task.category !==
              categoryFilter
          ) {
            return false;
          }

          if (
            energyFilter !==
              "all" &&
            task.energy !==
              energyFilter
          ) {
            return false;
          }

          if (
            projectFilter !==
              "all" &&
            task.projectId !==
              projectFilter
          ) {
            return false;
          }

          return true;
        }
      );
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

  const toggleTaskSelection =
    (taskId) => {
      setSelectedTasks(
        (previous) =>
          previous.includes(
            taskId
          )
            ? previous.filter(
                (id) =>
                  id !== taskId
              )
            : [
                ...previous,
                taskId,
              ]
      );
    };

  const selectAllVisibleTasks =
    () => {
      const visibleIds =
        filteredTasks.map(
          (task) => task.id
        );

      setSelectedTasks(
        (previous) => {
          const allSelected =
            visibleIds.length >
              0 &&
            visibleIds.every(
              (id) =>
                previous.includes(
                  id
                )
            );

          if (allSelected) {
            return previous.filter(
              (id) =>
                !visibleIds.includes(
                  id
                )
            );
          }

          return Array.from(
            new Set([
              ...previous,
              ...visibleIds,
            ])
          );
        }
      );
    };

  const clearTaskSelection =
    () => {
      setSelectedTasks([]);
    };

  // =========================================================
  // BULK COMPLETE
  // =========================================================

  const completeSelectedTasks =
    () => {
      if (
        selectedTasks.length ===
        0
      ) {
        return;
      }

      let completedCount = 0;

      setTasks((previous) =>
        previous.map((task) => {
          if (
            selectedTasks.includes(
              task.id
            ) &&
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
        addXp(
          completedCount * 10
        );

        updateStreak();

        setEnergy(
          (previous) =>
            Math.min(
              100,
              previous +
                completedCount *
                  5
            )
        );

        addActivity(
          `Completed ${completedCount} selected task${
            completedCount === 1
              ? ""
              : "s"
          }`,
          "success"
        );
      }

      setSelectedTasks([]);
    };

  // =========================================================
  // BULK ARCHIVE
  // =========================================================

  const archiveSelectedTasks =
    () => {
      if (
        selectedTasks.length ===
        0
      ) {
        return;
      }

      setTasks((previous) =>
        previous.map((task) =>
          selectedTasks.includes(
            task.id
          )
            ? {
                ...task,
                archived: true,
              }
            : task
        )
      );

      addActivity(
        `Archived ${selectedTasks.length} selected task${
          selectedTasks.length ===
          1
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

  const deleteSelectedTasks =
    () => {
      if (
        selectedTasks.length ===
        0
      ) {
        return;
      }

      setTasks((previous) =>
        previous.filter(
          (task) =>
            !selectedTasks.includes(
              task.id
            )
        )
      );

      addActivity(
        `Deleted ${selectedTasks.length} selected task${
          selectedTasks.length ===
          1
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

  const addProject = (
    projectData = {}
  ) => {
    const newProject = {
      id: makeId(),

      name:
        projectData.name ||
        projectData.title ||
        "New Project",

      description:
        projectData.description ||
        "",

      status:
        projectData.status ||
        "Not Started",

      priority:
        projectData.priority ||
        "Medium",

      dueDate:
        projectData.dueDate ||
        "",

      color:
        projectData.color ||
        "#765b6b",

      createdAt:
        new Date().toISOString(),
    };

    setProjects(
      (previous) => [
        newProject,
        ...previous,
      ]
    );

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
    setProjects(
      (previous) =>
        previous.map(
          (project) =>
            project.id ===
            projectId
              ? {
                  ...project,
                  ...updates,
                }
              : project
        )
    );
  };

  const deleteProject = (
    projectId
  ) => {
    const project =
      projects.find(
        (item) =>
          item.id ===
          projectId
      );

    setProjects(
      (previous) =>
        previous.filter(
          (item) =>
            item.id !==
            projectId
        )
    );

    setTasks((previous) =>
      previous.map((task) =>
        task.projectId ===
        projectId
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
  };

  // =========================================================
  // FOCUS
  // =========================================================

  const startFocus = () => {
    setFocusMode(true);
    setFocusPaused(false);

    if (
      focusSeconds <= 0
    ) {
      setFocusSeconds(
        5 * 60
      );
    }

    addActivity(
      "Started a focus session",
      "focus"
    );

    setEnergy(
      (previous) =>
        Math.max(
          0,
          previous - 5
        )
    );
  };

  const stopFocus = () => {
    setFocusMode(false);
    setFocusPaused(false);
  };

  const pauseFocus = () => {
    setFocusPaused(
      (previous) =>
        !previous
    );
  };

  const resetFocus = () => {
    setFocusSeconds(
      5 * 60
    );
    setFocusPaused(false);
  };

  const completeFocus = () => {
    setFocusMode(false);
    setFocusPaused(false);
    setFocusSeconds(
      5 * 60
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
  };

  // =========================================================
  // FOCUS TIMER
  // =========================================================

  useEffect(() => {
    if (
      !focusMode ||
      focusPaused
    ) {
      return undefined;
    }

    if (
      focusSeconds <= 0
    ) {
      completeFocus();
      return undefined;
    }

    const timer =
      setInterval(() => {
        setFocusSeconds(
          (previous) =>
            Math.max(
              0,
              previous - 1
            )
        );
      }, 1000);

    return () =>
      clearInterval(timer);
  }, [
    focusMode,
    focusPaused,
    focusSeconds,
  ]);

  const formattedFocusTime =
    useMemo(() => {
      const minutes =
        Math.floor(
          focusSeconds / 60
        );

      const seconds =
        focusSeconds % 60;

      return `${String(
        minutes
      ).padStart(
        2,
        "0"
      )}:${String(
        seconds
      ).padStart(
        2,
        "0"
      )}`;
    }, [focusSeconds]);

  // =========================================================
  // STATUS
  // =========================================================

  const tasksByStatus =
    useMemo(() => {
      const result = {
        backlog: [],
        "in-progress": [],
        review: [],
        done: [],
      };

      filteredTasks.forEach(
        (task) => {
          let status =
            task.status;

          if (task.completed) {
            status = "done";
          }

          if (!result[status]) {
            status = "backlog";
          }

          result[status].push(
            task
          );
        }
      );

      return result;
    }, [filteredTasks]);

  // =========================================================
  // STATS
  // =========================================================

  const stats = useMemo(
    () => {
      const today =
        getToday();

      const completed =
        tasks.filter(
          (task) =>
            task.completed
        );

      const pending =
        tasks.filter(
          (task) =>
            !task.completed
        );

      const todayTasks =
        tasks.filter(
          (task) =>
            task.dueDate ===
              today &&
            !task.completed
        );

      const overdueTasks =
        tasks.filter(
          (task) =>
            task.dueDate &&
            task.dueDate <
              today &&
            !task.completed
        );

      const highPriorityTasks =
        tasks.filter(
          (task) =>
            task.priority ===
              "High" &&
            !task.completed
        );

      return {
        total: tasks.length,
        completed:
          completed.length,
        pending:
          pending.length,
        today:
          todayTasks.length,
        overdue:
          overdueTasks.length,
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
    },
    [tasks]
  );

  // =========================================================
  // RESET EVERYTHING
  // =========================================================

  const resetEverything =
    () => {
      setTasks([]);
      setProjects([]);
      setXp(0);
      setEnergy(100);

      setStreak({
        current: 0,
        best: 0,
        lastCompletedDate:
          null,
      });

      setBadges([]);
      setNotificationsList(
        []
      );
      setActivity([]);
      setGlobalSearch("");
      setSelectedTasks([]);

      setTaskFilter("all");
      setPriorityFilter(
        "all"
      );
      setCategoryFilter(
        "all"
      );
      setEnergyFilter("all");
      setProjectFilter("all");
      setTaskView("list");

      setFocusMode(false);
      setFocusPaused(false);
      setFocusSeconds(
        5 * 60
      );

      setMissionDate(
        getToday()
      );

      setTheme("light");
      setDarkModeState(false);

      document.documentElement.classList.remove(
        "dark"
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
        localStorage.removeItem(
          key
        );
      });

      localStorage.setItem(
        "lockin_theme",
        "light"
      );

      localStorage.setItem(
        "lockin_dark_mode",
        "false"
      );
    };

  // =========================================================
  // OUTLET CONTEXT
  // =========================================================

  const outletContext = {
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

    selectedTasks,
    toggleTaskSelection,
    selectAllVisibleTasks,
    clearTaskSelection,
    completeSelectedTasks,
    archiveSelectedTasks,
    deleteSelectedTasks,

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

    projects,
    addProject,
    updateProject,
    deleteProject,

    stats,

    xp,
    level,
    xpProgress,
    addXp,

    streak,

    energy,
    setEnergy,

    badges,
    setBadges,

    focusMode,
    setFocusMode,
    focusSeconds,
    formattedFocusTime,
    focusPaused,
    startFocus,
    stopFocus,
    pauseFocus,
    resetFocus,
    completeFocus,

    notificationsList,
    addNotification,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,

    activity,
    addActivity,

    globalSearch,
    setGlobalSearch,

    theme,
    darkMode,
    setDarkMode,
    setTheme,
    changeTheme,

    missionDate,
    setMissionDate,

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
        {/* ===================================================
            SIDEBAR
        =================================================== */}

        <Sidebar
          tasks={tasks}
          projects={projects}
        />

        {/* ===================================================
            MAIN CONTENT AREA
        =================================================== */}

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
            setGlobalSearch={
              setGlobalSearch
            }
            notificationsList={
              notificationsList
            }
            markNotificationRead={
              markNotificationRead
            }
            markAllNotificationsRead={
              markAllNotificationsRead
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
            <div className="mx-auto w-full max-w-[1600px] min-w-0">
              <Outlet
                context={
                  outletContext
                }
              />
            </div>
          </main>
        </div>
      </div>

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
              w-full
              max-w-md
              rounded-[28px]
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
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#918b82] sm:text-xs">
              Focus mode
            </p>

            <h2 className="mt-3 text-2xl font-black text-[#292725] sm:text-3xl dark:text-white">
              Stay locked in.
            </h2>

            <div className="my-6 break-all text-5xl font-black tracking-tight text-[#765b6b] sm:my-8 sm:text-6xl">
              {formattedFocusTime}
            </div>

            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={
                  pauseFocus
                }
                className="
                  min-w-[90px]
                  rounded-xl
                  bg-[#765b6b]
                  px-4
                  py-3
                  text-xs
                  font-black
                  text-white
                  transition
                  hover:bg-[#674e5e]
                  sm:px-5
                  sm:text-sm
                "
              >
                {focusPaused
                  ? "Resume"
                  : "Pause"}
              </button>

              <button
                type="button"
                onClick={
                  resetFocus
                }
                className="
                  min-w-[90px]
                  rounded-xl
                  bg-[#eeeae4]
                  px-4
                  py-3
                  text-xs
                  font-black
                  text-[#292725]
                  transition
                  hover:bg-[#e2ddd5]
                  sm:px-5
                  sm:text-sm
                  dark:bg-[#303530]
                  dark:text-white
                "
              >
                Reset
              </button>

              <button
                type="button"
                onClick={
                  completeFocus
                }
                className="
                  min-w-[90px]
                  rounded-xl
                  bg-emerald-600
                  px-4
                  py-3
                  text-xs
                  font-black
                  text-white
                  transition
                  hover:bg-emerald-700
                  sm:px-5
                  sm:text-sm
                "
              >
                Complete
              </button>

              <button
                type="button"
                onClick={
                  stopFocus
                }
                className="
                  min-w-[90px]
                  rounded-xl
                  bg-rose-50
                  px-4
                  py-3
                  text-xs
                  font-black
                  text-rose-600
                  transition
                  hover:bg-rose-100
                  sm:px-5
                  sm:text-sm
                  dark:bg-rose-950/30
                  dark:text-rose-400
                "
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;