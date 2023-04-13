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
