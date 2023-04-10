const express = require('express');
const router = express.Router();

const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const {searchUserByUsername, createUser, deleteUser, updateUser} = require('./user');
const {searchFollow, followUser} = require('./follow')
const {uploadFile, getObjectSignedUrl} = require('../multimedia/image')

const {query} = require('../database');

const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

router.get('/searchUser', async (req, res) => {
    users = await searchUserByUsername(req.query.username, req.query.exactMatch);

    var usersResJson = JSON.parse(users)['result'];

    for (user of usersResJson){
        user.profilePic = (user.profilePic) && await getObjectSignedUrl(user.profilePic + "-profilePic");
    }

    console.log(`{"message": ${JSON.stringify(JSON.parse(users).message)}, "result": ${JSON.stringify(usersResJson)}}`)
    res.send(`{"message": ${JSON.stringify(JSON.parse(users).message)}, "result": ${JSON.stringify(usersResJson)}}`);   
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

//edit includes both create and update
router.post('/editProfilePic', upload.single('image'), async (req, res) => {
    if (req.file){
        const file = req.file;
        const fileBuffer = file.buffer;

        const imageName = req.body.username + "-profilePic"; //E.g. 1-profilePic

        const x = await uploadFile(fileBuffer, imageName, file.mimetype);
        await query(`UPDATE User SET profilePic = ? WHERE username = ?;`, [req.body.username + "-profilePic", req.body.username]);

        console.log(x);
        res.send(x);  
    }
});

module.exports = router;