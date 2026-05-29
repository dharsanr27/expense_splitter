const express = require('express');
const { handleCreateSettlement } = require('../controllers/settlementControllers');
const router = express.Router();
router.post("/createSettlement",handleCreateSettlement);
module.exports = router;