import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button, FormControl, Typography, Box} from '@material-ui/core';
import { UseStyles } from './CssFormat';

const useStyles = makeStyles((theme) => ({
  SubButton: {
    padding: '20px 40px 20px 40px',
  },
}));

function EmailVerf() {
  //const classes = useStyles();
  const classes = UseStyles();
  const [otp, setOTP] = useState('');

  const handleOtpChange = (event) => {
    setOTP(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // handle login logic here
  };

  const handleResent = (event) => {
    event.preventDefault();
    // handle login logic here
    //TODO 
    // Only can click each 60s
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
              classes={{ root: classes.button }} 
              onClick={handleResent}
            >
              Send again
            </Button>
          </div>
        </FormControl>
      </div>
    </div>
    
  );
}

export default EmailVerf;