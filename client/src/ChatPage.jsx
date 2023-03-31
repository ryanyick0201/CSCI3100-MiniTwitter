import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';

import Room from './Room';
import Panel from './Panel';

const useStyles = makeStyles({
    pageContainer: {
        position: "fixed",
        top: "5%",
        left: "5%",
        borderStyle: "solid",
        borderColor: "green",

        display: "flex",
        width: "90vw",
        height: "90vh",
        backgroundColor: "#263238"
    },
})



const ChatPage = ({ sender }) => {
    const classes = useStyles();
    const [recipient, setRecipient] = useState("");

    return (
        <div className={classes.pageContainer}>
            <Panel sender={sender ? sender : "Me"} setRecipient={setRecipient} />
            <Room recipient={recipient} />
        </div>
    )
}

export default ChatPage;