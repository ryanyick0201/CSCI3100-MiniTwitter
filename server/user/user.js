/* user.js
 * PROGRAMMER: YICK Ka Ho (SID: 1155142189)
 * PURPOSE: Handle CRUD operations of user accounts
 * Artificial intelligence tool such as ChatGPT is used for code generation.
 */

const { query } = require("../database");
const bcrypt = require("bcrypt");

/**
PURPOSE: Search usersby their username in the database.
@param {string} username - The username to search.
@param {string} exactMatch - Whether to search for exact match or not.
@return {string} - A JSON string representing the search result.
*/
async function searchUserByUsername(username, exactMatch) {
  try {
    if (username && exactMatch === "true") {
      var rows = await query(
        `SELECT userId, username, personalBio, privacySetting, profilePic FROM User WHERE username = "${username}";`
      );
    } else if (username) {
      var rows = await query(
        `SELECT userId, username, personalBio, privacySetting, profilePic FROM User WHERE username LIKE "%${username}%";`
      );
    } else {
      var rows = await query(
        `SELECT userId, username, personalBio, privacySetting, profilePic FROM User;`
      );
    }
    return `{"message": "Retrieve succeeded", "result": ${JSON.stringify(
      rows
    )}}`;
  } catch {
    return `{"message": "DB arises an error."}`;
  }
}

/**
PURPOSE: create a user in the database.
@param {string} username - The username of the new user.
@param {string} password - The password of the new user.
@param {string} email - The email of the new user.
@param {boolean} hasVerified - Whether the new user has been verified or not.
@return {string} - A JSON string representing the result of creating the user.
*/
async function createUser(username, password, email, hasVerified) {
  try {
    let rec = JSON.parse(await searchUserByUsername(username))["result"];
    password = await bcrypt.hash(password, 10);

    if (rec.length >= 1) {
      throw `{"message": "Username has been used."}`;
    } else {
      await query(`
            INSERT INTO User (username, password, email, hasVerified)
            VALUES
            ("${username}", "${password}", "${email}", ${hasVerified}
            );`);

      return `{"message": "Create user succeeded"}`;
    }
  } catch (err) {
    if (err) return err;
    else return `{"message": "Create user failed. Db error."}`;
  }
}

/**
PURPOSE: Delete a user from the database.
@param {string} username - The username of the user to delete.
@return {string} - A JSON string representing the result of deleting the user.
*/
async function deleteUser(username) {
  try {
    if (username) {
      var rows = await query(`DELETE FROM User
            WHERE username = "${username}";`);
      return `{"message": "Delete succeeded. Note that other tables may be affected."}`;
    } else {
      throw `{"message": "Delete user failed. Username is missing."}`;
    }
  } catch (err) {
    if (err) return err;
    else return `{"message": "Delete user failed. Db error."}`;
  }
}

/**
PURPOSE: Update a user in the database.
@oldUsername {string} - The original username of the user to be updated.
@newUsername {string} - The new username of the user to be updated.
@password {string} - The new password of the user to be updated.
@personalBio{string} - The new personalBio of the user to be updated.
@privacySetting {string} - The new privacySetting of the user to be updated.
@hasVerified {boolean} - The new hasVerified of the user to be updated.
@return {string} - A JSON string representing the result of deleting the user.
*/

async function updateUser(
  oldUsername,
  newUsername,
  password,
  personalBio,
  privacySetting,
  hasVerified
) {
  try {
    if (oldUsername) {
      var fieldArr = [
        oldUsername,
        newUsername,
        password,
        personalBio,
        privacySetting,
        hasVerified,
      ];

      for (let i = 0; i < fieldArr.length; i++) {
        if (typeof fieldArr[i] === "string") {
          fieldArr[i] = `'${fieldArr[i]}'`;
        }
      }

      var userInfoArray = [
        newUsername !== null ? `username = '${newUsername}'` : "",
        password !== null
          ? `password = '${await bcrypt.hash(password, 10)}'`
          : "",
        personalBio !== null ? `personalBio = '${personalBio}'` : "",
        privacySetting !== null ? `privacySetting = '${privacySetting}'` : "",
        hasVerified !== null ? `hasVerified = ${hasVerified}` : "",
      ];

      let x = await query(`
            UPDATE User
            SET 
            ${userInfoArray.filter(Boolean).join(", ")}
            WHERE username = "${oldUsername}";
            `);

      return `{"message": "Update an user success"}`;
    } else {
      throw `{"message": "Old username cannot be null."}`;
    }
  } catch (err) {
    return `{"message": "DB arises an error."}`;
  }
}

module.exports = { searchUserByUsername, createUser, deleteUser, updateUser };
