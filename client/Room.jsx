import React, { useRef, useState, useEffect } from 'react';
import { Paper, makeStyles } from '@material-ui/core';
//import { Paper, TextField, Button, IconButton } from '@mui/material';
//import { makeStyles } from '@mui/styles'; // makeStyles is not supported by in v5
import EmojiPicker from 'emoji-picker-react';



// Import self-defined items
import useChatRoom from "./useChatRoom.jsx";
import MsgBubble from "./MsgBubble.jsx";
import RoomHeader from './RoomHeader.jsx';
import RoomFooter from './RoomFooter.jsx';

// Styling
const useStyles = makeStyles({
  paper: {
    width: "50%",
    height: "100%",
    position: "relative"
  },
  messageContainer: {
    backgroundColor: "red",
    overflowY: "auto",
    height: "80%"
  }
});

const Room = ({ recipient }) => {
  const classes = useStyles();

  // Hooks for sending messages
  const { messages, sendMessage } = useChatRoom("Me", recipient);
  const [newMessage, setNewMessage] = useState("");

  // Scroll to bottom automatically on new message received
  const messageRef = useRef();
  useEffect(() => {
    messageRef.current.scrollIntoView({ behavior: "smooth" });
  })

  // emojiPicker
  const inputRef = useRef();
  const [cursorPos, setCursorPos] = useState();
  const [showEmojis, setShowEmojis] = useState();


  const handleEmojiClick = ({ emoji }) => {
    const ref = inputRef.current;
    ref.focus();
    const front = newMessage.substring(0, ref.selectionStart);
    const end = newMessage.substring(ref.selectionStart);
    const msg = front + emoji + end;
    setNewMessage(msg);
    setCursorPos(front.length + emoji.length);
  }

  // Remove the outermost container class and set Paper height as 100vh
  return (
    <Paper elevation={8} className={classes.paper}>

      <RoomHeader recipient={recipient} />

      <div className={classes.messageContainer}>
        <MsgBubble msgList={messages} />
        <div style={{ position: "absolute", left: 0, bottom: "10%" }}>
          {showEmojis &&
            <EmojiPicker previewConfig={{ showPreview: false }} height={300} width={270}
              onEmojiClick={({ emoji }) => { handleEmojiClick({ emoji }); }}
            />
          }
        </div>
        <div ref={messageRef}></div>
      </div>
      <RoomFooter
        sendMessage={sendMessage}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        showEmojis={showEmojis}
        setShowEmojis={setShowEmojis}
        cursorPos={cursorPos}
        inputRef={inputRef} />

    </Paper>
  );
};

export default Room;