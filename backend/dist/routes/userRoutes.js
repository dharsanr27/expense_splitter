//why we need express for routes
import express from "express";
const router = express.Router();
import { handleGetUser, } from "../controllers/userControllers.js";
import { auth } from "../middlewares/authMiddleware.js";
router.get("/", auth, handleGetUser);
export default router;
