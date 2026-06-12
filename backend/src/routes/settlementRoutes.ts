import express,{Router} from "express";
import {
  handleCreateSettlement,
} from "../controllers/settlementControllers";
import { auth } from "../middlewares/authMiddleware"; //why ai code gives without .js extension it will work without .js

const router:Router = express.Router();
router.post("/createSettlement", auth, handleCreateSettlement);
export default router;
