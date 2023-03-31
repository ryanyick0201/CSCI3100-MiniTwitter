import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

const NEW_MESSAGE_EVENT = "new-message-event";
const SOCKET_SERVER_URL = "http://localhost:3030";

const getMsgHistory = (msgSender, msgRecipient) => {
  // to be replaced by API
  let serverRes = [{
    sender: msgSender,
    recipient: msgRecipient,
    isImg: false,
    message: "getMsgHistory functioning for" + msgRecipient,
    sendTime: new Date(2018, 11, 24, 25, 33, 30, 0)
  }]
  serverRes.forEach((item) => {
    item["isSender"] = (item.sender == msgSender);
  })
  return serverRes;
}

const nameRoomBetween = (msgSender, msgRecipient) => {
  const participant = [msgSender, msgRecipient].sort();
  return participant.join("");
};

const useChatRoom = (msgSender, msgRecipient) => {
  const socketRef = useRef();
  socketRef.current = socketIOClient(SOCKET_SERVER_URL);

  const [messages, setMessages] = useState([]);

  // Fetch Msg History whenever switch to a new room
  // change to be an on connection successful event? Not sure if possible
  useEffect(() => {
    console.log(msgSender, msgRecipient);
    // Join chat room, emit a string of roomName to server(written by Raymond)
    socketRef.current.emit("joinRoom", nameRoomBetween(msgSender, msgRecipient))
    setMessages(() => getMsgHistory(msgSender, msgRecipient));
  }, [msgRecipient])


  useEffect(() => {
    // Receive message
    socketRef.current.on(NEW_MESSAGE_EVENT, (message) => {
      const incomingMessage = {
        ...message,
        isSender: message.sender === msgSender,
      };
      console.log("I M", incomingMessage);
      setMessages((messages) => [...messages, incomingMessage]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const sendMessage = (messageBody, isImg = false) => {
    socketRef.current.emit(NEW_MESSAGE_EVENT, {
      sender: msgSender,
      recipient: msgRecipient,
      isImg: isImg,
      message: messageBody, // if (isImg) message = {file, mimeType, fileName} else message is String
      sendTime: new Date()
    });
  };
  return { messages, sendMessage };
};

export default useChatRoom;