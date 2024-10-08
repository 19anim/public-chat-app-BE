const mongoose = require("mongoose");
const UserModel = require("../model/user.model");
const MessageModel = require("../model/message.model");
const ConversationModel = require("../model/conversation.model");
const index = require("../index");

const MessageController = {
  sendMessage: async (req, res) => {
    try {
      const { receiverId, messageContent, userSocketMap } = req.body;
      const user = req.user;
      if (receiverId.length === 0) {
        return res.status(401).json({ error: "No recipient is provided" });
      }
      const newMessage = new MessageModel({
        messageContent: messageContent,
        senderId: user._id,
        receiverId: receiverId,
      });

      const participantIds = [...receiverId, user._id].sort();

      let conversation = await ConversationModel.findOne({
        participantId: [...participantIds],
      });

      if (!conversation) {
        let userListPromises = receiverId.map((receiver) => {
          return UserModel.findById(receiver).select("username");
        });
        let usersList = [];
        await Promise.all([...userListPromises]).then((values) => {
          usersList = [...values];
        });

        const conversationName = usersList.reduce((acc, currentUser, index) => {
          return index == 0
            ? acc + currentUser.username
            : acc + ", " + currentUser.username;
        }, "");

        conversation = await ConversationModel.create({
          participantId: [...participantIds],
          conversationName: `Conversation of ${conversationName}, ${user.username}`,
        });
      }

      conversation.messages.push(newMessage._id);

      // emit event for live chat
      const tempMessage = await newMessage.populate([
        {
          path: "senderId",
          model: UserModel,
          select: "-password",
        },
        {
          path: "receiverId",
          model: UserModel,
          select: "-password",
        },
      ]);
      const receiverSocketId = index.getReceiverSocketId(receiverId);
      if (receiverSocketId.length > 0) {
        receiverSocketId.forEach((socketId) => {
          index.io.to(socketId).emit("newMessage", tempMessage);
        });
      }

      conversation.save();
      newMessage.save();

      res.status(201).json(newMessage);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAllMessages: async (req, res) => {
    try {
      const { conversationId } = req.params;
      const conversation = await ConversationModel.findById(
        conversationId
      ).populate({
        path: "messages",
        populate: {
          path: "senderId",
          model: UserModel,
          select: "-password",
        },
      });
      if (!conversation) {
        return res.status(401).json({ error: "Conversation not found" });
      }
      return res.status(200).json(conversation);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};

module.exports = MessageController;
