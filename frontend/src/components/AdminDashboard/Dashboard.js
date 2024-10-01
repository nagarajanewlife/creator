// frontend/src/components/AdminDashboard.js

import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Grid,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  IconButton,
  Avatar,
  Box,
  CircularProgress,
} from "@mui/material";
import {
  PersonAdd,
  Assignment,
  MonetizationOn,
  Logout,
} from "@mui/icons-material";
import TimesheetForm from "../Timesheet/TimesheetForm";
import TimesheetList from "../Timesheet/TimesheetList";
import EmployeeForm from "../Employee/EmployeeForm";
import EmployeeList from "../Employee/EmployeeList";
import MonthlyEarnings from "../Earnings/MonthlyEarnings";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { animated, useSpring } from "react-spring";
import axios from "axios";

const drawerWidth = 240; // Width of the sidebar

const AdminDashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false); // Check if the user is admin
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [activeMenu, setActiveMenu] = useState("Add New Employee"); // Menu state
  const [anchorEl, setAnchorEl] = useState(null); // Profile menu anchor
  const [profile, setProfile] = useState({}); // Store user profile

  // State to track the active menu item

  // State and handlers for profile menu

  const navigate = useNavigate();

  // Fetch user profile to check if user is admin
  useEffect(() => {
    const fetchUserRole = async () => {
      const user = auth.currentUser;

      if (user) {
        try {
          // Fetch user profile from the backend
          const response = await axios.get(
            `http://localhost:6969/api/users/profile/${user.uid}`
          );
          console.log("Profile Response:", response.data);
          setProfile(response.data); // Set profile details
          if (response.data.role === "admin") {
            setIsAdmin(true); // User is admin
          } else {
            navigate("/unauthorized"); // Redirect if not admin
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          navigate("/login"); // Redirect to login if error occurs
        } finally {
          setIsLoading(false); // Stop loading once the request is complete
        }
      } else {
        navigate("/login"); // Redirect to login if user is not authenticated
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Failed to logout.");
    }
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget); // Open profile menu
  };

  const handleProfileClose = () => {
    setAnchorEl(null); // Close profile menu
  };

  // Animation for the dashboard content
  const props = useSpring({ opacity: 1, from: { opacity: 0 }, delay: 200 });

  // Show a loading message while the profile is being fetched
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // If the user is not admin, show an unauthorized message
  if (!isAdmin) {
    return (
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" gutterBottom>
          You are not authorized to access this page.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/login")}
        >
          Go to Login
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <IconButton onClick={handleProfileClick} color="inherit">
            <Avatar src={profile.photoURL}>
              {profile.displayName?.charAt(0).toUpperCase() || "A"}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem disabled>
              <Typography variant="subtitle1">{profile.displayName}</Typography>
            </MenuItem>
            <MenuItem disabled>
              <Typography variant="body2">Role: {profile.role}</Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Logout fontSize="small" sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Drawer (Side Navigation) */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {/* Add New Employee */}
            <ListItem
              style={{
                cursor: "pointer",
                background:
                  activeMenu === "Add New Employee" ? "lightgray" : null,
              }}
              button
              selected={activeMenu === "Add New Employee"}
              onClick={() => handleMenuClick("Add New Employee")}
            >
              <ListItemIcon>
                <PersonAdd />
              </ListItemIcon>
              <ListItemText primary="Add New Employee" />
            </ListItem>

            {/* Submit Timesheet */}
            <ListItem
              button
              style={{
                cursor: "pointer",

                background:
                  activeMenu === "Submit Timesheet" ? "lightgray" : null,
              }}
              selected={activeMenu === "Submit Timesheet"}
              onClick={() => handleMenuClick("Submit Timesheet")}
            >
              <ListItemIcon>
                <Assignment />
              </ListItemIcon>
              <ListItemText primary="Submit Timesheet" />
            </ListItem>

            {/* Earnings */}
            <ListItem
              button
              style={{
                cursor: "pointer",

                background: activeMenu === "Earnings" ? "lightgray" : null,
              }}
              selected={activeMenu === "Earnings"}
              onClick={() => handleMenuClick("Earnings")}
            >
              <ListItemIcon>
                <MonetizationOn />
              </ListItemIcon>
              <ListItemText primary="Earnings" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" style={{ marginLeft: 12 }}>
        <Toolbar />
        <animated.div style={props}>
          {/* Conditional Rendering Based on Active Menu */}
          {activeMenu === "Add New Employee" && (
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography variant="h5" gutterBottom>
                  Add New Employee
                </Typography>
                <EmployeeForm />
                <Typography variant="h5" gutterBottom>
                  All Employees
                </Typography>
                <EmployeeList />
              </Grid>
            </Grid>
          )}

          {activeMenu === "Submit Timesheet" && (
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography variant="h5" gutterBottom>
                  Submit Timesheet
                </Typography>
                <TimesheetForm />
                <Typography variant="h5" gutterBottom>
                  All Timesheets
                </Typography>
                <TimesheetList />
              </Grid>
            </Grid>
          )}

          {activeMenu === "Earnings" && (
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography variant="h5" gutterBottom>
                  Monthly Earnings
                </Typography>
                <MonthlyEarnings />
              </Grid>
            </Grid>
          )}

          {/* Additional Sections */}
          {/* <Grid container spacing={4} sx={{ mt: 4 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom>
                All Timesheets
              </Typography>
              <TimesheetList />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom>
                All Employees
              </Typography>
              <EmployeeList />
            </Grid>
          </Grid> */}
        </animated.div>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
