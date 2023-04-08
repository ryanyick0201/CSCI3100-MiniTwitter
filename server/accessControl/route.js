const express = require("express");
const router = express.Router();

const bodyParser = require("body-parser");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

bcrypt = require("bcrypt");

const { login } = require("./loginOut");
const { setOTP, verifyOTP, deleteOTP } = require("./otp");
const { sendEmail } = require("./email");

//Use session
const sessions = require("express-session");
router.use(
  sessions({
    secret: "CSCI3100-HelloMichael",
    cookie: { maxAge: 1200000 },
  })
);

var session;

router.post("/login", async (req, res) => {
  x = await login(req.body.username, req.body.password);

  if (JSON.parse(x).message === "Login succeeded.") {
    session = req.session;
    session.isAuthenticated = true;
    session.username = req.body.username;
  }
  console.log(x);
  res.send(x);
});

router.get("/logout", async (req, res) => {
  try {
    req.session.destroy();
    session = req.session;
    console.log(session);
    console.log(`{"message": "Logout success."}`);
    res.send(`{"message": "Logout success."}`);
  } catch {
    console.log(`{"message": "Logout failed. Server error."}`);
    res.send(`{"message": "Logout failed. Server error."}`);
  }
});

router.post("/setOTP", async (req, res) => {
  x = await setOTP(req.body.username);
  console.log(x);
  res.send(x);
});

router.post("/verifyOTP", async (req, res) => {
  x = await verifyOTP(req.body.username, req.body.otp);
  console.log(x);
  res.send(x);
});

router.get("/getSessionUsername", async (req, res) => {
  try {
    console.log(
      `{"message": "Retrieve username success.", "result": ${JSON.stringify(
        session.username
      )}}`
    );
    res.send(
      `{"message": "Retrieve username success.", "result": ${JSON.stringify(
        session.username
      )}}`
    );
  } catch {
    console.log(`{"message": "Retrieve username failed. Server error."}`);
    res.send(`{"message": "Retrieve username failed. Server error."}`);
  }
});

// router.delete("/deleteOTP", async (req, res) => {
//   setTimeout(async () => {
//     x = await deleteOTP(req.body.username);
//     console.log(x);
//     res.send(x);
//   }, 300000);
// });

router.get("/sendEmail", async (req, res) => {
    x = await sendEmail(req.query.username || "");
    console.log(x);
    res.send(x);
});

module.exports = router;
