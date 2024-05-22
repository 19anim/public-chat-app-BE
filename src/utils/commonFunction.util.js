const jwt = require("jsonwebtoken");

const CommonFunction = {
  generateAccessTokenAndSetCookie: (userId, res) => {
    const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET_TOKEN, {
      expiresIn: process.env.JWT_LIFETIME,
    });

    res.cookie("accessToken", accessToken, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
    });
  },
};

module.exports = CommonFunction;
