//why we need express for routes
const express = require("express");
const router = express.Router();
const { handleRegisterUser, handleLoginUser } = require("../controllers/userControllers.js");
//1.define the end point
//why we are not adding () to function what happens if we add
//1.register endpoint
router.post("/register", handleRegisterUser);
//2.login endpoint
router.post("/login",handleLoginUser);
//why we are only writes router instead of {router}
module.exports = router;
 