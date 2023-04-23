/** RoomFooter - Chatroom Footer component
 * PROGRAMMER: Choi, Man Wai (SID: 1155159354)
 * CALLING SEQUENCE: RoomFooter({sendMessage, newMessage, setNewMessage, showEmojis, setShowEmojis, cursorPos, inputRef}))
 *  Where sendMessage is a function defined in "./useRoom.jsx"
 *        newMessage is a state storing what the user typed in the textbox
 *        setNewMessage is a function to set the newMessage state
 *        showEmojis is a Boolean state determine whether to display <EmojiPicker/> in "./Room" or not
 *        setShowEmojis is a function to set the showEmojis state
 *        cursorPos is a state storing the cursor position in the <TextField/>
 *        inputRef is a React Ref obj to anchor to the <TextField/>
 * PURPOSE: Contains all input method that a sender can use, except the render of <EmojiPicker/> which is placed in "./Room"
 */

import React, { useEffect } from "react";
import {
  TextField,
  Button,
  IconButton,
  Card,
  Grid,
  makeStyles,
} from "@material-ui/core";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

const useStyles = makeStyles({
  icon: {
    margin: "0 0.1em",
  },
  messageInput: {
    flex: 1,
  },
  sendButton: {
    margin: "0 2em",
  },
});

const RoomFooter = ({
  sendMessage,
  newMessage,
  setNewMessage,
  showEmojis,
  setShowEmojis,
  cursorPos,
  inputRef,
}) => {
  const classes = useStyles();
  /* emojiPicker */
  const handleShowEmojis = () => {
    inputRef.current.focus();
    setShowEmojis(!showEmojis);
  };

  useEffect(() => {
    inputRef.current.selectionEnd = cursorPos;
  }, [cursorPos]);
  /* emojiPicker end */

  /* File uploader */
  const handleSendFile = (e) => {
    const files = e.target.files;
    for (let file of files) {
      let msgObj = {
        file: file,
        mimeType: file.type,
        fileName: file.name,
      };
      sendMessage(msgObj, true);
    }
    e.target.value = null;
  };
  /* File uploader end */

  /* Message event handlers */
  const handleNewMessageChange = (e) => {
    if (e.key !== "Enter") {
      setNewMessage(e.target.value);
    }
  };
  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      sendMessage(newMessage);
      setNewMessage("");
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };
  /* Message event handlers end */

  return (
    <Card
      square
      className={classes.footerContainer}
      style={{
        display: "flex",
        width: "100%",
        minHeight: "10%",
        position: "absolute",
        bottom: 0,
      }}
    >
      <Grid container justifyContent="center" alignItems="center">
        <IconButton className={classes.icon} onClick={handleShowEmojis}>
          <InsertEmoticonIcon color={showEmojis ? "warning" : "disabled"} />
        </IconButton>
        <input
          style={{ display: "none" }}
          accept="image/*"
          id="img-uploader"
          multiple
          type="file"
          onChange={handleSendFile}
        />
        <label htmlFor="img-uploader">
          <IconButton component="span" className={classes.icon}>
            <AddPhotoAlternateIcon color="warning" />
          </IconButton>
        </label>
        <TextField
          inputRef={inputRef}
          className={classes.messageInput}
          id="message"
          label="Message"
          placeholder="Type here..."
          variant="outlined"
          value={newMessage}
          onChange={handleNewMessageChange}
          onKeyDown={handleKeyDown}
          //multiline maxRows={3}
        />
        <Button
          disabled={!newMessage.trim()}
          variant="contained"
          color="primary"
          onClick={handleSendMessage}
          className={classes.sendButton}
        >
          Send
        </Button>
      </Grid>
    </Card>
  );
};

export default RoomFooter;
