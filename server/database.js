/* database.js
PROGRAMMER: YICK Ka Ho (SID: 1155142189)
PURPOSE: setting up connection with MYSQL server and defining functions to execute queries
Artificial intelligence tool such as ChatGPT is used for code generation.
*/
const mysql = require("mysql2");
require("dotenv").config();

const connectionPromise = mysql
  .createConnection({
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "Twitter",
  })
  .promise();

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "Twitter",
});

/**
PURPOSE: perform SQL query
@param {string} cmd - SQL query
@param {string} placeholder - variables inside SQL queries
@returns {promise} if resolve, then return a promise with the rows (result), otherwise return a promise with the error message
*/
async function query(cmd, placeholder = []) {
  return new Promise(function (resolve, reject) {
    connection.query(cmd, placeholder, (err, rows) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(rows);
      }
    });
  });
}

/**
PURPOSE: perform SQL query
@param {string} cmd - SQL query
@returns {promise} if resolve, then return the rows (result), otherwise return the error message
*/

async function executeQuery(queryCmd) {
  try {
    let rows = await query(queryCmd);
    console.log(rows);
    return rows;
  } catch (err) {
    console.log(`Error: ${err.sqlMessage}`);
  }
}

module.exports = { connection, connectionPromise, query, executeQuery };
