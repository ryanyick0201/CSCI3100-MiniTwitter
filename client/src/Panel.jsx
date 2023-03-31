import React, { useEffect, useState } from 'react';
import { Card, CardActionArea, CardHeader, Avatar, makeStyles } from '@material-ui/core';
import PanelHeader from './PanelHeader';
import usePanel from "./usePanel.jsx";


const useStyles = makeStyles({
    panelContainer: {
        width: "25%",
        height: "100%",
        position: "relative"
    },
    recipientContainer: {
        height: "90%",
        overflowY: "auto",
    }
}
)

const Panel = ({ sender, setRecipient, socket }) => {
    const classes = useStyles();

    const { nameList } = usePanel(sender, socket);

    return (
        <Card square className={classes.panelContainer}>
            <PanelHeader sender={sender} />
            <div className={classes.recipientContainer}>
                {nameList.map((name, i) => (
                    <CardActionArea key={name}
                        onClick={(e) => {
                            setRecipient(e.target.innerText);
                        }}>
                        <CardHeader
                            avatar={<Avatar alt={name} src="" />}
                            title={name} />
                    </CardActionArea>
                ))}
            </div>
        </Card >
    )
}

export default Panel;