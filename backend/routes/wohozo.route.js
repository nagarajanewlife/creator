import express from "express";
import {
  UserCreate,
  DashboardCreate,
} from "../controllers/wohozo.controllers.js";
const router = express.Router();

router.post("/addUser", UserCreate);
router.post("/createDashboard", DashboardCreate);

export default router;
