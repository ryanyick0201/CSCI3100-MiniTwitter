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

/*
chat.js - chat room functions
Contributor: Tai Tsun Yiu
Purpose: Create a socket.io socket instance on the server, handle all incoming joinroom and sending message event
Explanation: 
When a user joins a chatroom, the server will create a socket.io instance with it. The socket will listen for below events from the user:
reqChatted: get the list of users that the user chatted with before and send it to the client
joinRoom: when user chooses another user to chat with, the user's socket will be placed in room of that user pair, fetch the chat history between the user and send it to the client, 
newMessageEvent: listen for message sent from the client, write the message to the database. If the message is image, the image will be uploaded to our S3 file server. Then, the message will be emitted to all users in the room.

The server also responds to http GET request query for the list of user that a user can chat with.

Inclusion of libraries in the list below implies the use of source code and citing its documentation. 
These libraries may depend on external libraries which are not mentioned here. For more information, please refer to the documentation of each libraries.
Libraries used:
  1.  Name: Socket.io software and documentation
      Author: Socket.io development team
      Link: https://github.com/socketio/socket.io
      License: MIT License
      
  2.  Name: ExpressJS software and documentation
      Author: ExpressJS development team
      Link: https://github.com/expressjs/express
      License: MIT License

  3.  Name: bodyParser software and documentation
      Author: bodyParser development team
      Link: https://github.com/expressjs/body-parser
      License: MIT License

  4.  Name: cors software and documentation
      Author: cors development team
      Link: https://github.com/expressjs/cors
      License: MIT Liscense

  5.  Name: Node.js (including http and crypto)
      Author: Node.js development team
      Link: https://github.com/nodejs/node/tree/v18.0.0
      License: MIT Liscense 


Reference List:
  1.  Name: #1 answer of Javascript date format like ISO but local
      Author: Denis Howe
      Link: https://stackoverflow.com/a/51643788
      License: CC BY-SA 4.0

  2.  Name: #1 answer of How to use DISTINCT and ORDER BY in same SELECT statement?
      Author: Prutswonder
      Link: https://stackoverflow.com/a/5391642
      License: CC BY-SA 4.0

  3.  Name: React with Socket.IO Messaging App
      Author: peterhle
      Link: https://keyholesoftware.com/2021/04/01/react-with-socket-io-messaging-app/
            https://github.com/peterhle/react-socket-io
      License: MIT License

  4.  Name: #1 answer of Create an object from an array of keys and an array of values
      Author: georg
      Link: https://stackoverflow.com/a/39128144
      License: CC BY-SA 4.0

  5.  Name: s3-get-put-and-delete
      Author: 
      Link: https://github.com/meech-ward/s3-get-put-and-delete

  6.  Name: #1 answer of Create an object from an array of keys and an array of values
      Author: jfriend00
      Link: https://stackoverflow.com/a/36418598
      License: CC BY-SA 4.0

  7.  Name: #1 answer of How to check file MIME type with JavaScript before upload?
      Author: Drakes & Hassan Baig
      Link: https://stackoverflow.com/a/29672957
      License: CC BY-SA 4.0

  8.  Name: #1 answer of How to access a javascript object value without knowing the key
      Author: D.Shawley & Elliot Bonneville
      Link: https://stackoverflow.com/a/12344684
      License: CC BY-SA 4.0

  9.  Name: #1 answer of How can I remove a specific item from an array in JavaScript?
      Author: Justin Liu
      Link: https://stackoverflow.com/a/5767357
      License: CC BY-SA 4.0

  10. Name: #1 answer of JavaScript set object key by variable
      Author: gen_Eric
      Link: https://stackoverflow.com/a/11508490
      License: CC BY-SA 4.0

Artificial intelligence tool such as ChatGPT was used during development to assist code generation. Code snippet generated by AI may be taken directly, or modified and put into production code.

*/

// calling libraries

const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());

const cors = require("cors");
const http = require("http");
const crypto = require('crypto')      // for randcomized image name
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
const {uploadFile, deleteFile, getObjectSignedUrl} = require('../multimedia/image');


const PORT = 3030;
const NEW_MESSAGE_EVENT = "newMessageEvent";

