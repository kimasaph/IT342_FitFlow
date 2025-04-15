import React, { useState, useEffect } from "react";
import { useNavigate, Routes, Route, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";

// MUI Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import FlagIcon from "@mui/icons-material/Flag";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BarChartIcon from "@mui/icons-material/BarChart";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import UserSettings from "./SettingsPages/UserSettings";
import NotificationsSettings from "./SettingsPages/NotificationsSettings";
import AccountPrivacySettings from "./SettingsPages/AccountPrivacySettings";
import SubscriptionPlanSettings from "./SettingsPages/SubscriptionPlanSettings";
import BadgeSettings from "./SettingsPages/BadgeSettings";
import ScheduleSettings from "./SettingsPages/ScheduleSettings";
import StreakSettings from "./SettingsPages/StreakSettings";
import ThemeSettings from "./SettingsPages/ThemeSettings";
import LanguageSettings from "./SettingsPages/LanguageSettings";
import BodyMetricsSettings from "./SettingsPages/BodyMetricsSettings";
import GoalPreferencesSettings from "./SettingsPages/GoalPreferencesSettings";
import WorkoutSettings from "./SettingsPages/WorkoutSettings";
import NutritionSettings from "./SettingsPages/NutritionSettings";
import WaterSettings from "./SettingsPages/WaterSettings";
import RecoverySettings from "./SettingsPages/RecoverySettings";
import HelpSettings from "./SettingsPages/HelpSettings";
import TermsSettings from "./SettingsPages/TermsSettings";
import PrivacySettings from "./SettingsPages/PrivacySettings";
import ContactsSettings from "./SettingsPages/ContactsSettings";

// React Icons (used in Tailwind section)
import { UserCircle, Lock, CalendarCheck2, Bell, SunMoon, Goal, Dumbbell, User, ShieldCheck, MonitorPlay, Globe, Carrot, Activity, Droplet, Bed, LifeBuoy, Handshake, ScrollText, Phone, Podcast, Medal, Flame} from "lucide-react";

// Import images
import fitFlowLogo from "../assets/images/logoFitFlow.png";

const SidebarSettings = () => {
  const [menuItemsState, setMenuItemsState] = useState([
    { text: "Overview", icon: <DashboardIcon />, route: "/dashboard" },
    { text: "Workout", icon: <FitnessCenterIcon />, route: "/workout" },
    { text: "Diet Plan", icon: <RestaurantIcon />, route: "/diet-plan" },
    { text: "Goals", icon: <FlagIcon />, route: "/goals" },
    { text: "My Schedule", icon: <CalendarMonthIcon />, route: "/my-schedule" },
    { text: "Progress", icon: <BarChartIcon />, route: "/progress", hasArrow: true },
  ]);

  const navigate = useNavigate();
  const location = useLocation();
  const [selectedSetting, setSelectedSetting] = useState('');

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    document.title = "Settings | FitFlow";
  }, []);

  useEffect(() => {
    const currentPath = window.location.pathname;
    setMenuItemsState((prevItems) =>
      prevItems.map((item) => ({
        ...item,
        selected: item.route === currentPath,
      }))
    );
  }, []);

  const handleMenuClick = (page, route) => {
    setMenuItemsState((prevItems) =>
      prevItems.map((item) => ({
        ...item,
        selected: item.text === page,
      }))
    );
    navigate(route);
  };

  // Handle settings menu item click
  const handleSettingClick = (settingName) => {
    setSelectedSetting(settingName);
  };

  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: 260,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
            border: "none",
            boxShadow:
              "0px 5px 22px 4px rgba(0,0,0,0.05), 0px 12px 17px 2px rgba(0,0,0,0.08)",
            borderRight: "1px solid rgba(203, 213, 225, 1)",
          },
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0,
            borderBottom: "1px solid rgba(203, 213, 225, 1)",
            pb: 3,
          }}
        >
          <Typography 
            variant="h5" 
            fontWeight="700" 
            color="#1e5fb4" 
            sx={{ fontFamily: "'Outfit', sans-serif" }}
          >
            FitFlow
          </Typography>
          <Box
            component="img"
            src={fitFlowLogo}
            alt="FitFlow Logo"
            sx={{ width: 60, height: 45 }}
          />
        </Box>

        {/* Main Navigation */}
        <List sx={{ flexGrow: 1, p: 2 }}>
          {menuItemsState.map((item) => (
            <ListItem
              key={item.text}
              button
              onClick={() => handleMenuClick(item.text, item.route)}
              sx={{
                borderRadius: 2,
                mb: 1,
                bgcolor: item.selected ? "#12417F" : "transparent",
                "&:hover": {
                  bgcolor: "#12417F",
                  "& .MuiListItemIcon-root": { color: "white" },
                  "& .MuiListItemText-primary": { color: "white" },
                },
                py: 1.5,
              }}
            >
              <ListItemIcon
                sx={{
                  color: item.selected ? "white" : "rgba(100, 116, 139, 1)",
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: 600,
                  fontSize: 16,
                  color: item.selected ? "white" : "rgba(100, 116, 139, 1)",
                  fontFamily: "'Outfit', sans-serif",
                }}
              />
              {item.hasArrow && (
                <ChevronRightIcon sx={{ color: item.selected ? "white" : "rgba(100, 116, 139, 1)" }} />
              )}
            </ListItem>
          ))}
        </List>

        {/* Footer Options */}
        <List sx={{ p: 2 }}>
          <ListItem 
            button 
            onClick={() => {}} 
            sx={{
              borderRadius: 2,
              "&:hover": {
                bgcolor: "#12417f",
                "& .MuiListItemIcon-root": { color: "white" },
                "& .MuiListItemText-primary": { color: "white" },
              }
            }}
          >
            <ListItemIcon sx={{ color: "rgba(100, 116, 139, 1)", minWidth: 40 }}>
              <HelpOutlineIcon />
            </ListItemIcon>
            <ListItemText
              primary="Help"
              primaryTypographyProps={{
                fontWeight: 600,
                fontSize: 16,
                color: "rgba(100, 116, 139, 1)",
                fontFamily: "'Outfit', sans-serif",
              }}
            />
          </ListItem>
          <Divider sx={{ my: 1 }} />
          <ListItem 
            button 
            onClick={handleLogout} 
            sx={{
              borderRadius: 2,
              "&:hover": {
                bgcolor: "#ffe3e0",
                "& .MuiListItemIcon-root": { color: "red" },
                "& .MuiListItemText-primary": { color: "red" },
              }
            }}
          >
            <ListItemIcon sx={{ color: "rgba(100, 116, 139, 1)", minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{
                fontWeight: 600,
                fontSize: 16,
                color: "rgba(100, 116, 139, 1)",
                fontFamily: "'Outfit', sans-serif",
              }}
            />
          </ListItem>
        </List>
      </Drawer>

      {/* Middle Section - Settings */}
      <div className="w-80 border-r border-gray-200 overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6 ml-3">Settings</h2>

          <div className="bg-white rounded-xl p-4 mb-6 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-600 font-bold">Core+</span>
            </div>
            <h3 className="text-lg font-bold mb-1">Accounts Center</h3>
            <p className="text-gray-600 text-xs mb-4">
              Manage your connected experiences and account settings across Core+ technologies.
            </p>

            <div className="space-y-0">
              <div 
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer ${selectedSetting === 'personal-details' ? "bg-blue-100" : "hover:bg-gray-100"}`}
                onClick={() => handleSettingClick('personal-details')}
              >
                <span className={`${selectedSetting === 'personal-details' ? "text-blue-600" : "text-gray-500"}`}>
                  <User size={19} />
                </span>
                <span className="text-gray-600 text-[12px] font-medium">Personal details</span>
              </div>
              <div 
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer ${selectedSetting === 'password' ? "bg-blue-100" : "hover:bg-gray-100"}`}
                onClick={() => handleSettingClick('password')}
              >
                <span className={`${selectedSetting === 'password-and-security' ? "text-blue-600" : "text-gray-500"}`}>
                  <ShieldCheck size={19} />
                </span>
                <span className="text-gray-600 text-[12px] font-medium">Password and security</span>
              </div>
              <div 
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer ${selectedSetting === 'ad-prefs' ? "bg-blue-100" : "hover:bg-gray-100"}`}
                onClick={() => handleSettingClick('ad-prefs')}
              >
                <span className={`${selectedSetting === 'ad-preference' ? "text-blue-600" : "text-gray-500"}`}>
                  <MonitorPlay size={19} />
                </span>
                <span className="text-gray-600 text-[12px] font-medium">Ad preference</span>
              </div>
            </div>

            <button className="text-blue-500 text-[12px] font-bold mt-2">See more in Accounts Center</button>
          </div>

          {/* How You Use FitFlow Section */}
          <div className="mb-6">
            <h3 className="text-gray-500 text-[13px] font-bold mb-2 ml-3">How you use FitFlow</h3>
            <div 
              className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer ${selectedSetting === 'edit-profile' ? "bg-gray-200" : "hover:bg-gray-200"}`}
              onClick={() => handleSettingClick('edit-profile')}
            >
              <UserCircle size={26} />
              <span className="text-sm font-medium">Edit profile</span>
            </div>
            <div 
              className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer ${selectedSetting === 'notifications-settings' ? "bg-gray-200" : "hover:bg-gray-200"}`}
              onClick={() => handleSettingClick('notifications-settings')}
            >
              <Bell size={25} />
              <span className="text-sm font-medium">Notifications</span>
            </div>
          </div>

          {/* App Customization Section */}
          <div className="mb-6">
            <h3 className="text-gray-500 text-[13px] font-bold mb-2 ml-3 mt-[-10px]">App Customization</h3>
            <div 
              className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer ${selectedSetting === 'account-privacy-settings' ? "bg-gray-200" : "hover:bg-gray-200"}`}
              onClick={() => handleSettingClick('account-privacy-settings')}
            >
              <Lock size={25} />
              <span className="text-sm font-medium">Account privacy</span>
            </div>
            <div 
              className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer ${selectedSetting === 'subscription-plan-settings' ? "bg-gray-200" : "hover:bg-gray-200"}`}
              onClick={() => handleSettingClick('subscription-plan-settings')}
            >
              <Podcast size={25} />
              <span className="text-sm font-medium">Subscription plan</span>
            </div>
            <div 
              className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer ${selectedSetting === 'badge-settings' ? "bg-gray-200" : "hover:bg-gray-200"}`}
              onClick={() => handleSettingClick('badge-settings')}
            >
              <Medal size={25} />
              <span className="text-sm font-medium">Badge Management</span>
            </div>
            <div 
              className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer ${selectedSetting === 'schedule-settings' ? "bg-gray-200" : "hover:bg-gray-200"}`}
              onClick={() => handleSettingClick('schedule-settings')}
            >
              <CalendarCheck2 size={25} />
              <span className="text-sm font-medium">Schedule</span>
            </div>
            <div 
              className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer ${selectedSetting === 'streak-settings' ? "bg-gray-200" : "hover:bg-gray-200"}`}
              onClick={() => handleSettingClick('streak-settings')}
            >
              <Flame size={25} />
              <span className="text-sm font-medium">Streak Tracking</span>
            </div>
            <div 
              className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer ${selectedSetting === 'theme-settings' ? "bg-gray-200" : "hover:bg-gray-200"}`}
              onClick={() => handleSettingClick('theme-settings')}
            >
              <SunMoon size={26} />
              <span className="text-sm font-medium">Theme</span>
            </div>
            <div 
              className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer ${selectedSetting === 'language-settings' ? "bg-gray-200" : "hover:bg-gray-200"}`}
              onClick={() => handleSettingClick('language-settings')}
            >
              <Globe size={25} />
              <span className="text-sm font-medium">Language</span>
            </div>
          </div>

          {/* Fitness Personalization */}
          <div className="mb-6">
            <h3 className="text-gray-500 text-[13px] font-bold mb-2 ml-3 mt-[-10px]">Fitness Personalization</h3>
            <div 
              className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer ${selectedSetting === 'body-metric-settings' ? "bg-gray-200" : "hover:bg-gray-200"}`}
              onClick={() => handleSettingClick('body-metric-settings')}
            >
              <Activity size={26} />
              <span className="text-sm font-medium">Body Metrics</span>
            </div>
            <div 
              className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer ${selectedSetting === 'goal-preference-settings' ? "bg-gray-200" : "hover:bg-gray-200"}`}
              onClick={() => handleSettingClick('goal-preference-settings')}
            >
              <Goal size={25} />
              <span className="text-sm font-medium">Goal Preferences</span>
            </div>
            <div 
              className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer ${selectedSetting === 'workout-settings' ? "bg-gray-200" : "hover:bg-gray-200"}`}
              onClick={() => handleSettingClick('workout-settings')}
            >
              <Dumbbell size={25} />
              <span className="text-sm font-medium">Workout Settings</span>
            </div>
            <div 
              className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer ${selectedSetting === 'nutrition-settings' ? "bg-gray-200" : "hover:bg-gray-200"}`}
              onClick={() => handleSettingClick('nutrition-settings')}
            >
              <Carrot size={25} />
              <span className="text-sm font-medium">Nutrition</span>
            </div>
            <div 
              className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer ${selectedSetting === 'water-settings' ? "bg-gray-200" : "hover:bg-gray-200"}`}
              onClick={() => handleSettingClick('water-settings')}
            >
              <Droplet size={25} />
              <span className="text-sm font-medium">Water Tracking</span>
            </div>
            <div 
              className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer ${selectedSetting === 'recovery-settings' ? "bg-gray-200" : "hover:bg-gray-200"}`}
              onClick={() => handleSettingClick('recovery-settings')}
            >
              <Bed size={25} />
              <span className="text-sm font-medium">Recovery</span>
            </div>
          </div>

          {/* More Info and Settings */}
          <div className="mb-0">
            <h3 className="text-gray-500 text-[13px] font-bold mb-2 ml-3 mt-[-10px]">More Info and Support</h3>
            <div 
              className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer ${selectedSetting === 'help-settings' ? "bg-gray-200" : "hover:bg-gray-200"}`}
              onClick={() => handleSettingClick('help-settings')}
            >
              <LifeBuoy size={25} />
              <span className="text-sm font-medium">Help center</span>
            </div>
            <div 
              className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer ${selectedSetting === 'terms-settings' ? "bg-gray-200" : "hover:bg-gray-200"}`}
              onClick={() => handleSettingClick('terms-settings')}
            >
              <Handshake size={25} />
              <span className="text-sm font-medium">Terms</span>
            </div>
            <div 
              className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer ${selectedSetting === 'privacy-settings' ? "bg-gray-200" : "hover:bg-gray-200"}`}
              onClick={() => handleSettingClick('privacy-settings')}
            >
              <ScrollText size={26} />
              <span className="text-sm font-medium">Privacy policy</span>
            </div>
            <div 
              className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer ${selectedSetting === 'contacts-settings' ? "bg-gray-200" : "hover:bg-gray-200"}`}
              onClick={() => handleSettingClick('contacts-settings')}
            >
              <Phone size={25} />
              <span className="text-sm font-medium">Contact</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Content Area Based on Selected Setting */}
      <div className="flex-1 overflow-y-auto">
        {selectedSetting === 'edit-profile' ? (
          <UserSettings onLogout={handleLogout} />
        ) : selectedSetting === 'notifications-settings' ? (
          <NotificationsSettings />
        ) : selectedSetting === 'account-privacy-settings' ? (
          <AccountPrivacySettings />
        ) : selectedSetting === 'subscription-plan-settings' ? (
          <SubscriptionPlanSettings />
        ) : selectedSetting === 'badge-settings' ? (
          <BadgeSettings />
        ) : selectedSetting === 'schedule-settings' ? (
          <ScheduleSettings />
        ) : selectedSetting === 'streak-settings' ? (
          <StreakSettings />
        ) : selectedSetting === 'theme-settings' ? (
          <ThemeSettings />
        ) : selectedSetting === 'language-settings' ? (
          <LanguageSettings />
        ) : selectedSetting === 'body-metric-settings' ? (
          <BodyMetricsSettings />
        ) : selectedSetting === 'goal-preference-settings' ? (
          <GoalPreferencesSettings />
        ) : selectedSetting === 'workout-settings' ? (
          <WorkoutSettings />
        ) : selectedSetting === 'nutrition-settings' ? (
          <NutritionSettings />
        ) : selectedSetting === 'water-settings' ? (
          <WaterSettings />
        ) : selectedSetting === 'recovery-settings' ? (
          <RecoverySettings />
        ) : selectedSetting === 'help-settings' ? (
          <HelpSettings />
        ) : selectedSetting === 'terms-settings' ? (
          <TermsSettings />
        ) : selectedSetting === 'privacy-settings' ? (
          <PrivacySettings />
        ) : selectedSetting === 'contacts-settings' ? (
          <ContactsSettings />
        ) : (
          <div className="p-6">
            <h1 className="text-2xl font-semibold"></h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarSettings;