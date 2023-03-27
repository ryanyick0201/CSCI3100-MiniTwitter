// A React hook that will allow us to connect to the server and send our messages.
import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

// Use the same event name as our server, to allow client-server communication
const NEW_MESSAGE_EVENT = "new-message-event";
const SOCKET_SERVER_URL = "http://localhost:3000"; // socket server URL ***Change this later

const useChatRoom = () => {
    const [messages, setMessages] = useState([]);
    const socketRef = useRef();

    useEffect(() => {
        // Create a new client with the socket server url
        socketRef.current = socketIOClient(SOCKET_SERVER_URL);

        // Listen incoming message
        socketRef.current.on(NEW_MESSAGE_EVENT, (message) => {
            const incomingMessage = {
                ...message,
                isOwner: message.senderId === socketRef.current.id,
            };
            // Send the new message to participants in the same chatroom
            setMessages((messages) => [...messages, incomingMessage]);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    // Send the messagee along with a sender id, to failitate styling the UI like other messenger
    const sendMessage = (messageBody) => {
        socketRef.current.emit(NEW_MESSAGE_EVENT, {
            body: messageBody,
            senderId: socketRef.current.id,
        });
    };

    return { messages, sendMessage };
};

export default useChatRoom;