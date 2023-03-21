const express = require('express');
const path = require('path');
const app = express();
const{connection, connectionPromise, query, executeQuery} = require('./database')

// Set up the server to listen on port 3000
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Set up the React Router to use the "user" route
const userRouter = require('./user/route');
app.use('/user', userRouter);

const tweetRouter = require('./tweet/route');
app.use('/tweet', tweetRouter);

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Default route
app.get('/', (req, res) => {
  res.send('Default route');
});

app.post('/login', function (req, res) {
    // Parameters are made available as properties of req.body 
    var id = req.body['loginid'], pwd = req.body['passwd'];
    res.send('Your login is ' + id + ' and password is ' + pwd);
   });

   
//var x = connection.query(`USE Twitter`)
executeQuery(`USE Twitter;`);