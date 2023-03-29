import { makeStyles } from '@material-ui/core';

import useChatRoom from "./useChatRoom.jsx";


const useStyles = makeStyles({
    ol: {
        paddingInlineEnd: "40px"
    },
    message: {
        listStyle: "none",
        margin: "1em",
        padding: "0.5em 1.5em",
        borderRadius: "20px",
        wordBreak: "break-word",
        maxWidth: "65%",
        width: "fit-content",
    },
    guest: {
        backgroundColor: "#CCC",
        color: "#000",
        marginRight: "auto"
    },
    owner: {
        backgroundColor: "#0091EA",
        color: "#FFF",
        marginLeft: "auto"
    }
});


const Messages = () => {
    const classes = useStyles();

    const { messages } = useChatRoom();

    return (
        <ol className={classes.ol}>
            {messages.map((message, i) => (
                <li
                    key={i}
                    className={classes.message + " " + (message.isOwner ? classes.owner : classes.guest)}
                >
                    <span>{message.body}</span>
                </li>
            ))}
        </ol>
    )
}

export default Messages;