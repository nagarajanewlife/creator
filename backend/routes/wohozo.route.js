import express from "express";
import { UserCreate } from "../controllers/wohozo.controllers.js";
const router = express.Router();

router.post("/useradd", UserCreate);

export default router;
