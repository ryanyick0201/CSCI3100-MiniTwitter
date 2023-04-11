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
    // *** To be replaced by socket.on event
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
    // Receive message
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
      message: messageBody, // if (isImg) message = {file, mimeType, fileName} else message is String
      sendTime: nowFormattedString(),
    });
  };
  return { messages, sendMessage, socket };
};

export default useChatRoom;