const jwt = require("jsonwebtoken");
const UserModel = require("../model/user.model");

const isAuthenticated = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res.status(401).json({ error: "Unauthorized user" });
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_TOKEN);

    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized user" });
    }

    const user = await UserModel.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = isAuthenticated;
