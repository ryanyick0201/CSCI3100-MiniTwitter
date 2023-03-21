const express = require('express');
const{connectionPromise, query, executeQuery} = require('../database')

async function searchUserByUsername(username){
    try{
        if (username){
            var rows = await query(`SELECT username, personalBio, privacySetting FROM User WHERE username = "${username}"`);
        } else{
            var rows = await query(`SELECT username, personalBio, privacySetting FROM User`);
        }
        return `{"message": "Retrieve succeeded", "result": ${JSON.stringify(rows)}}`
    } catch {
        return `{"message": "DB arises an error."}`;
    }  
}

async function createUser(username, password, email, hasVerified){
    try{
        let rec = await searchUserByUsername(username);
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

    } catch(err) {
        return err;   
    }
}

async function deleteUser(username){
    try{
        if (username){
            var rows = await query(`DELETE FROM User
            WHERE username = "${username}";`); 
            return `{"message": "Delete succeeded. Note that other tables may be affected."}`;
        } else{
            console.log("username is missing");
            throw "username is missing";
        }
    } catch {
        return `{"message": "DB arises an error."}`;
    }  
}

module.exports = {searchUserByUsername, createUser, deleteUser};