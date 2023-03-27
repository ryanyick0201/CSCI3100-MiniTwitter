import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button, FormControl, Typography, Box } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#FFA500',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(4),
    backgroundColor: 'white',
    borderRadius: theme.spacing(1),
  },
  form: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(4),
  },
  textField: {
    margin: theme.spacing(1),
    width: '25ch',
  },
  submitButton: {
    margin: theme.spacing(2, 0),
  },
}));

function ForgotPassword() {
  const classes = useStyles();
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
      <Box m={2} p={2} border={1} borderColor="grey.400">
      <Typography variant="h3" gutterBottom>
        Trouble with logging in?
      </Typography>
      <Typography variant="body1" gutterBottom>
        Enter your email address and we'll send you an OTP. <br></br>
            you can change your password after login.
      </Typography>
      <FormControl onSubmit={handleSubmitOTP}>
        <Box mt={2}>
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
          <Button variant="contained" color="primary" onClick={handleSendOTP}>
            Send me OTP
          </Button>
        </Box>
        <Box mt={2}>
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
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Box>
        <p>
          {/* OR <br></br> <Link to="/login">return to login</Link> */}
          OR <br></br> return to login
        </p>
      </FormControl>
    </Box>
  );
}

export default ForgotPassword;