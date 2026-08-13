import express,{Router} from "express";
import {
  handleAllExpense,
  handleExpenseWithSplitCreation,
  handleUserBalance
 
} from "../controllers/expenseControllers";
import { auth } from "../middlewares/authMiddleware";
import validate from "../middlewares/validateMiddleware";
import errorMiddleware from "../middlewares/errorMiddleware";
import {
  UserBalanceSchema,
  expenseSchema,
  expenseSplitSchema,
} from "../schemas/expenseSchemas";
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
