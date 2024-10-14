import React, { useState, useContext, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  Avatar,
  Box,
  Modal,
  TextField,
  DialogTitle,
  Divider,
} from "@mui/material";

import { ElectricBoltOutlined as ElectricBoltOutlinedIcon } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";

import AddIcon from "@mui/icons-material/Add";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import WorkflowIcon from "@mui/icons-material/AccountTree";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { auth } from "../components/firebase"; // Ensure you have Firebase setup
import Logoapp from "./images/fff.svg";
import { DashboardContext } from "./DashboardContext";
import { useLocation, useParams } from "react-router-dom";

const drawerWidth = 240;

const AppBarWithTabs = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [createFormModal, setCreateFormModal] = useState(false);
  const [activeButton, setActiveButton] = useState("design"); // Change state to manage active button
  const [formName1, setFormName1] = useState("");
  const [appName, setAppName] = useState("");

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const openCreateFormModal = () => {
    setCreateFormModal(true);
  };

  const closeCreateFormModal = () => {
    setCreateFormModal(false);
  };

  const handleFormSubmit = () => {
    if (!formName1) {
      alert("Please enter a form name!");
      return;
    }

    const sendData = {
      uid: auth.currentUser?.uid,
      dashid: appName,
      formName: formName1,
    }; // Assuming uid from auth
    axios
      .post("http://localhost:6969/createForm", sendData) // Replace with your API endpoint
      .then((response) => {
        alert("Form created successfully!");

        const editUrl = `/appbuilder/${auth?.currentUser?.displayName}/${appName}/formbuilder/${formName1}/edit`;
        window.location.href = editUrl;
        setFormName1(""); // Clear form name input after submission
        closeCreateFormModal(); // Close modal after submission
      })
      .catch((error) => {
        console.error("Error creating form:", error);
        alert("Error creating form.");
      });
  };
  useEffect(() => {
    const d = `http://localhost:6969/forms/${auth?.currentUser?.uid}/${appName}`;
    console.log(d);
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:6969/forms/${auth?.currentUser?.uid}/${appName}`
        );

        console.log(response.data); // Store the data from the response
      } catch (err) {
        console.log(err.message); // Store the error message
      }
    };

    fetchData();
  });

  const location = useLocation(); // Get the current location object (URL)
  // Read dynamic params from URL
  useEffect(() => {
    // Log full URL path from the browser
    console.log("Full URL Path:", location.pathname);

    // Split the URL by '/' and extract specific parts
    const pathParts = location.pathname.split("/");

    // For example: pathParts[0] = "", pathParts[1] = "appbuilder", pathParts[2] = "TechCodeLab", pathParts[3] = "muruganapp", pathParts[4] = "edit"
    if (pathParts.length >= 4) {
      setAppName(pathParts[3]); // "muruganapp" will be at index 3 in the array
    }

    console.log("Extracted dashName:", pathParts[3]); // Logs "muruganapp"
  }, [location]);

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: "#293040", height: 50 }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            style={{ marginBottom: "13px" }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>

          <Button
            color="inherit"
            style={{
              height: "50px",
              width: "250px",
              marginBottom: "20px",
              fontSize: "16px",
              transition: "background-color 0.3s",
              display: "flex",
              alignItems: "center",
              justifyContent: "left",
              textTransform: "none",
            }}
            sx={{
              "&:hover": {
                backgroundColor: "#1b202e",
                textTransform: "none",
              },
            }}
          >
            {appName}
          </Button>

          <Button
            style={{
              height: "50px",
              width: "50px",
              marginBottom: "20px",
              borderLeft: "1px solid #1b202e",
              borderRight: "1px solid #1b202e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: "10px",
              transition: "background-color 0.3s",
            }}
            color="inherit"
            startIcon={<AddIcon />}
            onClick={openCreateFormModal}
            sx={{
              "&:hover": {
                backgroundColor: "#1b202e",
              },
            }}
          />

          {/* Buttons instead of Tabs */}
          <Box
            sx={{ display: "flex", marginLeft: "13%", marginBottom: "13px" }}
          >
            <Button
              onClick={() => setActiveButton("design")}
              startIcon={<DesignServicesIcon />}
              sx={{
                marginRight: "12px",
                fontFamily: "sansans-serif",
                fontSize: "14px",
                boxShadow:
                  activeButton === "design" ? "inset 0 -3px 0 #3987d9" : "none",
                textTransform: "none",
                color: activeButton === "design" ? "white" : "#7e838d",
                "&:hover": {
                  backgroundColor:
                    activeButton === "design" ? "transparent" : "#1b202e",
                },
              }}
            >
              Design
            </Button>
            <Button
              onClick={() => setActiveButton("workflow")}
              startIcon={<WorkflowIcon />}
              sx={{
                marginRight: "12px",
                fontFamily: "sansans-serif",
                boxShadow:
                  activeButton === "workflow"
                    ? "inset 0 -3px 0 #3987d9"
                    : "none",
                fontSize: "12px",
                textTransform: "none",
                color: activeButton === "workflow" ? "white" : "#7e838d",
                "&:hover": {
                  backgroundColor:
                    activeButton === "workflow" ? "transparent" : "#1b202e",
                },
              }}
            >
              Workflow
            </Button>
            <Button
              onClick={() => setActiveButton("setting")}
              startIcon={<SettingsIcon />}
              sx={{
                marginRight: "12px",
                fontFamily: "sansans-serif",
                boxShadow:
                  activeButton === "setting"
                    ? "inset 0 -3px 0 #3987d9"
                    : "none",
                fontSize: "12px",
                textTransform: "none",
                color: activeButton === "setting" ? "white" : "#7e838d",
                "&:hover": {
                  backgroundColor:
                    activeButton === "setting" ? "transparent" : "#1b202e",
                },
              }}
            >
              Setting
            </Button>
          </Box>

          <Button
            color="inherit"
            disabled={true}
            onClick={toggleDrawer(true)}
            sx={{
              marginLeft: "20%",
              width: "230px",
              height: "29px",
              textTransform: "none",
              marginBottom: "13px",
              backgroundColor: "#34649c",
            }} // Add some margin for spacing
          >
            <ElectricBoltOutlinedIcon /> Access the Application
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: drawerWidth, p: 2, textAlign: "center" }}>
          <Avatar
            src="/path/to/profile.jpg"
            sx={{ width: 80, height: 80, margin: "auto" }}
          />
          <Typography variant="h6" mt={2}>
            Display Name
          </Typography>
          <Button startIcon={<LogoutIcon />} fullWidth sx={{ mt: 2 }}>
            Logout
          </Button>
        </Box>
      </Drawer>

      {/* Content area */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        <img src={Logoapp} alt="Logo" style={{ width: "150px" }} />
        <Typography variant="h5" sx={{ mt: 2 }}>
          Start building your application by creating a form
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 3 }}
          onClick={openCreateFormModal}
        >
          Create New Form
        </Button>
      </Box>

      {/* Modal for creating form */}
      <Modal
        open={createFormModal}
        onClose={closeCreateFormModal}
        aria-labelledby="create-form-modal-title"
        aria-describedby="create-form-modal-description"
      >
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box>
            <IconButton
              aria-label="close"
              onClick={closeCreateFormModal}
              sx={{ right: 8, top: 8, marginLeft: "502%" }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <DialogTitle id="create-form-modal-title">
            Create a New Form
          </DialogTitle>
          <Divider />

          <Box
            sx={{
              display: "flex",
              //   flexDirection: "column",
              width: "100%",
              alignItems: "center",
              marginLeft: "55%",
              mt: 2,
            }}
          >
            <label>Form Name</label>
            <TextField
              label="Form Name"
              variant="outlined"
              value={formName1}
              onChange={(e) => setFormName1(e.target.value)}
              sx={{
                marginLeft: "65px",
                width: "360px", // Width of TextField
                height: "44px", // Height of TextField
              }}
            />
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleFormSubmit}
            sx={{
              marginRight: "17%",
              textTransform: "none",

              ml: 2,
              width: "117px", // Width of Button
              height: "44px", // Height of Button
              mt: 2, // Added margin-top for spacing
            }}
          >
            Create Form
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default AppBarWithTabs;
