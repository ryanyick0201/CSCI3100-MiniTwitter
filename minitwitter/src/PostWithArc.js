import React from 'react';
import { Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, IconButton, Typography } from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbDownAltOutlinedIcon from '@material-ui/icons/ThumbDownAltOutlined';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import RepeatIcon from '@material-ui/icons/Repeat';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles({
  archiveButton: {
    textTransform: 'none',
    backgroundColor: '#F47458',
    borderRadius: '25px',
    fontWeight: 'bold', 
    color: 'white',
  },
});

const Post = ({ post }) => {
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

  const navigate = useNavigate();

  const handleUserClick = (post) => {
    navigate('/other profile', {state: { username: post.username }});
  };

  return (
    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
      <Card style={{flex: '1'}}>
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
        <IconButton component={Link} to={`/post`}>
          <ChatBubbleOutlineIcon />
        </IconButton>
        <Typography variant="caption">{post.comment}</Typography>
        <IconButton>
          <RepeatIcon />
        </IconButton>
        <Typography variant="caption">{post.retweet}</Typography>
        <Button component={Link} to={`/post`} size="small" color="primary" style={{textTransform: 'none'}}>
          Show this thread
        </Button>
      </CardActions>
    </Card>


      <Button  className={classes.archiveButton}>
        archive
      </Button>



    </div>        
  );
};

export default Post;