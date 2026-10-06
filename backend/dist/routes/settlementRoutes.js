import express from "express";
import { handleCreateSettlement, } from "../controllers/settlementControllers.js";
import { auth } from "../middlewares/authMiddleware.js"; //why ai code gives without .js extension it will work without .js
const router = express.Router();
router.post("/createSettlement", auth, handleCreateSettlement);
export default router;
