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