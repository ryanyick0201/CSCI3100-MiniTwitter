/* email.js
PROGRAMMER: YICK Ka Ho (SID: 1155142189)
PURPOSE: This program file exports a function named "sendEmail" that sends an email containing a one-time password (OTP) to a given
user's email address, with the OTP value retrieved from a database. The function uses nodemailer package to send the email,
and also calls a function named "setOTP" to set the OTP value in the database.
Artificial intelligence tool such as ChatGPT is used for code generation.
*/

/*
email.js - sending OTP emails
Contributor: Tai Tsun Yiu
Purpose: Sending email containing a OTP to the user's email address.
Triggering sequence:
  1.  The user create an account and request a OTP.
  2.  An OTP will be generated in otp.js and store in database.
  3.  sendEmail() will retreive the user's email address and the otp, compose a email, and send it to the user.


Inclusion of libraries in the list below implies the use of source code and citing its documentation. 
These libraries may depend on external libraries which are not mentioned here. For more information, please refer to the documentation of each libraries.
Libraries used:
  1.  Name: nodemailer software and documentation
      Author: andris9
      Link: https://github.com/nodemailer/nodemailer/
      License: https://github.com/nodemailer/nodemailer/blob/master/LICENSE
      
  2.  Name: ExpressJS software and documentation
      Author: ExpressJS development team
      Link: https://github.com/expressjs/express
      License: MIT License

  3.  Name: Node.js (including http and crypto)
      Author: Node.js development team
      Link: https://github.com/nodejs/node/tree/v18.0.0
      License: MIT Liscense 


Reference List:
  1.  Name: #1 answer of Error: self signed certificate in certificate chain Nodejs nodemailer express
      Author: ty2k
      Link: https://stackoverflow.com/a/46752426
      License: CC BY-SA 3.0

  */


const { setOTP } = require("./otp");
const nodemailer = require("nodemailer");
const { query } = require("../database");

var transport = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 465,
  secure: true, //ssl
  auth: {
    user: "***redacted***",
    pass: "***redacted***",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const emailGenerator = (toEmail, otp) => {
  return {
    from: "***redacted***",
    to: `${toEmail}`,
    subject: "OTP from Minitwitter",
    text: `Your one time password is: ${otp}.`,
    html: `Your one time password is: ${otp}.`,
  };
};


async function sendEmail(username) {
  if (username == "") return `{"message": "username empty."}`;

  let otp = "";
  let toEmail = "";

  try {
    await setOTP(username);
  } catch (err) {
    return `{"message": "Set OTP error."}`;
  }

  try {
    let row = await query(
      `SELECT otp FROM User WHERE username = '${username}'`
    );
    otp = row[0].otp;
  } catch (err) {
    return `{"message": "Get OTP db error."}`;
  }

  try {
    let row = await query(
      `SELECT email FROM User WHERE username = '${username}'`
    );
    toEmail = row[0]["email"];
  } catch (err) {
    return `{"message": "Fetching receipient email db error."}`;
  }

  // const expiryTime = 'asdf';

  // send the email
  try {
    transport.sendMail(emailGenerator(toEmail, otp), function (error, info) {
      if (error) {
        console.log(error);
        return `{"message": "Send email error."}`;
      } else {
        console.log(
          `Email sent to: ${toEmail}, OTP is ${otp}, user is ${username}, server response is "${info.response}"`
        );
      }
    });
    return `{"message": "Email sent."}`;
  } catch (err) {
    return `{"message": "Send email error."}`;
  }
}

module.exports = { sendEmail };
