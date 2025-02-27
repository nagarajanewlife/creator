import React, { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { auth } from "../components/firebase"; // Firebase config
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import axios from "axios";
import { DashboardContext } from "./DashboardContext";

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Button,
  Box,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Divider } from "@mui/material";

import MoreVert from "@mui/icons-material/MoreHoriz";
import { Edit, Delete, ContentCopy, Info, Block } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import GridViewIcon from "@mui/icons-material/GridView";
import EditCalendarOutlinedIcon from "@mui/icons-material/EditCalendarOutlined";
import {
  Build as SolutionsIcon,
  DataUsage as MicroservicesIcon,
  CloudUpload as DeployIcon,
  Storage as EnvironmentsIcon,
  PhoneIphone as MobileIcon,
  Dashboard as PortalIcon,
  Group as UsersIcon,
  AccountTree as OrganizationIcon,
  Policy as GovernanceIcon,
  Assessment as MetricsIcon,
  ManageAccounts as OperationsIcon,
  AttachMoney as BillingIcon,
} from "@mui/icons-material";

import CloseIcon from "@mui/icons-material/Close";
import AppsIcon from "@mui/icons-material/Apps";
import BarChartIcon from "@mui/icons-material/BarChart";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";
import SelectAllIcon from "@mui/icons-material/SelectAll";
import { useSpring, animated } from "@react-spring/web";
import Creatorimg from "./images/edit.png";
import ApplicationCrate from "./ApplicationCreatePopup";
import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";

// Custom Hook for handling the hover animation of each card
const useCardHoverAnimation = (hoveredCard, cardName) => {
  const cardSpring = useSpring({
    transform: hoveredCard === cardName ? "scale(1.05)" : "scale(1)", // Scale on hover
    border:
      hoveredCard === cardName ? "2px solid #295bf9" : "2px solid transparent", // Border color on hover
    config: { tension: 200, friction: 10 },
  });

  const iconSpring = useSpring({
    transform: hoveredCard === cardName ? "scale(0.85)" : "scale(1)", // Icon size on hover
    config: { tension: 250, friction: 15 },
  });

  return { cardSpring, iconSpring };
};

