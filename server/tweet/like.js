/* like.js
PROGRAMMER: YICK Ka Ho (SID: 1155142189)
PURPOSE: Functions that support viewing and editing the like status of tweets with a certain user
Artificial intelligence tool such as ChatGPT is used for code generation.
*/
const { query } = require("../database");
const { searchUserByUsername } = require("../user/user");

/**
PURPOSE: view tweet likes/dislikes of a user or a tweet
@param {number} userId - the id of the user to view their tweet likes/dislikes
@param {string} username - the username of the user to view their tweet likes/dislikes (either userId or username is needed, but not both)
@param {number} tweetId - the id of the tweet to view its likes/dislikes
@returns {string} a message indicating whether the view tweet likes/dislikes operation was successful or not and the result in JSON format
*/
async function viewLikeTweetByUser(userId, username, tweetId) {
  try {
    let reqQuery = [userId, username];

    if (reqQuery.map((item) => !!item).reduce((a, b) => a + b, 0) === 2)
      throw "Too many fields";
  } catch (err) {
    return `{"message": "${err}"}`;
  }

  try {
    if (userId && !username) {
      var rows = await query(
        `SELECT * FROM TweetLike WHERE userId = ${userId} AND tweetId = ${tweetId};`
      );
    } else if (username && !userId) {
      var rows = await query(`
            SELECT t.tweetId, u.username, l.status
            FROM tweet t, user u, tweetlike l
            WHERE t.tweetId = l.tweetId AND u.userId = l.userId AND u.username = '${username}' AND t.tweetId = ${tweetId}
            ORDER BY tweetId, username;
            `);
    }

    return `{"message": "Retrieve succeeded", "result": ${JSON.stringify(
      rows
    )}}`;
  } catch (err) {
    return `{"message": "View tweet likes/dislikes failed. Db error."}`;
  }
}

/**
PURPOSE: like/dislike a tweet for a user
@param {string} username - the username of the user who likes/dislikes the tweet
@param {number} tweetId - the id of the tweet to be liked/disliked
@param {string} status - the status of the like/dislike operation. "like" if the tweet is liked, "dislike" if it's disliked, and null if the like/dislike record is to be deleted.
@returns {string} a message indicating whether the like/dislike tweet operation was successful or not
*/
async function likeTweet(username, tweetId, status) {
  try {
    var id = await searchUserByUsername(username, "true");
    id = JSON.parse(id)["result"][0].userId;

    var rec = await viewLikeTweetByUser(id, null, tweetId);
    rec = JSON.parse(rec)["result"];
  } catch {
    return `{"message": "Search user/likes failed. db error."}`;
  }

  try {
    if (rec.length === 0) {
      let x = await query(`INSERT INTO TweetLike (tweetId, userId, status)
            VALUES (${tweetId}, ${id}, "${status}");`);
    } else {
      if (status) {
        let x = await query(`UPDATE TweetLike
                SET status = "${status}"
                WHERE userId = ${id} AND tweetId = ${tweetId};`);
      } else {
        let x = await query(`DELETE FROM TweetLike
                WHERE userId = ${id} AND tweetId = ${tweetId};`);
      }
    }
    return `{"message": "Like/dislike a tweet success"}`;
  } catch {
    return `{"message": "Like/dislike tweet failed. Db error."}`;
  }
}

module.exports = { viewLikeTweetByUser, likeTweet };
