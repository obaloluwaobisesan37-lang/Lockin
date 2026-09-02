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
import SignIn from "./Pages/SignIn";

import "./index.css";

function isAuthenticated() {
  return (
    localStorage.getItem("lockin_session") === "true" &&
    Boolean(localStorage.getItem("lockin_auth_user"))
  );
}

function ProtectedApp() {
  if (!isAuthenticated()) {
    return <Navigate to="/signin" replace />;
  }

  return <App />;
}

function SignInRoute() {
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  return <SignIn />;
}

const router = createBrowserRouter([
  {
    path: "/signin",
    element: <SignInRoute />,
  },

  {
    path: "/",
    element: <ProtectedApp />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },

      {
        path: "dashboard",
        element: <Dashboard />,
      },

      {
        path: "todos",
        element: <Todos />,
      },

      {
        path: "completed",
        element: <Completed />,
      },

      {
        path: "archives",
        element: <Archives />,
      },

      {
        path: "projects",
        element: <Projects />,
      },

      {
        path: "project-manager",
        element: <ProjectManager />,
      },

      {
        path: "overview",
        element: <TaskOverview />,
      },

      {
        path: "calendar",
        element: <Calendar />,
      },

      {
        path: "profile",
        element: <Profile />,
      },

      {
        path: "settings",
        element: <Settings />,
      },

      {
        path: "*",
        element: <Navigate to="/dashboard" replace />,
      },
    ],
  },

  {
    path: "*",
    element: (
      <Navigate
        to={isAuthenticated() ? "/dashboard" : "/signin"}
        replace
      />
    ),
  },
]);

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);