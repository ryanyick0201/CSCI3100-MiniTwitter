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
    let login_Url = 'http://'+ window.location.hostname + ':3000/login';
    if (username === 'admin' && password === 'admin') {
      console.log('Login as Admin');
      mode = 'admin';
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
          hashedPassword = await hashPassword(password); // hash password
        }
    }
    let ok = false;
    const postBody = {
      username: username,
      password: hashedPassword
    };
    fetch(
      login_Url,
      {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postBody),
      }
    )
      .then(response => response.json())
      .then((data) => {
        if(data.message == "Login succeeded."){
          sessionStorage.setItem('username', username);
          this.props.setUsername(username);
          // TODO Need Integration
          // if(mode === "user") 
          //   navigate('/userHome');
          // else 
          //   navigate('/adminHome');
          alert('Login Success')
        } else {
          alert(data.message);
        }
      })
      .catch((err)=> alert(err));
  }

  return (
    <div className={classes.root}>
      <div className={classes.formContainer} style={{padding: '5%', width: '70%', height: '80%', borderColor: 'white', borderRadius: '25px',}}>
      <Box>
        <Typography variant="h6" className={classes.loginDesc}>
          Welcome back
        </Typography>
        <Typography variant="h3" className={classes.loginTitle} style={{fontWeight: "800"}}>
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
          <Box style={{display: "flex",flexDirection: "column",padding: '20px 0 20px 0',}}>
            <div style={{ display: 'flex', justifyContent: 'space-between'}}>
              <Typography variant="h6">
                Password:
              </Typography>
              <Link className={classes.linkText} style={{opacity: '0.6'}} to="/forgot_password"> Forgot password?</Link>
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
            >
              Sign In
            </Button>
          </Box>
          <Box className={classes.form_redirect}>
            <Typography variant="h6" >
              I don't have an account ? 
              <Link className={classes.linkText} style={{color: "#F47458"}} to="/signUp"> Sign Up</Link>
            </Typography>
          </Box>
        </FormControl>
      </div>
    </div>
    
  );
}

export default Login;