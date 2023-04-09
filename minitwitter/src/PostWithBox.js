import React from 'react';
import { Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, IconButton, Typography, TextField } from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbDownAltOutlinedIcon from '@material-ui/icons/ThumbDownAltOutlined';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import RepeatIcon from '@material-ui/icons/Repeat';
import { makeStyles } from '@material-ui/core/styles';

import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles({
  submitButton: {
    textTransform: 'none',
    backgroundColor: '#F47458',
    borderRadius: '25px',
    fontWeight: 'bold', 
    color: 'white',
  },
});





const PostWithBox = ({ post }) => {
  const classes = useStyles();

  const [liked, setLiked] = React.useState(false);
  const [disliked, setDisliked] = React.useState(false);
  const [likes, setLikes] = React.useState(post.likes);
  const [dislikes, setDislikes] = React.useState(post.dislikes);

  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setLiked(!liked);
    if (disliked) {
      setDisliked(false);
      setDislikes(dislikes - 1);
    }
  };

  const handleDislike = () => {
    if (disliked) {
      setDislikes(dislikes - 1);
    } else {
      setDislikes(dislikes + 1);
    }
    setDisliked(!disliked);
    if (liked) {
      setLiked(false);
      setLikes(likes - 1);
    }
  };
  
  const [comment, setComment] = React.useState('');

  const handleSubmit = () => {
    // handle submit logic here
  };

  const navigate = useNavigate();

  const handleUserClick = (post) => {
    navigate('/other profile', {state: { username: post.username }});
  };
  

  return (
    <div >
    <Card>
      <CardHeader
        avatar={<Avatar src />}
        title={post.username}
        subheader={new Date(post.postTime).toLocaleString('en-US')}
        onClick={() => handleUserClick(post)}
      />
      {/*post.image && <CardMedia image={post.image} />*/}
      <CardContent>
        <Typography variant="body1">{post.tweetContent}</Typography>
          <Button size="small" color="primary" style={{textTransform: 'none'}}>
            #{post.category}
          </Button>
      </CardContent>
      <CardActions>
        <IconButton onClick={handleLike}>
          {liked ? <FavoriteIcon color="secondary" /> : <FavoriteBorderIcon />}
        </IconButton>
        <Typography variant="caption">{post.likes}</Typography>
        <IconButton onClick={handleDislike}>
          {disliked ? <ThumbDownIcon color="primary" /> : <ThumbDownAltOutlinedIcon />}
        </IconButton>
        <Typography variant="caption">{post.dislikes}</Typography>
        <IconButton >
          <ChatBubbleOutlineIcon />
        </IconButton>
        <Typography variant="caption">{post.comment}</Typography>
        <IconButton>
          <RepeatIcon />
        </IconButton>
        <Typography variant="caption">{post.retweet}</Typography>
        
      </CardActions>
    </Card>


    <div className="comment-input">      
    <h3>Comments</h3>
    <TextField
        variant="outlined"
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder="leave your comment"
        multiline
        minRows={4}
        fullWidth
      />      
    <Button className={classes.submitButton} onClick={handleSubmit}>Submit</Button>
    </div>
    

    

    </div>        
  );
};

export default PostWithBox;