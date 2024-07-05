const AuthRoute = require("../routes/auth.route");
const MessageRoute = require("../routes/message.route");
const ConversationRoute = require("../routes/conversation.route");
const UserRoute = require("../routes/user.route");

const route = (app) => {
  app.use("/api/auth", AuthRoute);
  app.use("/api/message", MessageRoute);
  app.use("/api/conversation", ConversationRoute);
  app.use("/api/user", UserRoute);
};

module.exports = route;
