import React, { useState } from 'react';
import { Link, useNavigate  } from 'react-router-dom';
import { TextField, Button, Typography, FormControl, Box} from '@material-ui/core';
import { UseStyles } from './CssFormat';
import bcrypt from 'bcryptjs';
import {
  usernameValidator,
  passwordValidator,
} from "./Validator";

function Login() {
  const classes = UseStyles();
  let navigate  = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    loginAction();  
  };

  const hashPassword = async (password) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  };

  const loginAction= async() => {
    console.log('Enter loginAction');
    let mode = "";
    let hashedPassword = "";
    let login_Url = 'http://'+ window.location.hostname;
    if (username === 'admin' && password === 'admin') {
      console.log('Login as Admin');
      mode = 'admin';
      login_Url = login_Url + '/loginOut/adminLogin'; //change it if needed
    } else {
        console.log('Login as User');
        let userValidateResult = usernameValidator(username);
        let pwdValidateResult = passwordValidator(password);
        let ValidateResult = userValidateResult + pwdValidateResult;
        if (ValidateResult !== "") {
          alert(ValidateResult);
          return null;
        }        
        else {
          mode = 'user';
          login_Url = login_Url + '/loginOut/userLogin';
          hashedPassword = await hashPassword(password); // hash password
        }
    }
    let ok = false;
    fetch(
      login_Url,
      {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({username, hashedPassword, mode}),
      }
    )
      .then((res) => {
        ok = res.ok ? true : false;
        return res.text()
      })
      .then((res) => {
        if(ok){
          sessionStorage.setItem('username', res);
          this.props.setUsername(res);
          // Uncomment after integration
          // if(mode === "user") 
          //   navigate('/userHome');
          // else 
          //   navigate('/adminHome');
        }
        document.getElementById('login-msg').innerText = res;
      })
      .catch((err)=> document.getElementById('login-msg').innerText = err );
  }

  return (
    <div className={classes.root}>
      <div className={classes.formContainer} style={{padding:'120px 120px 120px 120px'}}>
      <Box m={2} p={2} border={1} borderColor="grey.400">
        <Typography variant="h6" className={classes.loginDesc}>
          Welcome back
        </Typography>
        <Typography variant="h3" className={classes.loginTitle}>
          Sign in
        </Typography>
      </Box>
        <FormControl className={classes.form} onSubmit={handleSubmit}>
          <Box mt={2} className={classes.form_item}>
            <Typography variant="h6">Username:</Typography>
            <TextField
              className={classes.textField}
              label="Username"
              variant="outlined"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              margin="dense"
              fullWidth
            />
          </Box>
          <Box mt={2} className={classes.form_item}>
            <Typography variant="h6">
              Password:
              <Link className={classes.linkText} to="/forgot_password">Forgot password?</Link>
            </Typography>
            <TextField
              className={classes.textField}
              label="Password"
              variant="outlined"
              type="password"
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
              color="primary"
              type="submit"
              fullWidth
              style={{ height: '40px', width: '100px' }}
            >
              Sign In
            </Button>
          </Box>
          <Box className={classes.form_item}>
            <Typography variant="h6" >
              I don't have an account ?
              <Link className={classes.linkText} to="/signUp">Sign Up</Link>
            </Typography>
          </Box>
        </FormControl>
      </div>
    </div>
    
  );
}

export default Login;