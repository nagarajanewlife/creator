import React from "react";
import {
  Container,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Grid,
} from "@mui/material";
import TimesheetForm from "../Timesheet/TimesheetForm";
import TimesheetList from "../Timesheet/TimesheetList";
import EmployeeForm from "../Employee/EmployeeForm";
import EmployeeList from "../Employee/EmployeeList";
// import MonthlyEarnings from "../Earnings/MonthlyEarnings";
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
      //  alert("Failed to logout.");
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
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <TimesheetForm />
            </Grid>
            <Grid item xs={12} md={6}>
              <EmployeeForm />
            </Grid>
            {/* <Grid item xs={12}>
              <Button color="inherit" onClick={() => navigate("/earnings")}>
                View Earnings
              </Button>
              <MonthlyEarnings />
            </Grid> */}
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
          </Grid>
        </animated.div>
      </Container>
    </>
  );
};

export default Dashboard;
