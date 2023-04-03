const express = require('express');
const path = require('path');
const app = express();
var cors = require('cors');
const{connection, connectionPromise, query, executeQuery} = require('./database')
require('dotenv').config();
app.use(cors());
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


const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));