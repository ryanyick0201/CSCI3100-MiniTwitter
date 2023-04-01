import React from 'react';
import { Avatar, List, ListItem, ListItemAvatar, ListItemText } from '@material-ui/core';

const CommentList = ({ comment }) => (
  <List>   
      <ListItem key={comment.id}>
        <ListItemAvatar>
          <Avatar src={comment.avatar} />
        </ListItemAvatar>
        <ListItemText primary={comment.username} secondary={comment.content} />
      </ListItem>    
  </List>
);

export default CommentList;