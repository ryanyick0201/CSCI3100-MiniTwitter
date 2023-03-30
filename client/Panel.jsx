import React, { useState } from 'react';
import { Card, CardActionArea, CardHeader, Avatar, makeStyles } from '@material-ui/core';
import PanelHeader from './PanelHeader';

const useStyles = makeStyles({
    paper: {
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

const getRecipientList = () => {
    const names = [];
    for (let i = 0; i < 2; i++) {
        names.push("Placeholder" + i);
    }
    return names;
}


const Panel = ({ setRoomName }) => {
    const classes = useStyles();

    const [recipients, setRecipients] = useState(getRecipientList());

    return (
        <Card className={classes.paper}>
            <PanelHeader sender="MeMeMeMeMeMeMeMe" />
            <div className={classes.recipientContainer}>
                {recipients.map((recipient, i) => (
                    <CardActionArea key={recipient}
                        onClick={(e) => {
                            setRoomName(e.target.innerText);
                            console.log(e.target.innerText);
                        }}>
                        <CardHeader
                            avatar={<Avatar alt={recipient} src="" />}
                            title={recipient} />
                    </CardActionArea>
                ))}
            </div>
        </Card >
    )
}

export default Panel;