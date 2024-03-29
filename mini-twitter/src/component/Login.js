/** login - Login form
 * PROGRAMMER: Li, Hang Chi (SID: 1155142983)
 * CALLING SEQUENCE: import Login From "./Login"
 *                   import the js and call to render this page
 * PURPOSE: Provide a form for user to login
 * ALGORITHM: "username" state used to store the username of user's input
 *            "password" state used to store the password of user's input
 *            "cookie" is used to set the username in cookie.
 *
 *            loginAction() is a async function used fetch the login api and set the login mode after checking user login as admin if the username includes "admin" else login as user and perform format vaildation by calling the validater. If the api result if success, then route the user to the admin page or user page based on their mode. If user account has not verified by email, then call sendEmail(username) function.
 *            handleSubmit(event) is used to perform action after user click the login button. It will call the loginAction.
 *
 */

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  FormControl,
  Box,
} from "@material-ui/core";
import { UseStyles } from "./CssFormat";
import { passwordValidator, usernameloginValidator } from "./Validator";
import { sendEmail } from "./sendEmail";
import Cookies from "js-cookie";

function Login({ setLogInAs }) {
  const classes = UseStyles();
  let navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  Cookies.set("signUpUsernameCookie", username);

  const handleSubmit = (event) => {
    console.log("handleSubmit");
    event.preventDefault();
    loginAction();
  };

  const loginAction = async () => {
    console.log("Enter loginAction");
    let mode = "";
    let login_Url = "http://" + window.location.hostname + ":3000/login";
    // change this
    if (username.includes("admin")) {
      let userValidateResult = usernameloginValidator(username);
      let pwdValidateResult = passwordValidator(password);
      let ValidateResult = userValidateResult + pwdValidateResult;
      if (ValidateResult !== "") {
        alert(ValidateResult);
        return null;
      } else {
        console.log("Login as Admin");
        mode = "admin";
      }
    } else {
      console.log("Login as User");
      let userValidateResult = usernameloginValidator(username);
      let pwdValidateResult = passwordValidator(password);
      let ValidateResult = userValidateResult + pwdValidateResult;
      if (ValidateResult !== "") {
        alert(ValidateResult);
        return null;
      } else {
        mode = "user";
      }
    }

    const postBody = {
      username: username,
      password: password,
    };
    fetch(login_Url, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postBody),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Login succeeded.") {
          sessionStorage.setItem("username", username);
          alert("Login Success");
          // TODO Need Integration
          if (mode === "user") {
            setLogInAs("user");
            navigate("/userHome");
          } else {
            setLogInAs("admin");
            navigate("/adminHome");
          }
        } else if (data.message === "Account not yet verified.") {
          sessionStorage.setItem("username", username);
          Cookies.set("signUpUsernameCookie", username);
          sendEmail(username);
          alert(data.message);
          navigate("/emailVerf");
        } else {
          alert(data.message);
        }
      })
      .catch((err) => alert(err));
  };

  return (
    <div className={classes.root}>
      <div
        className={classes.formContainer}
        style={{
          padding: "5%",
          width: "70%",
          borderColor: "white",
          borderRadius: "25px",
        }}
      >
        <Box>
          <Typography variant="h6" className={classes.loginDesc}>
            Welcome back
          </Typography>
          <Typography
            variant="h3"
            className={classes.loginTitle}
            style={{ fontWeight: "800" }}
          >
            Sign in
          </Typography>
        </Box>
        <FormControl className={classes.form} onSubmit={handleSubmit}>
          <Box className={classes.form_item}>
            <Typography variant="h6">Username:</Typography>
            <TextField
              label="Username"
              variant="outlined"
              required
              className={classes.inputField}
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              margin="dense"
              fullWidth
            />
          </Box>
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "20px 0 20px 0",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h6">Password:</Typography>
              <Link
                className={classes.linkText}
                style={{ opacity: "0.6" }}
                to="/forgot_password"
              >
                {" "}
                Forgot password?
              </Link>
            </div>
            <TextField
              label="Password"
              variant="outlined"
              required
              type="password"
              className={classes.inputField}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              margin="dense"
              fullWidth
            />
          </Box>
          <Box className={classes.form_button_grp}>
            <Button
              classes={{ root: classes.button }}
              variant="contained"
              type="submit"
              onClick={handleSubmit}
            >
              Sign In
            </Button>
          </Box>
          <Box className={classes.form_redirect}>
            <Typography variant="h6">
              I don't have an account ?
              <Link
                className={classes.linkText}
                style={{ color: "#F47458" }}
                to="/signUp"
              >
                {" "}
                Sign Up
              </Link>
            </Typography>
          </Box>
        </FormControl>
      </div>
    </div>
  );
}

export default Login;
