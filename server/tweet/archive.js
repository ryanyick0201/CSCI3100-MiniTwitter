const{connectionPromise, query, executeQuery} = require('../database')

async function archiveTweet(tweetId, status) {
    if (status) 
        status = "'" + status + "'";
    else
        status = "NULL";

    try{
        let x = await query(`
        UPDATE Tweet
        SET archived = ${status}
        WHERE tweetId = ${tweetId};`
        );
        return `{"message": "Archive a tweet success"}`;
    } catch {
        return `{"message": "DB arises an error."}`;     
    }
}

module.exports = {archiveTweet};