import express,{Router} from "express";
import {
  handleCreateSettlement,
} from "../controllers/settlementControllers.js";
import { auth } from "../middlewares/authMiddleware.js"; //why ai code gives without .js extension it will work without .js
import errorMiddleware from "../middlewares/errorMiddleware.js";
import validate from "../middlewares/validateMiddleware.js";
import { settlement } from "../validates/settlementValidates.js";

const router:Router = express.Router();
router.post("/createSettlement", auth, validate(settlement),handleCreateSettlement);
export default router;
