/** Room - Chatroom Header + Body + Footer component
 * PROGRAMMER: Choi, Man Wai (SID: 1155159354)
 * CALLING SEQUENCE: Room({sender, recipient, socket})
 *  Where sender is the username of string type of the sender
 *        recipient is a state storing the username, whose message history with the sender is being viewed by the sender
 *          recipient state is set by actions in "./Panel.jsx" (not shown in the below code)
 *        socket is a socket object defined in "../ChatPage.jsx" for listening to socket events
 * PURPOSE: Combine <RoomHeader/> and <RoomFooter/> with Room body, so the whole chatrroom can be used by ChatPage
 *  Where Room body shows the list of message between the sender and the recipient
 * ALGORITHM: useChatroom(sender, recipient, socket) from "./useChatRoom.jsx" for emitting and listening to socket event
 *            Rendering <EmojiPicker/> in Room body, visability based on a state set in <RoomFooter/>
 */

import React, { useRef, useState, useEffect } from "react";
import { Paper, makeStyles } from "@material-ui/core";
import EmojiPicker from "emoji-picker-react";

import useChatRoom from "./useChatRoom.jsx";
import MsgBubble from "./MsgBubble.jsx";
import RoomHeader from "./RoomHeader.jsx";
import RoomFooter from "./RoomFooter.jsx";

// Styling
const useStyles = makeStyles({
  roomContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  messageContainer: {
    overflowY: "auto",
    height: "80%",
  },
});

const Room = ({ sender, recipient, socket }) => {
  const classes = useStyles();

  // Hooks for sending messages
  const { messages, sendMessage } = useChatRoom(sender, recipient, socket);
  const [newMessage, setNewMessage] = useState("");

  // Scroll to bottom automatically on new message received
  const messageRef = useRef();
  useEffect(() => {
    messageRef.current.scrollIntoView({ behavior: "smooth" });
  });

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
  };

  return (
    <Paper elevation={8} className={classes.roomContainer}>
      <RoomHeader recipient={recipient} />

      <div className={classes.messageContainer}>
        <MsgBubble msgList={messages} />
        <div style={{ position: "absolute", left: 0, bottom: "10%" }}>
          {showEmojis && (
            <EmojiPicker
              previewConfig={{ showPreview: false }}
              height={300}
              width={270}
              onEmojiClick={({ emoji }) => {
                handleEmojiClick({ emoji });
              }}
            />
          )}
        </div>
        <div ref={messageRef}></div>
      </div>
      {recipient && (
        <RoomFooter
          sendMessage={sendMessage}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          showEmojis={showEmojis}
          setShowEmojis={setShowEmojis}
          cursorPos={cursorPos}
          inputRef={inputRef}
        />
      )}
    </Paper>
  );
};

export default Room;
