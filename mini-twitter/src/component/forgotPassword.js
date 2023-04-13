import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  FormControl,
  Typography,
  Box,
} from "@material-ui/core";
import { UseStyles } from "./CssFormat";
import { usernameValidator, optValidator } from "./Validator";

function ForgotPassword({ setIsLoggedIn }) {
  const classes = UseStyles();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [otp, setOTP] = useState("");
  const [buttonText, setButtonText] = useState("Send me OTP");
  const [isResendEnable, setIsResendEnable] = useState(false);
  const [isSubmitEnable, setIsSubmitEnable] = useState(true);
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    let interval;
    if (isResendEnable) {
      interval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isResendEnable]);

  useEffect(() => {
    if (countdown === 0) {
      setIsResendEnable(false);
      setButtonText("Send me OTP");
    }
  }, [countdown]);

  const sendEmail = () => {
    console.log("Send email");

    //Email validation
    if (username) {
      //If ok, call api with email to send
      setIsResendEnable(true);
      setButtonText("Resend");
      setCountdown(60);
      const api_url = "http://" + window.location.hostname + ":3000/sendEmail?";
      const api_with_params = `${api_url}username=${username}`;
      console.log("Calling API: ", api_with_params);
      fetch(api_with_params, {
        method: "GET",
        mode: "cors",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === "Email sent.") {
            alert("OTP is sended to your email account. ");
            // Enable OTP Submit button
            setIsSubmitEnable(false);
          } else {
            //Alert user
            alert(data.message);
          }
        })
        .catch((err) => alert(err));
    }
  };

  const handleSendOTP = (event) => {
    event.preventDefault();
    console.log("Send OTP button clicked");

    // username validation
    let usernameValidateResult = usernameValidator(username);
    if (usernameValidateResult !== "") {
      alert(usernameValidateResult);
      return null;
    } else {
      //If ok, call api with email to send
      sendEmail();
    }
  };

  const handleSubmitOTP = (event) => {
    event.preventDefault();
    console.log("Enter handleSubmitOTP");
    let otpValidateResult = optValidator(otp);
    if (otpValidateResult !== "") {
      alert(otpValidateResult);
    } else {
      let api_url = "http://" + window.location.hostname + ":3000/verifyOTP";
      const postBody = {
        username: username,
        otp: otp,
      };
      fetch(api_url, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postBody),
      })
        .then((res) => {
          if (res.ok) {
            // ##TODO Route to usermain page
            alert("Going to user home page");
            setIsLoggedIn(true);
            navigate("/userHome");
          } else {
            //Alert user
            alert(res.text);
          }
        })
        .catch((err) => alert(err));
      console.log("Form submitted");
    }
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleOtpChange = (event) => {
    const input = event.target.value.replace(/\D/g, "");
    if (input.length <= 6) {
      setOTP(input);
    }
  };

  return (
    <div className={classes.rootNormal}>
      <div className={classes.formContainer}>
        <Box m={2} p={2} border={1} borderColor="grey.400">
          <Typography variant="h3" className={classes.form_title}>
            Trouble with logging in?
          </Typography>
          <Typography variant="body1" className={classes.formDescription}>
            Enter your username and we'll send you an OTP, <br></br>
            you can change your password after login.
          </Typography>
          <FormControl onSubmit={handleSubmitOTP} className={classes.form}>
            <Box mt={2} className={classes.form_item}>
              <Typography variant="h6">Please fill in your username</Typography>
              <TextField
                label="Username"
                variant="outlined"
                className={classes.inputField}
                value={username}
                onChange={handleUsernameChange}
                margin="dense"
                fullWidth
              />
            </Box>
            <Box className={classes.form_button_grp}>
              <Button
                variant="contained"
                color="primary"
                disabled={isResendEnable}
                onClick={handleSendOTP}
                classes={{ root: classes.button }}
              >
                {buttonText}{" "}
                {countdown !== null && countdown !== 0 && `(${countdown}s)`}
              </Button>
            </Box>
            <Box mt={2} className={classes.form_item}>
              <Typography variant="h6">Please fill in the OTP</Typography>
              <TextField
                label="OTP"
                variant="outlined"
                className={classes.inputField}
                value={otp}
                onChange={handleOtpChange}
                margin="dense"
                inputProps={{ maxLength: 6, pattern: "[0-9]*" }}
                fullWidth
              />
            </Box>
            <Box className={classes.form_button_grp}>
              <Button
                variant="contained"
                color="primary"
                disabled={isSubmitEnable}
                onClick={handleSubmitOTP}
                type="submit"
                classes={{ root: classes.button }}
              >
                Submit
              </Button>
            </Box>
            <Box className={classes.form_redirect}>
              OR
              <Link className={classes.linkText} to="/">
                return to login
              </Link>
            </Box>
          </FormControl>
        </Box>
      </div>
    </div>
  );
}

export default ForgotPassword;
