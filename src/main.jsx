import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import App from "./App";

import Dashboard from "./Pages/Dashboard";
import Todos from "./Pages/Todos";
import Completed from "./Pages/Completed";
import Profile from "./Pages/Profile";
import Settings from "./Pages/Settings";

import "./index.css";

const router = createBrowserRouter([
{
path: "/",
element: <App />,
children: [
{
index: true,
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
path: "profile",
element: <Profile />,
},
{
path: "settings",
element: <Settings />,
},
],
},
]);

ReactDOM.createRoot(document.getElementById("root")).render(
<React.StrictMode> <RouterProvider router={router} />
</React.StrictMode>
);
