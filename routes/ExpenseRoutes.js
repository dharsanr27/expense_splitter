const express = require('express');
const { handleExpenseWithSplitCreation, handleUserBalance, handleGetUsersExpensesWithSplits, } = require('../controllers/expenseControllers');
const {auth}= require('../middlewares/authMiddleware.js');
const router = express.Router();
router.post("/createExpense",auth,handleExpenseWithSplitCreation);
router.post("/netBalance",auth,handleUserBalance);
router.get("/groupExpensesWithSplits/:groupId",auth,handleGetUsersExpensesWithSplits);
module.exports = router;