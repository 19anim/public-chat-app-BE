const express = require("express");
const moongose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const path = require("path");
const route = require("../src/routes/index.route");

dotenv.config({ path: "./src/.env" });
const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan("common"));

route(app);
moongose.connect(process.env.MONGODB_URL).then(console.log("Connected to DB"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});