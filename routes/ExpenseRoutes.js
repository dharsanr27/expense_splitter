const express = require('express');
const { handleExpenseWithSplitCreation, handleUserBalance, handleGetUsersExpensesWithSplits, } = require('../controllers/expenseControllers');
const router = express.Router();
router.post("/createExpense",handleExpenseWithSplitCreation);
router.post("/netBalance",handleUserBalance);
router.get("/groupExpensesWithSplits/:groupId",handleGetUsersExpensesWithSplits);
module.exports = router;