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

const router:Router = express.Router();
router.post("/createGroup", auth,validate(groupCreateSchema),handleCreateGroup);
router.post("/addMember/:groupId", auth,validate(addMemberSchema),handleAddMember);
router.get("/groupMembers/:groupId",auth,verifyGroupMember,validate(membersSchema),handleMemberList);
router.get("/userGroups",auth,validate(userGroupSchema),handleUserGroups);
router.use(errorMiddleware);
export default  router;

