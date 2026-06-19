import express,{Router} from "express";
import {
 getGroupDashboardData 
} from "../controllers/deptControllers";
import { auth } from "../middlewares/authMiddleware";
const router:Router = express.Router();

router.get(
  "/userDataAndBalance/:groupId",
  auth,
  getGroupDashboardData,
);
export default router;