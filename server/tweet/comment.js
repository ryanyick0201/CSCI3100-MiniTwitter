/* comment.js
PROGRAMMER: YICK Ka Ho (SID: 1155142189)
PURPOSE: Functions that support retrieval and addition of comment to a given tweet
Artificial intelligence tool such as ChatGPT is used for code generation.
*/
const{query} = require('../database')

/**
PURPOSE: retrieves comments for the given tweet ID
@param {number} tweetId - the ID of the tweet to retrieve comments for
@returns {string} a message indicating whether the retrieval operation was successful or not, along with the retrieved comments (if any)
*/
async function viewCommentByTweetId(tweetId){
    try{
        let rows = await query(`SELECT t.tweetId, c.commentId, c.commentTime, c.commentContent
        FROM TweetComment c, Tweet t 
        WHERE c.tweetId = t.tweetId AND t.tweetid = ${tweetId}
        ORDER BY commentId DESC;`);
        return `{"message": "Retrieve succeeded", "result": ${JSON.stringify(rows)}}`;
    } catch {
        return `{"message": "View comment by tweetId failed. DB error"}`;     
    }
}

/**
PURPOSE: adds a comment to the given tweet
@param {number} userId - the ID of the user adding the comment
@param {number} tweetId - the ID of the tweet to add a comment to
@param {string} commentContent - the content of the comment to be added
@returns {string} a message indicating whether the comment addition operation was successful or not
*/
async function commentTweet(userId, tweetId, commentContent){
    try{
    //console.log([userId, tweetId ,commentContent]);

    var rec = await query(`SELECT MAX(commentId) AS maxCommentId FROM TweetComment WHERE tweetId = ?;`, [tweetId]);

    if (rec.length > 0)
        commentId = rec[0]['maxCommentId'];
    else
        commentId = 0;

    } catch {
        return `{"message": "Cannot find maximum comment id"}`;
    }

    try{
        let now = new Date();
        let formattedTime = now.toISOString().replace('T', ' ').slice(0, -5);
        
        let x = await query(`
            INSERT INTO TweetComment (userId, tweetId, commentId, commentTime, commentContent)
            VALUES (?, ?, ?, ?, ?);
        `, [userId, tweetId, commentId + 1, formattedTime, commentContent]);

        return `{"message": "Comment succeeded"}`;
    } catch {
        return `{"message": "Add comment failed. DB error"}`;
    }

}

module.exports = {viewCommentByTweetId, commentTweet};
