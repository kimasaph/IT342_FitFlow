import React, { useState, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Dashboard from "./components/DashboardTemplate";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import SignupSuccessPage from "./components/SignupSuccess";
import ForgotPassPage1 from "./components/ForgotPassPage1.jsx";

// Custom 404 component
const NotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-gray-600 mb-4">Page not found</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          Go back home
        </button>
      </div>
    </div>
  );
};

// Disable authentication for development
const ProtectedRoute = ({ children }) => {
  return children; // Allows direct access to /dashboard
};

const PublicRoute = ({ children }) => {
  return children; // Allows direct access to /login
};

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public Route - Login Page */}
          <Route path="/login" element={<LoginPage />} />

          {/* Public Route - Signup Page */}
          <Route path="/signup" element={<SignupPage />} />

          {/* Public Route - Signup Success Page */}
          <Route path="/signup-success" element={<SignupSuccessPage />} />

          {/* Public Route - Forgot Password Page */}
          <Route path="/forgot1" element={<ForgotPassPage1 />} />

          {/* Protected Route - Dashboard (now accessible without authentication) */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Redirect root path to dashboard for quick testing */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

