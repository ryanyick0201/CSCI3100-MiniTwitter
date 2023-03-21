const express = require('express');
const router = express.Router();
const{connectionPromise, query, executeQuery} = require('../database')

const {searchUserByUsername, createUser, deleteUser} = require('./user');

const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

router.get('/searchUser', async (req, res) => {
    try{
        x = await searchUserByUsername(req.query.username);
        res.send(x);   
    } catch {
        res.send(`{"message": "DB arises an error."}`);
    }
});

router.post('/createUser', async (req, res) => {
    try {
        let x = await createUser(req.body.username, req.body.password, req.body.email, req.body.hasVerified);
        res.send(x);   
    } catch {
        res.send(`{"message": "DB arises an error."}`);
    }
});

router.post('/deleteUser', async (req, res) => {
    try {
        let x = await deleteUser(req.body.username);
        res.send(x);   
    } catch {
        res.send(`{"message": "DB arises an error."}`);
    }
});


module.exports = router;