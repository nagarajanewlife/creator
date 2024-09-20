import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../components/firebase"; // Firebase config
import axios from "axios";
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
  MoreVert,
  Edit,
  Delete,
  ContentCopy,
  Info,
  Block,
} from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";

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
  const navigate = useNavigate();
  const handleCardClick = (id, dashName) => {
    navigate(`/Playground?id=${id}&dashName=${dashName}`);
  };

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
    getApplication();
  });

  const getApplication = () => {
    axios
      .get(`http://localhost:6969/dashboardApplication/${user?.uid}`)

      .then((response) => {
        setDashApps(response.data);
        setFilteredApps(response.data); // Initially show all apps
      })
      .catch((error) => {
        console.error("Error getting dashboard Apps:", error);
      });
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
      .post("http://localhost:6969/createDashboard", sendData)
      .then((response) => {
        alert("Dashboard created successfully!");
        setOpen(false);
        setDashName("");
        getApplication(); // Refresh the list
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

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* AppBar with custom background */}
      <AppBar position="static" sx={{ backgroundColor: "#27274A" }}>
        <Toolbar>
          {/* Left side: Logo */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
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
              >
                <Avatar alt={user.displayName} src={user.photoURL} />
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
            sx={{ display: "flex", alignItems: "center", marginRight: "20px" }}
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
            <IconButton color="inherit">
              <Button variant="contained" color="primary" onClick={handleOpen}>
                + New Application
              </Button>
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Main content */}
      <Box sx={{ padding: "20px" }}>
        {/* Button for creating a new application */}

        {/* Grid of Dashboard Applications */}
        <Grid container spacing={2} sx={{ marginTop: "20px" }}>
          {filteredApps.length > 0 ? (
            filteredApps.map((app) => (
              <Grid item key={app._id} xs={12} sm={6} md={4} lg={3}>
                <Card
                  sx={{
                    width: 300,
                    height: 300,
                    position: "relative",
                    backgroundColor: "#fdfdff",
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
                          backgroundColor: "#27274A",
                          width: 66, // Set your desired width
                          height: 66, // Set your desired height
                        }}
                      >
                        {app.dashName.charAt(0)}
                      </Avatar>
                      <Typography variant="caption" component="div">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    {/* <IconButton>
                      <Edit />
                    </IconButton> */}
                    <IconButton
                      onClick={(event) => handleAppMenuOpen(event, app)}
                    >
                      <MoreVert />
                    </IconButton>
                  </CardActions>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {app.dashName}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography>No dashboards available.</Typography>
          )}
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
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Create New Application</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Dashboard Name"
              fullWidth
              value={dashName}
              onChange={(e) => setDashName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleCreateDashboard} color="primary">
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
