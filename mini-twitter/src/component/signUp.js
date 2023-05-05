/** signUp - Form for user to sign up a user account
 * PROGRAMMER: Li, Hang Chi (SID: 1155142983)
 * CALLING SEQUENCE: import signUp From "./component/signUp"
 *                   import the js and call to render this page
 * PURPOSE: Provide a form for user to sign up an account with username, password and email.
 * ALGORITHM: "username" state is used to store the username input by user
 *            "password" state is used to store the password input by user
 *            "email" state is used to store the email address input by user
 *            passwordRegex and emailRegex are used to check the input of user for password and email are fuifill the requirement or not.
 *            handleSubmit(event) is a async function used to fetch the api with username, password and email to sign up an account.  If success, route user to email verification page and trigger sendEmail(username), else alert the error to user.
 *
 */

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Box } from "@material-ui/core";
import { UseStyles } from "./CssFormat";
import Cookies from "js-cookie";
import bcrypt from "bcryptjs";
import {
  usernameValidator,
  passwordValidator,
  emailValidator,
} from "./Validator";
import { sendEmail } from "./sendEmail";

function SignUp() {
  const classes = UseStyles();
  let navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,16}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [passwordError, setPasswordError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Enter handleSubmit");
    let signUp_Url =
      "http://" + window.location.hostname + ":3000/user/createUser";
    let userValidateResult = usernameValidator(username);
    let pwdValidateResult = passwordValidator(password);
    let emailValidateResult = emailValidator(email);
    let ValidateResult =
      userValidateResult + pwdValidateResult + emailValidateResult;
    if (ValidateResult !== "") {
      alert(ValidateResult);
      return null;
    } else {
      //hashedPassword = await hashPassword(password); // hash password
      const postBody = {
        username: username,
        password: password,
        email: email,
        hasVerified: false,
      };
      fetch(signUp_Url, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postBody),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === "Create user succeeded") {
            Cookies.set("signUpUsernameCookie", username);
            sendEmail(username);
            navigate("/emailVerf");
          } else {
            alert(data.message);
          }
        })
        .catch((err) => alert(err));
    }
  };

  const handlePasswordChange = (event) => {
    const value = event.target.value;
    setPassword(value);
    setPasswordError(!passwordRegex.test(value));
  };

  const handleEmailChange = (event) => {
    const value = event.target.value;
    setEmail(value);
    setEmailError(!emailRegex.test(value));
  };

  return (
    <div className={classes.rootNormal}>
      <div className={classes.formContainer} style={{ width: "40%" }}>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Typography
            variant="h2"
            className={classes.form_title}
            style={{ color: "#FB9231" }}
          >
            Mini Twitter
          </Typography>
          <Box className={classes.form_item}>
            <Typography variant="h6">Please fill in your email</Typography>
            <TextField
              label="Email"
              variant="outlined"
              className={classes.inputField}
              value={email}
              onChange={handleEmailChange}
              error={emailError}
              helperText={emailError ? "Invalid email address" : ""}
              inputProps={{
                pattern: emailRegex.source,
                title: "Please enter a valid email address",
              }}
              fullWidth
            />
          </Box>
          <Box className={classes.form_item}>
            <Typography variant="h6">Please fill in your username:</Typography>
            <TextField
              label="Username"
              variant="outlined"
              className={classes.inputField}
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              fullWidth
            />
          </Box>
          <Box className={classes.form_item}>
            <Typography variant="h6">Please fill in your Password:</Typography>
            <TextField
              label="Password"
              variant="outlined"
              className={classes.inputField}
              type="password"
              value={password}
              onChange={handlePasswordChange}
              error={passwordError}
              helperText={passwordError ? "Invalid password" : ""}
              inputProps={{
                pattern: passwordRegex.source,
                title:
                  "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number",
              }}
              fullWidth
            />
          </Box>

          <Box className={classes.form_button_grp}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              type="submit"
              classes={{ root: classes.button }}
            >
              Sign up
            </Button>
          </Box>
          <Box className={classes.form_redirect}>
            OR
            <Link className={classes.linkText} to="/">
              return to login
            </Link>
          </Box>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
