import React, { useState, useRef } from "react";
import { Card, CardHeader, Avatar, Grid, IconButton } from "@material-ui/core";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@material-ui/core"; // import for search dialog function
import { Autocomplete, TextField, Snackbar, Alert } from "@mui/material/";

import RateReviewIcon from "@mui/icons-material/RateReview";

const fetchChattableList = (sender) => {
  // to be replaced by API
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
};

const PanelHeader = ({ sender, recipient, setRecipient }) => {
  /* Dialog */
  const [open, setOpen] = useState(false);
  const [chattables, setChattables] = useState([]);

  const handleClickOpen = () => {
    setChattables(fetchChattableList(sender));
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  /* Dialog end */

  /* Autocomplete Search with alert*/
  const formRef = useRef();
  const [alertVisibility, setAlertVisibility] = useState(false);

  const handleConfirm = () => {
    const target = formRef.current.value;
    if (chattables.includes(target)) {
      console.log(recipient);
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
          <CardHeader avatar={<Avatar alt={sender} src="/" />} title={sender} />
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

        <Snackbar
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
