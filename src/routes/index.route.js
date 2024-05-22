const AuthRoute = require("../routes/auth.route");

const route = (app) => {
  app.use("/api/auth", AuthRoute);
}

module.exports = route;