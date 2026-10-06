import express from "express";
import { getGroupDashboardData } from "../controllers/deptControllers.js";
import { auth } from "../middlewares/authMiddleware.js";
const router = express.Router();
router.get("/userDataAndBalance/:groupId", auth, getGroupDashboardData);
export default router;
