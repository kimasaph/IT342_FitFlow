import {
    Box,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
  } from "@mui/material";
  import React, { useState, useEffect } from "react";
  import { useNavigate } from "react-router-dom";
  
  import BarChartIcon from "@mui/icons-material/BarChart";
  import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
  import ChevronRightIcon from "@mui/icons-material/ChevronRight";
  import DashboardIcon from "@mui/icons-material/Dashboard";
  import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
  import FlagIcon from "@mui/icons-material/Flag";
  import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
  import LogoutIcon from "@mui/icons-material/Logout";
  import RestaurantIcon from "@mui/icons-material/Restaurant";
  
  // Import images
  import fitFlowLogo from "../assets/images/logoFitFlow.png";
  
  const DashboardSimple = ({ children }) => {
    const [currentPage, setCurrentPage] = useState("Overview");
    const [menuItemsState, setMenuItemsState] = useState([
      { text: "Overview", icon: <DashboardIcon />, route: "/dashboard" },
      { text: "Workout", icon: <FitnessCenterIcon />, route: "/workout" },
      { text: "Diet Plan", icon: <RestaurantIcon />, route: "/diet-plan" },
      { text: "Goals", icon: <FlagIcon />, route: "/goals" },
      { text: "My Schedule", icon: <CalendarMonthIcon />, route: "/my-schedule" },
      { text: "Progress", icon: <BarChartIcon />, route: "/progress", hasArrow: true },
    ]);
    const navigate = useNavigate();
  
    const handleLogout = () => {
      // Clear any stored authentication tokens
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
    
      // Redirect to login page
      navigate("/login");
    };    
  
    useEffect(() => {
      const currentPath = window.location.pathname;
      setMenuItemsState((prevItems) =>
        prevItems.map((item) => ({
          ...item,
          selected: item.route === currentPath || (currentPath === "/exercises" && item.route === "/workout"),
        }))
      );
    }, []);
  
    const handleMenuClick = (page, route) => {
      setCurrentPage(page);
      setMenuItemsState((prevItems) =>
        prevItems.map((item) => ({
          ...item,
          selected: item.text === page,
        }))
      );
      navigate(route);
    };
  
    return (
      <Box sx={{ display: "flex", bgcolor: "#ffffff", width: "100%" }}>
        {/* Sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            width: 240,
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
                    "& .MuiSvgIcon-root": { color: "white" },
                  },
                  py: 1.5,
                  width: "100%",
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
  
          <List sx={{ p: 2 }}>
            <ListItem button onClick={() => {}} sx={{
              borderRadius: 2,
              "&:hover": {
                bgcolor: "#12417f",
                "& .MuiListItemIcon-root": { color: "white" },
                "& .MuiListItemText-primary": { color: "white" },
              }
            }}>
              <ListItemIcon
                sx={{ color: "rgba(100, 116, 139, 1)", minWidth: 40 }}
              >
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
            <ListItem button onClick={handleLogout} sx={{
              borderRadius: 2,
              "&:hover": {
                bgcolor: "#ffe3e0",
                "& .MuiListItemIcon-root": { color: "red" },
                "& .MuiListItemText-primary": { color: "red" },
              }
            }}>
              <ListItemIcon
                sx={{ color: "rgba(100, 116, 139, 1)", minWidth: 40 }}
              >
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
  
        {/* Main content area, also a template for all*/}
        <Box sx={{ flexGrow: 1 }}>
          {children}
        </Box>
      </Box>
    );
  };
  
  export default DashboardSimple;