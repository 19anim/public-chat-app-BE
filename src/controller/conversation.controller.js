const ConversationModel = require("../model/conversation.model");
const UserModel = require("../model/user.model");

const ConversationController = {
  createNewConversation: async (req, res) => {
    try {
      const senderId = req.user._id;
      const { receiverId } = req.body;

      const senderName = await UserModel.find(
        {
          _id: senderId,
        },
        "fullName"
      ).lean();
      const receiverName = await UserModel.find(
        {
          _id: receiverId,
        },
        "fullName"
      ).lean();

      const participantIds = [receiverId, senderId].sort();
      const conversation = await ConversationModel.create({
        messages: [],
        participantId: participantIds,
        conversationName: `Conversation of ${senderName[0].fullName}, ${receiverName[0].fullName}`,
      });

      const returnedConversation = await ConversationModel.findById(
        conversation._id
      ).populate({
        path: "participantId",
        select: "-password",
      });

      return res.status(200).json(returnedConversation);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  getConversationBetweenTwoAccount: async (req, res) => {
    try {
      const senderId = req.user._id;
      const { receiverId } = req.query;
      const participantIds = [receiverId, senderId].sort();
      const conversation = await ConversationModel.find({
        participantId: { $all: participantIds, $size: 2 },
      }).populate({
        path: "participantId",
        select: "-password",
      });

      return res.status(200).json(conversation);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  getAllConversations: async (req, res) => {
    try {
      const senderId = req.user._id;
      const conversations = await ConversationModel.find({
        participantId: { $all: [senderId] },
      }).populate({
        path: "participantId",
        select: "-password",
      });

      return res.status(200).json(conversations);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  queryConversations: async (req, res) => {
    try {
      const { conversationName } = req.query;
      const senderId = req.user._id;
      const searchingRegex = new RegExp(conversationName, "i");
      // const conversations = await ConversationModel.find(
      //   {
      //     conversationName: searchingRegex,
      //     participantId: senderId,
      //   },
      //   "_id conversationName"
      // );
      const conversations = await ConversationModel.find(
        {
          conversationName: searchingRegex,
          participantId: senderId,
        },
        "_id conversationName participantId"
      ).populate({
        path: "participantId",
        select: "-password",
      });
      const users = await UserModel.find(
        {
          $or: [
            {
              username: searchingRegex,
            },
            {
              fullName: searchingRegex,
            },
          ],
        },
        "_id username fullName profilePic"
      );

      const filteredUsers = users.filter((user) => !user._id.equals(senderId));

      return res.status(200).json({
        conversations: conversations,
        users: filteredUsers,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};

module.exports = ConversationController;
