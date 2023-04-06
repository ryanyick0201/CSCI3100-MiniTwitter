/*
Step 0: call all the libraries / modules (e.g. http, socket.io)
Step 1: create several functions as follow:
	1. Open room / load chats
		- Check if two users (we call them A and B) have any chats before
		- If yes, then use the room and send the past chats back to A and B
		- If no, then create a new room
		- Keep it simple
			- You need not show if a user is online or not
			- The messages data of the format [{"sender": 1, "receiver": 2, "message": "XYZ", "sendTime": "..."}, {"sender": "Y", "receiver": "X", "message": "XZY", "sendTime": "..."}]. It means that it is an array of messages, each has the sender userId, receiver userId and the message content, and the time
			- It's preferred to sort the data with the sendTime (in descending order)
			- You'll know how to do sql queries when you go through other files

	2. Listen for chat messages
		- When a user A sends a message,
		- B should be able to receive the message {"sender": 1, "receiver": 2, "message": "XYZ", "sendTime": "..."}
		- Make sure you don't broadcast the message to other people (except A and B)

	* You may want to alter the SQL database, just go ahead.
	* Check the UML document and chat branch on GitHub (FE is also working on chat function) for more design details.

Step 2: export the functions
Step 3: write codes on server.js to integrate the module into the server

*/

// This video gives you lots of hints: https://www.youtube.com/watch?v=jD7FnbI76Hg&ab_channel=TraversyMedia
// Check the description box for the GitHub code too. You'll know more about how it works (and copy half of the code).

// calling libraries

const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());

const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");
const { query } = require("../database");
const { searchUserByUsername } = require("../user/user");
const { findRoom, addRoom } = require("./room.js");

const PORT = 3030;
const NEW_MESSAGE_EVENT = "newMessageEvent";

const server = http.createServer(app);
const io = socketIO(server, {
  cors: true,
  origins: ["localhost:3000"],
});

app.use(cors());

