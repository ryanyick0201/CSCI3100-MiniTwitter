const{connectionPromise, query, executeQuery} = require('../database')

async function viewCommentByTweetId(tweetId){
    try{
        let rows = await query(`SELECT t.tweetId, c.commentId, c.commentTime, c.commentContent
        FROM TweetComment c, Tweet t 
        WHERE c.tweetId = t.tweetId AND t.tweetid = ${tweetId}
        ORDER BY commentId DESC;`);
        return `{"message": "Retrieve succeeded", "result": ${JSON.stringify(rows)}}`;
    } catch {
        return `{"message": "DB arises an error."}`;     
    }
}

async function commentTweet(userId, tweetId, commentContent){
    try{
    //console.log([userId, tweetId ,commentContent]);

    let rec = await query(`SELECT MAX(commentId) AS maxCommentId FROM TweetComment WHERE tweetId = ${tweetId};`);
    commentId = rec[0]['maxCommentId'];
    
    let now = new Date();
    let formattedTime = now.toISOString().replace('T', ' ').slice(0, -5);
    
    let x = await query(`
        INSERT INTO TweetComment (userId, tweetId, commentId, commentTime, commentContent)
        VALUES (${userId}, ${tweetId}, ${commentId + 1}, '${formattedTime}', '${commentContent}');
    `);

    return `{"message": "Comment succeeded"}`;
    } catch {
        return `{"message": "DB arises an error."}`;
    }

}

module.exports = {viewCommentByTweetId, commentTweet};