const express = require("express");
//why we are calling express.Router() instead express.Router
const router = express.Router();
const {handleCreateGroup}= require("../controllers/groupControllers");

router.post("/create",handleCreateGroup);
module.exports = router;
