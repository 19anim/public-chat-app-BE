const express = require("express");
const router = express.Router();
const ConversationController = require("../controller/conversation.controller");
const isAuthenticated = require("../middleware/isAuthenticated.middleware");

router.get(
  "/getConversations",
  isAuthenticated,
  ConversationController.getAllConversations
);
router.get(
  "/searchConversations",
  isAuthenticated,
  ConversationController.queryConversations
);
router.post(
  "/createConversation",
  isAuthenticated,
  ConversationController.createNewConversation
);
router.get(
  "/findConversation",
  isAuthenticated,
  ConversationController.getConversationBetweenTwoAccount
);

module.exports = router;
