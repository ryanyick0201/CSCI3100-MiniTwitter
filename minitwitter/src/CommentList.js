
import React from 'react';
import { Avatar, List, ListItem, ListItemAvatar, ListItemText } from '@material-ui/core';

const CommentList = ({ comment }) => (

  //const [comment, setComment] = useState([]);

  /*useEffect(() => {
    fetch("/tweet/searchCommentByTweetId?tweetId=2")
      .then((response) => response.json())
      .then((data) => setComment(data))
      .catch((error) => console.log(error));
  }, [tweetId]);*/

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