io.on("connection", async (socket) => {
  console.log(`a user connected, the socket.id is ${socket.id}`);
  let socketRoomId = -1;
  let userIdPair = [];
  let usernameIdDict = {};

  // debugging event
  socket.on("joinRoom0", () => {
    console.log("user clicked joinRoom0");
    socket.join("0");
  });

  // debugging event
  socket.on("sendTestToRoom0", () => {
    console.log("user pressed sendTestToRoom0");
    io.to("0").emit("chat message", "this is a test message to room0");
    // io.to('0').emit('to console', 'asdfasdf');
  });

  socket.on("joinRoom", async (usernamePair) => {
    console.log(`this is the socket.id that emitted 'joinroom' ${socket.id}`);
    console.log("joinRoom event triggered", usernamePair);
    console.log(
      `${usernamePair[0]} want to open a room with ${usernamePair[1]}`
    );

    // find userid of the pair
    userIdPair = await findUserIdPair(usernamePair);
    userIdPair.forEach((id, i) => {
      usernameIdDict[id] = usernamePair[i];
    }); // note that userId key coerced to string

    console.log("userIdPair", userIdPair);
    console.log("usernameIdDict", usernameIdDict);

    // find room number, if not exist, open enw
    socketRoomId = findRoom(userIdPair);
    if (socketRoomId == "-1") {
      socketRoomId = addRoom(userIdPair);
    }
    console.log("socketRoomId is", socketRoomId);

    // join the room
    await socket.join(socketRoomId);

    // testing code after joining the room
    // for unknown reason, sending to room requires me to call io object directly
    // if use original socket inside the joinroom callback, it does not work
    // socket.emit('chat message', 'this is emit message after join room, emit not room');
    // socket.in(socketRoomId).emit('chat message', 'this is emit message after join room, emit in room');
    // io.to(socketRoomId).emit('chat message', 'this is emit message after join room, emit to room');

    // fetch chat history
    fetchChat(userIdPair).then((result) => {
      console.log("chat history succesfully retreived");
      // console.log(result);
      io.to(socket.id).emit(
        "chat message",
        `this is emit message after ${socket.id} join retrieving chat history`
      );

      const emitObj = [];
      for (chatObj of result) {
        console.log(chatObj);
        chatObj = {
          ...chatObj,
          sender: usernameIdDict[String(chatObj["sender"])],
          receiver: usernameIdDict[String(chatObj["receiver"])],
        };
        emitObj.push(chatObj);
      }

      console.log("the parsed emitObj is", emitObj);
      // io.to(socket.id).emit("chatHistory", emitObj);
    });
  });

  // handle client sending message
  socket.on(NEW_MESSAGE_EVENT, (data) => {
    console.log("receive msg from client:" + data["message"]);

    // send to other client in the room
    io.in(socketRoomId).emit(NEW_MESSAGE_EVENT, data);

    // write to the database
    if (!data["isImg"]) {
      writeChatToDb(data["message"], userIdPair);
    }
  });

  // debugging event
  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
    io.to("0").emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    // socket.leave(socketRoomId);
    console.log("user disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});

async function findUserIdPair(usernamePair) {
  try {
    var id1 = await searchUserByUsername(usernamePair[0], "true");
    var id2 = await searchUserByUsername(usernamePair[1], "true");
    id1 = JSON.parse(id1).result[0].userId;
    id2 = JSON.parse(id2).result[0].userId;
    const userIdPair = [id1, id2];
    // console.log(userIdPair);
    return userIdPair;
  } catch {
    console.log("findUserIdPair failed,  db error.");
    return `{"message": "findUserIdPair failed. db error."}`;
  }
}

async function fetchChat(userIdPair) {
  // console.log("this is start of fetchChat, at this point userIdPair is ");
  // console.log(userIdPair);
  // fetch userId
  // console.log('starting to fetch userids');
  // let userIds = await findUserIdPair(usernamePair);
  // console.log('userIds are', userIds)
  // fetch chat
  try {
    let rows = await query(
      `SELECT *
            FROM Message m
            WHERE (m.sender = ${userIdPair[0]} and m.receiver = ${userIdPair[1]}) OR (m.sender = ${userIdPair[1]} and m.receiver = ${userIdPair[0]}) 
            ORDER BY sendTime ASC;`
    );
    console.log("Retrieve chats success");
    return rows;
  } catch {
    console.log("Retrieve chats failed. DB error");
  }
}

async function writeChatToDb(messageContent, userIdPair) {
  try {
    const now = new Date();
    const formattedTime = now.toISOString().replace("T", " ").slice(0, -5);

    let x = await query(
      `INSERT INTO Message (message, sendTime, sender, receiver, isFile)
        VALUES (?, ?, ?, ?, ?)`,
      [messageContent, formattedTime, userIdPair[0], userIdPair[1], false]
    );

    console.log("write chat to db success");
    return `{"message": "Create a tweet success"}`;
  } catch {
    return `{"message": "write chat to db failed. db error."}`;
  }
}

router.get("/", async (req, res) => {
  res.send("this is chat!");
});

// req query username=...
router.get("/chatTables", async (req, res) => {
  const username = req.query.username || "";
  // fetch userId
  var id = await searchUserByUsername(username, "true");
  id = JSON.parse(id).result[0].userId;
  // console.log(`the id found is ${id}`);
  // fetch follower and following
  try {
    let chattable = await query(`(SELECT f.followee as chattable
            FROM Follow f  
            WHERE f.follower = ${id} AND status = 'Accepted')
            INTERSECT
            (SELECT f.follower as chattable
            FROM Follow f  
            WHERE f.followee = ${id} AND status = 'Accepted')
            ORDER BY chattable ASC;`);

    // console.log(chattable);
    chattable = chattable.map((obj) => obj.chattable);
    // console.log("chattable is", chattable) ;
    const returnObj = [];
    for (const userId of chattable) {
      // console.log(userId);
      const username = await query(
        `SELECT u.username FROM User u WHERE u.userId = ${userId}`
      );
      // console.log(username);
      returnObj.push(username[0]["username"]);
    }

    console.log(returnObj);
    res.send(returnObj);
  } catch (error) {
    console.log("the error is", error);
    console.log("Retrieve chattable failed. DB error when getting chattable");
  }
});

router.get("/chattedUser", async (req, res) => {
  const username = req.query.username || "";
  // fetch userId
  var id = await searchUserByUsername(username, "true");
  id = JSON.parse(id).result[0].userId;
  // console.log(`the id found is ${id}`);
  // fetch follower and following
  try {
    let chattedUser = await query(`(SELECT DISTINCT m.receiver as chattedUser
            FROM Message m
            WHERE m.sender = ${id})
            UNION 
            (SELECT DISTINCT m.sender as chattedUser
            FROM Message m
            WHERE m.receiver = ${id})`);

    // console.log(chattable);
    chattedUser = chattedUser.map((obj) => obj.chattedUser);
    // console.log("chattable is", chattable) ;
    const returnObj = [];
    for (const userId of chattedUser) {
      // console.log(userId);
      const username = await query(
        `SELECT u.username FROM User u WHERE u.userId = ${userId}`
      );
      // console.log(username);
      returnObj.push(username[0]["username"]);
    }

    console.log(returnObj);
    res.send(returnObj);
  } catch {
    console.log("Retrieve chattable failed. DB error when getting chattable");
  }
});

module.exports = router;
