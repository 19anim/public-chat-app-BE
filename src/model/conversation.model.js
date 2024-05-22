const mongoose = require("mongoose");

const ConversationSchema = mongoose.Schema({
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
  participant: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Conversation = mongoose.model("Conversation", ConversationSchema);
module.exports = Conversation;
