import React, { useState, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Dashboard from "./Components/Dashboard";
import LoginPage from "./Components/LoginPage";
import SignupPage from "./Components/SignupPage";
import SignupSuccessPage from "./components/SignupSuccess";
import ForgotPassPage1 from "./components/ForgotPassPage1.jsx";
import ForgotPassPage2 from "./components/ForgotPassPage2.jsx";
import SignupVerifyPage from "./components/SignupVerifyPage.jsx";
import SignupSetupPage from "./components/SignupSetupPage.jsx";
import ForgotPassVerification from "./components/ForgotPassVerificationPage.jsx";
import ForgotPassSuccess from "./components/ForgotPassSuccess.jsx";
import SignupSetupSuccess from "./components/SignupSetupSuccess.jsx";
import Workout from "./components/Workout.jsx";
import OAuth2RedirectHandler from "./Components/OAuth2RedirectHandler.jsx";
import Exercises from "./components/Exercises.jsx";
import StrengthTraining from "./components/StrengthTraining.jsx";
import Cardio from "./components/Cardio.jsx";
import FlexiYoga from "./components/FlexiYoga.jsx";
import SettingsRoutes from "./SettingsRoutes.jsx";
import axios from 'axios';

const setupAxiosInterceptors = () => {
  // Store axios instance globally so other components can access it
  window.axios = axios;
  
  // Get token from localStorage
  const token = localStorage.getItem('token');
  
  if (token) {
    // Set default headers for all requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
  
  // Add response interceptor to handle auth errors
  axios.interceptors.response.use(
    response => response,
    error => {
      if (error.response && error.response.status === 401) {
        // If unauthorized, clear localStorage and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};

setupAxiosInterceptors();

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

          {/* Public Route - Signup Verification Page */}
          <Route path="/signup-verify" element={<SignupVerifyPage />} />

          {/* Public Route - Signup Setup Page */}
          <Route path="/signup-setup" element={<SignupSetupPage />} />

          {/* Public Route - Signup Setup Success Page */}
          <Route path="/signup-setup-success" element={<SignupSetupSuccess />} />

          {/* Public Route - Forgot Password Page */}
          <Route path="/forgot1" element={<ForgotPassPage1 />} />

          {/* Public Route - Forgot Password Verification Page */}
          <Route path="/forgot-verify" element={<ForgotPassVerification />} />

          {/* Public Route - Forgot Password Page 2 */}
          <Route path="/forgot2" element={<ForgotPassPage2 />} />

          {/* Public Route - Forgot Password Success Page */}
          <Route path="/forgot-success" element={<ForgotPassSuccess />} />

          {/* Protected Route - Dashboard (now accessible without authentication) */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Route for Workout */}
          <Route path="/workout" element={<Workout />} />

          {/* Route for Exercises */}
          <Route path="/exercises" element={<Exercises />} />

          <Route path="/strength-training" element={<StrengthTraining />} />

          <Route path="/cardio" element={<Cardio />} />

          <Route path="/flexi-yoga" element={<FlexiYoga />} />
          
          {SettingsRoutes}

          {/* OAuth2 Redirect Handler */}
          <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

          {/* Redirect root path to login page */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

