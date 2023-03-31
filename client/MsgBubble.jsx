import { makeStyles } from '@material-ui/core';
import moment from 'moment';

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
    sender: {
        backgroundColor: "#0091EA",
        color: "#FFF",
        marginLeft: "auto"
    }
});


const MsgBubble = ({ msgList }) => {
    const classes = useStyles();

    return (
        <ol className={classes.ol}>
            {msgList.map((msg, i) => (
                <li
                    key={i}
                    className={classes.message + " " + (msg.isSender ? classes.sender : classes.guest)}
                >
                    <div>{msg.message}</div>
                    <div style={{ border: "3px solid #73AD21", textAlign: "right", fontSize: "80%", fontStyle: "italic" }}>{moment(msg.sendTime).format("MMM Do, YYYY HH:mm")} </div>
                </li>
            ))}
        </ol>
    )
}

export default MsgBubble;