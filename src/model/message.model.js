const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema({
  messageContent: {
    type: String,
    default: ""
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  receiverId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const MessageModel = mongoose.model("Message", MessageSchema);
module.exports = MessageModel;