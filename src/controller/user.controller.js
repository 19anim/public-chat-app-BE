const UserModel = require("../model/user.model");

const UserController = {
  getUser: async (req, res) => {
    try {
      const { username } = req.params;
      const users = await UserModel.find({
        username: new RegExp(username, "i"),
      }).select("-password");
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};

module.exports = UserController;
