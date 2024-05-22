const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ["male", "femail"],
  },
  profilePic: {
    type: String,
    default: "",
  },
});

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
