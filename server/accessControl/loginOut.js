const {query} = require('../database')
const bcrypt = require("bcrypt");

async function login(username, password){
    try{
        if (!username || !password){
            throw `{"message": "Field(s) missing."}`;
        }

        var rows = await query(`SELECT * FROM USER WHERE username = ?`, [username]);
        
        if (username === rows[0].username){
            if (bcrypt.compareSync(password, rows[0].password))
                return `{"message": "Login succeeded."}`   
        }
        return `{"message": "Login failed. Credentials not matched."}`
                   
    } catch(err) {
        if (err){
            return err;
        } else {
            return `{"message": "Login failed. Db error."}`;
        }
    }
}

module.exports = {login};