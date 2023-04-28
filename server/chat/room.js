/*
room.js - function library to handle user data, socket data and room placement
Contributor: Tai Tsun Yiu
Purpose: Provide helper functions for chat.js, and also store user-socket data.
Explanation: 
When the server starts, an empty list - rooms and an empty object - usernameSocketDict is created.
addUsernameSocketDict: When a user open the chat page, addUsernameSocketDict is called. The socketId the user will be added to the list (value) of the key-value pair of that username. If the username does not exist, a new key-pair will be created.
deleteUsernameSocketDict: When a user close/leave the chat page, deleteUsernameSocketDict is called. The socketId the user will be deleted from the list (value) of the key-value pair of that username.
findRoom: When a user open a chat room with a target user, the function return the existing room number (index of the username pair -1) for the usernIdPair exists in rooms. 
addRoom: If findRoom returns -1 (i.e. room not exist), addRoom will be called to add a new room. The room number is returned.

Inclusion of libraries in the list below implies the use of source code and citing its documentation. 
These libraries may depend on external libraries which are not mentioned here. For more information, please refer to the documentation of each libraries.
Libraries used:

Reference List:
  1.  Name: JavaScript Array pop()
      Author: W3Schools
      Link: https://www.w3schools.com/jsref/jsref_pop.asp

  2.  Name: #1 answer of Js check if pair exists in array of pairs
      Author: Majed Badawi
      Link: https://stackoverflow.com/a/67199788

  */




// rooms contains userID pairs, socketID is the index of the pair in rooms
const rooms = [
  // [1, 2],
  // [3, 4],
];

let usernameSocketDict = {};

// function sortUsername(usernameArr){
//     if (usernameArr[0] > usernameArr[1]){
//         let tmpstring = '';
//         tmpstring = usernameArr[0];
//         usernameArr[0] = username2;
//         usernameArr[1] = tmpstring;
//     }
//     return usernameArr;
// }

function addUsernameSocketDict(username, socketID) {
  let array = [];
  if (usernameSocketDict.hasOwnProperty(username)) {
    array = usernameSocketDict[username];
  }
  const index = array.indexOf(socketID);
  if (index == -1) {
    // only push the socket into the array when item is not found
    array.push(socketID);
  }

  usernameSocketDict[username] = array;
  console.log(`added user ${username}: ${socketID}`);
  console.log(`usernameSocketDict is`);
  console.log(usernameSocketDict);
}

function deleteUsernameSocketDict(username, socketID) {
  let array = [];
  if (usernameSocketDict.hasOwnProperty(username)) {
    array = usernameSocketDict[username];
  }
  const index = array.indexOf(socketID);
  if (index > -1) {
    // only splice array when item is found
    array.splice(index, 1); // 2nd parameter means remove one item only
  }
  usernameSocketDict[username] = array;
  console.log(`deleted user ${username}: ${socketID}`);
  console.log(`usernameSocketDict is`);
  console.log(usernameSocketDict);
}

function getUsernameSocketDict(username) {
  let array = [];
  if (usernameSocketDict.hasOwnProperty(username)) {
    array = usernameSocketDict[username];
  }
  return array;
}

// see if room exist or not
/*
function findRoom contain code snippets adapted and modified from #1 answer of Js check if pair exists in array of pairs
Name: #1 answer of Js check if pair exists in array of pairs
Author: Majed Badawi
Date: Apr 21, 2021
Link: https://stackoverflow.com/a/67199788
License: CC BY-SA 4.0
*/
function findRoom(userIdPair) {
  // swap username1 and 2 if 1 is larger than 2
  // usernameArr = sortUsername(usernameArr);
  let sortedUserIdPair = [];
  if (userIdPair[0] < userIdPair[1]) {
    sortedUserIdPair = userIdPair;
  } else {
    sortedUserIdPair = [userIdPair[1], userIdPair[0]];
  }

  return rooms
    .findIndex(
      (o) => o[0] == sortedUserIdPair[0] && o[1] == sortedUserIdPair[1]
    )
    .toString();
}

// add new room to rooms
function addRoom(userIdPair) {
  // push ther username pair to rooms
  // push will return the length of resulting array
  // so -1 to return the index
  if (userIdPair[0] < userIdPair[1]) {
    const sortedUserIdPair = userIdPair;
  } else {
    const sortedUserIdPair = [userIdPair[1], userIdPair[0]];
  }
  roomId = (rooms.push(userIdPair) - 1).toString();
  console.log("now room is", rooms);
  return roomId;
}

module.exports = {
  findRoom,
  addRoom,
  addUsernameSocketDict,
  deleteUsernameSocketDict,
  getUsernameSocketDict,
};
