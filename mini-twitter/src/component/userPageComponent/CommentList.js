/* PROGRAM CommentList - the component shows the comment of a tweet
 * PROGRAMMER: YU Zhuofeng SID: 1155159772
 * CALLING SEQUENCE: CommentList = ({ comment })
 *  where comment is an object containing content and time
 * PURPOSE: rendering a comment of a tweet
 */
import React from "react";
import { List, ListItem, ListItemText } from "@material-ui/core";

const CommentList = ({ comment }) => (
  <List>
    <ListItem
      key={comment.commentId}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <span style={{ marginBottom: "8px" }}>
        {new Date(comment.commentTime).toLocaleString("en-US")}
      </span>
      <ListItemText
        primary={comment.commentContent}
        style={{ color: "orange", fontSize: "20px" }}
      />
    </ListItem>
  </List>
);

export default CommentList;
