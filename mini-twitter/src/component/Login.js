import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

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

function Login() {
  const classes = useStyles();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
          <Typography variant="h6">
            Welcome back
          </Typography>
          <Typography variant="h3">
            Sign in
          </Typography>
          <Typography variant="h6">Username:</Typography>
          <TextField
            className={classes.textField}
            label="Username"
            variant="outlined"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
          <Typography variant="h6">
            Password:
            {/* <Link to="/forgot_password">Forgot password?</Link> */}
          </Typography>
          <TextField
            className={classes.textField}
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <Button
            className={classes.submitButton}
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            style={{ height: '40px', width: '100px' }}
          >
            Sign In
          </Button>
          <Typography variant="h6">
            I don't have an account ?
            {/* <Link to="/signUp">Sign Up?</Link> */}
          </Typography>
        </form>
      </div>
    </div>
    
  );
}

export default Login;