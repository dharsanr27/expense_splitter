import express,{Router} from "express";
import {
  handleCreateGroup,
  handleAddMember,
  handleMemberList,
  handleUserGroups,
} from "../controllers/groupControllers";
import { auth } from "../middlewares/authMiddleware";
//why we are calling express.Router() instead express.Router
const router:Router = express.Router();
//I need to name the endpoints on user perspective or developer perspective
router.post("/createGroup", auth, handleCreateGroup);
router.post("/addMember/:groupId", auth, handleAddMember);
router.get("/groupMembers/:groupId",auth,handleMemberList);
router.get("/userGroups",auth,handleUserGroups);
export default  router;

