/* otp.js
PROGRAMMER: YICK Ka Ho (SID: 1155142189)
PURPOSE: Handle authentication related routes such as login, logout, setting OTP, verifying OTP and retrieving session username
Artificial intelligence tool such as ChatGPT is used for code generation.
*/

const {query} = require('../database')

/**
PURPOSE: sets a one-time password (OTP) for the given username
@param {string} username - the username of the user
@returns {string} a message indicating whether the set OTP operation was successful or not
*/
async function setOTP(username){
    try{
        var otp = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000 + "";

        x = await query(`UPDATE User Set otp = ? WHERE username = ?`, [otp, username])
        return `{"message": "Set otp success."}`
    } catch(err) {
        if (err){
            return err;
        } else {
            return `{"message": "Set otp failed. Db error."}`;
        }
    }
}

/**
PURPOSE: verifies the OTP for the given username
@param {string} username - the username of the user
@param {string} otp - the OTP to verify
@returns {string} a message indicating whether the verify OTP operation was successful or not
*/
async function verifyOTP(username, otp){
    try{
        if (!username || !otp){
            throw(`{"message": "Verify otp failed. Field(s) missing."}`)
        }

        x = await query(`SELECT otp FROM User WHERE username = ?`, [username]);
        if (!x[0].otp)
            throw(`{"message": "Verify otp failed. Otp has expired."}`)

        x = await query(`SELECT * FROM User WHERE username = ? AND otp = ?`, [username, otp]);
        if (x.length === 1){
            await query(`UPDATE User SET hasVerified = true where username = "${username}"`);
            return `{"message": "Verify otp success."}`
        } else {
            return `{"message": "Verify otp failed. Wrong otp"}`;
        }

    } catch(err) {
        if (err){
            return err;
        } else {
            return `{"message": "Verify otp failed. Db error."}`;
        }
    }
}

/**
PURPOSE: deletes the OTP for the given username
@param {string} username - the username of the user
@returns {string} a message indicating whether the delete OTP operation was successful or not
*/
async function deleteOTP(username){
    try{
        x = await query(`UPDATE User Set otp = NULL WHERE username = ?`, [username]);
        return `{"message": "Delete otp success."}`;
    } catch {
        return `{"message": "Delete otp failed. Db error."}`;
    }
}
module.exports = {setOTP, verifyOTP, deleteOTP};
