import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TextField, Button, Typography, Box} from '@material-ui/core';
import { UseStyles } from './CssFormat';

function SignUp() {
  const classes = UseStyles();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loginMode, setMode] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    loginAction();
    // handle login logic here
  };

  const loginAction= () => {
    console.log('Enter loginAction');
    let login_Url = 'http://'+ window.location.hostname;
    if (username === 'admin' && password === 'admin') {
      console.log('Login as Admin');
      setMode('admin');
      login_Url = login_Url + '/loginOut/adminLogin';
    } else {
      console.log('Login as User');
      setMode('user');
      login_Url = login_Url + '/loginOut/userLogin';
    }
      let ok = false;
      fetch(
        login_Url,
        {
          method: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({username, password, loginMode}),
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
          }
          document.getElementById('login-msg').innerText = res;
        })
        .catch((err)=> document.getElementById('login-msg').innerText = err );
  }

  return (
    <div className={classes.root}>
      <div className={classes.formContainer}>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Typography variant="h2" className={classes.form_title}>
            Mini Twitter
          </Typography>
          <Box className = {classes.form_item}>
            <Typography variant="h6">Please fill in your email</Typography>
            <TextField
              className={classes.textField}
              label="Email"
              variant="outlined"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
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
              onChange={(event) => setPassword(event.target.value)}
            />
          </Box>
          
          <Button
            className={classes.submitButton}
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            style={{ height: '40px', width: '100px' }}
          >
            Sign Up
          </Button>
          <Typography variant="h6" style={{ fontSize: '12px' }}>
            OR<br></br>
          </Typography>
          <Link to="/">return to login</Link>
        </form>
      </div>
    </div>
    
  );
}

export default SignUp;