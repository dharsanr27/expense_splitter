import express,{Router} from "express";
import {
 getGroupDashboardData 
} from "../controllers/deptControllers.js";
import { auth } from "../middlewares/authMiddleware.js";
const router:Router = express.Router();

router.get(
  "/userDataAndBalance/:groupId",
  auth,
  getGroupDashboardData,
);
export default router;