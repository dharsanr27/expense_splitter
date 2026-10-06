import express,{Router} from "express";
import {
  handleAllExpense,
  handleExpenseWithSplitCreation,
  handleUserBalance
 
} from "../controllers/expenseControllers.js";
import { auth } from "../middlewares/authMiddleware.js";
import validate from "../middlewares/validateMiddleware.js";
import errorMiddleware from "../middlewares/errorMiddleware.js";
import {
  UserBalanceSchema,
  expenseSchema,
  expenseSplitSchema,
} from "../validates/expenseValidates.js";
const router:Router = express.Router();
router.post(
  "/createExpense",
  auth,
  validate(expenseSplitSchema),
  handleExpenseWithSplitCreation,
);
router.get(
  "/userBalance/:groupId",
  auth,
  validate(UserBalanceSchema),
  handleUserBalance,
);
router.get("/groupExpense/:groupId",auth,validate(expenseSchema),handleAllExpense)
router.use(errorMiddleware);
export default router;
