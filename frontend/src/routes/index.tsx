import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import Home from "../pages/Home";
import About from "../pages/About";
import Login from "../pages/Login";
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Market = lazy(() => import("../pages/MarketTransfer"));
import NotFound from "../pages/NotFound";
import MainLayout from "../layouts/MainLayout";
import { ProtectedRoute } from "../auth/ProtectedRoute";

const protectedRoutes = [
  {
    path: "dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "market",
    element: (
      <ProtectedRoute>
        <Market />
      </ProtectedRoute>
    ),
  },
];

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "", element: <Home /> },
      { path: "about", element: <About /> },
      ...protectedRoutes,
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "*", element: <NotFound /> },
]);

