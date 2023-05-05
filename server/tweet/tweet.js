/* searchTweet.js
PROGRAMMER: YICK Ka Ho (SID: 1155142189)
PURPOSE: functions that support
(i)  search tweets for both user and other users with optional parameters,
(ii) creation of tweet
Artificial intelligence tool such as ChatGPT is used for code generation.
*/
const { query } = require("../database");

const { searchUserByUsername } = require("../user/user");

/**
PURPOSE: search self tweet by multiple optional parameters
@param {string} [username] - the username of the user to search tweet for
@param {string} [category] - the category to search tweet for
@returns {string} - a JSON string containing the search result or an error message
*/
//Map all tweets with username, content, postTime, category, #likes, #dislikes, #comments, #retweets
//Accept username, tweetContent and category as optional parameter
async function searchSelfTweetByMultiple(username, category) {
  category = category ? `t.category = '${category}' ` : "";
  //tweetContent = (tweetContent) ? `%${tweetContent}%` : "%%";
  username = username ? `u.username = '${username}'` : "";
  var hasAnd1 = category || username ? `and` : "";
  var hasAnd2 = category && username ? `and` : "";

  try {
    let rows = await query(`
        SELECT u.username, t.tweetId, t.tweetContent, t.postTime, t.category, t.archived, t.image, t.video,
        (select COUNT(*) userId from tweetLike l where l.tweetId = t.tweetId and l.status = "like" group by tweetId) AS likes,
        (select COUNT(*) userId from tweetLike l where l.tweetId = t.tweetId and l.status = "dislike" group by tweetId) AS dislikes,
        (select COUNT(*) commentId from tweetComment c where c.tweetId = t.tweetId group by tweetId) AS comment,
        (select COUNT(*) retweetTime from TweetRetweet r where r.tweetId = t.tweetId group by tweetId) AS retweet
        FROM tweet t, tweetlike l, user u
        WHERE t.creator = u.userId ${hasAnd1} ${category} ${hasAnd2} ${username}
        GROUP BY tweetId, category
        ORDER BY tweetId;
        `);

    return `{"message": "Retrieve succeeded", "result": ${JSON.stringify(
      rows
    )}}`;
  } catch (err) {
    return `{"message": "Retrieve tweet failed. db error."}`;
  }
}

/**
PURPOSE: search other user's tweet by multiple optional parameters
@param {string} myUsername - the username of the user to search tweet for
@param {string} lookForUsername - the username of the user to search tweet for
@param {string} [category] - the category to search tweet for
@returns {string} - a JSON string containing the search result or an error message
*/
async function searchOthersTweetByMultiple(
  myUsername,
  lookForUsername,
  category
) {
  if (!myUsername) throw `{"message": "myUsername missing."}`;

  if (category) {
    category = `t.category = "${category}" and`;
  } else {
    category = "";
  }

  myUserId = JSON.parse(await searchUserByUsername(myUsername, true))[
    "result"
  ][0]["userId"];
  lookForUserId = JSON.parse(await searchUserByUsername(lookForUsername, true))[
    "result"
  ][0]["userId"];

  let tweets = [];

  let rows = await query(`
    SELECT u.username, t.tweetId, t.tweetContent, t.postTime, t.category, t.archived, t.image, t.video, f.follower, f.followee, f.status,
    (select COUNT(*) userId from tweetLike l where l.tweetId = t.tweetId and l.status = "like" group by tweetId) AS likes,
    (select COUNT(*) userId from tweetLike l where l.tweetId = t.tweetId and l.status = "dislike" group by tweetId) AS dislikes,
    (select COUNT(*) commentId from tweetComment c where c.tweetId = t.tweetId group by tweetId) AS comment,
    (select COUNT(*) retweetTime from TweetRetweet r where r.tweetId = t.tweetId group by tweetId) AS retweet
    FROM tweet t, tweetlike l, user u, follow f
    WHERE t.creator = u.userId and t.archived IS NULL and f.followee = t.creator and
    f.follower = ${myUserId} and f.followee = ${lookForUserId} and ${category}
    f.status = "Accepted" and
    f.followee IN (SELECT UserId FROM User WHERE privacySetting = "follower")
    GROUP BY tweetId, category, follower, followee
    ORDER BY tweetId;
    `);

  if (rows.length > 0) {
    for (let i = 0; i < rows.length; i++) tweets.push(rows[i]);
  }

  rows = await query(`
    SELECT u.username, t.tweetId, t.tweetContent, t.postTime, t.category, t.archived, t.image, t.video,
    (select COUNT(*) userId from tweetLike l where l.tweetId = t.tweetId and l.status = "like" group by tweetId) AS likes,
    (select COUNT(*) userId from tweetLike l where l.tweetId = t.tweetId and l.status = "dislike" group by tweetId) AS dislikes,
    (select COUNT(*) commentId from tweetComment c where c.tweetId = t.tweetId group by tweetId) AS comment,
    (select COUNT(*) retweetTime from TweetRetweet r where r.tweetId = t.tweetId group by tweetId) AS retweet
    FROM tweet t, tweetlike l, user u
    WHERE ${category} t.creator = u.userId and t.archived IS NULL and u.privacySetting = 'public' and t.creator = ${lookForUserId}
    GROUP BY tweetId, category
    ORDER BY tweetId;
    `);

  if (rows.length > 0) {
    for (let i = 0; i < rows.length; i++) tweets.push(rows[i]);
  }

  console.log(tweets);
  return `{"message": "Retrieve succeeded", "result": ${JSON.stringify(
    tweets
  )}}`;
}

