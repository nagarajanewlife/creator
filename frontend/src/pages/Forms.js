import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  Avatar,
  Tabs,
  Tab,
  Box,
  Modal,
  TextField,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import WorkflowIcon from "@mui/icons-material/Workflow";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { auth } from "../components/firebase"; // Ensure you have Firebase setup

const drawerWidth = 240;

const AppBarWithTabs = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [createFormModal, setCreateFormModal] = useState(false);
  const [formName, setFormName] = useState("");

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const openCreateFormModal = () => {
    setCreateFormModal(true);
  };

  const closeCreateFormModal = () => {
    setCreateFormModal(false);
  };

  const handleFormSubmit = () => {
    // Implement your POST API call here
    console.log("Form Created:", formName);
    // After API call, close the modal
    setCreateFormModal(false);
  };

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: "#293040", height: 50 }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            AppName
          </Typography>
          <Button
            color="inherit"
            startIcon={<AddIcon />}
            onClick={openCreateFormModal}
          >
            + Add
          </Button>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{ marginLeft: "auto" }}
          >
            <Tab label="Design" icon={<DesignServicesIcon />} />
            <Tab label="Workflow" icon={<WorkflowIcon />} />
            <Tab label="Setting" icon={<SettingsIcon />} />
          </Tabs>
          <Button
            color="inherit"
            onClick={toggleDrawer(true)}
            sx={{ marginLeft: "auto" }}
          >
            Access the Application
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
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <img src="/path/to/logo.png" alt="Logo" style={{ width: "150px" }} />
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
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            textAlign: "center",
          }}
        >
          <Typography
            id="create-form-modal-title"
            variant="h6"
            component="h2"
            sx={{ mb: 3 }}
          >
            How would you like to create your form?
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-around" }}>
            <Box sx={{ textAlign: "center" }}>
              <Box
                sx={{ width: 160, height: 130, border: "1px solid gray", p: 2 }}
              >
                <Typography>From Scratch</Typography>
              </Box>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Box
                sx={{ width: 160, height: 130, border: "1px solid gray", p: 2 }}
              >
                <Typography>Import with Data</Typography>
              </Box>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Box
                sx={{ width: 160, height: 130, border: "1px solid gray", p: 2 }}
              >
                <Typography>Using wAi</Typography>
              </Box>
            </Box>
          </Box>

          {/* Popup for creating form from scratch */}
          <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 500,
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                textAlign: "center",
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                Create from Scratch
              </Typography>
              <TextField
                label="Form Name"
                placeholder="Examples: Add Order, Staff Details"
                fullWidth
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 3 }}
                onClick={handleFormSubmit}
              >
                Create Form
              </Button>
            </Box>
          </Modal>
        </Box>
      </Modal>
    </>
  );
};

export default AppBarWithTabs;
