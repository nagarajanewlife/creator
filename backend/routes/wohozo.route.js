import express from "express";
import {
  UserCreate,
  DashboardCreate,
  DashboardAppsDetails,
  DashboardDelete,
} from "../controllers/wohozo.controllers.js";
const router = express.Router();

router.post("/addUser", UserCreate);
router.post("/createDashboard", DashboardCreate);
router.get("/dashboardApplication/:uid", DashboardAppsDetails);
router.post("/deleteDashboard/:appID", DashboardDelete);
export default router;
