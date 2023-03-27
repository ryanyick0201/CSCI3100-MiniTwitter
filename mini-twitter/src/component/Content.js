import React from 'react';
import { Link } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import Login from './Login';
import Logo from './Logo';
// import ForgotPassword from './forgotPassword';

function Content() {
  return (   
    <div>
      <Grid container spacing={2}>
       <Grid item xs={12} sm={8}>
         <Login />
       </Grid>
       <Grid item xs={12} sm={4}>
         <Logo />
       </Grid>
      </Grid>
    </div>

    
  );

}

export default Content;