/** ChatPage - Panel + Chatroom component
 * PROGRAMMER: Choi, Man Wai (SID: 1155159354)
 * CALLING SEQUENCE: ChatPage({sender})
 *  Where sender is the username of string type of the sender (Everyone opening the chat page is the sender from his perspective)
 * PURPOSE: Combine <Panel/> and <Room/> as a whole page
 * ALGORITHM: io(URL) to connect to web socket, and pass the connected object to the components used by this page
 */

import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import { io } from "socket.io-client";

import Room from "./chatComponent/Room";
import Panel from "./chatComponent/Panel";

// Connect to web socket
const SOCKET_SERVER_URL = "http://" + window.location.hostname + ":3030";
const socket = io(SOCKET_SERVER_URL);
console.log("Connect to socket", socket);

// Styling
const useStyles = makeStyles({
  pageContainer: {
    position: "relative",
    top: "5vh",
    left: "350px",
    borderStyle: "solid",
    borderColor: "green",

    display: "flex",
    flex: 1,
    width: "70vw",
    height: "90vh",
    backgroundColor: "#263238",
  },
});

const ChatPage = ({ sender }) => {
  const classes = useStyles();
  // A state to store the name of target that the actioner is chatting with
  const [recipient, setRecipient] = useState("");

  return (
    <div className={classes.pageContainer}>
      {
        /*  
          Panel shows the list of users (aka recipient) that the actioner (aka sender) has chatted with,
          or allow the actioner to choose new target to chat with.
          Pass states as props so subcomponents can access to those states globally.
        */
        <Panel sender={sender} setRecipient={setRecipient} socket={socket} />
      }

      {
        /*
          Room is the chatroom area, which shows the current chatting target on the top,
          the messages exchange in the middle,
          and the input tools (e.g. Emoji picker and image uploader) and textbox to receive user input.
          Pass states as props so subcomponents can access to those states globally.
        */
        <Room sender={sender} recipient={recipient} socket={socket} />
      }
    </div>
  );
};

export default ChatPage;
