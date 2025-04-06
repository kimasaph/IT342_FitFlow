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
];

export default settingsRoutes;
