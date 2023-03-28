import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button, Typography, Box} from '@material-ui/core';

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
  SubButton: {
    padding: '20px 40px 20px 40px',
  },
}));

function EmailVerf() {
  const classes = useStyles();
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
  };

 
  return (
    <div className={classes.root}>
      <div className={classes.formContainer}>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Box>
            <Typography variant="h3">
              Email Verification
            </Typography>
            <Typography variant="h6">
              We have sent an OTP to your email account, please <br></br> 
              enter the OTP to finish the verification process.
            </Typography>
          </Box>  
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
          <Box>
            <Button
              className={classes.SubButton}
              variant="contained"
              color="primary"
              type="submit"
              style={{ margin: '50px' }}
            >
              Submit
            </Button>
            <Button 
              variant="contained" 
              className={classes.SubButton} 
              color="primary" 
              onClick={handleResent}
              style={{ margin: '50px' }}
            >
              Send again
            </Button>
          </Box>
        </form>
      </div>
    </div>
    
  );
}

export default EmailVerf;