const mysql = require('mysql2');
require('dotenv').config();

const connectionPromise = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'Twitter'
}).promise()

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'Twitter'
})

async function query(cmd, placeholder = []){
    return new Promise(function (resolve, reject){
        connection.query(cmd, placeholder, (err, rows) => {
            if (err){
                return reject(err);
            } else {
                return resolve(rows);
            };
        })
    })
}

async function executeQuery(queryCmd){
    try{
        let rows = await query(queryCmd);
        console.log(rows);
        return rows;
    } catch(err){
        console.log(`Error: ${err.sqlMessage}`)
    }
}

module.exports = {connection, connectionPromise, query, executeQuery};