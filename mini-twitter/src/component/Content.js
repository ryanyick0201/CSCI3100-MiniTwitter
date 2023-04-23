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
