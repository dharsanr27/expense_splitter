//why we need express for routes
import express,{Router} from "express";
const router:Router = express.Router();

import {
  handleGetUser,
} from "../controllers/userControllers.js";

import { auth } from "../middlewares/authMiddleware.js";
//why we import full function(error middleware)
import errorMiddleware from "../middlewares/errorMiddleware.js";

import validate from "../middlewares/validateMiddleware.js";

import { userSchema } from "../validates/userValidates.js";




router.get("/",auth,validate(userSchema),handleGetUser);




//how this will excecute
router.use(errorMiddleware);
export default router;
