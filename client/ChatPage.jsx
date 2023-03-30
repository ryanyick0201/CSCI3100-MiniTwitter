import React, { useState } from 'react';
import { Grid, makeStyles } from '@material-ui/core';

import Room from './Room';
import Panel from './Panel';

const useStyles = makeStyles({
    pageContainer: {
        display: "flex",
        width: "100vw",
        height: "100vh",
        backgroundColor: "#263238"
    },
})

const ChatPage = () => {
    const classes = useStyles();
    const [roomName, setRoomName] = useState("");

    return (
        <div className={classes.pageContainer}>
            <Panel setRoomName={setRoomName} />
            <Room roomName={roomName} />
        </div>
    )
}

export default ChatPage;