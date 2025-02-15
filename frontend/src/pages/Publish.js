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
import { Link } from "react-router-dom"; // Import Link from react-router-dom

import { ElectricBoltOutlined as ElectricBoltOutlinedIcon } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import DynamicForm from "./DynamicForm";
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
import EditIcon from "@mui/icons-material/Edit"; // Icon for "Edit this application"

const drawerWidth = 240;

const AppBarWithTabs = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [createFormModal, setCreateFormModal] = useState(false);
  const [activeButton, setActiveButton] = useState("design"); // Change state to manage active button
  const [formName1, setFormName1] = useState("");
  const [appName, setAppName] = useState("");
  const [formname, setFormName] = useState("");
  const [formItems, setFormIteam] = useState("");
  const [formLists, setFormList] = useState("");
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const openCreateFormModal = () => {
    setCreateFormModal(true);
  };

  const closeCreateFormModal = () => {
    setCreateFormModal(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${REACT_APP_BACKEND_URL}api/formsiteam/${auth?.currentUser?.uid}/${appName}/${formname}`
        );

        // console.log("formsiteam", response.data); // Store the data from the response
        setFormIteam(response.data?.formItems);
      } catch (err) {
        console.log(err.message); // Store the error message
      }
    };

    fetchData();
  }, [formname]);

  useEffect(() => {
    fetchFormList();
  });
  const fetchFormList = async () => {
    try {
      const response = await axios.get(
        `${REACT_APP_BACKEND_URL}api/formslist/${auth?.currentUser?.uid}`
      );

      // console.log("fetchFormList", response.data); // Store the data from the response
      setFormList(response.data);
    } catch (err) {
      console.log(err.message); // Store the error message
    }
  };

  const location = useLocation(); // Get the current location object (URL)
  // Read dynamic params from URL
  useEffect(() => {
    // Log full URL path from the browser
    console.log("Full URL Path:", location.pathname);

    // Split the URL by '/' and extract specific parts
    const pathParts = location.pathname.split("/");

    // For example: pathParts[0] = "", pathParts[1] = "appbuilder", pathParts[2] = "TechCodeLab", pathParts[3] = "muruganapp", pathParts[4] = "edit"
    if (pathParts.length >= 4) {
      const decodedAppName = decodeURIComponent(pathParts[3]);

      setAppName(decodedAppName);
      // "muruganapp" will be at index 3 in the array
      const decodedFormName = decodeURIComponent(pathParts[5]);
      setFormName(decodedFormName);
    }

    console.log("Extracted dashName:", pathParts[3]); // Logs "muruganapp"
  }, [location]);
  const [isAccessed, setIsAccessed] = useState(true);
  const [publishtrue, setPublish] = useState(true);
  // Function to handle button click
  const handleClick = () => {
    if (!isAccessed) {
      // alert(isAccessed);
      setPublish(true);
      // Redirect to the "Access the Application" URL
      // window.location.href = "http://localhost:3000/wohozo/wapp1/#form:wform1/";
    } else {
      // Redirect to the "Edit this application" URL
      window.location.href = "/appbuilder/wohozo/wapp1/form/wform1/edit";
    }

    // Toggle the state to switch the button label and icon
    setIsAccessed(!isAccessed);
  };
  return (
    <>
      <AppBar position="static" sx={{ bgcolor: "#293040", height: 50 }}>
        <Toolbar>
          <Button
            color="inherit"
            style={{
              height: "50px",
              width: "250px",
              marginBottom: "20px",
              fontSize: "13px",
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

          {/* Buttons instead of Tabs */}
          <Box
            sx={{ display: "flex", marginLeft: "13%", marginBottom: "13px" }}
          ></Box>

          <Button
            color="inherit"
            onClick={handleClick}
            component={Link}
            to={`/${auth?.currentUser.displayName}/${appName}/#Form:${formname}`}
            sx={{
              marginLeft: "20%",
              width: "230px",
              height: "29px",
              textTransform: "none",
              marginBottom: "13px",
              backgroundColor: "#34649c",
            }}
          >
            {isAccessed ? (
              <>
                <EditIcon /> Edit this application
              </>
            ) : (
              <>
                <ElectricBoltOutlinedIcon /> Access the Application
              </>
            )}
          </Button>
        </Toolbar>
      </AppBar>

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
        <DynamicForm
          formData={formItems}
          formLists={formLists && formLists}
          appname={appName}
          formname={formname}
          publish={publishtrue}
        />
        {/* <img src={Logoapp} alt="Logo" style={{ width: "150px" }} /> */}
        {/* <Typography variant="h5" sx={{ mt: 2 }}>
          Start building your application by creating a form
        </Typography> */}
        {/* <Button
          variant="contained"
          sx={{ mt: 3 }}
          onClick={openCreateFormModal}
        >
          Create New Form
        </Button> */}
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
        </Box>
      </Modal>
    </>
  );
};

export default AppBarWithTabs;
