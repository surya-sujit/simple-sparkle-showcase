
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";
import ModeratorLogin from "./pages/ModeratorLogin";
import WorkerLogin from "./pages/WorkerLogin";
import AdminRegister from "./pages/AdminRegister";
import ModeratorRegister from "./pages/ModeratorRegister";
import WorkerRegister from "./pages/WorkerRegister";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ModeratorDashboard from "./pages/ModeratorDashboard";
import WorkerDashboard from "./pages/WorkerDashboard";
import Hotels from "./pages/Hotels";
import HotelDetails from "./pages/HotelDetails";
import RoomDetails from "./pages/RoomDetails";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/admin-login",
        element: <AdminLogin />,
      },
      {
        path: "/admin-register",
        element: <AdminRegister />,
      },
      {
        path: "/moderator-login",
        element: <ModeratorLogin />,
      },
      {
        path: "/moderator-register",
        element: <ModeratorRegister />,
      },
      {
        path: "/worker-login",
        element: <WorkerLogin />,
      },
      {
        path: "/worker-register",
        element: <WorkerRegister />,
      },
      {
        path: "/dashboard",
        element: <UserDashboard />,
      },
      {
        path: "/admin",
        element: <AdminDashboard />,
      },
      {
        path: "/moderator",
        element: <ModeratorDashboard />,
      },
      {
        path: "/worker",
        element: <WorkerDashboard />,
      },
      {
        path: "/hotels",
        element: <Hotels />,
      },
      {
        path: "/hotels/:id",
        element: <HotelDetails />,
      },
      {
        path: "/rooms/:id",
        element: <RoomDetails />,
      }
    ],
  },
]);

export default function Routes() {
  return <RouterProvider router={router} />;
}
