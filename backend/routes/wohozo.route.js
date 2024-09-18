import express from "express";
import {
  UserCreate,
  DashboardCreate,
  DashboardAppsDetails,
} from "../controllers/wohozo.controllers.js";
const router = express.Router();

router.post("/addUser", UserCreate);
router.post("/createDashboard", DashboardCreate);
router.get("/dashboardApplication/:uid", DashboardAppsDetails);

export default router;
