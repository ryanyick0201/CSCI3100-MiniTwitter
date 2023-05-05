/** MsgBubble - Message bubble component
 * PROGRAMMER: Choi, Man Wai (SID: 1155159354)
 * CALLING SEQUENCE: MsgBubble({msgList})
 *  Where msgList is a state storing the message between the sender and the recipient in an array
 * PURPOSE: Rendering message bubbles in a room, each message takes one bubble
 * ALGORITHM: Map the msgList input into an ordered list,
 *            Helper component <Image/> for rendering image messages
 */

import React from "react";
import { makeStyles } from "@material-ui/core";
import moment from "moment";

// Styling
const useStyles = makeStyles({
  ol: {
    paddingInlineEnd: "40px",
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
    marginRight: "auto",
  },
  sender: {
    backgroundColor: "#0091EA",
    color: "#FFF",
    marginLeft: "auto",
  },
});

// Define helper component <Image/> for rendering image messages
const Image = ({ imgSrc, alt }) => {
  return (
    <div style={{ height: 150 }}>
      <a href={imgSrc} target="_blank">
        <img style={{ width: "auto", height: 150 }} src={imgSrc} alt={alt} />
      </a>
    </div>
  );
};

const MsgBubble = ({ msgList }) => {
  const classes = useStyles();

  return (
    <ol className={classes.ol}>
      {msgList.map((msg, i) => (
        <li
          key={i}
          className={
            classes.message +
            " " +
            (msg.isSender ? classes.sender : classes.guest)
          }
        >
          {
            /*
              Render <Image/> Object if the message is of image type,
              otherwise render it as text.
            */
            (msg.isImg && (
              <Image imgSrc={msg.imgUrl} alt={"An image from " + msg.sender} />
            )) || <div>{msg.message}</div>
          }

          {
            // Display message sent time
            <div
              style={{
                textAlign: "right",
                fontSize: "0.5em",
                fontStyle: "italic",
              }}
            >
              {moment(msg.sendTime).format("MMM Do, YYYY HH:mm")}
            </div>
          }
        </li>
      ))}
    </ol>
  );
};

export default MsgBubble;
