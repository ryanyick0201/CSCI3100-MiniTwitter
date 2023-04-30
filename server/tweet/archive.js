/* comment.js
PROGRAMMER: YICK Ka Ho (SID: 1155142189)
PURPOSE: Archive tweet function
Artificial intelligence tool such as ChatGPT is used for code generation.
*/

const{query} = require('../database')

/**
PURPOSE: archives a tweet by updating its archived status in the database
@param {number} tweetId - the ID of the tweet to be archived
@param {string} status - the status to set for the tweet. Can be null if no status is specified
@returns {string} a message indicating whether the archive tweet operation was successful or not
*/
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
