// rooms contains userID pairs, socketID is the index of the pair in rooms
const rooms = [
  [1, 2],
  [3, 4],
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
