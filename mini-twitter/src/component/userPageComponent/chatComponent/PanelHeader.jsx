/** PanelHeader - Panel Header component
 * PROGRAMMER: Choi, Man Wai (SID: 1155159354)
 * CALLING SEQUENCE: PanelHeader({sender, setRecipient, socket})
 *  Where sender is the username of string type of the sender
 *        setRecipient is a function to set the "recipient" state
 *        socket is a socket object defined in "../ChatPage.jsx" for listening to socket events
 * PURPOSE: Hold the name tag of the sender, and a button to search and start chatting with his chattable users
 *  Where chattable ("chat-t-able") is a relation between two users only exist when both of them follow each other
 *  After choosing the chattable user, the sender can see the chatroom between the two and start sending message.
 * ALGORITHM: Use from Material UI,
 *            <Dialog/> for a pop-up window holding the search bar, so that the sender can always stay on the same page
 *            <Autocomplete/> and <TextField/> as search bar for searching chattable users
 *            <Snackbar/> and <Alert/> for styled alert
 */

import React, { useState, useRef } from "react";
import { Card, Grid, IconButton } from "@material-ui/core";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@material-ui/core";
import { Autocomplete, TextField, Snackbar, Alert } from "@mui/material/";

import RateReviewIcon from "@mui/icons-material/RateReview";
import NameTag from "./NameTag";

// Fetch from server the list of other users that the message sender can chat with (chattable, "chat-t-able")
const fetchChattableList = async (sender) => {
  console.log("enter fetchChattableList()");

  const url =
    "http://" +
    window.location.hostname +
    ":3000/chat/chatTables?username=" +
    sender;
  const res = await fetch(url, { mode: "cors" });

  console.log(
    "finish fetch, now parse res to json. before parsing res is",
    res
  );

  const data = await res.json();

  console.log("finished parsing, data is", data);

  return data;

  /*dummy data for testing, to be replaced by API
  return [
    sender,
    "The Shawshank Redemption",
    "The Godfather",
    "The Godfather: Part II",
    "The Dark Knight",
    "12 Angry Men",
    "Schindler's List",
    "Pulp Fiction",
  ];
*/
};

const PanelHeader = ({ sender, setRecipient, socket }) => {
  // Pop-up Dialog Component
  const [open, setOpen] = useState(false);
  const [chattables, setChattables] = useState([]);

  const handleClickOpen = async () => {
    setChattables(await fetchChattableList(sender));
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  // Dialog end

  /*
    Search with validation, to search for chattables of a sender,
    and choose the one to chat with.
    Validation rule: if the sender attempts to choose one not in his chattable list,
    an alert will pop up; otherwise, proceeds to start chatting.
  */
  const formRef = useRef();
  const [alertVisibility, setAlertVisibility] = useState(false);

  const handleConfirm = () => {
    const target = formRef.current.value;
    if (chattables.includes(target)) {
      socket.emit("leaveRoom");
      setRecipient(target);
      setOpen(false);
      setAlertVisibility(false);
    } else {
      handleClickOpen();
      setAlertVisibility(true);
    }
  };

  const handleAlertClose = () => {
    setAlertVisibility(false);
  };
  const handleAlertClickAway = () => {
    console.log("click away");
    setAlertVisibility(alertVisibility);
  };
  /* Autocomplete Search end */

  return (
    <>
      <Card square style={{ minHeight: "10%" }}>
        <Grid container justifyContent="center" alignItems="center">
          <NameTag name={sender} />
          <IconButton aria-label="compose" onClick={handleClickOpen}>
            <RateReviewIcon color="warning" />
          </IconButton>
        </Grid>
      </Card>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Search user</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Search the name of recipient to open a new chatroom and start
            chatting!
          </DialogContentText>
          <Autocomplete
            id="autocomplete_search"
            freeSolo
            options={chattables}
            renderInput={(params) => (
              <TextField
                inputRef={formRef}
                {...params}
                label="Search whom to chat with..."
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleConfirm}>Chat now!</Button>
        </DialogActions>

        <Snackbar // Alert message holder
          open={alertVisibility}
          autoHideDuration={3000}
          onClose={handleAlertClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          ClickAwayListenerProps={{ onClickAway: handleAlertClickAway }}
        >
          <Alert
            onClose={handleAlertClose}
            severity="error"
            sx={{ width: "100%" }}
          >
            Cannot find that user. You may have inputted a wrong username.
          </Alert>
        </Snackbar>
      </Dialog>
    </>
  );
};

export default PanelHeader;