const avatarColors = ["#27274A", "#1a73e8", "#fbbc05", "#34a853", "#ea4335"];
const getRandomAvatarColor = () => {
  const randomIndex = Math.floor(Math.random() * avatarColors.length); // Get a random index between 0 and 4
  return avatarColors[randomIndex];
};
export default function Dashboard() {
  const [uid, setUid] = useState(null);
  const [user, setUser] = useState(null); // Store user details
  const [dashName, setDashName] = useState("");
  const [dashapps, setDashApps] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // For search
  const [open, setOpen] = useState(false); // For dashboard creation dialog
  const [anchorEl, setAnchorEl] = useState(null); // For profile menu popup
  const [appAnchorEl, setAppAnchorEl] = useState(null); // For app-specific menu
  const [selectedApp, setSelectedApp] = useState(null); // Store selected app for menu options
  const [selectedDashboard, setSelectedDashboard] = useState(null);
  const [activeItem, setActiveItem] = useState(null); // State for active menu item
  const [hoveredCard, setHoveredCard] = useState(null); // Track the hovered card
  const [openApp, setOpenApp] = useState(false); // For dashboard creation dialog
  const [openAppName, setOpenAppName] = useState(false); // For dashboard creation dialog
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const handleSelect = (label) => {
    // For dashboard creation dialog
    switch (label) {
      case "Applications":
        setOpenApp(true); // Call setOpenApp to open the dialog
        break;
      case "Create from scratch":
        setOpenAppName(true);
        break;

      // Add other cases here if needed
      default:
        console.log("No matching case for: " + label);
    }

    console.log(`${label} selected`);
  };

  const [avatarColor, setAvatarColor] = useState(getRandomAvatarColor());
  useEffect(() => {
    const interval = setInterval(() => {
      setAvatarColor(getRandomAvatarColor()); // Change the avatar color every 3 seconds
    }, 3000);

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, []);

  const navigate = useNavigate();
  const handleCardClick = (id, dashName) => {
    navigate(`/Playground?id=${id}&dashName=${dashName}`);
  };
  const menuItems = [
    { id: 1, text: "Develop", isHeader: true },
    { id: 2, text: "Solutions", icon: <SolutionsIcon /> },
    { id: 3, text: "Microservices", icon: <MicroservicesIcon /> },
    { id: 4, text: "Deploy", isHeader: true },
    { id: 5, text: "Environments", icon: <EnvironmentsIcon /> },
    { id: 6, text: "Mobile", icon: <MobileIcon /> },
    { id: 7, text: "Portal", icon: <PortalIcon /> },
    { id: 8, text: "Manage", isHeader: true },
    { id: 9, text: "Users", icon: <UsersIcon /> },
    { id: 10, text: "Organization", icon: <OrganizationIcon /> },
    { id: 11, text: "Governance", icon: <GovernanceIcon /> },
    { id: 12, text: "Metrics", icon: <MetricsIcon /> },
    { id: 13, text: "Operations", icon: <OperationsIcon /> },
    { id: 14, text: "Billing", icon: <BillingIcon /> },
  ];

  // Fetch user data from Firebase Auth on component load
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      setUid(currentUser.uid);
    } else {
      navigate("/"); // Redirect to login if user not authenticated
    }
  }, [navigate]);

  useEffect(() => {
    if (user?.uid) {
      getApplication();
    }
  }, [user?.uid]); // user?.uid update ஆனபோது மட்டும் API call செய்யும்

  const getApplication = useCallback(() => {
    axios
      .get(`${REACT_APP_BACKEND_URL}dashboardApplication/${user?.uid}`)
      .then((response) => {
        setDashApps(response.data);
        setFilteredApps(response.data);
      })
      .catch((error) => {
        console.error("Error getting dashboard Apps:", error);
      });
  }, [user?.uid]); // user?.uid update ஆனால் மட்டும் function recreate ஆகும்

  useEffect(() => {
    getApplication();
  }, [getApplication]);

  const handleMenuItemClick = (id) => {
    setActiveItem(id); // Set the clicked item as active
  };
  // Handle search filter
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = dashapps.filter((app) =>
      app.dashName.toLowerCase().includes(query)
    );
    setFilteredApps(filtered);
  };

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        navigate("/"); // Redirect to login page after logout
      })
      .catch((error) => {
        console.error("Error during logout: ", error);
      });
  };

  const handleCreateDashboard = () => {
    if (!dashName) {
      alert("Please enter a dashboard name!");
      return;
    }

    const sendData = { uid: uid, dashName: dashName };
    axios
      .post(`${REACT_APP_BACKEND_URL}createDashboard`, sendData)
      .then((response) => {
        alert("Dashboard created successfully!");
        setFormNameC(dashName);
        setOpen(false);
        setDashName("");
        getApplication(); // Refresh the list
        const editUrl = `/appbuilder/${user?.displayName}/${dashName}/edit`;
        window.location.href = editUrl;
      })
      .catch((error) => {
        console.error("Error creating dashboard:", error);
        alert("Error creating dashboard.");
      });
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDashName("");
  };
  const handleCloseApp = () => {
    setOpenApp(false);
    setOpen(false);
    setDashName("");
  };

  const handleCloseAppName = () => {
    setOpenApp(false);
    setOpenAppName(false);
    setOpen(false);
    setDashName("");
  };
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAppMenuOpen = (event, app) => {
    setAppAnchorEl(event.currentTarget);
    setSelectedApp(app);
  };

  const handleAppMenuClose = () => {
    setAppAnchorEl(null);
  };

  // use
  const { formNameC, setFormNameC } = useContext(DashboardContext);

  // Function to get color based on app index or ID
  const getAvatarColor = (index) => avatarColors[index % avatarColors.length];

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* AppBar with custom background */}
      <AppBar
        position="static"
        sx={{ backgroundColor: "#27274A", height: "48px" }}
      >
        <Toolbar>
          {/* Left side: Logo */}
          <Typography
            variant="h7"
            component="div"
            sx={{ flexGrow: 1, marginBottom: 2 }}
          >
            Wohozo Creator
          </Typography>

          {/* Right side: Profile */}
          {user && (
            <div>
              <IconButton
                edge="end"
                aria-controls="profile-menu"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
                style={{ marginBottom: 12 }}
              >
                <Avatar
                  alt={user.displayName}
                  src={user.photoURL}
                  style={{
                    width: 35,
                    height: 35,
                    backgroundColor: avatarColor,
                  }}
                />
              </IconButton>

              {/* Profile menu */}
              <Menu
                id="profile-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MenuItem disabled>Name: {user.displayName || "N/A"}</MenuItem>
                <MenuItem disabled>Email: {user.email}</MenuItem>
                <MenuItem disabled>UID: {user.uid}</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>

      {/* Main content */}
      <Box sx={{ display: "flex", position: "fixed" }}>
        {/* side menu */}
        <Drawer
          variant="permanent"
          sx={{
            width: 240,
            position: "initial",
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: 225,
              backgroundColor: "#f7f8fc",
              padding: "20px 0",
              marginTop: "48px",
            },
          }}
        >
          <List>
            {menuItems.map((item) =>
              item.isHeader ? (
                <ListItem key={item.id} disablePadding>
                  <Typography
                    sx={{
                      padding: "10px 16px",
                      color: "#222326",
                      fontWeight: "bold",
                      fontSize: "12px",
                      textTransform: "uppercase",
                      lineHeight: "18px",
                    }}
                  >
                    {item.text}
                  </Typography>
                </ListItem>
              ) : (
                <ListItem
                  button
                  key={item.id}
                  component={Link} // Use Link for navigation
                  to={`/userhome/${user?.displayName}/admindashboard#/${item?.text}`} // Navigate to the corresponding path
                  onClick={() => handleMenuItemClick(item.id)}
                  sx={{
                    backgroundColor:
                      activeItem === item.id ? "#e7edff" : "transparent",
                    "&:hover": {
                      backgroundColor: "#e7edff",
                    },
                    marginLeft: "20px",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: activeItem === item.id ? "#295bf9" : "#222326",
                      fontSize: "0.75rem",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      color: activeItem === item.id ? "#295bf9" : "#222326",
                    }}
                  />
                </ListItem>
              )
            )}
          </List>
        </Drawer>

        <Box
          component="main"
          sx={{ flexGrow: 1, backgroundColor: "white", padding: "2px" }}
        >
          {/* Main content goes here */}
          {filteredApps.length > 0 ? (
            <AppBar
              position="static"
              sx={{ backgroundColor: "white", boxShadow: "none" }}
            >
              <Toolbar>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ flexGrow: 1, color: "black" }}
                >
                  Welcome ,{user?.displayName}
                </Typography>
                {/* Search Box */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginRight: "20px",
                  }}
                >
                  <SearchIcon />
                  <TextField
                    variant="outlined"
                    placeholder="Search..."
                    size="small"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    sx={{ marginLeft: 1, backgroundColor: "white" }} // Light gray background for search box
                  />
                </Box>
                {/* Profile Avatar */}
                {user && (
                  <Button
                    variant="contained"
                    onClick={handleOpen}
                    startIcon={<AddIcon />}
                    sx={{
                      backgroundColor: "#295bf9",
                      color: "white",
                      textTransform: "none", // Disable uppercase transformation
                      padding: "10px 20px", // Adjust padding for button size
                      "&:hover": {
                        backgroundColor: "#1a46d0", // Darker shade on hover
                      },
                    }}
                  >
                    Create Solution
                  </Button>
                )}
              </Toolbar>
            </AppBar>
          ) : null}
          <Box
            container
            spacing={2}
            sx={{
              marginTop: "20px",
              overflowY: "auto", // Enable vertical scrolling
              maxHeight: "700px", // Set the maximum height for the scroll area
              paddingRight: "10px", // Add padding for better scroll bar visibility
              "&::-webkit-scrollbar": {
                width: "8px", // Customize scrollbar width for Webkit browsers
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#888", // Customize scrollbar color
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#555", // Customize scrollbar color on hover
              },
            }}
          >
            {/* Button for creating a new application */}
            {filteredApps.length > 0 ? null : (
              <Box
                sx={{
                  height: "100vh", // Full screen height
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  backgroundColor: "white", // Light gray background
                  padding: "0px",
                }}
              >
                {/* Image */}

                <Box
                  component="img"
                  src={Creatorimg} // Replace with your image path
                  alt="Center Image"
                  sx={{
                    width: "200px", // Adjust as needed
                    height: "auto",
                  }}
                />

                {/* Title Text */}
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 400,
                    lineHeight: 1.25,
                    fontFamily: "LatoWeb", // Ensure you have this font available
                    marginBottom: "10px",
                  }}
                >
                  Start building your solution
                </Typography>

                {/* Paragraph Text */}
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 400,
                    lineHeight: 1.5,
                    fontFamily: "LatoWeb",
                    color: "#555", // A soft gray color for the paragraph
                    maxWidth: "500px", // To limit the paragraph width
                    marginBottom: "20px",
                  }}
                >
                  Solution is a suite of low-code tools to build applications,
                  analyze data, and automate business processes.
                </Typography>

                {/* Button */}
                <Button
                  variant="contained"
                  onClick={handleOpen}
                  startIcon={<AddIcon />}
                  sx={{
                    backgroundColor: "#295bf9",
                    color: "white",
                    textTransform: "none", // Disable uppercase transformation
                    padding: "10px 20px", // Adjust padding for button size
                    "&:hover": {
                      backgroundColor: "#1a46d0", // Darker shade on hover
                    },
                  }}
                >
                  Create Solution
                </Button>
              </Box>
            )}
            {/* Grid of Dashboard Applications */}
            <Grid container spacing={2} sx={{ marginTop: "20px" }}>
              {filteredApps.length > 0
                ? filteredApps.map((app, index) => (
                    <Grid item key={app._id} xs={12} sm={6} md={4}>
                      <Card
                        sx={{
                          width: "90%", // Set width to 100% to make sure it fits the grid
                          height: "200px",
                          position: "relative",
                          borderRadius: "16px",
                          padding: "12px",
                          border: "1px solid transparent", // Initial border
                          "&:hover": {
                            borderColor: "#295bf9", // Change border color on hover
                            backgroundColor: "#e7edff", // Change background color on hover
                          },
                        }}
                        onClick={() => handleCardClick(app._id, app.dashName)} // Navigate to Playground with parameters
                      >
                        <CardActions
                          sx={{
                            justifyContent: "space-between",
                            position: "relative",
                            bottom: 0,
                            left: 0,
                            right: 0,
                          }}
                        >
                          <Box>
                            <Avatar
                              sx={{
                                backgroundColor: getAvatarColor(index),
                                width: 50,
                                height: 50,
                                borderRadius: "13px",
                                marginBottom: "12px",
                              }}
                            >
                              {app.dashName.charAt(0)}
                            </Avatar>
                            <Typography component="div">
                              {app?.dashName}
                            </Typography>
                            <Typography variant="caption" component="div">
                              {"Created on  " +
                                new Date(app?.createdAt).toLocaleDateString()}
                            </Typography>
                          </Box>

                          {/* The modified IconButton with event propagation control */}
                          <IconButton
                            style={{ marginBottom: 80 }}
                            onClick={(event) => {
                              event.stopPropagation(); // Prevents the Card's onClick from firing
                              handleAppMenuOpen(event, app); // Opens the app menu
                            }}
                          >
                            <MoreVert />
                          </IconButton>
                        </CardActions>
                        <CardContent></CardContent>

                        <Button
                          onClick={() => handleCardClick(app._id, app.dashName)}
                          sx={{
                            fontSize: "12px", // Reduce font size
                            textTransform: "none", // Keep text as is (remove uppercase transformation)
                            padding: "6px 12px",
                            marginRight: "155px",
                          }}
                        >
                          <GridViewIcon
                            sx={{
                              fontSize: "16px", // Adjust icon size
                              marginRight: "2px", // Add space between icon and text
                            }}
                          />
                          Application
                        </Button>
                        <Button
                          onClick={() => handleCardClick(app._id, app.dashName)}
                          sx={{
                            fontSize: "12px", // Reduce font size
                            textTransform: "none", // Keep text as is (remove uppercase transformation)
                            // padding: "6px 12px", // Adjust padding if needed
                          }}
                        >
                          <EditOutlinedIcon
                            sx={{
                              fontSize: "16px", // Adjust icon size
                              // marginRight: "4px", // Add space between icon and text
                            }}
                          />
                          Edit
                        </Button>
                      </Card>
                    </Grid>
                  ))
                : null}
            </Grid>
            {/* App-specific menu */}
            <Menu
              anchorEl={appAnchorEl}
              open={Boolean(appAnchorEl)}
              onClose={handleAppMenuClose}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem>
                <ContentCopy fontSize="small" sx={{ marginRight: 1 }} />
                Duplicate
              </MenuItem>
              <MenuItem>
                <Info fontSize="small" sx={{ marginRight: 1 }} />
                Summary
              </MenuItem>
              <MenuItem>
                <Block fontSize="small" sx={{ marginRight: 1 }} />
                Disable
              </MenuItem>
              <MenuItem>
                <Delete fontSize="small" sx={{ marginRight: 1 }} />
                Delete
              </MenuItem>
            </Menu>
            {/* Dialog for creating a new dashboard */}
            <Dialog
              open={open}
              onClose={handleClose}
              fullScreen
              sx={{
                "& .MuiDialog-paper": {
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#f7f8fc",
                },
              }}
            >
              <DialogTitle sx={{ position: "absolute", top: 0, right: 0 }}>
                <IconButton
                  aria-label="close"
                  onClick={handleClose}
                  sx={{
                    color: (theme) => theme.palette.grey[500],
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>

              <DialogContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <Typography variant="h4" sx={{ marginBottom: "84px" }}>
                  What kind of solution are you looking for?
                </Typography>

                <Grid container spacing={4} justifyContent="center">
                  {/* Applications Card */}
                  <Grid item xs={12} sm={4}>
                    <animated.div
                      // style={cardSpring}
                      onMouseEnter={() => setHoveredCard("Applications")}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <Box
                        sx={{
                          width: "380px",
                          height: "274px",
                          textAlign: "center",
                          borderRadius: "16px",
                          backgroundColor: "#fff",

                          cursor: "pointer",
                          padding: "16px",
                          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                          position: "relative",
                        }}
                      >
                        <animated.div
                          style={{
                            position: "absolute",
                            top: "-32px",
                            left: "45%",
                            transform: "translateX(-50%)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#295bf9",
                            borderRadius: "50%",
                            padding: "16px",
                            border: "2px solid #295bf9",
                            width: "30px",
                            height: "30px",
                            transform: "rotate(45deg)",
                          }}
                        >
                          <animated.div>
                            <AppsIcon
                              sx={{ color: "white", fontSize: "32px" }}
                            />
                          </animated.div>
                        </animated.div>

                        <Typography
                          variant="h6"
                          sx={{ marginTop: "40px", fontSize: "18px" }}
                        >
                          Application
                          <br></br>
                          <p style={{ fontSize: "16px" }}>
                            Create mobile and web apps to handle simple tasks
                            and complex automations
                          </p>
                        </Typography>

                        <Button
                          variant="contained"
                          onClick={() => handleSelect("Applications")}
                          startIcon={
                            <SelectAllIcon sx={{ fontSize: "58px" }} />
                          }
                          sx={{
                            marginTop: "16px",
                            backgroundColor: "#295bf9",
                            "&:hover": {
                              backgroundColor: "#1a46d0",
                            },
                          }}
                        >
                          Select
                        </Button>
                      </Box>
                    </animated.div>
                  </Grid>

                  {/* BI & Analytics Card */}
                  <Grid item xs={12} sm={4}>
                    <animated.div
                      // style={cardSpring}
                      onMouseEnter={() => setHoveredCard("BI & Analytics")}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <Box
                        sx={{
                          width: "380px",
                          height: "274px",
                          textAlign: "center",
                          borderRadius: "16px",
                          backgroundColor: "#fff",

                          cursor: "pointer",
                          padding: "16px",
                          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                          position: "relative",
                        }}
                      >
                        <animated.div
                          style={{
                            position: "absolute",
                            top: "-32px",
                            left: "45%",
                            transform: "translateX(-50%)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#295bf9",
                            borderRadius: "50%",
                            padding: "16px",
                            border: "2px solid #295bf9",
                            width: "30px",
                            height: "30px",
                            transform: "rotate(45deg)",
                          }}
                        >
                          <animated.div>
                            <BarChartIcon
                              sx={{ color: "white", fontSize: "32px" }}
                            />
                          </animated.div>
                        </animated.div>

                        <Typography
                          variant="h6"
                          sx={{ marginTop: "40px", fontSize: "18px" }}
                        >
                          BI & Analytics
                          <br></br>
                          <p style={{ fontSize: "16px" }}>
                            Unify data from multiple sources to create
                            interactive and insightful reports
                          </p>
                        </Typography>

                        <Button
                          variant="contained"
                          onClick={() => handleSelect("BI & Analytics")}
                          startIcon={
                            <SelectAllIcon sx={{ fontSize: "58px" }} />
                          }
                          sx={{
                            marginTop: "16px",
                            backgroundColor: "#295bf9",
                            "&:hover": {
                              backgroundColor: "#1a46d0",
                            },
                          }}
                        >
                          Select
                        </Button>
                      </Box>
                    </animated.div>
                  </Grid>

                  {/* Integration Flow Card */}
                  <Grid item xs={12} sm={4}>
                    <animated.div
                      // style={cardSpring}
                      onMouseEnter={() => setHoveredCard("Integration Flow")}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <Box
                        sx={{
                          width: "380px",
                          height: "274px",
                          textAlign: "center",
                          borderRadius: "16px",
                          backgroundColor: "#fff",

                          cursor: "pointer",
                          padding: "16px",
                          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                          position: "relative",
                        }}
                      >
                        <animated.div
                          style={{
                            position: "absolute",
                            top: "-32px",
                            left: "45%",
                            transform: "translateX(-50%)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#295bf9",
                            borderRadius: "50%",
                            padding: "16px",
                            border: "2px solid #295bf9",
                            width: "30px",
                            height: "30px",
                            transform: "rotate(45deg)",
                          }}
                        >
                          <animated.div>
                            <IntegrationInstructionsIcon
                              sx={{ color: "white", fontSize: "32px" }}
                            />
                          </animated.div>
                        </animated.div>

                        <Typography
                          variant="h6"
                          sx={{ marginTop: "40px", fontSize: "18px" }}
                        >
                          Integration Flow
                          <br></br>
                          <p style={{ fontSize: "16px" }}>
                            Create efficient workflow automation that connects
                            to hundreds of popular cloud apps.
                          </p>
                        </Typography>

                        <Button
                          variant="contained"
                          onClick={() => handleSelect("Integration Flow")}
                          startIcon={
                            <SelectAllIcon sx={{ fontSize: "58px" }} />
                          }
                          sx={{
                            marginTop: "16px",
                            backgroundColor: "#295bf9",
                            "&:hover": {
                              backgroundColor: "#1a46d0",
                            },
                          }}
                        >
                          Select
                        </Button>
                      </Box>
                    </animated.div>
                  </Grid>
                </Grid>
              </DialogContent>
            </Dialog>
            {/* create application popup */}
            <Dialog
              open={openApp}
              onClose={handleClose}
              fullScreen
              sx={{
                "& .MuiDialog-paper": {
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#f7f8fc",
                },
              }}
            >
              <DialogTitle sx={{ position: "absolute", top: 0, right: 0 }}>
                <IconButton
                  aria-label="close"
                  onClick={handleCloseApp}
                  sx={{
                    color: (theme) => theme.palette.grey[500],
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>

              <DialogContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <Typography variant="h4" sx={{ marginBottom: "84px" }}>
                  Create new application
                </Typography>

                <Grid container spacing={4} justifyContent="center">
                  {/* Applications Card */}
                  <Grid item xs={12} sm={4}>
                    <animated.div
                      // style={cardSpring}
                      onMouseEnter={() => setHoveredCard("Create from scratch")}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <Box
                        sx={{
                          width: "380px",
                          height: "274px",
                          textAlign: "center",
                          borderRadius: "16px",
                          backgroundColor: "#fff",

                          cursor: "pointer",
                          padding: "16px",
                          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                          position: "relative",
                        }}
                      >
                        <animated.div
                          style={{
                            position: "absolute",
                            top: "-32px",
                            left: "45%",
                            transform: "translateX(-50%)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#295bf9",
                            borderRadius: "50%",
                            padding: "16px",
                            border: "2px solid #295bf9",
                            width: "30px",
                            height: "30px",
                            transform: "rotate(45deg)",
                          }}
                        >
                          <animated.div>
                            <IntegrationInstructionsIcon
                              sx={{ color: "white", fontSize: "32px" }}
                            />
                          </animated.div>
                        </animated.div>

                        <Typography
                          variant="h6"
                          sx={{ marginTop: "40px", fontSize: "18px" }}
                        >
                          Create from scratch
                          <br></br>
                          <p style={{ fontSize: "16px" }}>
                            Create a new application for your business needs.
                          </p>
                        </Typography>

                        <Button
                          variant="contained"
                          onClick={() => handleSelect("Create from scratch")}
                          startIcon={
                            <SelectAllIcon sx={{ fontSize: "58px" }} />
                          }
                          sx={{
                            marginTop: "16px",
                            backgroundColor: "#295bf9",
                            "&:hover": {
                              backgroundColor: "#1a46d0",
                            },
                          }}
                        >
                          Create
                        </Button>
                      </Box>
                    </animated.div>
                  </Grid>

                  {/* BI & Analytics Card */}
                  <Grid item xs={12} sm={4}>
                    <animated.div
                      // style={cardSpring}
                      onMouseEnter={() => setHoveredCard("Create from gallery")}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <Box
                        sx={{
                          width: "380px",
                          height: "274px",
                          textAlign: "center",
                          borderRadius: "16px",
                          backgroundColor: "#fff",

                          cursor: "pointer",
                          padding: "16px",
                          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                          position: "relative",
                        }}
                      >
                        <animated.div
                          style={{
                            position: "absolute",
                            top: "-32px",
                            left: "45%",
                            transform: "translateX(-50%)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#295bf9",
                            borderRadius: "50%",
                            padding: "16px",
                            border: "2px solid #295bf9",
                            width: "30px",
                            height: "30px",
                            transform: "rotate(45deg)",
                          }}
                        >
                          <animated.div>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "70px", // Define the width of the circle
                                height: "70px", // Define the height of the circle
                                backgroundColor: "#295bf9", // Set the background color for the circle
                                borderRadius: "50%", // Makes the box a perfect circle
                                border: "2px solid #fff", // White border around the circle
                              }}
                            >
                              <CollectionsOutlinedIcon
                                sx={{ color: "white", fontSize: "32px" }}
                              />
                            </Box>
                          </animated.div>
                        </animated.div>

                        <Typography
                          variant="h6"
                          sx={{ marginTop: "40px", fontSize: "18px" }}
                        >
                          Create from gallery
                          <br></br>
                          <p style={{ fontSize: "16px" }}>
                            Pick a pre-built application that suits your
                            requirement.
                          </p>
                        </Typography>

                        <Button
                          variant="contained"
                          onClick={() => handleSelect("Create from gallery")}
                          startIcon={
                            <SelectAllIcon sx={{ fontSize: "58px" }} />
                          }
                          sx={{
                            marginTop: "16px",
                            backgroundColor: "#295bf9",
                            "&:hover": {
                              backgroundColor: "#1a46d0",
                            },
                          }}
                        >
                          Pick
                        </Button>
                      </Box>
                    </animated.div>
                  </Grid>

                  {/* Integration Flow Card */}
                  <Grid item xs={12} sm={4}>
                    <animated.div
                      // style={cardSpring}
                      onMouseEnter={() => setHoveredCard("Import from file")}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <Box
                        sx={{
                          width: "380px",
                          height: "274px",
                          textAlign: "center",
                          borderRadius: "16px",
                          backgroundColor: "#fff",

                          cursor: "pointer",
                          padding: "16px",
                          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                          position: "relative",
                        }}
                      >
                        <animated.div
                          style={{
                            position: "absolute",
                            top: "-32px",
                            left: "45%",
                            transform: "translateX(-50%)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#295bf9",
                            borderRadius: "50%",
                            padding: "16px",
                            border: "2px solid #295bf9",
                            width: "30px",
                            height: "30px",
                            transform: "rotate(45deg)",
                          }}
                        >
                          <animated.div>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "70px", // Define the width of the circle
                                height: "70px", // Define the height of the circle
                                backgroundColor: "#295bf9", // Set the background color for the circle
                                borderRadius: "50%", // Makes the box a perfect circle
                                border: "2px solid #fff", // White border around the circle
                              }}
                            >
                              <CloudDownloadOutlinedIcon
                                sx={{ color: "white", fontSize: "32px" }}
                              />
                            </Box>
                          </animated.div>
                        </animated.div>

                        <Typography
                          variant="h6"
                          sx={{ marginTop: "40px", fontSize: "18px" }}
                        >
                          Import from file
                          <br></br>
                          <p style={{ fontSize: "16px" }}>
                            Import your existing data to create an application.
                          </p>
                        </Typography>

                        <Button
                          variant="contained"
                          onClick={() => handleSelect("Import from file")}
                          startIcon={
                            <SelectAllIcon sx={{ fontSize: "58px" }} />
                          }
                          sx={{
                            marginTop: "16px",
                            backgroundColor: "#295bf9",
                            "&:hover": {
                              backgroundColor: "#1a46d0",
                            },
                          }}
                        >
                          Import
                        </Button>
                      </Box>
                    </animated.div>
                  </Grid>
                </Grid>
              </DialogContent>
            </Dialog>

            {/* create Application name */}
            <Dialog
              open={openAppName}
              onClose={handleCloseApp}
              fullScreen
              sx={{
                "& .MuiDialog-paper": {
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#f7f8fc",
                },
              }}
            >
              <DialogTitle sx={{ position: "absolute", top: 0, right: 0 }}>
                <IconButton
                  aria-label="close"
                  onClick={handleCloseAppName}
                  sx={{
                    color: (theme) => theme.palette.grey[500],
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>

              {/* Container for both rows */}
              <Box
                sx={{
                  width: 602,
                  height: 451,
                  backgroundColor: "#fafafc",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  border: "1px solid #d3d3d3", // Adding gray border
                  borderRadius: "8px", // Optional: Add border-radius if needed
                }}
              >
                {/* Box content */}

                {/* Row 1 */}
                <Box
                  sx={{
                    width: 600,
                    height: 163,
                    backgroundColor: "white",
                    padding: 2,
                  }}
                >
                  {/* <RadioGroup
                    row
                    sx={{ justifyContent: "center" }}
                    aria-label="options"
                    name="row-radio-buttons-group"
                  >
                    {[...Array(13)].map((_, index) => (
                      <FormControlLabel
                        key={index}
                        value={`option-${index + 1}`}
                        control={<Radio />}
                        label={`Option ${index + 1}`}
                      />
                    ))}
                  </RadioGroup> */}
                </Box>

                <Divider sx={{ width: 600 }} />

                {/* Row 2 */}
                <Box
                  sx={{
                    width: 600,
                    height: 286,
                    backgroundColor: "#fafafc",
                    padding: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {/* TextField for Application Name */}
                  <TextField
                    label="Application Name"
                    variant="outlined"
                    value={dashName}
                    onChange={(e) => setDashName(e.target.value)}
                    sx={{ width: 500, height: 37 }}
                  />

                  {/* Button to create dashboard */}
                  <Button
                    variant="contained"
                    onClick={handleCreateDashboard}
                    sx={{
                      width: 500,
                      height: 48,
                      backgroundColor: "#3f51b5",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#303f9f",
                      },
                    }}
                  >
                    Create Dashboard
                  </Button>
                </Box>
              </Box>
            </Dialog>
          </Box>
        </Box>
      </Box>
      {/* Main content goes here */}
    </Box>
  );
}
