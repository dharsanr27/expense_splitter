import express,{Router} from "express";
import {
  handleExpenseWithSplitCreation,
  handleUserBalance,
  handleGetUsersExpensesWithSplits,
} from "../controllers/expenseControllers";
import { auth } from "../middlewares/authMiddleware";
import validate from "../middlewares/validateMiddleware";
import errorMiddleware from "../middlewares/errorMiddleware";
import {
  UserBalanceSchema,
  groupExpenseWithSplitSchema,
  expenseSplitSchema,
} from "../schemas/expenseSchemas";
const router:Router = express.Router();
router.post(
  "/createExpense",
  auth,
  validate(expenseSplitSchema),
  handleExpenseWithSplitCreation,
);
router.post(
  "/netBalance",
  auth,
  validate(UserBalanceSchema),
  handleUserBalance,
);
router.get(
  "/groupExpensesWithSplits/:groupId",
  auth,
  validate(groupExpenseWithSplitSchema),
  handleGetUsersExpensesWithSplits,
);
router.use(errorMiddleware);
export default router;
