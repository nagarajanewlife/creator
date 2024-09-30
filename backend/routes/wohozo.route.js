import express from "express";
import {
  UserCreate,
  DashboardCreate,
  DashboardAppsDetails,
  EmployeeCreate,
  Employeeget,
  Timesheetsget,
  TimesheetCreate,
} from "../controllers/wohozo.controllers.js"; // Ensure this path is correct

const router = express.Router();

// Define the routes
router.post("/addUser", UserCreate);
router.post("/createDashboard", DashboardCreate);
router.get("/dashboardApplication/:uid", DashboardAppsDetails);

// employees
router.post("/employees", EmployeeCreate);
router.get("/employees", Employeeget);

// Timesheet
router.get("/timesheets", Timesheetsget);

router.post("/timesheets", TimesheetCreate);

export default router;