/**
PURPOSE: search tweets by tweetId
@param {integer} tweetId - the tweetId to search tweet for
@returns {string} - a JSON string containing the search result or null (if an error arises)
*/
async function searchTweetByTweetId(tweetId) {
  try {
    return await query(`
        SELECT u.username, t.tweetId, t.tweetContent, t.postTime, t.category, t.archived, t.image, t.video,
        (select COUNT(*) userId from tweetLike l where l.tweetId = t.tweetId and l.status = "like" group by tweetId) AS likes,
        (select COUNT(*) userId from tweetLike l where l.tweetId = t.tweetId and l.status = "dislike" group by tweetId) AS dislikes,
        (select COUNT(*) commentId from tweetComment c where c.tweetId = t.tweetId group by tweetId) AS comment,
        (select COUNT(*) retweetTime from TweetRetweet r where r.tweetId = t.tweetId group by tweetId) AS retweet
        FROM tweet t, tweetlike l, user u
        WHERE t.creator = u.userId and t.tweetId = ${tweetId}
        GROUP BY tweetId, category
        ORDER BY tweetId;
        `);
  } catch {
    return;
  }
}

/**
PURPOSE: create a new tweet to database
@param {string} username - the username to create tweet to
@param {string} tweetContent - the tweetContent of the tweet to be created
@param {string} category -  the category of the tweet to be created
@param {string} image -  the iamge file name of the tweet to be created
@param {string} video - the video file name to create tweet to
@returns {string} - a JSON string containing the search result or error message
*/
async function createTweet(username, tweetContent, category, image, video) {
  try {
    var id = await searchUserByUsername(username, "true");
    id = JSON.parse(id).result[0].userId;
  } catch {
    return `{"message": "Search user by username failed. db error."}`;
  }

  try {
    const now = new Date();
    const formattedTime = now.toISOString().replace("T", " ").slice(0, -5);

    let x = await query(
      `INSERT INTO Tweet (creator, tweetContent, postTime, category, image, video)
        VALUES (?, ?, ?, ?, ?, ?)`,
      [id, tweetContent, formattedTime, category, image, video]
    );

    return `{"message": "Create a tweet success"}`;
  } catch {
    return `{"message": "Create tweet failed. db error."}`;
  }
}

module.exports = {
  searchSelfTweetByMultiple,
  searchOthersTweetByMultiple,
  createTweet,
  searchTweetByTweetId,
};
