/* retweet.js
PROGRAMMER: YICK Ka Ho (SID: 1155142189)
PURPOSE: Handle retweet related routes such as retweeting a tweet and viewing retweeted tweets
Artificial intelligence tool such as ChatGPT is used for code generation.
*/
const { query } = require("../database");
const { searchUserByUsername } = require("../user/user");
const { searchTweetByTweetId } = require("./tweet");

/**
PURPOSE: Retrieves all the tweets that a user has retweeted
@param {string} senderUsername - the username of the user
@returns {string} a JSON string indicating the retrieval status and the retrieved tweets
*/
async function viewRetweet(senderUsername) {
  try {
    var tweetIds = await query(
      `SELECT tweetId from Tweetretweet r, User u WHERE u.username = ? and r.senderId = u.userId;`,
      [senderUsername]
    );
    tweetIds = tweetIds.map((tweetId) => tweetId.tweetId);

    // console.log(tweetIds);

    var tweets = [];
    for (let i = 0; i < tweetIds.length; i++) {
      let x = await searchTweetByTweetId(tweetIds[i]);
      tweets.push(x[0]);
    }
    // console.log(tweets);

    tweets = tweets.filter((tweet) => !tweet.archived);
    return `{"message": "Retrieve succeeded", "result": ${JSON.stringify(
      tweets
    )}}`;
  } catch {
    return `{"message": "View retweet failed. Db error."}`;
  }
}

/**
PURPOSE: Records a retweet by a user for a tweet
@param {number} tweetId - the ID of the tweet to retweet
@param {string} senderUsername - the username of the user retweeting the tweet
@returns {string} a message indicating whether the retweet operation was successful or not
*/
async function retweet(tweetId, senderUsername) {
  try {
    var sid = await searchUserByUsername(senderUsername, "true");
    sid = JSON.parse(sid)["result"][0].userId;
  } catch {
    return `{"message": "Search user by username failed. Db error."}`;
  }

  try {
    var now = new Date();
    var formattedTime = now.toISOString().replace("T", " ").slice(0, -5);

    var x = await query(`INSERT INTO TweetRetweet (tweetId, senderId, retweetTime)
        VALUES (${tweetId}, ${sid}, "${formattedTime}");`);
    return `{"message": "Retweet success"}`;
  } catch {
    return `{"message": "Retweet failed. Db error."}`;
  }
}

module.exports = { retweet, viewRetweet };
