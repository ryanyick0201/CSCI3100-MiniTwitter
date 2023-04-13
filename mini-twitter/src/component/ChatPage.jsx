import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { io } from "socket.io-client";

import Room from "./chatComponent/Room";
import Panel from "./chatComponent/Panel";

const SOCKET_SERVER_URL = "http://" + window.location.hostname + ":3030";
const socket = io(SOCKET_SERVER_URL);

const useStyles = makeStyles({
  pageContainer: {
    position: "relative",
    top: "5vh",
    left: "20vw",
    borderStyle: "solid",
    borderColor: "green",

    display: "flex",
    width: "70vw",
    height: "90vh",
    backgroundColor: "#263238",
  },
});

const ChatPage = ({ sender }) => {
  const classes = useStyles();
  const [recipient, setRecipient] = useState("");
  console.log(`sender is ${sender}`);
  console.log("socket", socket);

  return (
    <div className={classes.pageContainer}>
      <Panel sender={sender} setRecipient={setRecipient} socket={socket} />
      <Room sender={sender} recipient={recipient} socket={socket} />
    </div>
  );
};

export default ChatPage;
