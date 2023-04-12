const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const {searchTweetByMultiple, searchOthersTweetByMultiple, createTweet} = require('./tweet');
const {likeTweet, viewLikeTweetByUser} = require('./like');
const {archiveTweet} = require('./archive')
const {retweet, viewRetweet} = require('./retweet')
const {viewCommentByTweetId, commentTweet} = require('./comment')

const {searchFollow} = require('../user/follow');

const {uploadFile, deleteFile, getObjectSignedUrl} = require('../multimedia/image');
const {query} = require('../database')

router.get('/searchMyTweet', async (req, res) => {
    //Map all tweets with username, content, postTime, category, #likes, #dislikes, #comments, #retweets
    var tweets = await searchTweetByMultiple(req.query.username, req.query.category);

    var tweetsResJson = JSON.parse(tweets)['result'];

    for (let tweet of tweetsResJson){
        if (tweet.image){
            tweet.image = await getObjectSignedUrl(tweet.image + "-image");
        }
    }

    for (let tweet of tweetsResJson){
        if (tweet.video){
            tweet.image = await getObjectSignedUrl(tweet.video + "-video");
        }
    }    

    console.log(`{"message": ${JSON.stringify(JSON.parse(tweets).message)}, "result": ${JSON.stringify(tweetsResJson)}}`)
    res.send(`{"message": ${JSON.stringify(JSON.parse(tweets).message)}, "result": ${JSON.stringify(tweetsResJson)}}`);  
});

router.get('/searchOtherTweet', async(req, res) => {
    if (!req.query.lookForUsername){
        var users = await query(`SELECT username FROM User`);

        var tweets = []
        for (let user of users){
            //TODO
            for (let newTweet of JSON.parse(await searchOthersTweetByMultiple(req.query.myUsername, user.username, req.query.category))['result'])
                tweets.push(newTweet);
            console.log(tweets);
        }
    } else {
        var tweets = JSON.parse(await searchOthersTweetByMultiple(req.query.myUsername, req.query.lookForUsername, req.query.category))['result'];
    }

    for (let tweet of tweets){
        if (tweet.image){
            tweet.image = await getObjectSignedUrl(tweet.image + "-image");
        }
    }

    for (let tweet of tweets){
        if (tweet.video){
            tweet.image = await getObjectSignedUrl(tweet.video + "-video");
        }
    }    

    // console.log(`{"message": $"Retrieve succeeded", "result": ${JSON.stringify(tweets)}}`)
    res.send(`{"message": "Retrieve succeeded", "result": ${JSON.stringify(tweets)}}`);  
})

router.post('/createTweet', upload.single('image'), async (req, res) => {
    if (req.body.username && req.body.tweetContent && req.body.category && (!req.file || (req.file && (req.body.fileType === "video" || req.body.fileType === "image")))){
        let x = await createTweet(req.body.username, req.body.tweetContent, req.body.category);   
        console.log(x);
        if (x === `{"message": "Retrieve tweet failed. db error."}`){
            res.send(x);
        }

        if (req.file){
            const file = req.file;
            const fileBuffer = file.buffer;
            const fileType = req.body.fileType; //either 'video' or 'image'
    
            const tweetId = JSON.parse(await searchTweetByMultiple()).result.length;
    
            var fileName;
            if (fileType === 'video'){
                fileName = tweetId + "-video"; //E.g. 1-tweetVideo
                await query(`UPDATE Tweet SET video = ? WHERE tweetId = ?;`, [tweetId + "-tweetVideo", tweetId]);
            } else if (fileType === 'image') {
                fileName = tweetId + "-image"; //E.g. 1-tweetImage
                await query(`UPDATE Tweet SET image = ? WHERE tweetId = ?;`, [tweetId + "-tweetImage", tweetId]);
            }
    
            const x = await uploadFile(fileBuffer, fileName, file.mimetype);   
            console.log(x);
            res.send(x);
        }

    } else {
        console.log(`{"message": "Create a tweet failed. Field(s) missing."}`);
        res.send(`{"message": "Create a tweet failed. Field(s) missing."}`);
    }

});

router.get('/viewLikeTweet', async (req, res) => {
    if (req.query.username && req.query.tweetId){
        let x = await viewLikeTweetByUser(null, req.query.username, req.query.tweetId);
        console.log(x);
        res.send(x);
    } else {
        res.send(`{"message": "Viewl like/dislike of a tweet failed. Field(s) missing."}`);
    }
});

router.get('/viewRetweet', async (req, res) => {
    if (req.query.senderUsername){
        let x = await viewRetweet(req.query.senderUsername);
        console.log(x);
        res.send(x);
    } else {
        res.send(`{"message": "Viewl like/dislike of a tweet failed. Field(s) missing."}`);
    }
});

router.post('/archiveTweet', async (req, res) => {
    if (req.body.tweetId){
        let x = await archiveTweet(req.body.tweetId, req.body.status);
        res.send(x);
    } else {
        res.send(`{"message": "Archive a tweet failed. Field(s) missing."}`);
    }
});

router.post('/likeTweet', async (req, res) => {
    if (req.body.username && req.body.tweetId){
        //status can only be null, 'like' or 'dislike'
        let status = "";
        if (req.body.status)
            status = req.body.status
        else
            status = null;

        let x = await likeTweet(req.body.username, req.body.tweetId, status);
        res.send(x);
    } else {
        res.send(`{"message": "Like/dislike a tweet failed. Field(s) missing."}`);
    }
});

router.post('/retweet', async (req, res) => {
    if (req.body.senderUsername && req.body.tweetId){
        let x = await retweet(req.body.tweetId, req.body.senderUsername)
        res.send(x);
    } else {
        res.send(`{"message": "Retweet failed. Field(s) missing."}`);
    }
});

router.get('/searchCommentByTweetId', async(req, res)=>{
    x = await viewCommentByTweetId(req.query.tweetId);
    res.send(x);   
});

router.post('/commentTweet', async(req, res) => {
    let x = await commentTweet(req.body.userId, req.body.tweetId, req.body.commentContent);
    res.send(x);   
})

module.exports = router;