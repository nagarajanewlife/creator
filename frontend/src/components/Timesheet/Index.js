import React from "react";
import { Container, Typography, Button, AppBar, Toolbar } from "@mui/material";
import TimesheetForm from "./TimesheetForm";
import TimesheetList from "./TimesheetList";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { animated, useSpring } from "react-spring";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      //alert("Failed to logout.");
    }
  };

  // Animation for the dashboard content
  const props = useSpring({ opacity: 1, from: { opacity: 0 }, delay: 200 });

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Wohozo Dashboard
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <animated.div style={props}>
          <Typography variant="h4" gutterBottom>
            Employee Timesheet
          </Typography>
          <TimesheetForm />
          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            All Timesheets
          </Typography>
          <TimesheetList />
        </animated.div>
      </Container>
    </>
  );
};

export default Dashboard;
