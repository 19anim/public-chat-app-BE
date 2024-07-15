const express = require("express");
const router = express.Router();
const MessageController = require("../controller/message.controller");
const isAuthenticated = require("../middleware/isAuthenticated.middleware");

router.post("/send", isAuthenticated, MessageController.sendMessage);
router.get(
  "/getAllMessages/:conversationId",
  isAuthenticated,
  MessageController.getAllMessages
);

module.exports = router;
