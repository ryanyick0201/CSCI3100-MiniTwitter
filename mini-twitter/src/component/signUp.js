import React, { useState } from 'react';
import { Link, useNavigate  } from 'react-router-dom';
import { TextField, Button, Typography, Box} from '@material-ui/core';
import { UseStyles } from './CssFormat';
import Cookies from 'js-cookie';
import bcrypt from 'bcryptjs';
import {
  usernameValidator,
  passwordValidator,
  emailValidator,
} from "./Validator";

function SignUp() {
  const classes = UseStyles();
  let navigate  = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,16}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [passwordError, setPasswordError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const handleSubmit = async(event) => {
    event.preventDefault();
    console.log('Enter handleSubmit');
    let hashedPassword = "";
    let signUp_Url = 'http://'+ window.location.hostname + '';
    let userValidateResult = usernameValidator(username);
    let pwdValidateResult = passwordValidator(password);
    let emailValidateResult = emailValidator(email);
    let ValidateResult = userValidateResult + pwdValidateResult + emailValidateResult;
    if (ValidateResult !== "") {
      alert(ValidateResult);
      return null;
    }        
    else {
      hashedPassword = await hashPassword(password); // hash password
      fetch(
        signUp_Url,
        {
          method: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({username, hashedPassword, email}),
        }
      )
        .then((res) => {
          if (res.ok) {

          }
        })
        .then((res) => {
          if(res.ok){
            Cookies.set('signUpEmailCookie', email);
            //   navigate('/emailVerf');
          } else {
            alert(res.text);
          }
        })
        .catch((err)=> alert(err));
    }
  };

  const hashPassword = async (password) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
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
      <div className={classes.formContainer}>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Typography variant="h2" className={classes.form_title} style={{ color: 'orange' }}>
            Mini Twitter
          </Typography>
          <Box className = {classes.form_item}>
            <Typography variant="h6">Please fill in your email</Typography>
            <TextField
              className={classes.textField}
              label="Email"
              variant="outlined"
              value={email}
              onChange={handleEmailChange}
              error={emailError}
              helperText={emailError ? 'Invalid email address' : ''}
              inputProps={{
                pattern: emailRegex.source,
                title: 'Please enter a valid email address',
              }}
              fullWidth
            />
          </Box>
          <Box className = {classes.form_item}>
            <Typography variant="h6">Please fill in your username:</Typography>
            <TextField
              className={classes.textField}
              label="Username"
              variant="outlined"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              fullWidth
            />
          </Box>
          <Box className = {classes.form_item}>
            <Typography variant="h6">
            Please fill in your Password:
            </Typography>
            <TextField
              className={classes.textField}
              label="Password"
              variant="outlined"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              error={passwordError}
              helperText={passwordError ? 'Invalid password' : ''}
              inputProps={{
                pattern: passwordRegex.source,
                title: 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number',
              }}
              fullWidth
            />
          </Box>
          
          <Box className={classes.form_button_grp}>
            <Button variant="contained" color="primary" onClick={handleSubmit} type="submit" classes={{ root: classes.button }}>
              Sign up
            </Button>
          </Box>
          <Box className={classes.form_redirect}>
            OR
            <Link className={classes.linkText} to="/">return to login</Link>
          </Box>
        </form>
      </div>
    </div>
    
  );
}

export default SignUp;