const express = require('express');
const { handleCreateSettlement } = require('../controllers/settlementControllers');
const { auth } = require('../middlewares/authMiddleware.js');//why ai code gives without .js extension it will work without .js
 
const router = express.Router();
router.post("/createSettlement",auth,handleCreateSettlement);
module.exports = router;