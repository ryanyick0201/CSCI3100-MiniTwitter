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
const {
  findRoom,
  addRoom,
  addUsernameSocketDict,
  deleteUsernameSocketDict,
  getUsernameSocketDict,
} = require("./room.js");

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
  let SOCKET_ROOM_ID = -1;
  let USER_ID_PAIR = [];            // format: [ 1, 2 ]
  let USERNAME_ID_DICT = {};        // format: [ '1': 'user1, '2': 'user2']
  // let SOCKET_USERNAME_PAIR = [];
  let USERNAME_PAIR = [];           // format: [ 'user1', 'user2']
  let IN_ROOM_FLAG = false;


  socket.on("joinRoom", async (usernamePair) => {
    if(IN_ROOM_FLAG){
      console.log("already in room, now return");
      return;
    }

    IN_ROOM_FLAG = true;
    USERNAME_PAIR = usernamePair;
    // SOCKET_USERNAME_PAIR = usernamePair;
    console.log(`this is the socket.id that emitted 'joinroom' ${socket.id}`);
    console.log("joinRoom event triggered", usernamePair);
    console.log(
      `${usernamePair[0]} want to open a room with ${usernamePair[1]}`
    );

    // find userid of the pair
    USER_ID_PAIR = await findUserIdPair(usernamePair);
    USER_ID_PAIR.forEach((id, i) => {
      USERNAME_ID_DICT[id] = usernamePair[i];
    }); // note that userId key coerced to string

    console.log("userIdPair", USER_ID_PAIR);
    console.log("usernameIdDict", USERNAME_ID_DICT);

    addUsernameSocketDict(usernamePair[0], socket.id);

    // find room number, if not exist, open enw
    SOCKET_ROOM_ID = findRoom(USER_ID_PAIR);
    if (SOCKET_ROOM_ID == "-1") {
      SOCKET_ROOM_ID = addRoom(USER_ID_PAIR);
    }
    console.log("socketRoomId is", SOCKET_ROOM_ID);

    // join the room
    socket.join(SOCKET_ROOM_ID);

    // fetch chat history
    let result = await fetchChat(USER_ID_PAIR);
    console.log("chat history succesfully retreived");
    // console.log(result);
    // io.to(socket.id).emit(        "chat message",        `this is emit message after ${socket.id} join retrieving chat history`);

    // convert sender from userId to username
    const emitObj = [];
    for (chatObj of result) {
      // console.log(chatObj);
      chatObj = {
        ...chatObj,
        sender: USERNAME_ID_DICT[String(chatObj["sender"])],
        receiver: USERNAME_ID_DICT[String(chatObj["receiver"])],
      };
      emitObj.push(chatObj);
    }
    // emit to the client
    console.log("the parsed emitObj is", emitObj);
    io.to(socket.id).emit("chatHistory", emitObj);

    // fetch and send chattedUserLists (chatted User of both user)
    sendChattedUsers(USER_ID_PAIR, USERNAME_PAIR, io);

    // start handling client sending message after join room
    
    console.log("reached line166");

    if(!IN_ROOM_FLAG) {
      console.log('reaching return statement of joinroom callback');
      return;
    }

  });

  socket.on(NEW_MESSAGE_EVENT, (data) => {
    if(IN_ROOM_FLAG){
      console.log("receive msg from client:" + data["message"]);
      // send to other client in the room
      io.in(SOCKET_ROOM_ID).emit(NEW_MESSAGE_EVENT, data);

      // write to the database
      if (!data["isImg"]) {
        writeChatToDb(data["message"], USER_ID_PAIR);
      }

      // fetch and send chattedUserLists (chatted User of both user)
      // call getChattedUser inside, and send 'chattedUser'
      sendChattedUsers(USER_ID_PAIR, USERNAME_PAIR, io);
    }
    else{
      console.log("inRoomFlag false, but receive msg from client:" + data["message"]);
    }
  });

  socket.on("leaveRoom", () => {
    console.log("leaveRoom event received");
    console.log(`inRoomFlag is ${IN_ROOM_FLAG}`);

    if(IN_ROOM_FLAG){
      socket.leave(SOCKET_ROOM_ID);
      console.log(`removed socket ${socket.id} from ${SOCKET_ROOM_ID}`);
      deleteUsernameSocketDict(USERNAME_PAIR[0], socket.id);
      // resetting all 'global varaibles'
      SOCKET_ROOM_ID = -1;
      USER_ID_PAIR = [];            // format: [ 1, 2 ]
      USERNAME_ID_DICT = {};        // format: [ '1': 'user1, '2': 'user2']
      // let SOCKET_USERNAME_PAIR = [];
      USERNAME_PAIR = [];           // format: [ 'user1', 'user2']
      IN_ROOM_FLAG = false;
      
    }
    IN_ROOM_FLAG = false;
    console.log(`setting inRoomFlag to ${IN_ROOM_FLAG}`);
    return;
  });


  // debugging event
  socket.on("test", () => {
    console.log("test received");
    return;
  });
  

  socket.on("disconnect", () => {
    if(IN_ROOM_FLAG){
      console.log("socket disconnected without leaving room");

      socket.leave(SOCKET_ROOM_ID);
      deleteUsernameSocketDict(USERNAME_PAIR[0], socket.id);
      // resetting all 'global varaibles'
      SOCKET_ROOM_ID = -1;
      USER_ID_PAIR = [];            // format: [ 1, 2 ]
      USERNAME_ID_DICT = {};        // format: [ '1': 'user1, '2': 'user2']
      // let SOCKET_USERNAME_PAIR = [];
      USERNAME_PAIR = [];           // format: [ 'user1', 'user2']
      IN_ROOM_FLAG = false;
    }
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
    // referenced hhttps://stackoverflow.com/questions/12413243/javascript-date-format-like-iso-but-local
    const now = new Date();
    let offsetToUTC = now.getTimezoneOffset() * 60 * 1000; // minutes offset to milliseconds
    let nowWithOffset = now - offsetToUTC;
    const newNow = new Date(nowWithOffset);
    const formattedTime = newNow.toISOString().replace("T", " ").slice(0, -5);

    let x = await query(
      `INSERT INTO Message (message, sendTime, sender, receiver, isImg)
        VALUES (?, ?, ?, ?, ?)`,
      [messageContent, formattedTime, userIdPair[0], userIdPair[1], false]
    );

    console.log("write chat to db success");
    return `{"message": "Create a tweet success"}`;
  } catch {
    console.log("write chat to db failed. db error.");

    return `{"message": "write chat to db failed. db error."}`;
  }
}

