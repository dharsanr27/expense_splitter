
import express,{Router} from "express";
const router:Router = express.Router();

import {
  handleGetUser,
} from "../controllers/userControllers.js";

import { auth } from "../middlewares/authMiddleware.js";

import errorMiddleware from "../middlewares/errorMiddleware.js";

import validate from "../middlewares/validateMiddleware.js";

import { userSchema } from "../validates/userValidates.js";




router.get("/:groupId",auth,validate(userSchema),handleGetUser);





router.use(errorMiddleware);
export default router;
