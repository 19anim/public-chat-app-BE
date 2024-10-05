const ConversationModel = require("../model/conversation.model");
const UserModel = require("../model/user.model");

const ConversationController = {
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
      const conversations = await ConversationModel.find(
        {
          conversationName: searchingRegex,
          participantId: senderId,
        },
        "_id conversationName"
      );
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
