/* loginOut.js
PROGRAMMER: YICK Ka Ho (SID: 1155142189)
PURPOSE: Handle authentication and login
Artificial intelligence tool such as ChatGPT is used for code generation.
*/

const { query } = require("../database");
const bcrypt = require("bcrypt");

/**
PURPOSE: Log in a user.
@param {string} username - The username of the user.
@param {string} password - The password of the user.
@returns {string} A message indicating if the login succeeded or failed.
*/

async function login(username, password) {
  try {
    //console.log(username);
    //console.log(password);
    if (!username || !password) {
      throw `{"message": "Field(s) missing."}`;
    }

    if (username.includes("admin")) {
      var rows = await query(`SELECT * FROM ADMIN WHERE adminname = ?`, [
        username,
      ]);
      var usernameMatched = username === rows[0].adminname;
    } else {
      var rows = await query(`SELECT * FROM USER WHERE username = ?`, [
        username,
      ]);
      var usernameMatched = username === rows[0].username;
    }
    if (rows.length > 0 && usernameMatched) {
      if (bcrypt.compareSync(password, rows[0].password))
        if (rows[0].adminname || rows[0].hasVerified)
          return `{"message": "Login succeeded."}`;
        else return `{"message": "Account not yet verified."}`;
    }
    return `{"message": "Login failed. Credentials not matched."}`;
  } catch (err) {
    if (err) {
      return err;
    } else {
      return `{"message": "Login failed. Db error."}`;
    }
  }
}

module.exports = { login };
