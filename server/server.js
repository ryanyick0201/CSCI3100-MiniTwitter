/* otp.js
PROGRAMMER: YICK Ka Ho (SID: 1155142189)
PURPOSE: Setting up environment for the server, including Express, CORS, .env, Body parser, port and router
Artificial intelligence tool such as ChatGPT is used for code generation.
*/

// Express
const express = require("express");
const app = express();

// CORS
var cors = require("cors");
app.use(cors());

// .env
require("dotenv").config();

// Body parser
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set up the server to listen on port 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Set up the router
const userRouter = require("./user/route");
app.use("/user", userRouter);

const tweetRouter = require("./tweet/route");
app.use("/tweet", tweetRouter);

const acRouter = require("./accessControl/route");
app.use("/", acRouter);

const chatRouter = require("./chat/chat");
app.use("/chat", chatRouter);
