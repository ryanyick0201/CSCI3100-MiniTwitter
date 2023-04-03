import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { io } from "socket.io-client";

import Room from "./chatComponent/Room";
import Panel from "./chatComponent/Panel";

const SOCKET_SERVER_URL = "http://localhost:3030";

const useStyles = makeStyles({
  pageContainer: {
    position: "fixed",
    top: "5%",
    left: "5%",
    borderStyle: "solid",
    borderColor: "green",

    display: "flex",
    width: "90vw",
    height: "90vh",
    backgroundColor: "#263238",
  },
});

const ChatPage = ({ sender }) => {
  const classes = useStyles();
  const [recipient, setRecipient] = useState("");
  console.log(`sender is ${sender}`);

  const [socket, setSocket] = useState(io(SOCKET_SERVER_URL));

  return (
    <div className={classes.pageContainer}>
      <Panel
        sender={sender}
        recipient={recipient}
        setRecipient={setRecipient}
        socket={socket}
      />
      <Room sender={sender} recipient={recipient} socket={socket} />
    </div>
  );
};

export default ChatPage;
