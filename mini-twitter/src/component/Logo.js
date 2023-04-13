import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import logo from "./logo_twi.png";

const useStyles = makeStyles({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "white",
  },
  image: {
    width: "100%",
    maxWidth: "auto",
    height: "auto",
  },
});

function Logo() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <img src={logo} className={classes.image} alt="logo" />
    </div>
  );
}
export default Logo;
