const express = require('express');
const router = express.Router();

const {searchUserByUsername, createUser, deleteUser, updateUser} = require('./user');
const {searchFollow, followUser} = require('./follow')

const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

router.get('/searchUser', async (req, res) => {
    x = await searchUserByUsername(req.query.username, req.query.exactMatch);
    console.log(x);
    res.send(x);   
});

router.post('/createUser', async (req, res) => {
    let x = await createUser(req.body.username, req.body.password, req.body.email, req.body.hasVerified);
    console.log(x);
    res.send(x);   
});

router.post('/deleteUser', async (req, res) => {
    let x = await deleteUser(req.body.username);
    console.log(x);
    res.send(x);   
});

router.post('/updateUser', async (req, res) => {
    if (! req.body.oldUsername) throw `{"message": "Old username must not be null."}`
    var oldUsername = req.body.oldUsername;
    var newUsername = (req.body.newUsername) ? req.body.newUsername : null;
    var password = (req.body.password) ? req.body.password : null;
    var personalBio = (req.body.personalBio) ? req.body.personalBio : null;
    var privacySetting = (req.body.privacySetting) ? req.body.privacySetting : null;
    var hasVerified = (req.body.hasVerified) ? req.body.hasVerified : null;        

    let x = await updateUser(oldUsername, newUsername, password, personalBio, privacySetting, hasVerified);
    console.log(x);
    res.send(x);
});

router.get('/searchFollow', async (req, res) => {
    if (! ((req.query.follower || req.query.followee) && req.query.status))
        throw `{"message": "Field(s) missing."}`
    let x = await searchFollow(req.query.follower, req.query.followee, req.query.status);
    console.log(x);
    res.send(x);
});

router.post('/followUser', async (req, res) => {
    if (req.body.follower && req.body.followee){
    //status can only be null, 'like' or 'dislike'
        let status = "";
        if (req.body.status)
            status = req.body.status
        else
            status = null;

        let x = await followUser(req.body.follower, req.body.followee, status);
        console.log(x);
        res.send(x);
    } else {
        console.log(x);
        res.send(`{"message": "Follow/unfollow a user failed. Field(s) missing."}`);
    }
});
module.exports = router;