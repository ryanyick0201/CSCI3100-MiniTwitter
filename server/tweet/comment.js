const{query} = require('../database')

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