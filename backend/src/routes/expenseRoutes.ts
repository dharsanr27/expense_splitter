import express,{Router} from "express";
import {
  handleExpenseWithSplitCreation,
  handleUserBalance
 
} from "../controllers/expenseControllers";
import { auth } from "../middlewares/authMiddleware";
import validate from "../middlewares/validateMiddleware";
import errorMiddleware from "../middlewares/errorMiddleware";
import {
  UserBalanceSchema,
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

router.use(errorMiddleware);
export default router;
