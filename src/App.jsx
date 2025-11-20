import React from "react";
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

import Dashboard from "./pages/dashboard/dashboard";
import Profile from "./pages/dashboard/profile";

import DashboardLayout from "./components/dashboard/DashboardLayout";
import Spinner from "./components/Spinner";

import { useAuth } from "./contexts/AuthContext";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner size="lg" color="text-purple-600" />
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

          {/* PROTECTED ROUTES */}
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
