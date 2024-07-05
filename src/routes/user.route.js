const express = require("express");
const router = express.Router();
const UserController = require("../controller/user.controller");
const isAuthenticated = require("../middleware/isAuthenticated.middleware");

router.get("/getUsers/:username", isAuthenticated, UserController.getUser);

module.exports = router;