const express = require("express");
//why we are calling express.Router() instead express.Router
const router = express.Router();
const {handleCreateGroup, handleAddMember}= require("../controllers/groupControllers");
const {auth} = require("../middlewares/authMiddleware.js");
//I need to name the endpoints on user perspective or developer perspective
router.post("/createGroup",auth,handleCreateGroup);
router.post("/addMember",auth,handleAddMember)
module.exports = router;
