//why we need express for routes
import express,{Router} from "express";
const router:Router = express.Router();
import {
  handleGetUser,
} from "../controllers/userControllers";
import { auth } from "../middlewares/authMiddleware";
router.get("/",auth ,handleGetUser)
export default router;
