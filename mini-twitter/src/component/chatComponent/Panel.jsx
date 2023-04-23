/** Panel - Panel Header + Body component
 * PROGRAMMER: Choi, Man Wai (SID: 1155159354)
 * CALLING SEQUENCE: Panel({sender, setRecipient, socket})
 *  Where sender is the username of string type of the sender
 *        setRecipient is a function to set the "recipient" state
 *        socket is a socket object defined in "../ChatPage.jsx" for listening to socket events
 * PURPOSE: Combine <PanelHeader/> with Panel body, so the whole Panel can be used by ChatPage
 *  Where Panel body is a list of users chatted with the sender,
 *        Order by the message time; later the time, upper the username on the list.
 *        Clikcing on the username on the list opens the chatroom between the sender and that user
 * ALGORITHM: usePanel(socket) from "./usePanel.jsx" for listening to the list of chatted users from socket
 *            Using <Card /> and <CardActionArea/> from Material UI for layout and clickable actions
 */

import React from "react";
import { Card, CardActionArea, makeStyles } from "@material-ui/core";
import PanelHeader from "./PanelHeader";
import usePanel from "./usePanel.jsx";
import NameTag from "./NameTag";

const useStyles = makeStyles({
  panelContainer: {
    width: "25%",
    height: "100%",
    position: "relative",
  },
  recipientContainer: {
    height: "90%",
    overflowY: "auto",
  },
});

const Panel = ({ sender, setRecipient, socket }) => {
  const classes = useStyles();

  const { nameList } = usePanel(sender, socket);

  return (
    <Card square className={classes.panelContainer}>
      <PanelHeader
        sender={sender}
        setRecipient={setRecipient}
        socket={socket}
      />
      {
        // Panel body
        <div className={classes.recipientContainer}>
          {nameList.map((name, i) => (
            <CardActionArea
              key={name}
              onClick={(e) => {
                socket.emit("leaveRoom");
                setRecipient(e.target.innerText);
              }}
            >
              <NameTag name={name} />
            </CardActionArea>
          ))}
        </div>
      }
    </Card>
  );
};

export default Panel;
