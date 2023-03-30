import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

const NEW_MESSAGE_EVENT = "new-message-event";
const SOCKET_SERVER_URL = "http://localhost:3030";

const getMsgHistory = (msgSender, msgRecipient) => {
  if (msgRecipient == 'Placeholder0')
    return ([{
      sender: msgSender,
      recipient: msgRecipient,
      message: "getMsgHistory functioning",
      sendTime: new Date(2018, 11, 24, 10, 33, 30, 0)
    }])
  else return [];
}


const useChatRoom = (msgSender, msgRecipient) => {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    console.log(msgSender, msgRecipient);
    setMessages(() => getMsgHistory(msgSender, msgRecipient));
  }, [msgRecipient])


  const socketRef = useRef();
  useEffect(() => {
    socketRef.current = socketIOClient(SOCKET_SERVER_URL);

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

  const sendMessage = (messageBody) => {
    socketRef.current.emit(NEW_MESSAGE_EVENT, {
      sender: msgSender,
      recipient: msgRecipient,
      message: messageBody,
      sendTime: new Date()
    });
  };
  return { messages, sendMessage };
};

export default useChatRoom;