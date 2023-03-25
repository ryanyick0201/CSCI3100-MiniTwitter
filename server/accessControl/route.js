const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

bcrypt = require("bcrypt");

const {login} = require('./loginOut')
const {setOTP, verifyOTP, deleteOTP} = require('./otp')
/*const {sendEmail} = require('./email')*/

//Use session
const sessions = require('express-session');
router.use(sessions({
  secret: 'CSCI3100-HelloMichael',
  cookie: {maxAge: 1200000}
}));

var session;

router.post('/login', async (req, res) => {
    x = await login(req.body.username, req.body.password);

    if (JSON.parse(x).message === 'Login succeeded.'){
        session = req.session;
        session.isAuthenticated = true;
        session.username = req.body.username;
    }
    res.send(x);
});

router.get('/logout', async(req, res) => {
    try {
        req.session.destroy();
        session = req.session;
        console.log(session);
        res.send(`{"message": "Logout success."}`);   
    } catch {
        res.send(`{"message": "Logout failed. Server error."}`);   
    }
})

router.post('/setOTP', async(req, res) => {
    x = await setOTP(req.body.username);
    res.send(x);
});

router.post('/verifyOTP', async(req, res) => {
    x = await verifyOTP(req.body.username, req.body.otp);
    res.send(x);
});

router.get('/getSessionUsername', async(req, res) => {
    try{
        res.send(`{"message": "Retrieve username success.", "result": ${JSON.stringify(session.username)}}`);
    } catch {
        res.send(`{"message": "Retrieve username failed. Server error."}`);
    }
})

router.delete('/deleteOTP', async(req, res) => {
    setTimeout(async () => {
        x = await deleteOTP(req.body.username);
        res.send(x);
    }, 10000);
})

/*
router.post('/sendEmail', async (req, res) => {
    x = await sendEmail(req.body.username);
    res.send(x);
});
*/

module.exports = router;