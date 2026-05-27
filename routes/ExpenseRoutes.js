const express = require('express');
const { handleExpenseWithSplitCreation, handleUserBalance, } = require('../controllers/expenseControllers');
const router = express.Router();
router.post("/createExpense",handleExpenseWithSplitCreation);
router.post("/netBalance",handleUserBalance);
module.exports = router;