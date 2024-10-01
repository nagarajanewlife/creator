import express from "express";
import {
  UserCreate,
  getUserProfile,
  DashboardCreate,
  DashboardAppsDetails,
  EmployeeCreate,
  Employeeget,
  Timesheetsget,
  TimesheetCreate,
  Earings,
} from "../controllers/wohozo.controllers.js"; // Ensure this path is correct

const router = express.Router();

// Define the routes
router.post("/addUser", UserCreate);
router.get("/api/users/profile/:uid", getUserProfile);
router.post("/createDashboard", DashboardCreate);
router.get("/dashboardApplication/:uid", DashboardAppsDetails);

// employees
router.post("/employees", EmployeeCreate);
router.get("/employees", Employeeget);

// Timesheet
router.get("/timesheets", Timesheetsget);

router.post("/timesheets", TimesheetCreate);
router.get("/earnings/:year/:month", Earings);

export default router;
