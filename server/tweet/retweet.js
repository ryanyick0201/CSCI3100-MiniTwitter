const{query} = require('../database');
const {searchUserByUsername} = require('../user/user');

async function retweet(tweetId, senderUsername) {
    try{
        var sid = await searchUserByUsername(senderUsername, "true");
        sid = JSON.parse(sid)['result'][0].userId;
    } catch {
        return `{"message": "Search user by username failed. Db error."}`
    }

    try{
        var now = new Date();
        var formattedTime = now.toISOString().replace('T', ' ').slice(0, -5);

        var x = await query(`INSERT INTO TweetRetweet (tweetId, senderId, retweetTime)
        VALUES (${tweetId}, ${sid}, "${formattedTime}");`);   
        return `{"message": "Retweet success"}`;
    } catch {
        return `{"message": "Retweet failed. Db error."}`;
    }
}

module.exports = {retweet};