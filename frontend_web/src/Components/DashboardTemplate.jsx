import {
    AppBar,
    Autocomplete,
    Badge,
    Box,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Modal,
    TextField,
    Toolbar,
    Typography,
  } from "@mui/material";
  import React, { useState, useEffect } from "react"; // Import useEffect
  import { useNavigate } from "react-router-dom"; // Import useNavigate
  
  import BarChartIcon from "@mui/icons-material/BarChart";
  import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
  import ChevronRightIcon from "@mui/icons-material/ChevronRight";
  // MUI Icons
  import DashboardIcon from "@mui/icons-material/Dashboard";
  import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
  import FlagIcon from "@mui/icons-material/Flag";
  import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
  import LogoutIcon from "@mui/icons-material/Logout";
  import NotificationsIcon from "@mui/icons-material/Notifications";
  import RestaurantIcon from "@mui/icons-material/Restaurant";
  import SearchIcon from "@mui/icons-material/Search";
  import SettingsIcon from "@mui/icons-material/Settings";
  
  // Import images
  import avatarWPhoto from "../assets/images/default-profile.png";
  import fitFlowLogo from "../assets/images/logoFitFlow.png";

  
  const Dashboard = ({ children, notifications = [], notificationCount = 0, stopAlarm }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState("Overview"); // Track the current page
    const [menuItemsState, setMenuItemsState] = useState([
      { text: "Overview", icon: <DashboardIcon />, route: "/dashboard" },
      { text: "Workout", icon: <FitnessCenterIcon />, route: "/workout" },
      { text: "Diet Plan", icon: <RestaurantIcon />, route: "/diet-plan" },
      { text: "Goals", icon: <FlagIcon />, route: "/goals" },
      { text: "My Schedule", icon: <CalendarMonthIcon />, route: "/my-schedule" },
      { text: "Progress", icon: <BarChartIcon />, route: "/progress", hasArrow: true },
    ]); // Manage menuItems as state
    const navigate = useNavigate(); // Initialize useNavigate

    const handleLogout = () => {
      // Clear any stored authentication tokens and role
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      sessionStorage.removeItem("token");
    
      // Redirect to login page
      navigate("/login");
    };    

    const features = [
      "Workout Tracker",
      "Goals Tracker",
      "Meal Plan Tracker",
      "Overview",
      "My Schedule",
      "Progress",
      "Help",
    ];

    useEffect(() => {
      const currentPath = window.location.pathname; // Get the current route
      setMenuItemsState((prevItems) =>
        prevItems.map((item) => ({
          ...item,
          selected: item.route === currentPath || (currentPath === "/exercises" && item.route === "/workout"), // Ensure "Workout" is selected on Exercises page
        }))
      );
    }, []); // Run only on component mount

    const handleNotificationClick = () => {
      setModalOpen(true);
    };

    const handleSearchChange = (event) => {
      setSearchQuery(event.target.value);
    };

    const filteredFeatures = features.filter((feature) =>
      feature.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleMenuClick = (page, route) => {
      setCurrentPage(page); // Update the current page
      setMenuItemsState((prevItems) =>
        prevItems.map((item) => ({
          ...item,
          selected: item.text === page, // Ensure only the clicked tab is selected
        }))
      );
      navigate(route); // Navigate to the corresponding route
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
                onClick={() => handleMenuClick(item.text, item.route)} // Single click triggers the function
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  bgcolor: item.selected ? "#12417F" : "transparent", // Set background color to #12417F if selected
                  "&:hover": {
                    bgcolor: "#12417F", // Consistent hover color
                    "& .MuiListItemIcon-root": { color: "white" }, // Change icon color to white
                    "& .MuiListItemText-primary": { color: "white" }, // Change text color to white
                    "& .MuiSvgIcon-root": { color: "white" }, // Change arrow color to white
                  },
                  py: 1.5,
                  width: "100%", // Ensure the background fills the entire tab
                }}
              >
                <ListItemIcon
                  sx={{
                    color: item.selected ? "white" : "rgba(100, 116, 139, 1)", // Use 'selected' to determine icon color
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: 600,
                    fontSize: 16, // Increased font size
                    color: item.selected ? "white" : "rgba(100, 116, 139, 1)", // Use 'selected' to determine text color
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
                bgcolor: "#12417f", // Consistent hover color
                "& .MuiListItemIcon-root": { color: "white" }, // Change icon color to white
                "& .MuiListItemText-primary": { color: "white" }, // Change text color to white
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
                  fontSize: 16, // Increased font size
                  color: "rgba(100, 116, 139, 1)",
                  fontFamily: "'Outfit', sans-serif",
                }}
              />
            </ListItem>
            <Divider sx={{ my: 1 }} />
            <ListItem button onClick={handleLogout} sx={{
              borderRadius: 2,
              "&:hover": {
                bgcolor: "#ffe3e0", // Updated hover background color
                "& .MuiListItemIcon-root": { color: "red" }, // Change icon color to white
                "& .MuiListItemText-primary": { color: "red" }, // Change text color to white
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
                  fontSize: 16, // Increased font size
                  color: "rgba(100, 116, 139, 1)",
                  fontFamily: "'Outfit', sans-serif",
                }}
              />
            </ListItem>
          </List>
        </Drawer>
  
        <Box sx={{ flexGrow: 1 }}>
          <AppBar
            position="static"
            sx={{ bgcolor: "#11407e", boxShadow: "none", height: 135 }}
          >
            <Toolbar
              sx={{ height: "100%", display: "flex", alignItems: "center" }}
            >
              <Box sx={{ ml: 3 }}>
                <Typography
                  variant="caption"
                  sx={{ color: "white", fontWeight: 200, fontFamily: "'Outfit', sans-serif" }}
                >
                  Good Morning
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{ color: "white", fontWeight: 700, opacity: 0.89, fontFamily: "'Outfit', sans-serif" }}
                >
                  Welcome Back!
                </Typography>
              </Box>

              <Box sx={{ flexGrow: 1, mx: 3 }}>
                <Autocomplete
                  freeSolo
                  options={filteredFeatures}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Search"
                      variant="outlined"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <Box
                            sx={{ display: "flex", alignItems: "center", mr: 1 }}
                          >
                            <SearchIcon color="action" />
                          </Box>
                        ),
                      }}
                      sx={{
                        bgcolor: "#f8fafb",
                        borderRadius: 1,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 1,
                          height: 40,
                        },
                      }}
                    />
                  )}
                />
              </Box>
  
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <IconButton onClick={handleNotificationClick}>
                  <Badge badgeContent={notificationCount} color="error">
                    <NotificationsIcon sx={{ color: "white" }} />
                  </Badge>
                </IconButton>
  
                <IconButton onClick={() => navigate("/settings")}>
                  <SettingsIcon sx={{ color: "white" }} />
                </IconButton>
  
                <IconButton sx={{ p: 0 }}>
                  <Box
                    component="img"
                    src={avatarWPhoto}
                    alt="User avatar"
                    sx={{ width: 40, height: 40, borderRadius: "50%" }}
                  />
                </IconButton>
              </Box>
            </Toolbar>
          </AppBar>

          {/* Notification Modal */}
          <Modal
            open={isModalOpen}
            onClose={() => setModalOpen(false)}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "right",
            }}
          >
            <Box
              sx={{
                bgcolor: "white",
                border: "none",
                borderRadius: 2,
                position: "absolute",
                right: 130,
                top: 100,
                p: 4,
                boxShadow: 24,
                width: 250,
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                Notifications
              </Typography>
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <Typography
                    key={notification.id}
                    variant="body2"
                    sx={{ mb: 1 }}
                  >
                    - {notification.message}
                  </Typography>
                ))
              ) : (
                <Typography variant="body2">No new notifications.</Typography>
              )}
            </Box>
          </Modal>
                
    
            {/* Main content area, also a template for all*/}
          <Box>{children}</Box>
        </Box>
      </Box>
    );
  };
  
  export default Dashboard;