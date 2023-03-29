import React, { useRef, useState, useEffect } from 'react';
import { Paper, TextField, Button, IconButton, makeStyles } from '@material-ui/core';
//import { Paper, TextField, Button, IconButton } from '@mui/material';
//import { makeStyles } from '@mui/styles'; // makeStyles is not supported by in v5
import EmojiPicker from 'emoji-picker-react';

import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
// Import hook
import useChatRoom from "./useChatRoom.jsx";

// Styling
const useStyles = makeStyles({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#263238"
  },
  paper: {
    width: "50em",
    height: "100%",
    position: "relative"
  },
  footer: {
    display: "flex",
    width: "96%",
    alignItems: "center",
    margin: "1em",
    position: "absolute",
    bottom: 0
  },
  icon: {
    margin: "0 0.01em"
  },
  messageInput: {
    width: "100%"
  },
  sendButton: {
    //width: "10em",
    height: "50%",
    margin: "0 2em"
  },
  messageContainer: {
    overflowY: "auto",
    height: "87.5%"
  },
  message: {
    listStyle: "none",
    margin: "1em",
    padding: "0.5em 1.5em",
    borderRadius: "20px",
    wordBreak: "break-word",
    maxWidth: "65%",
    width: "fit-content",
  },
  guest: {
    backgroundColor: "#CCC",
    color: "#000",
    marginRight: "auto"
  },
  owner: {
    backgroundColor: "#0091EA",
    color: "#FFF",
    marginLeft: "auto"
  },
  ol: {
    paddingInlineEnd: "40px"
  },
  emojiPicker: {
    position: "fixed",
    bottom: 0,
    left: 0
  }
});

const Room = () => {
  const classes = useStyles();

  // Hooks for sending messages
  const { messages, sendMessage } = useChatRoom();
  const [newMessage, setNewMessage] = useState("");

  // Scroll to bottom automatically on new message received
  const messageRef = useRef();
  useEffect(() => {
    messageRef.current.scrollIntoView({ behavior: "smooth" });
  })

  // Message event handlers
  const handleNewMessageChange = (e) => {
    if (e.key !== "Enter") {
      setNewMessage(e.target.value);
    };
  }
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

  // emojiPicker
  const inputRef = useRef();
  const [cursorPos, setCursorPos] = useState();
  const [showEmojis, setShowEmojis] = useState();

  const handleShowEmojis = () => {
    inputRef.current.focus();
    setShowEmojis(!showEmojis);
  }

  const handleEmojiClick = ({ emoji }) => {
    const ref = inputRef.current;
    ref.focus();
    const front = newMessage.substring(0, ref.selectionStart);
    const end = newMessage.substring(ref.selectionStart);
    const msg = front + emoji + end;
    setNewMessage(msg);
    setCursorPos(front.length + emoji.length);
  }

  useEffect(() => {
    inputRef.current.selectionEnd = cursorPos;
  }, [cursorPos])
  // emojiPicker end


  // File uploader
  const handleUploadClick = (e) => {
    var file = e.target.files[0];
    const reader = new FileReader();
    var url = reader.readAsDataURL(file);


    console.log("url", url); // Would see a path?

  };
  // File uploader end
  return (
    <div className={classes.container}>
      <Paper elevation={24} className={classes.paper}>
        <div className={classes.messageContainer}>
          <ol className={classes.ol}>
            {messages.map((message, i) => (
              <li
                key={i}
                className={classes.message + " " + (message.isOwner ? classes.owner : classes.guest)}
              >
                <span>{message.body}</span>
              </li>
            ))}
          </ol>
          <div id="01" style={{ position: "absolute", left: 0, bottom: "12.5%" }}>
            {showEmojis &&
              <EmojiPicker previewConfig={{ showPreview: false }}
                className={classes.emojiPicker}
                onEmojiClick={({ emoji }) => { handleEmojiClick({ emoji }); }}
              />
            }
          </div>
          <div ref={messageRef}></div>
        </div>
        <div className={classes.footer}>
          <IconButton className={classes.icon} onClick={handleShowEmojis}>
            <InsertEmoticonIcon color={showEmojis ? "warning" : "disabled"} />
          </IconButton>

          <input style={{ display: "none" }}
            accept="image/*"
            id="img-uploader"
            multiple
            type="file"
            onChange={handleUploadClick}
          />
          <label htmlFor="img-uploader">
            <IconButton component="span" className={classes.icon}>
              <AddPhotoAlternateIcon color="warning" />
            </IconButton>
          </label>

          <TextField inputRef={inputRef}
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
        </div>
      </Paper>
    </div>
  );
};

export default Room;
