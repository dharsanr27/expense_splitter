const express = require("express");
//why we are calling express.Router() instead express.Router
const router = express.Router();
const {handleCreateGroup, handleAddMember}= require("../controllers/groupControllers");
//I need to name the endpoints on user perspective or developer perspective
router.post("/createGroup",handleCreateGroup);
router.post("/addMember",handleAddMember)
module.exports = router;
