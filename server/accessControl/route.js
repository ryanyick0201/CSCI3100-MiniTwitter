/* [authentication.js]
 * PROGRAMMER: YICK Ka Ho (SID: 1155142189)
 * PURPOSE: Handle authentication related routes such as login, logout, setting OTP, verifying OTP and retrieving session username
 * Artificial intelligence tool such as ChatGPT is used for code generation.
 */

//Defining libraries and files
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

/*
PURPOSE: Handles the login request from the client and sets up the session for the user
OUTPUT: Sends the login response to the client
FUNCTIONS CALLED: login()
*/
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

/*
PURPOSE: Handles the logout request from the client and destroys the session for the user
OUTPUT: Sends the logout response to the client
FUNCTIONS CALLED: None
*/
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

/*
PURPOSE: Handles the request from the client to set up OTP for a user
OUTPUT: Sends the OTP setup response to the client
FUNCTIONS CALLED: setOTP()
*/
router.post("/setOTP", async (req, res) => {
  x = await setOTP(req.body.username);
  console.log(x);
  res.send(x);
});

/*
PURPOSE: Handles the request from the client to verify OTP for a user
OUTPUT: Sends the OTP verification response to the client
FUNCTIONS CALLED: verifyOTP()
*/
router.post("/verifyOTP", async (req, res) => {
  x = await verifyOTP(req.body.username, req.body.otp);
  console.log(x);
  res.send(x);
});

/*
PURPOSE: Get the username stored in the current session
FUNCTIONS CALLED: None
*/
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

/*
PURPOSE: Sends email to the user's email address with a verification code
OUTPUT: Response from the sendEmail function
FUNCTIONS CALLED: sendEmail
*/
router.get("/sendEmail", async (req, res) => {
  x = await sendEmail(req.query.username || "");
  console.log(x);
  res.send(x);
});

/*
PURPOSE: This route is used to verify the OTP entered by the user for a specific username
OUTPUT: The output is the verification result returned by the function verifyOTP
FUNCTIONS CALLED: verifyOTP
*/
router.post("/verifyOTP", async (req, res) => {
  x = await verifyOTP(req.body.username, req.body.otp);
  console.log(x);
  res.send(x);
});

/*
PURPOSE: This route is used to get the username of the current session
OUTPUT: The output is a JSON object containing the message and result of the operation, with the username stored in session.username
FUNCTIONS CALLED: None
*/
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

/*
PURPOSE: This route is used to delete the OTP of a specific username after a certain amount of time (5 minutes)
OUTPUT: The output is the result of deleting the OTP returned by the function deleteOTP
FUNCTIONS CALLED: deleteOTP
*/
router.delete("/deleteOTP", async (req, res) => {
  setTimeout(async () => {
    x = await deleteOTP(req.body.username);
    console.log(x);
    res.send(x);
  }, 300000);
});

/*
router.post('/sendEmail', async (req, res) => {
    x = await sendEmail(req.body.username);
    res.send(x);
});
*/

module.exports = router;
