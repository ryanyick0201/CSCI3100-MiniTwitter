/** useChatRoom - Functions for sending and receiving messages used in Room.jsx
 * PROGRAMMER: Choi, Man Wai (SID: 1155159354)
 * CALLING SEQUENCE: useChatRoom(msgSender, msgRecipient, socket)
 *  Where msgSender, msgRecipient are usernames
 *        socket is a socket object defined in "../ChatPage.jsx" for listening to socket events
 * PURPOSE: For maintainability, define all socket event emitter and listener to be used by "./Room.jsx"
 * ALGORITHM: useEffect((...)=>{...}, []) to define listener only once when the page is rendered for the first time
 *            nowFormattedString() for formatting message sent time
 */
/** Reference list
 * Author: Peter LE
 * Link: https://keyholesoftware.com/2021/04/01/react-with-socket-io-messaging-app/
 */
import { useEffect, useState } from "react";

const NEW_MESSAGE_EVENT = "newMessageEvent";

// get now time in formatted string
function nowFormattedString() {
  // get now time
  const now = new Date();
  let offsetToUTC = now.getTimezoneOffset() * 60 * 1000; // minutes offset to milliseconds
  let nowWithOffset = now - offsetToUTC;
  const newNow = new Date(nowWithOffset);
  const formattedTime = newNow.toISOString().replace("T", " ").slice(0, -5);

  return formattedTime;
}

const useChatRoom = (msgSender, msgRecipient, socket) => {
  const [messages, setMessages] = useState([]);

  // Fetch Msg History whenever switch to a new room
  useEffect(() => {
    console.log(
      `join Room and fetch history between "${msgSender}" and "${msgRecipient}"`
    );
    console.log(`socket id of "${msgSender}"(sender) is`, socket.id);

    // Join chat room, emit the two parties in an array to server
    socket.emit("joinRoom", [msgSender, msgRecipient]);
    socket.emit("reqChatted", msgSender);
    socket.on("chatHistory", (res) => {
      res.forEach((item) => {
        item["isSender"] = item.sender == msgSender;
      });
      setMessages(res);
    });
  }, [msgRecipient]);

  useEffect(() => {
    // Receive message and add it to the message list for rendering
    socket.on(NEW_MESSAGE_EVENT, (message) => {
      console.log("received", message);
      const incomingMessage = {
        ...message,
        isSender: message.sender === msgSender,
      };
      setMessages((messages) => [...messages, incomingMessage]);
    });

    return () => {
      socket.off(NEW_MESSAGE_EVENT);
      socket.disconnect();
    };
  }, []);

  const sendMessage = (messageBody, isImg = false) => {
    console.log("sending msg, time now is", new Date());
    socket.emit(NEW_MESSAGE_EVENT, {
      sender: msgSender,
      recipient: msgRecipient,
      isImg: isImg,
      message: messageBody, // if (isImg) message = {file, mimeType, fileName} else message is of type String
      sendTime: nowFormattedString(),
    });
  };
  return { messages, sendMessage };
};

export default useChatRoom;
