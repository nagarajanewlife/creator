import express from "express";
import {
  UserCreate,
  getUserProfile,
  DashboardCreate,
  FormCreate,
  DashboardAppsDetails,
  EmployeeCreate,
  Employeeget,
  Timesheetsget,
  Getallforms,
  TimesheetCreate,
  Earings,
} from "../controllers/wohozo.controllers.js"; // Ensure this path is correct

const router = express.Router();

// Define the routes
router.post("/addUser", UserCreate);
router.get("/api/users/profile/:uid", getUserProfile);
router.post("/createDashboard", DashboardCreate);
router.post("/createDashboard", DashboardCreate);
router.post("/createForm", FormCreate);

router.get("/dashboardApplication/:uid", DashboardAppsDetails);
router.get("forms/:uid/:dashid", Getallforms);

// employees
router.post("/employees", EmployeeCreate);
router.get("/employees", Employeeget);

// Timesheet
router.get("/timesheets", Timesheetsget);

router.post("/timesheets", TimesheetCreate);
router.get("/earnings/:year/:month", Earings);

export default router;
