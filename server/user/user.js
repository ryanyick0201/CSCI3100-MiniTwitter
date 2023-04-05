const{query} = require('../database')
const bcrypt = require("bcrypt");

async function searchUserByUsername(username, exactMatch){
    try{
        if (username && exactMatch === "true"){
            var rows = await query(`SELECT userId, username, personalBio, privacySetting FROM User WHERE username = "${username}";`);
        } else if (username){
            var rows = await query(`SELECT userId, username, personalBio, privacySetting FROM User WHERE username LIKE "%${username}%";`);
        } else{
            var rows = await query(`SELECT userId, username, personalBio, privacySetting FROM User;`);
        }
        return `{"message": "Retrieve succeeded", "result": ${JSON.stringify(rows)}}`
    } catch {
        return `{"message": "DB arises an error."}`;
    }  
}

async function createUser(username, password, email, hasVerified){
    try{
        let rec = JSON.parse(await searchUserByUsername(username))["result"];
        //password = await bcrypt.hash(password, 10);

        if (rec.length >= 1){
            throw `{"message": "Username has been used."}`;
        } else {
            await query(`
            INSERT INTO User (username, password, email, hasVerified)
            VALUES
            ("${username}", "${password}", "${email}", ${hasVerified}
            );`);

            return `{"message": "Create user succeeded"}`;
        }

    } catch(err){
        if (err)
            return err;
        else
            return `{"message": "Create user failed. Db error."}`;
    }
}

async function deleteUser(username){
    try{
        if (username){
            var rows = await query(`DELETE FROM User
            WHERE username = "${username}";`); 
            return `{"message": "Delete succeeded. Note that other tables may be affected."}`;
        } else{
            throw `{"message": "Delete user failed. Username is missing."}`;
        }
    } catch(err) {
        if (err)
            return err;
        else
            return `{"message": "Delete user failed. Db error."}`;
    }  
}

async function updateUser(oldUsername, newUsername, password, personalBio, privacySetting, hasVerified) {
    try {
        if (oldUsername){
            var fieldArr = [oldUsername, newUsername, password, personalBio, privacySetting, hasVerified];

            for (let i = 0; i < fieldArr.length; i++) {
                if (typeof fieldArr[i] === 'string') {
                    fieldArr[i] = `'${fieldArr[i]}'`;
                }
            }

            var userInfoArray = [
                newUsername !== null ? `username = '${newUsername}'` : '',
                password !== null ? `password = '${password}'` : '',
                personalBio !== null ? `personalBio = '${personalBio}'` : '',
                privacySetting !== null ? `privacySetting = '${privacySetting}'` : '',
                hasVerified !== null ? `hasVerified = ${hasVerified}` : ''
              ];

            let x = await query(`
            UPDATE User
            SET 
            ${userInfoArray.filter(Boolean).join(', ')}
            WHERE username = "${oldUsername}";
            `)

            return `{"message": "Update an user success"}`;

        } else {
            throw(`{"message": "Old username cannot be null."}`)
        }

    } catch(err) {
        return `{"message": "DB arises an error."}`;
    }
}
 
module.exports = {searchUserByUsername, createUser, deleteUser, updateUser};