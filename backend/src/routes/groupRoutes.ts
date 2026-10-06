import express,{Router} from "express";
import {
  handleCreateGroup,
  handleAddMember,
  handleMemberList,
  handleUserGroups,
} from "../controllers/groupControllers.js";
import { auth } from "../middlewares/authMiddleware.js";
import errorMiddleware from "../middlewares/errorMiddleware.js";
import { verifyGroupMember } from "../middlewares/verifyMemberMiddleware.js";
import validate from "../middlewares/validateMiddleware.js";

import { groupCreateSchema,addMemberSchema,userGroupSchema,membersSchema } from "../validates/groupValidates.js";

//why we are calling express.Router() instead express.Router
const router:Router = express.Router();
//I need to name the endpoints on user perspective or developer perspective
router.post("/createGroup", auth,validate(groupCreateSchema),handleCreateGroup);
router.post("/addMember/:groupId", auth,validate(addMemberSchema),handleAddMember);
router.get("/groupMembers/:groupId",auth,verifyGroupMember,validate(membersSchema),handleMemberList);
router.get("/userGroups",auth,validate(userGroupSchema),handleUserGroups);
router.use(errorMiddleware);
export default  router;