async function getChattedUser(userId) {
  try {
    let chattedUser = await query(`
      SELECT chatteduser 
      FROM
        ((SELECT max(sendTime) AS sendtime, sender AS chatteduser
        FROM message
        WHERE receiver = ${userId}
        GROUP BY sender, receiver)
        UNION
        (SELECT max(sendTime), receiver AS chatteduser
        FROM message
        WHERE sender = ${userId}
        GROUP BY sender, receiver)) AS combinedTable
      GROUP BY chatteduser
      ORDER BY max(sendtime) DESC `);

    // console.log("chattedUser is", chattedUser);
    chattedUser = chattedUser.map((obj) => obj.chatteduser);
    const chattedUserList = [];
    for (const userId of chattedUser) {
      // console.log(userId);
      const username = await query(
        `SELECT u.username FROM User u WHERE u.userId = ${userId}`
      );
      // console.log(username);
      chattedUserList.push(username[0]["username"]);
    }
    return chattedUserList;
  } catch {
    console.log("Retrieve chatted failed. DB error when getting chattable");
    return ["Retrieve chatted failed. DB error when getting chattable"];
  }
}

async function sendChattedUsers(userIdPair, usernamePair, bigIOsocket) {
  // fetch chatted user
  let chattedUserList0 = await getChattedUser(userIdPair[0]);
  // console.log('chattedUserList0', chattedUserList0);
  let chattedUserList1 = await getChattedUser(userIdPair[1]);
  // console.log('chattedUserList1', chattedUserList1);

  let user0SocketList = getUsernameSocketDict(usernamePair[0]);
  let user1SocketList = getUsernameSocketDict(usernamePair[1]);

  for (const socketID of user0SocketList) {
    bigIOsocket.to(socketID).emit("chattedUser", chattedUserList0);
  }
  for (const socketID of user1SocketList) {
    bigIOsocket.to(socketID).emit("chattedUser", chattedUserList1);
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
