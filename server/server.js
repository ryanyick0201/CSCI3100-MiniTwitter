const express = require('express');
const path = require('path');
const app = express();
const{connection, connectionPromise, query, executeQuery} = require('./database')
require('dotenv').config();


// Set up the server to listen on port 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Set up the router
const userRouter = require('./user/route');
app.use('/user', userRouter);

const tweetRouter = require('./tweet/route');
app.use('/tweet', tweetRouter);

const acRouter = require('./accessControl/route');
app.use('/', acRouter);

const chatRouter = require('./chat/chat');
app.use('/chat', chatRouter);



const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));