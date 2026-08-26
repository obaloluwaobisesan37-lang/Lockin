import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import App from "./App";

import Dashboard from "./Pages/Dashboard";
import Todos from "./Pages/Todos";
import Completed from "./Pages/Completed";
import Archives from "./Pages/Archives";
import Projects from "./Pages/Projects";
import ProjectManager from "./Pages/ProjectManager";
import TaskOverview from "./Pages/TaskOverview";
import Calendar from "./Pages/Calendar";
import Profile from "./Pages/Profile";
import Settings from "./Pages/Settings";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,

    children: [
      // ================================
      // DASHBOARD
      // ================================

      {
        index: true,
        element: <Dashboard />,
      },

      {
        path: "dashboard",
        element: <Dashboard />,
      },

      // ================================
      // TODOS
      // ================================

      {
        path: "todos",
        element: <Todos />,
      },

      // ================================
      // COMPLETED
      // ================================

      {
        path: "completed",
        element: <Completed />,
      },

      // ================================
      // ARCHIVES
      // ================================

      {
        path: "archives",
        element: <Archives />,
      },

      // ================================
      // PROJECTS
      // ================================

      {
        path: "projects",
        element: <Projects />,
      },

      // ================================
      // PROJECT MANAGER
      // ================================

      {
        path: "project-manager",
        element: <ProjectManager />,
      },

      // ================================
      // TASK OVERVIEW
      // ================================

      {
        path: "overview",
        element: <TaskOverview />,
      },

      // ================================
      // CALENDAR
      // ================================

      {
        path: "calendar",
        element: <Calendar />,
      },

      // ================================
      // PROFILE
      // ================================

      {
        path: "profile",
        element: <Profile />,
      },

      // ================================
      // SETTINGS
      // ================================

      {
        path: "settings",
        element: <Settings />,
      },

      // ================================
      // UNKNOWN ROUTE
      // ================================

      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);