const server = http.createServer(app);
const io = socketIO(server, {
  cors: true,
  origins: ["localhost:3000"],
  maxHttpBufferSize: 1e9 // increased from default 1e3 to handle large photos
});

app.use(cors());

/*
Purpose: create a socket.io instance for each new useer establishing connection
*/
io.on("connection", async (socket) => {
  console.log(`a user connected, the socket.id is ${socket.id}`);

  // create a set of global variables for the socket
  let SOCKET_ROOM_ID = -1;
  let USER_ID_PAIR = [];            // format: [ 1, 2 ]
  let USERNAME_ID_DICT = {};        // format: [ '1': 'user1, '2': 'user2']
  // let SOCKET_USERNAME_PAIR = [];
  let USERNAME_PAIR = [];           // format: [ 'user1', 'user2']
  let IN_ROOM_FLAG = false;

  // listen for "reqChatted" event from client and emit the list of chatted users with the "chattedUser" event
  socket.on("reqChatted", async (username) => {
    console.log("reqChatted received, the username is,", username);
    var id = await searchUserByUsername(username, "true");
    id = JSON.parse(id).result[0].userId;
    let chattedUserList = await getChattedUser(id);
    io.to(socket.id).emit("chattedUser", chattedUserList);
  });

  // listen for "joinRoom" event, 
  socket.on("joinRoom", async (usernamePair) => {
    console.log("received joinRoom, usernamePair is", usernamePair);
    if(usernamePair[1]==""){
      console.log("recipient empty, now return");
      return;
    }
    if(IN_ROOM_FLAG){
      console.log("already in room, now return");
      return;
    }

    // fix username if there is \n
    if(usernamePair[1].includes("\n")){
      console.log("forward-slashn in username, now remove,", usernamePair)
      USERNAME_PAIR[0] = usernamePair[0];
      USERNAME_PAIR[1] = usernamePair[1].replaceAll("\n", "");  
      console.log("USERNAME_PAIR now is,", USERNAME_PAIR)
    } else{    
	    USERNAME_PAIR = usernamePair;
    }

    IN_ROOM_FLAG = true;
  
    // SOCKET_USERNAME_PAIR = usernamePair;
    console.log(`this is the socket.id that emitted 'joinroom' ${socket.id}`);
    console.log("joinRoom event triggered", usernamePair);
    console.log(
      `${USERNAME_PAIR[0]} want to open a room with ${USERNAME_PAIR[1]}`
    );

    // find userid of the pair
    // note that userId key coerced to string
    USER_ID_PAIR = await findUserIdPair(USERNAME_PAIR);
    USER_ID_PAIR.forEach((id, i) => {
      USERNAME_ID_DICT[id] = USERNAME_PAIR[i];
    }); 

    console.log("userIdPair", USER_ID_PAIR);
    console.log("usernameIdDict", USERNAME_ID_DICT);

    addUsernameSocketDict(USERNAME_PAIR[0], socket.id);

    // find room number, if not exist, open new
    SOCKET_ROOM_ID = findRoom(USER_ID_PAIR);
    if (SOCKET_ROOM_ID == "-1") {
      SOCKET_ROOM_ID = addRoom(USER_ID_PAIR);
    }
    console.log("socketRoomId is", SOCKET_ROOM_ID);

    // join the room
    socket.join(SOCKET_ROOM_ID);

    // fetch chat history and send to client
    let result = await fetchChat(USER_ID_PAIR);
      console.log("chat history succesfully retreived");
      // console.log(result);
      // io.to(socket.id).emit("chat message",`this is emit message after ${socket.id} join retrieving chat history`);

      // convert sender from userId to username & add imgUrl & convert sendTime back to UTC+8
      const emitObj = [];
      for (chatObj of result) {
        let url = "";
        if (chatObj.isImg){
          url = await getObjectSignedUrl(chatObj.fileName);
        }

        chatObj = {
          ...chatObj,
          sender: USERNAME_ID_DICT[String(chatObj["sender"])],
          receiver: USERNAME_ID_DICT[String(chatObj["receiver"])],
          sendTime: parseDateToUTC8(chatObj.sendTime),
          imgUrl: url
        };
        emitObj.push(chatObj);
      }
      // emit to the client
      console.log("the parsed emitObj is", emitObj);
      io.to(socket.id).emit("chatHistory", emitObj);

    // fetch and send chattedUserLists (chatted User of both user)
    sendChattedUsers(USER_ID_PAIR, USERNAME_PAIR, io);


    // console.log("reached line166");

    if(!IN_ROOM_FLAG) {
      console.log('reaching return statement of joinroom callback');
      return;
    }

  });
  

  /*
  Purpose: listen to NEW_MESSAGE_EVENT from user. 
  If the message is not image, it will be written to the db directly, and broadcast to the socket room members. 
  Else, the image will be upload to AWS S3 bucket, and the URL to the image will be broadcst to the socket room members.
  */
  socket.on(NEW_MESSAGE_EVENT, async (data) => {
    if(!IN_ROOM_FLAG){
      console.log("inRoomFlag false, but receive msg from client:" + data["message"]);
      return;
    }
    
    console.log("receive msg from client, isImg" + data["isImg"]);

    if(!data.isImg){
      console.log("receive !isImg msg from client:" + data["message"]);
      
      // send to other client in the room
      io.in(SOCKET_ROOM_ID).emit(NEW_MESSAGE_EVENT, data);
      // write to the database
      writeChatToDb(data["message"], USER_ID_PAIR);
    }
    
    else{ // msg isImg
    // genereate random name
    let randomName = crypto.randomBytes(32).toString('hex');

    console.log('received isImg msg from client');
    console.log(data.message.file);
    console.log(data.message.mimeType);
    console.log(randomName);
    const x = await uploadFile(data.message.file, randomName, data.message.mimeType);   
    console.log(x);

    const writeChatToDbReturnObj = await writeChatToDb(randomName, USER_ID_PAIR, randomName, data.message.mimeType);
    const url = await getObjectSignedUrl(randomName);
    

    const dataToRoom = {
      sender: data.sender,
      recipient: data.recipient,
      isImg: true,
      sendTime: data.sendTime,
      imgUrl: url 
    }      
    io.in(SOCKET_ROOM_ID).emit(NEW_MESSAGE_EVENT, dataToRoom);
  }


    // fetch and send chattedUserLists (chatted User of both user)
    // call getChattedUser inside, and send 'chattedUser'
    sendChattedUsers(USER_ID_PAIR, USERNAME_PAIR, io);
  });

  /*
  Purpose: listen to leaveroom from user and remove the user's socket from the room.
  */
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

  /*
  Purpose: handles user's socket disconnection, i.e. close the browser or going to another page
  */
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

/*
Purpose: finding the userId of the usernamePair
*/
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

/*
Purpose: retrieve chat history from database of the usernamePair
@param {array} userIdPair - user Ids of the pair of the user that we fetch the chat history
@return A message indicating if the retrieval failed, or an object containing chat history.
*/

async function fetchChat(userIdPair) {

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

// parse javascript Date To UTC8 string format
/*
function parseDateToUTC8 is adapted and modified from #1 answer of https://stackoverflow.com/questions/12413243/javascript-date-format-like-iso-but-local 
title: 
author: Denis Howe
date: Oct 29, 2022
link: https://stackoverflow.com/a/51643788
license: CC BY-SA 4.0
*/
/*
Purpose: parse DateTime object to UTC8
@param {array} dateObject - javascript DateTime object
@return {string} formattedTime - date string in the desired format and UTC8
*/
function parseDateToUTC8 (dateObject){
    let offsetToUTC = dateObject.getTimezoneOffset() * 60 * 1000; // minutes offset to milliseconds
    let nowWithOffset = dateObject - offsetToUTC;
    const newNow = new Date(nowWithOffset);
    const formattedTime = newNow.toISOString().replace("T", " ").slice(0, -5);
  return formattedTime;
}

/*
Purpose: writing chat message to database 
@param {object} messageContent - message object, which may be text message or image
@param {object} userIdPair - related sender's and recipient's of the message
@param {string} fileName - fileName of the sent file
@param {string} mimeType - fileType of the sent file

@return {string}  a message indicating whether the set OTP operation was successful or not
*/
async function writeChatToDb(messageContent, userIdPair, fileName=null, mimeType=null) {
  try {
    const now = new Date();
    // let offsetToUTC = now.getTimezoneOffset() * 60 * 1000; // minutes offset to milliseconds
    // let nowWithOffset = now - offsetToUTC;
    // const newNow = new Date(nowWithOffset);
    // const formattedTime = newNow.toISOString().replace("T", " ").slice(0, -5);
    const formattedTime = parseDateToUTC8(now);


    if (fileName == null || mimeType == null){
    let x = await query(
      `INSERT INTO Message (message, sendTime, sender, receiver, isImg, fileName, mimeType)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [messageContent, formattedTime, userIdPair[0], userIdPair[1], false, null, null]
    );} 
    
    else{
      let x = await query(
        `INSERT INTO Message (message, sendTime, sender, receiver, isImg, fileName, mimeType)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [messageContent, formattedTime, userIdPair[0], userIdPair[1], true, fileName, mimeType]
      );
    }

    console.log("write chat to db success");
    return `{"message": "Write chat to db success"}`;
  } catch {
    console.log("write chat to db failed. db error.");
    return `{"message": "write chat to db failed. db error."}`;
  }
}

// helper function to retrieve the list of chatted user
/*
function getChattedUser contain code snippets adapted and modified from #1 answer of How to use DISTINCT and ORDER BY in same SELECT statement?
Name: #1 answer of How to use DISTINCT and ORDER BY in same SELECT statement?
Author: Prutswonder
Date: Dec 28, 2017
Link: https://stackoverflow.com/a/51643788
License: CC BY-SA 4.0
*/
/*
Purpose: retrieve the list of chatted user
@param {object} userId - user Id of the user that we retrieve the list of chatted user
@return {object} or {string} a list of chatted user username or a message indicating the operation was unsuccessful
*/

async function getChattedUser(userId) {
  try {

    console.log('getChattedUser starts, userId is', userId);

    let chattedUser = await query(`
      SELECT chatteduser 
      FROM
        ((SELECT max(sendTime) AS sendtime, sender AS chatteduser
        FROM Message
        WHERE receiver = ${userId}
        GROUP BY sender, receiver)
        UNION
        (SELECT max(sendTime), receiver AS chatteduser
        FROM Message
        WHERE sender = ${userId}
        GROUP BY sender, receiver)) AS combinedTable
      GROUP BY chatteduser
      ORDER BY max(sendtime) DESC `);

    console.log("sql result of chattedUser is", chattedUser);

    chattedUser = chattedUser.map((obj) => obj.chatteduser);
    const chattedUserList = [];
    for (const userId of chattedUser) {
      // console.log(userId);
      const username = await query(
        `SELECT u.username FROM User u WHERE u.userId = ${userId};`
      );
      // console.log(username);
      chattedUserList.push(username[0]["username"]);
    }
    console.log("mapped result is,", chattedUserList);
    return chattedUserList;
  } catch {
    console.log("Retrieve chatted failed. DB error when getting chattedUser");
    return ["Retrieve chatted failed. DB error when getting chattedUser"];
  }
}

/*
Purpose: send the list of chatted usernames in reverse time order to all sockets of each user of the usernamePair
@param {object} userIdPair - user Id pair of the chatroom
@param {object} usernamePair - username pair of the chatroom
@param {object} bigIOsocket - socket object that the script uses
@return {null}
*/
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

/*
Purpose: testing route, response to GET request to see whether is up
*/
router.get("/", async (req, res) => {
  res.send("this is chat!");
});

/*
Purpose: listen to http GET query at /chatTables, respond with the list of username that the user can chat with
*/
router.get("/chatTables", async (req, res) => {
  console.log("**************\nrecevied get request at /chatTables**************\n")

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
        `SELECT u.username FROM User u WHERE u.userId = ${userId};`
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

/*
Purpose: listen to http GET query at /chattedUser, respond with the list of username that the user has chattet with
*/
router.get("/chattedUser", async (req, res) => {
  console.log("**************\nrecevied get request at /chatttedUser**************\n")


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
        `SELECT u.username FROM User u WHERE u.userId = ${userId};`
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
