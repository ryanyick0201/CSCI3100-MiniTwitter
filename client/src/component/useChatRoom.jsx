import { useEffect, useState } from "react";

const NEW_MESSAGE_EVENT = "newMessageEvent";

const useChatRoom = (msgSender, msgRecipient, socket) => {
  const [messages, setMessages] = useState([]);

  // Fetch Msg History whenever switch to a new room
  useEffect(() => {
    console.log(`join Room and fetch history between "${msgSender}" and "${msgRecipient}"`);

    // Join chat room, emit the two parties in an array to server
    // *** To be replaced by socket.on event
    socket.emit("joinRoom", [msgSender, msgRecipient]);
    socket.on("chatHistory", (res) => {
      res.forEach((item) => {
        item["isSender"] = item.sender == msgSender;
      });
      setMessages(res);
    })
  }, [msgRecipient]);

  useEffect(() => {
    // Receive message
    socket.on(NEW_MESSAGE_EVENT, (message) => {
      const incomingMessage = {
        ...message,
        isSender: message.sender === msgSender,
      };
      setMessages((messages) => [...messages, incomingMessage]);
    });

    return () => {
      socket.disconnect();
    };

  }, []);

  const sendMessage = (messageBody, isImg = false) => {
    console.log("sending msg");
    socket.emit(NEW_MESSAGE_EVENT, {
      sender: msgSender,
      recipient: msgRecipient,
      isImg: isImg,
      message: messageBody, // if (isImg) message = {file, mimeType, fileName} else message is String
      sendTime: new Date(),
    });
  };
  return { messages, sendMessage, socket };
};

export default useChatRoom;
