import React, { useRef, useState, useEffect } from "react";
import { Paper, TextField, Button, makeStyles } from "@material-ui/core"; // makeStyles is not supported by /core in v5
import EmojiPicker from 'emoji-picker-react';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';

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
    height: "80%",
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
  sendButton: {
    width: "10em",
    height: "50%",
    margin: "0 2em"
  },
  messageInput: {
    width: "100%"
  },
  messageContainer: {
    overflowY: "auto",
    height: "85%"
  },
  divider: {
    margin: "0.1em"
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
  // Use hook
  const { messages, sendMessage } = useChatRoom();
  const [newMessage, setNewMessage] = useState("");
  const classes = useStyles();
  
  // Scroll to bottom automatically on new message received
  const messageRef = useRef();
  useEffect(() => {
    messageRef.current.scrollIntoView({ behavior: "smooth" });
  })

  // Event handlers
  const handleNewMessageChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (newMessage !== "") {
      sendMessage(newMessage);
      setNewMessage("");
    }
  };

  const handleKeyUp = (e) => {
    if (e.key === "Enter" && newMessage !== "") {
        sendMessage(newMessage);
        setNewMessage("");
    }
  };
  // emojiPicker
  const inputRef = useRef();
  const [cursorPos, setCursorPos] = useState();
  const [showEmojis, setShowEmojis] = useState();

  const pickEmoji = ({ emoji }) => {
    const ref = inputRef.current;
    ref.focus();
    const start = newMessage.substring(0, ref.selectionStart);
    const end = newMessage.substring(ref.selectionStart);
    const msg = start + emoji + end;
    setNewMessage(msg);
    setCursorPos(start.length + emoji.length);
  }

  const handleShowEmojis = () => {
    inputRef.current.focus();
    setShowEmojis(!showEmojis);
  }

  useEffect(() => {
    inputRef.current.selectionEnd = cursorPos;
  })
  // emojiPicker end
  
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
          <div ref={messageRef}></div>
          {showEmojis &&
            <EmojiPicker
              className={classes.emojiPicker}
              onEmojiClick={({ emoji }) => { console.log({ emoji }); console.log({ emoji }); pickEmoji({ emoji }); }}
            />
          }
        </div>
        <div className={classes.footer}>
          <InsertEmoticonIcon className={classes.emojiIcon} onClick={handleShowEmojis} />
          <TextField
            className={classes.messageInput}
            id="message"
            label="Message"
            placeholder="Type here..."
            variant="outlined"
            value={newMessage}
            onChange={handleNewMessageChange}
            onKeyUp={handleKeyUp}
          />
          <Button
            disabled={!newMessage}
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
