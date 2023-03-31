import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button, FormControl, Typography, Box} from '@material-ui/core';
import { UseStyles } from './CssFormat';
import { optValidator, emailValidator } from './Validator';
import Cookies from 'js-cookie';

const useStyles = makeStyles((theme) => ({
  SubButton: {
    padding: '20px 40px 20px 40px',
  },
}));

function EmailVerf() {
  //const classes = useStyles();
  const classes = UseStyles();
  const navigate  = useNavigate();
  const userEmail = Cookies.get('signUpEmailCookie');
  const [otp, setOTP] = useState('');
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
    const input = event.target.value.replace(/\D/g, '');
    if (input.length <= 6) {
      setOTP(input);
    }
  };

  const handleResent = (event) => {
    event.preventDefault();
    console.log('Send OTP button clicked');
    
    //Email validation
    if (!userEmail) {     //If ok, call api with email to send 
      let api_url = '';
      fetch(
        api_url,
        {
          method: 'GET',
          mode: 'cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({userEmail}),
        }
      )
      .then((res) => {
        if (res.ok) {
          alert("OTP is sended to your email account. ");
        } else {
          //Alert user
          alert(res.text);
        }
      })
      .catch((err)=> alert(err) );
      
      //Change Button text to Resend and only can click resend button each 60 second
      setIsResendEnable(true);
      setCountdown(60);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Enter handleSubmit');
    let otpValidateResult = optValidator(otp);
    if (otpValidateResult !== '') {
      alert(otpValidateResult);
    } else {
      let api_url = '';
      const userEmail = Cookies.get('signUpEmailCookie'); 
      fetch(
        api_url,
        {
          method: 'GET',
          mode: 'cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({userEmail, otp}),
        }
      )
      .then((res) => {
        if (res.ok) {
          // Store email in cookie
          navigate('/');
        } else {
          //Alert user
          alert(res.text);
        }
      })
      .catch((err)=> alert(err) );
      console.log('Form submitted');
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
            <Typography variant="h6">
              Please fill in the OTP
            </Typography>
            <TextField
              label="OTP"
              variant="outlined"
              value={otp}
              onChange={handleOtpChange}
              margin="dense"
              inputProps={{ maxLength: 6, pattern: '[0-9]*' }}
              fullWidth
            />
          </Box>
          <div style={{ display: 'flex', justifyContent: 'space-around', padding: '50px 0 50px 0'}}>
            <Button
              variant="contained"
              color="primary"
              classes={{ root: classes.button }} 
              type="submit"
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
              Send again {countdown !== null && countdown !== 0 && `(${countdown}s)`}
            </Button>
          </div>
        </FormControl>
      </div>
    </div>
    
  );
}

export default EmailVerf;