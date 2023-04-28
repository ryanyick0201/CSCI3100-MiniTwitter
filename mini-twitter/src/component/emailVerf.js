import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  FormControl,
  Typography,
  Box,
} from "@material-ui/core";
import { UseStyles } from "./CssFormat";
import { optValidator } from "./Validator";
import Cookies from "js-cookie";
import { sendEmail } from "./sendEmail";

function EmailVerf() {
  const classes = UseStyles();
  const navigate = useNavigate();
  const username = Cookies.get("signUpUsernameCookie");
  const [otp, setOTP] = useState("");
  const [isResendEnable, setIsResendEnable] = useState(false);
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
    }
  }, [countdown]);

  const handleOtpChange = (event) => {
    const input = event.target.value.replace(/\D/g, "");
    if (input.length <= 6) {
      setOTP(input);
    }
  };

  const handleResent = (event) => {
    event.preventDefault();
    console.log("Send OTP button clicked");

    sendEmail(username);
    //Change Button text to Resend and only can click resend button each 60 second
    setIsResendEnable(true);
    setCountdown(60);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Enter handleSubmit");
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
        .then((response) => response.json())
        .then((data) => {
          if (data.message === "Verify otp success.") {
            alert("Email verified. Return to login page.");
            navigate("/");
          } else {
            //Alert user
            alert(data.message);
          }
        })
        .catch((err) => alert(err));
    }
  };

  return (
    <div className={classes.rootNormal}>
      <div className={classes.formContainer}>
        <Typography variant="h3" className={classes.form_title}>
          Email Verification
        </Typography>
        <Typography variant="h6" className={classes.formDescription}>
          We have sent an OTP to your email account, please <br></br>
          enter the OTP to finish the verification process.
        </Typography>
        <FormControl className={classes.form} onSubmit={handleSubmit}>
          <Box>
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              padding: "50px 0 50px 0",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              classes={{ root: classes.button }}
              type="submit"
              onClick={handleSubmit}
            >
              Submit
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={isResendEnable}
              classes={{ root: classes.button }}
              onClick={handleResent}
            >
              Send again{" "}
              {countdown !== null && countdown !== 0 && `(${countdown}s)`}
            </Button>
          </div>
        </FormControl>
      </div>
    </div>
  );
}

export default EmailVerf;
