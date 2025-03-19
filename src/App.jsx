import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from 'sonner';

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ModeratorDashboard from "./pages/ModeratorDashboard";
import WorkerDashboard from "./pages/WorkerDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";
import ModeratorLogin from "./pages/ModeratorLogin";
import ModeratorRegister from "./pages/ModeratorRegister";
import WorkerLogin from "./pages/WorkerLogin";
import WorkerRegister from "./pages/WorkerRegister";
import NotFound from "./pages/NotFound";
import Hotels from "./pages/Hotels";
import HotelDetail from "./pages/HotelDetail";
import RoomDetails from "./pages/RoomDetails";
import Pricing from "./pages/Pricing";
import About from "./pages/About";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css';

import axios from "axios";

const App = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });

  const setupMockAPI = () => {
    axios.interceptors.request.use(
      async (config) => {
        await new Promise(resolve => setTimeout(resolve, 800));
        console.log("API Request:", config.url);
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  };

  useEffect(() => {
    setupMockAPI();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster position="top-right" />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/moderator" element={<ModeratorDashboard />} />
            <Route path="/worker" element={<WorkerDashboard />} />
            
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin-register" element={<AdminRegister />} />
            <Route path="/moderator-login" element={<ModeratorLogin />} />
            <Route path="/moderator-register" element={<ModeratorRegister />} />
            <Route path="/worker-login" element={<WorkerLogin />} />
            <Route path="/worker-register" element={<WorkerRegister />} />
            
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/hotels/:id" element={<HotelDetail />} />
            <Route path="/rooms/:id" element={<RoomDetails />} />
            
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<About />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
