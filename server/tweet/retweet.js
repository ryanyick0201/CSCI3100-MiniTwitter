const{connectionPromise, query, executeQuery} = require('../database');
const {searchUserByUsername, createUser} = require('../user/user');

async function retweet(tweetId, senderUsername) {
    try{
        let sid = await searchUserByUsername(senderUsername);
        sid = JSON.parse(sid)['result'][0].userId;

        let now = new Date();
        let formattedTime = now.toISOString().replace('T', ' ').slice(0, -5);
    
        console.log(`INSERT INTO TweetRetweet (tweetId, senderId, retweetTime)
        VALUES (${tweetId}, ${sid}, "${formattedTime}");`);

        let x = await query(`INSERT INTO TweetRetweet (tweetId, senderId, retweetTime)
        VALUES (${tweetId}, ${sid}, "${formattedTime}");`);   
        return `{"message": "Retweet success"}`;

    } catch {
        return `{"message": "DB arises an error."}`;
    }
}

module.exports = {retweet};