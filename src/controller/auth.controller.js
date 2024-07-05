const UserModel = require("../model/user.model");
const bcrypt = require("bcrypt");
const {
  generateAccessTokenAndSetCookie,
} = require("../utils/commonFunction.util");

const AuthController = {
  signUp: async (req, res) => {
    try {
      const { fullName, username, password, confirmPassword, gender } =
        req.body;

      const user = await UserModel.findOne({ username: username });
      if (user) {
        return res
          .status(401)
          .json({ error: "Username existed, please try another" });
      }

      if (password !== confirmPassword) {
        return res
          .status(401)
          .json({ error: "Confirm password does not match" });
      }

      const profilePic = `https://api.dicebear.com/8.x/big-smile/svg?seed=${username}`;
      const hasedSalt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, hasedSalt);

      const newUser = new UserModel({
        fullName,
        username,
        password: hashedPassword,
        gender,
        profilePic,
        email: "",
      });

      generateAccessTokenAndSetCookie(newUser._id, res);
      await newUser.save();

      return res.status(201).json({
        _id: newUser._id,
        username,
        fullName,
        profilePic,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  signIn: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await UserModel.findOne({ username: username });
      if (!user) {
        return res
          .status(401)
          .json({ error: "Incorrect username or password" });
      }

      const isCorrectPassword = await bcrypt.compare(password, user.password);
      if (!isCorrectPassword) {
        return res
          .status(401)
          .json({ error: "Incorrect username or password" });
      }

      generateAccessTokenAndSetCookie(user._id, res);
      return res.status(200).json({
        _id: user._id,
        username,
        fullName: user.fullName,
        profilePic: user.profilePic,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  signOut: (req, res) => {
    try {
      res.cookie("accessToken", "", { maxAge: 0 });
      return res.status(200).json({ message: "log out successfully" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};

module.exports = AuthController;
