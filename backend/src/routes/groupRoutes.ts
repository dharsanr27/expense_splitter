import express,{Router} from "express";
import {
  handleCreateGroup,
  handleAddMember,
} from "../controllers/groupControllers";
import { auth } from "../middlewares/authMiddleware";
//why we are calling express.Router() instead express.Router
const router:Router = express.Router();
//I need to name the endpoints on user perspective or developer perspective
router.post("/createGroup", auth, handleCreateGroup);
router.post("/addMember", auth, handleAddMember);
export default  router;
