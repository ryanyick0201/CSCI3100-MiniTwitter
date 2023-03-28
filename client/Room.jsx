import React, { useRef, useState, useEffect } from "react";
import { Paper, TextField, Button, makeStyles } from "@material-ui/core";
import clsx from "clsx"; // To pass class names into the package

// Import hook
import useChatRoom from "./useChatRoom.jsx";

const Room = () => {
    // Use hook
    const { messages, sendMessage } = useChatRoom();
    const [newMessage, setNewMessage] = useState("");
    //const classes = useStyles();

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
        if (e.key === "Enter") {
            if (newMessage !== "") {
                sendMessage(newMessage);
                setNewMessage("");
            }
        }
    };

    return (
        <div className={classes.container}>
            <Paper elevation={5} className={classes.paper}>
                <div className={classes.messageContainer}>
                    <ol className={classes.ol}>
                        {messages.map((message, i) => (
                            <li
                                key={i}
                                className={clsx(classes.message, message.isOwner ? classes.owner : classes.guest)}
                            >
                                <span>{message.body}</span>
                            </li>
                        ))}
                    </ol>
                    <div ref={messageRef}></div>
                </div>
                <div className={classes.action}>
                    <TextField
                        className={classes.messageInput}
                        id="message"
                        label="Message"
                        placeholder="enter message here"
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
