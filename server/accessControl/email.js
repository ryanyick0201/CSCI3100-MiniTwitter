/*
Step 0: call all the libraries / modules
Step 1: create a function called sendEmail()
Step 2: the function should be able to:
    - create and write a one-time-password to the db
        - use the module setOTP(username) in accessControl/otp.js
        - don't write the function again
    - connect to a email server
        - you can create a new email account or use your own email account
        - if you use your email account, you need to hard-code your credentials (password and email address)
    - send an email
        - the subject and content can be very simple (e.g. "Your one time password is: ... The password will expire at ...")
    - return a message
        - telling the client whether the email is sent successfully

Step 3: export the function
Step 4: un-comment accessControl/route.js to test your function out

PS. Remember to use try-catch block(s) to handle the errors. Otherwise, the server will crash.
PSS. Check other functions for the formats
*/

const { setOTP} = require("./otp");
const nodemailer = require("nodemailer");
const { query } = require("../database");

var transport = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 465,
  secure: true, //ssl
  auth: {
    user: "csci3100.group.b8@zohomail.com",
    pass: "CSCI3100b8!",
  },
});

const emailGenerator = (toEmail, otp) => {
  return {
    from: "csci3100.group.b8@zohomail.com",
    to: `${toEmail}`,
    subject: "OTP from Minitwitter",
    text: `Your one time password is: ${otp} The password will expire in 5 minutes`,
    html: `Your one time password is: ${otp} The password will expire at 5 minutes`,
  };
};

//  debug block
//   transport.verify(function (error, success) {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log("Server is ready to take our messages");
//     }
//   });

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
  }
  catch (err)
  {
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
          `Email sent to: ${toEmail}, OTP is ${otp}, user is ${username}, server response is "${info.response}"`);
      }
    });
    return `{"message": "Email sent."}`;
  }
  catch (err)
  {
    return `{"message": "Send email error."}`;
  }
}

// async function sendEmail(username){

//     // send the email

//     transport.sendMail(emailGenerator('csci3100.group.b8@gmail.com', 'otp', 'expiryTime'), function(error, info){
//         if (error) {
//           console.log(error);
//         } else {
//           console.log('Email sent: ' + info.response);
//         }
//       });

//     return `{"message": "Email sent."}`;
// }

module.exports = {sendEmail};
