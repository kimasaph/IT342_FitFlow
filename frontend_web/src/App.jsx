import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";

// Pages
import Dashboard from "./components/Dashboard";
import LoginPage from "./Components/LoginPage";
import SignupPage from "./Components/SignupPage";
import SignupSuccessPage from "./components/SignupSuccess";
import ForgotPassPage1 from "./Components/ForgotPassPage1.jsx";
import ForgotPassPage2 from "./Components/ForgotPassPage2.jsx";
import SignupVerifyPage from "./Components/SignupVerifyPage.jsx";
import SignupSetupPage from "./Components/SignupSetupPage.jsx";
import ForgotPassVerification from "./Components/ForgotPassVerificationPage.jsx";
import ForgotPassSuccess from "./Components/ForgotPassSuccess.jsx";
import SignupSetupSuccess from "./Components/SignupSetupSuccess.jsx";
import Workout from "./Components/Workout.jsx";
import OAuth2RedirectHandler from "./Components/OAuth2RedirectHandler.jsx";
import SidebarSettings from "./Components/SidebarSettings.jsx";
import Exercises from "./Components/Exercises.jsx";
import StrengthTraining from "./Components/StrengthTraining.jsx";
import Cardio from "./Components/Cardio.jsx";
import FlexiYoga from "./Components/FlexiYoga.jsx";
import SettingsRoutes from "./SettingsRoutes.jsx";
import DietPlan from "./Components/DietPlanPage/DietPlanPage.jsx";
import AdminDashboard from "./Components/Admin/AdminDashboard.jsx";
import TrainerDashboard from "./Components/Trainer/TrainerDashboard.jsx";
import axios from 'axios';

// Axios Interceptor Setup
const setupAxiosInterceptors = () => {
  window.axios = axios;
  const token = localStorage.getItem("token");

  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );
};

setupAxiosInterceptors();

// Not Found Page
const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-gray-600 mb-4">Page not found</p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          Go back home
        </button>
      </div>
    </div>
  );
};

// App Component
const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signup-success" element={<SignupSuccessPage />} />
          <Route path="/signup-verify" element={<SignupVerifyPage />} />
          <Route path="/signup-setup" element={<SignupSetupPage />} />
          <Route path="/signup-setup-success" element={<SignupSetupSuccess />} />
          <Route path="/forgot-password" element={<ForgotPassPage1 />} />
          <Route path="/forgot-verify" element={<ForgotPassVerification />} />
          <Route path="/reset-password" element={<ForgotPassPage2 />} />
          <Route path="/forgot-success" element={<ForgotPassSuccess />} />
          <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/admin-dashboard"
            element={
              localStorage.getItem("role") === "ADMIN" ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="/trainer-dashboard" element={<TrainerDashboard />} />
          <Route path="/settings" element={<SidebarSettings />} />
          <Route path="/workout" element={<Workout />} />
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/diet-plan" element={<DietPlan />} />
          <Route path="/strength-training" element={<StrengthTraining />} />
          <Route path="/cardio" element={<Cardio />} />
          <Route path="/flexi-yoga" element={<FlexiYoga />} />
          {SettingsRoutes}

          {/* Redirects */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

