import React from 'react';
import { Link } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import Login from './Login';
import Logo from './Logo';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import ForgotPassword from './forgotPassword';

function Content() {
  return (   
    // <Router>
    //   <Grid container spacing={2}>
    //     <Grid item xs={12}>
    //       <Logo />
    //     </Grid>
    //     <Grid item xs={12} md={6}>
    //       <Routes>
    //         <Route exact path="/" element={<Login/>}/>
    //         <Route exact path="/forgot_password"element={<ForgotPassword/>}/>
    //       </Routes>
    //     </Grid>
    //   </Grid>
    // </Router>

    // <div>
    //   <Grid container spacing={2}>
    //    <Grid item xs={12} sm={8}>
    //      <Login />
    //    </Grid>
    //    <Grid item xs={12} sm={4}>
    //      <Logo />
    //    </Grid>
    //   </Grid>
    // </div>
    <div>
      Testing
      <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/forgot_password">About</Link>
        </li>
      </ul>
    </nav>

    </div>
    
  );

}

export default Content;