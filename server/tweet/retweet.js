const { query } = require("../database");
const { searchUserByUsername } = require("../user/user");
const { searchTweetByTweetId } = require("./tweet");

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
