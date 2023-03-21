const mysql = require('mysql2');

const connectionPromise = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', //Your password
    database: 'Twitter'
}).promise()

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', //Your password
    database: 'Twitter'
})

async function query(cmd){
    return new Promise(function (resolve, reject){
        connection.query(cmd, (err, rows) => {
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