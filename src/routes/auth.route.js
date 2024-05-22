const express = require("express");
const router = express.Router();
const AuthController = require("../controller/auth.controller");

router.post("/signup", AuthController.signUp);
router.post("/signin", AuthController.singIn);
router.post("/signout", AuthController.signOut);

module.exports = router;