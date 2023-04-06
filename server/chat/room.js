// rooms contains userID pairs, socketID is the index of the pair in rooms
const rooms = [
  [1, 2],
  [3, 4],
];

// function sortUsername(usernameArr){
//     if (usernameArr[0] > usernameArr[1]){
//         let tmpstring = '';
//         tmpstring = usernameArr[0];
//         usernameArr[0] = username2;
//         usernameArr[1] = tmpstring;
//     }
//     return usernameArr;
// }

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

  console.log("now room is", rooms);
  return (rooms.push(userIdPair) - 1).toString();
}

module.exports = {
  findRoom,
  addRoom,
};
