// src/App.jsx
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./components/login";
import SignUp from "./components/register";
import { auth } from "./components/firebase";

import Dashboard from "./pages/dashboard/dashboard";
import Profile from "./pages/dashboard/profile";
import Devices from "./pages/dashboard/devices";

import DashboardLayout from "./components/dashboard/DashboardLayout"; // NEW

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route
            path="/"
            element={user ? <Navigate to="/dashboard" replace /> : <Login />}
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" replace /> : <Login />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/dashboard" replace /> : <SignUp />}
          />

          {/* PROTECTED ROUTES – WITH LAYOUT */}
          <Route
            path="/dashboard"
            element={
              user ? (
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/profile"
            element={
              user ? (
                <DashboardLayout>
                  <Profile />
                </DashboardLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/devices"
            element={
              user ? (
                <DashboardLayout>
                  <Devices />
                </DashboardLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>

        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar
          closeOnClick
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  );
}

export default App;
