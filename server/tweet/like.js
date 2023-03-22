const{query} = require('../database')
const {searchUserByUsername} = require('../user/user');

async function viewLikeTweetByUser(userId, username, tweetId){
    try{
        let reqQuery = [userId, username];

        if (reqQuery.map((item) => (!!item)).reduce((a, b) => a + b, 0) === 2)
            throw("Too many fields");
    } catch (err) {
        return `{"message": "${err}"}`
    }

    try {
        if (userId && !username){
            var rows = await query(`SELECT * FROM TweetLike WHERE userId = ${userId} AND tweetId = ${tweetId};`);
        }
        else if (username && !userId){
            var rows = await query(`
            SELECT t.tweetId, u.username, l.status
            FROM tweet t, user u, tweetlike l
            WHERE t.tweetId = l.tweetId AND u.userId = l.userId AND u.username = '${username}' AND t.tweetId = ${tweetId}'
            ORDER BY tweetId, username;
            `);
        }

        return `{"message": "Retrieve succeeded", "result": ${JSON.stringify(rows)}}`      
    } catch(err) {
        return `{"message": "View tweet likes/dislikes failed. Db error."}`;
    }
}

async function likeTweet(username, tweetId, status) {
    try {
        var id = await searchUserByUsername(username, "true");
        id = JSON.parse(id)['result'][0].userId;

        var rec = await viewLikeTweetByUser(id, null, tweetId)
        rec = JSON.parse(rec)['result'];
    } catch {
        return `{"message": "Search user/likes failed. db error."}`
    }

    try{
        if (rec.length === 0){
            let x = await query(`INSERT INTO TweetLike (tweetId, userId, status)
            VALUES (${tweetId}, ${id}, "${status}");`);

        } else {
            if (status){
                let x = await query(`UPDATE TweetLike
                SET status = "${status}"
                WHERE userId = ${id} AND tweetId = ${tweetId};`);

            } else {
                let x = await query(`DELETE FROM TweetLike
                WHERE userId = ${id} AND tweetId = ${tweetId};`);                
            }
        }   
        return `{"message": "Like/dislike a tweet success"}`;

    } catch {
        return `{"message": "Like/dislike tweet failed. Db error."}`;
    }
}

module.exports = {viewLikeTweetByUser, likeTweet};