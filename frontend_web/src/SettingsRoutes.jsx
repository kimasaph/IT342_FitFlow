// src/SettingsRoutes.jsx
import React from "react";
import { Route } from "react-router-dom";

import UserSettings from "./Components/SettingsPages/UserSettings.jsx";
import SidebarSettings from "./Components/SidebarSettings.jsx";
import NotificationsSettings from "./Components/SettingsPages/NotificationsSettings.jsx";
import AccountPrivacySettings from "./Components/SettingsPages/AccountPrivacySettings.jsx";
import SubscriptionPlanSettings from "./Components/SettingsPages/SubscriptionPlanSettings.jsx";
import BadgeSettings from "./Components/SettingsPages/BadgeSettings.jsx";
import ScheduleSettings from "./Components/SettingsPages/ScheduleSettings.jsx";
import StreakSettings from "./Components/SettingsPages/StreakSettings.jsx";
import ThemeSettings from "./Components/SettingsPages/ThemeSettings.jsx";
import LanguageSettings from "./Components/SettingsPages/LanguageSettings.jsx";
import BodyMetricsSettings from "./Components/SettingsPages/BodyMetricsSettings.jsx";
import GoalPreferencesSettings from "./Components/SettingsPages/GoalPreferencesSettings.jsx";
import WorkoutSettings from "./Components/SettingsPages/WorkoutSettings.jsx";
import NutritionSettings from "./Components/SettingsPages/NutritionSettings.jsx";
import WaterSettings from "./Components/SettingsPages/WaterSettings.jsx";
import RecoverySettings from "./Components/SettingsPages/RecoverySettings.jsx";
import HelpSettings from "./Components/SettingsPages/HelpSettings.jsx";
import TermsSettings from "./Components/SettingsPages/TermsSettings.jsx";
import PrivacySettings from "./Components/SettingsPages/PrivacySettings.jsx";
import ContactsSettings from "./Components/SettingsPages/ContactsSettings.jsx";

const settingsRoutes = [
  <Route key="user" path="/user-settings" element={<UserSettings />} />,
  <Route key="sidebar" path="/sidebar-settings" element={<SidebarSettings />} />,
  <Route key="notifications" path="/notifications-settings" element={<NotificationsSettings />} />,
  <Route key="privacy" path="/account-privacy-settings" element={<AccountPrivacySettings />} />,
  <Route key="subscription" path="/subscription-plan-settings" element={<SubscriptionPlanSettings />} />,
  <Route key="badge" path="/badge-settings" element={<BadgeSettings />} />,
  <Route key="schedule" path="/schedule-settings" element={<ScheduleSettings />} />,
  <Route key="streak" path="/streak-settings" element={<StreakSettings />} />,
  <Route key="theme" path="/theme-settings" element={<ThemeSettings />} />,
  <Route key="language" path="/language-settings" element={<LanguageSettings />} />,
  <Route key="bodymetrics" path="/body-metrics-settings" element={<BodyMetricsSettings />} />,
  <Route key="goalpreferences" path="/goal-preferences-settings" element={<GoalPreferencesSettings />} />,
  <Route key="workoutsettings" path="/workout-settings" element={<WorkoutSettings />} />,
  <Route key="nutrition" path="/nutrition-settings" element={<NutritionSettings />} />,
  <Route key="water" path="/water-settings" element={<WaterSettings />} />,
  <Route key="recovery" path="/recovery-settings" element={<RecoverySettings />} />,
  <Route key="help" path="/help-settings" element={<HelpSettings />} />,
  <Route key="terms" path="/terms-settings" element={<TermsSettings />} />,
  <Route key="privacy" path="/privacy-settings" element={<PrivacySettings />} />,
  <Route key="contacts" path="/contacts-settings" element={<ContactsSettings />} />,
];

export default settingsRoutes;
