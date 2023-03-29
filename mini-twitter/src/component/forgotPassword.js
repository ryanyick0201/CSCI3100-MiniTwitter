import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TextField, Button, FormControl, Typography, Box } from '@material-ui/core';
import { UseStyles } from './CssFormat';

function ForgotPassword() {
  const classes = UseStyles();
  const [email, setEmail] = useState('');
  const [otp, setOTP] = useState('');

  const handleSendOTP = (event) => {
    event.preventDefault();
    console.log('Send OTP button clicked');
    
    
  }

  const handleSubmitOTP = (event) => {
    event.preventDefault();
    event.preventDefault();
    console.log('Form submitted');
    console.log('OTP:', otp);

  }
  
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleOtpChange = (event) => {
    setOTP(event.target.value);
  };

  return (
    <div className={classes.rootNormal}>
      <div className={classes.formContainer}>
        <Box m={2} p={2} border={1} borderColor="grey.400">
          <Typography variant="h3" className={classes.form_title}>
            Trouble with logging in?
          </Typography>
          <Typography variant="body1" className={classes.formDescription}>
            Enter your email address and we'll send you an OTP. <br></br>
                you can change your password after login.
          </Typography>
          <FormControl onSubmit={handleSubmitOTP} className={classes.form}>
            <Box mt={2} className={classes.form_item}>
              <Typography variant="h6">
                Please fill in your email
              </Typography>
              <TextField
                label="Email"
                variant="outlined"
                value={email}
                onChange={handleEmailChange}
                margin="dense"
                fullWidth
              />
            </Box>
            <Box className={classes.form_button_grp}>
              <Button variant="contained" color="primary" onClick={handleSendOTP} classes={{ root: classes.button }}>
                Send me OTP
              </Button>
            </Box>
            <Box mt={2} className={classes.form_item}>
              <Typography variant="h6">
                Please fill in the OTP
              </Typography>
              <TextField
                label="OTP"
                variant="outlined"
                value={otp}
                onChange={handleOtpChange}
                margin="dense"
                fullWidth
              />
            </Box>
            <Box className={classes.form_button_grp}>
              <Button type="submit" variant="contained" color="primary" classes={{ root: classes.button }}>
                Submit
              </Button>
            </Box>
            <Box className={classes.form_redirect}>
              OR
              <Link className={classes.linkText} to="/">return to login</Link>
            </Box>
          </FormControl>
        </Box>
      </div>
    </div>
  );
}

export default ForgotPassword;