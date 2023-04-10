const{query} = require('../database')

const {searchUserByUsername} = require('../user/user');

//Map all tweets with username, content, postTime, category, #likes, #dislikes, #comments, #retweets
//Accept username, tweetContent and category as optional parameter
async function searchTweetByMultiple(username, tweetContent, category){
    category = (category) ? `t.category = '${category}' and ` : "";
    tweetContent = (tweetContent) ? `%${tweetContent}%` : "%%";
    username = (username) ? `and u.username = '${username}'` : "";

    try{
        let rows = await query(`
<<<<<<< Updated upstream
        SELECT u.username, t.tweetId, t.tweetContent, t.postTime, t.category, t.category,
        COUNT(CASE WHEN l.status = 'like' THEN 1 END) AS likes,
        COUNT(CASE WHEN l.status = 'dislike' THEN 1 END) AS dislikes,
=======
        SELECT u.username, t.tweetId, t.tweetContent, t.postTime, t.category, t.category, t.image, t.video,
        (select COUNT(*) userId from tweetLike l where l.tweetId = t.tweetId and l.status = "like" group by tweetId) AS likes,
        (select COUNT(*) userId from tweetLike l where l.tweetId = t.tweetId and l.status = "dislike" group by tweetId) AS dislikes,
>>>>>>> Stashed changes
        (select COUNT(*) commentId from tweetComment c where c.tweetId = t.tweetId group by tweetId) AS comment,
        (select COUNT(*) retweetTime from TweetRetweet r where r.tweetId = t.tweetId group by tweetId) AS retweet
        FROM tweet t, tweetlike l, user u
        WHERE t.creator = u.userId and ${category}t.tweetContent LIKE "${tweetContent}" ${username}
        GROUP BY tweetId, category
        ORDER BY tweetId;
        `);
        
        return `{"message": "Retrieve succeeded", "result": ${JSON.stringify(rows)}}`
    } catch(err) {
        return `{"message": "Retrieve tweet failed. db error."}`;   
    }
}

/*
async function searchTweetByTweetId(tweetId){
    try{
        return await query(`
        SELECT * FROM Tweet WHERE tweetId = ${tweetId};
        `);   
    } catch {
        return;
    }
}
*/

async function createTweet(username, tweetContent, category){
    try{
        var id = await searchUserByUsername(username, "true");
        id = JSON.parse(id).result[0].userId;

    } catch {
        return `{"message": "Search user by username failed. db error."}`;
    }
    
    try{
        const now = new Date();
        const formattedTime = now.toISOString().replace('T', ' ').slice(0, -5);
    
        let x = await query(`INSERT INTO Tweet (creator, tweetContent, postTime, category)
        VALUES (?, ?, ?, ?)`, [id, tweetContent, formattedTime, category]);

        return `{"message": "Create a tweet success"}`;
    } catch {
        return `{"message": "Create tweet failed. db error."}`;
    }
}


module.exports = {searchTweetByMultiple, createTweet/*, searchTweetByTweetId*/};