const ConversationModel = require("../model/conversation.model");

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
};

module.exports = ConversationController;
