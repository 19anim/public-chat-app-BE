const express = require("express");
const router = express.Router();
const MessageController = require("../controller/message.controller");
const isAuthenticated = require("../middleware/isAuthenticated.middleware");

router.post("/send", isAuthenticated, MessageController.sendMessage);
router.post("/getAllMessages", isAuthenticated, MessageController.getAllMessages);

module.exports = router;