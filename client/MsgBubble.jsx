import { makeStyles } from '@material-ui/core';

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


const MsgBubble = ({ msgList }) => {
    const classes = useStyles();

    return (
        <ol className={classes.ol}>
            {msgList.map((msg, i) => (
                <li
                    key={i}
                    className={classes.message + " " + (msg.isOwner ? classes.owner : classes.guest)}
                >
                    <span>{msg.body}</span>
                </li>
            ))}
        </ol>
    )
}

export default MsgBubble;