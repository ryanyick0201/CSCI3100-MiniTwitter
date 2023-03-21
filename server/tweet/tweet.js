const{connectionPromise, query, executeQuery} = require('../database')

const {searchUserByUsername, createUser} = require('../user/user');

//Map all tweets with username, content, postTime, category, #likes, #dislikes, #comments, #retweets
//Accept username, tweetContent and category as optional parameter
async function searchTweetByMultiple(username, tweetContent, category){
    category = (category) ? `t.category = '${category}' and ` : "";
    tweetContent = (tweetContent) ? `%${tweetContent}%` : "%%";
    username = (username) ? `and u.username = '${username}'` : "";

    try{
        let rows = await query(`
        SELECT u.username, t.tweetId, t.tweetContent, t.postTime, t.category, t.category,
        COUNT(CASE WHEN l.status = 'like' THEN 1 END) AS likes,
        COUNT(CASE WHEN l.status = 'dislike' THEN 1 END) AS dislikes,
        (select COUNT(*) commentId from tweetComment c where c.tweetId = t.tweetId group by tweetId) AS comment,
        (select COUNT(*) retweetTime from TweetRetweet r where r.tweetId = t.tweetId group by tweetId) AS retweet
        FROM tweet t, tweetlike l, user u
        WHERE t.creator = u.userId and ${category}t.tweetContent LIKE "${tweetContent}" ${username}
        GROUP BY tweetId, category
        ORDER BY tweetId;
        `);
        
        return `{"message": "Retrieve succeeded", "result": ${JSON.stringify(rows)}}`
    } catch(err) {
        console.log(err);
        return err;   
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
        let id = await searchUserByUsername(username);
        id = id[0].userId;
    
        const now = new Date();
        const formattedTime = now.toISOString().replace('T', ' ').slice(0, -5);
    
        let x = await query(`INSERT INTO Tweet (creator, tweetContent, postTime, category)
        VALUES (${id}, "${tweetContent}", "${formattedTime}", "${category}")`);

        return `{"message": "Create a tweet success"}`;
    } catch {
        return `{"message": "DB arises an error."}`;
    }
}

module.exports = {searchTweetByMultiple, createTweet/*, searchTweetByTweetId*/};