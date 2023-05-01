/* follow.js
 * PROGRAMMER: YICK Ka Ho (SID: 1155142189)
 * PURPOSE: Handle retrieval and creation/update of following record in database 
 * Artificial intelligence tool such as ChatGPT is used for code generation.
 */

const { query } = require("../database");
const { searchUserByUsername } = require("./user");

/**
PURPOSE: Search follow relationship between two users.
@param {string} follower - The username of the follower.
@param {string} followee - The username of the followee.
@param {string} status - The status of the follow relationship.
@returns {string} - A JSON string representing the search result or an error message.
*/

async function searchFollow(follower, followee, status) {
  try {
    if (follower && followee) {
      var followerId = await searchUserByUsername(follower, "true");
      followerId = JSON.parse(followerId)["result"][0].userId;

      var followeeId = await searchUserByUsername(followee, "true");
      followeeId = JSON.parse(followeeId)["result"][0].userId;

      var rows = await query(
        `SELECT * FROM Follow WHERE follower = ${followerId} AND followee = ${followeeId} AND status = "${status}";`
      );
    } else if (follower) {
      var followerId = await searchUserByUsername(follower, "true");
      followerId = JSON.parse(followerId)["result"][0].userId;
      var rows = await query(
        `SELECT * FROM Follow WHERE follower = ${followerId} AND status = "${status}";`
      );
    } else if (followee) {
      var followeeId = await searchUserByUsername(followee, "true");
      followeeId = JSON.parse(followeeId)["result"][0].userId;
      var rows = await query(
        `SELECT * FROM Follow WHERE followee = ${followeeId} AND status = "${status}";`
      );
    }

    return `{"message": "Retrieve succeeded", "result": ${JSON.stringify(
      rows
    )}}`;
  } catch {
    return `{"message": "Search follow failed. Db error."}`;
  }
}

/**
PURPOSE: Follow or unfollow a user.
@param {string} follower - The username of the follower.
@param {string} followee - The username of the followee.
@param {string} status - The status of the follow relationship.
@returns {string} - A success message or an error message.
*/
async function followUser(follower, followee, status) {
  try {
    if (follower && followee) {
      var followerId = JSON.parse(await searchUserByUsername(follower, "true"))[
        "result"
      ][0].userId;
      var followeeId = JSON.parse(await searchUserByUsername(followee, "true"))[
        "result"
      ][0].userId;

      var recPending = JSON.parse(
        await searchFollow(follower, followee, "Pending")
      )["result"];
      var recAccepted = JSON.parse(
        await searchFollow(follower, followee, "Accepted")
      )["result"];

      if (recPending.length + recAccepted.length === 0 && !status) {
        throw `{"message": "Field(s) missing."}`;
      } else if (recPending.length + recAccepted.length === 0) {
        let x = await query(`INSERT INTO Follow (follower, followee, status)
                VALUES (${followerId}, ${followeeId}, "${status}");`);
      } else {
        if (status) {
          let x = await query(`UPDATE Follow
                    SET status = "${status}"
                    WHERE follower = ${followerId} AND followee = ${followeeId};`);
        } else {
          let x = await query(`DELETE FROM Follow
                    WHERE follower = ${followerId} AND followee = ${followeeId};`);
        }
      }
      return `{"message": "Follow/unfollow a user success"}`;
    } else {
      throw `{"message": "Field(s) missing."}`;
    }
  } catch (err) {
    if (err) return err;
    else return `{"message": "DB arises an error."}`;
  }
}

module.exports = { searchFollow, followUser };
