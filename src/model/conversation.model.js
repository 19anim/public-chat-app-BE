const mongoose = require("mongoose");

const ConversationSchema = mongoose.Schema({
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  conversationName: {
    type: String,
  },
});

const Conversation = mongoose.model("Conversation", ConversationSchema);
module.exports = Conversation;
