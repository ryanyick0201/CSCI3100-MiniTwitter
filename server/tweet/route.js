const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

const {searchTweetByMultiple, createTweet} = require('./tweet');
const {likeTweet} = require('./like');
const {archiveTweet} = require('./archive')
const {retweet} = require('./retweet')
const {viewCommentByTweetId, commentTweet} = require('./comment')

router.get('/searchTweet', async (req, res) => {
    //Map all tweets with username, content, postTime, category, #likes, #dislikes, #comments, #retweets
    try{
        x = await searchTweetByMultiple(req.query.username, req.query.tweetContent, req.query.category);
        res.send(x);   
    } catch {
        res.send(`{"message": "DB arises an error."}`);
    }
});

router.post('/createTweet', async (req, res) => {
    if (req.body.username && req.body.tweetContent && req.body.category){
        try {
            let x = await createTweet(req.body.username, req.body.tweetContent, req.body.category);
            res.send(x);
        } catch {
            res.send(`{"message": "DB arises an error."}`);
        }

    } else {
        res.send(`{"message": "Create a tweet failed. Field(s) missing."}`);
    }

});

router.post('/archiveTweet', async (req, res) => {
    if (req.body.tweetId){
        try {
            let x = await archiveTweet(req.body.tweetId, req.body.status);
            res.send(x);
        } catch {
            res.send(`{"message": "DB arises an error."}`);
        }

    } else {
        res.send(`{"message": "Archive a tweet failed. Field(s) missing."}`);
    }
});

router.post('/likeTweet', async (req, res) => {
    if (req.body.username && req.body.tweetId){
        try{ 
        //status can only be null, 'like' or 'dislike'
            let status = "";
            if (req.body.status)
                status = req.body.status
            else
                status = null;

            let x = await likeTweet(req.body.username, req.body.tweetId, status);
            res.send(x);
        } catch {
            res.send(`{"message": "DB arises an error."}`);
        }
    } else {
        res.send(`{"message": "Like/dislike a tweet failed. Field(s) missing."}`);
    }
});

router.post('/retweet', async (req, res) => {
    if (req.body.senderUsername && req.body.tweetId){
        try{
            let x = await retweet(req.body.tweetId, req.body.senderUsername)
            res.send(x);
        } catch {
            res.send(`{"message": "DB arises an error."}`);
        }
    } else {
        res.send(`{"message": "Retweet failed. Field(s) missing."}`);
    }
});

router.get('/searchCommentByTweetId', async(req, res)=>{
    try{
        x = await viewCommentByTweetId(req.query.tweetId);
        res.send(x);   
    } catch {
        res.send(`{"message": "DB arises an error."}`);
    }
});

router.post('/commentTweet', async(req, res) => {
    try{
        let x = await commentTweet(req.body.userId, req.body.tweetId, req.body.commentContent);
        res.send(x);   
    } catch {
        res.send(`{"message": "DB arises an error."}`);
    }
})

module.exports = router;