import React, { useRef, useState, useEffect } from 'react';
import { Card, CardActionArea, CardContent, makeStyles } from '@material-ui/core';
import PanelHeader from './PanelHeader';

const useStyles = makeStyles({
    container: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#263238"
    },
    paper: {
        width: "50em",
        height: "100%",
        position: "relative"
    },
    recipientContainer: {
        overflowY: "auto",
        height: "50%"
    }
}
)

const getRecipientList = () => {
    const names = [];
    for (let i = 0; i < 20; i++) {
        names.push("Placeholder" + i);
    }
    return names;
}


const Panel = () => {
    let recipients = getRecipientList();
    console.log(recipients);
    const classes = useStyles();
    return (
        <div className={classes.container}>

            <Card className={classes.paper}>
                <PanelHeader sender="Me" />
                <div className={classes.recipientContainer}>
                    {recipients.map((recipient, i) => (
                        <CardActionArea key={recipient} onClick={() => { alert("clicked"); recipients.push("click") }}>
                            <CardContent>{recipient}</CardContent>
                        </CardActionArea>
                    ))}
                </div>
            </Card>
        </div>
    )
}

export default Panel;