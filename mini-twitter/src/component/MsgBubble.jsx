import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import moment from "moment";
//import { Blob } from 'buffer'

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

const Image = ({ fileName, blob }) => {
  const [imgSrc, setImgSrc] = useState("");

  useEffect(() => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      setImgSrc(reader.result);
    };
  }, [blob]);
  return (
    <div>
      <img style={{ width: 150, height: "auto" }} src={imgSrc} alt={fileName} />
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
          {(msg.isImg && (
            <Image
              fileName={msg.message.fileName}
              blob={
                new Blob([msg.message.file], { type: msg.message.mimeType })
              }
            />
          )) || <div>{msg.message}</div>}
          <div
            style={{
              textAlign: "right",
              fontSize: "50%",
              fontStyle: "italic",
            }}
          >
            {moment(msg.sendTime).format("MMM Do, YYYY HH:mm")}
          </div>
        </li>
      ))}
    </ol>
  );
};

export default MsgBubble;
