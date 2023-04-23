/** Content - Page to integrate login page and the logo
 * PROGRAMMER: Li, Hang Chi (SID: 1155142983)
 * CALLING SEQUENCE: import Content From "./component/Content"
 *                   import the js and call to render this page
 * PURPOSE: Provide a login form with the logo for user
 * ALGORITHM: <Grid> is for layout control
 *            <Login setLogInAs={setLogInAs}> is importing the login page and set the role is the user logined
 *            <Logo> is import the logo componet from /Logo.
 */

import React from "react";
import { Grid } from "@material-ui/core";
import Login from "./Login";
import Logo from "./Logo";

function Content({ setLogInAs }) {
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={8}>
          <Login setLogInAs={setLogInAs} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Logo />
        </Grid>
      </Grid>
    </div>
  );
}

export default Content;
