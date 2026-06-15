//why we need express for routes
import express,{Router} from "express";
const router:Router = express.Router();
import {
  handleRegisterUser,
  handleLoginUser,
  handleGetUser,
} from "../controllers/userControllers";
import { auth } from "../middlewares/authMiddleware";
//1.define the end point
//why we are not adding () to function what happens if we add
//1.register endpoint
router.post("/register", handleRegisterUser);
//2.login endpoint
router.post("/login", handleLoginUser);
//why we are only writes router instead of {router}
router.get("/",auth ,handleGetUser)
export default router;
