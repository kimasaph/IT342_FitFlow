import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";

// Components
import Dashboard from "./Components/Dashboard";
import LoginPage from "./Components/LoginPage";
import SignupPage from "./Components/SignupPage";
import SignupSuccessPage from "./Components/SignupSuccess";
import ForgotPassPage1 from "./Components/ForgotPassPage1.jsx";
import ForgotPassPage2 from "./Components/ForgotPassPage2.jsx";
import SignupVerifyPage from "./Components/SignupVerifyPage.jsx";
import SignupSetupPage from "./Components/SignupSetupPage.jsx";
import ForgotPassVerification from "./Components/ForgotPassVerificationPage.jsx";
import ForgotPassSuccess from "./Components/ForgotPassSuccess.jsx";
import SignupSetupSuccess from "./Components/SignupSetupSuccess.jsx";
import Workout from "./Components/Workout.jsx";
import OAuth2RedirectHandler from "./Components/OAuth2RedirectHandler.jsx";
import Exercises from "./Components/Exercises.jsx";
import StrengthTraining from "./Components/StrengthTraining.jsx";
import Cardio from "./Components/Cardio.jsx";
import FlexiYoga from "./Components/FlexiYoga.jsx";
import SettingsRoutes from "./SettingsRoutes.jsx";
import ProtectedRoute from "./Components/ProtectedRoute";
import AdminDashboard from "./Components/AdminDashboard";

// Axios Interceptor Setup
import axios from "axios";

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
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("isAuthenticated");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );
};

setupAxiosInterceptors();

// NotFound Component
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

// PublicRoute Component
const PublicRoute = ({ children }) => {
  return children;
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
          <Route path="/forgot1" element={<ForgotPassPage1 />} />
          <Route path="/forgot2" element={<ForgotPassPage2 />} />
          <Route path="/forgot-verification" element={<ForgotPassVerification />} />
          <Route path="/forgot-success" element={<ForgotPassSuccess />} />

          {/* Protected Routes */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["USER", "TRAINER"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Other Routes */}
          <Route path="/workout" element={<Workout />} />
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/strength-training" element={<StrengthTraining />} />
          <Route path="/cardio" element={<Cardio />} />
          <Route path="/flexi-yoga" element={<FlexiYoga />} />
          {SettingsRoutes}
          <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

          {/* Default and Fallback Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;