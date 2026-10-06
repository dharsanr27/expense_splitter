import express from "express";
import { handleCreateGroup, handleAddMember, handleMemberList, handleUserGroups, } from "../controllers/groupControllers.js";
import { auth } from "../middlewares/authMiddleware.js";
import { verifyGroupMember } from "../middlewares/verifyMemberMiddleware.js";
//why we are calling express.Router() instead express.Router
const router = express.Router();
//I need to name the endpoints on user perspective or developer perspective
router.post("/createGroup", auth, handleCreateGroup);
router.post("/addMember/:groupId", auth, handleAddMember);
router.get("/groupMembers/:groupId", auth, verifyGroupMember, handleMemberList);
router.get("/userGroups", auth, handleUserGroups);
export default router;
