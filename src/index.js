const express = require("express");
const moongose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const path = require("path");
const route = require("../src/routes/index.route");
const { Server } = require("socket.io");
const { createServer } = require("node:http");
const __originalDirname = path.resolve();

dotenv.config({ path: "./src/.env" });
const port = process.env.PORT || 3000;
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://jtjchatapp.netlify.app/"],
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan("common"));

route(app);
moongose.connect(process.env.MONGODB_URL).then(console.log("Connected to DB"));

const userSocketMap = {};

const getReceiverSocketId = (receiverId) => {
  const ReceiverSocketId = receiverId.map((Id) => {
    return userSocketMap[Id];
  });
  return ReceiverSocketId;
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId !== undefined) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports.getReceiverSocketId = getReceiverSocketId;
module.exports.io = io;
