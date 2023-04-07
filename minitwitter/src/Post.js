import React from 'react';
import { Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, IconButton, Typography } from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbDownAltOutlinedIcon from '@material-ui/icons/ThumbDownAltOutlined';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import RepeatIcon from '@material-ui/icons/Repeat';
import { Link } from 'react-router-dom';

const Post = ({ post }) => {
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

  return (
    <Card>
      <CardHeader
        avatar={<Avatar src={post.user.avatar} />}
        title={post.user.username}
        subheader={new Date(post.timestamp).toLocaleString('en-US')}
      />
      {post.image && <CardMedia image={post.image} />}
      <CardContent>
        <Typography variant="body1">{post.content}</Typography>
        {post.hashtags.map(hashtag => (
          <Button key={hashtag} size="small" color="primary" style={{textTransform: 'none'}}>
            #{hashtag}
          </Button>
        ))}
      </CardContent>
      <CardActions>
        <IconButton onClick={handleLike}>
          {liked ? <FavoriteIcon color="secondary" /> : <FavoriteBorderIcon />}
        </IconButton>
        <Typography variant="caption">{likes}</Typography>
        <IconButton onClick={handleDislike}>
          {disliked ? <ThumbDownIcon color="primary" /> : <ThumbDownAltOutlinedIcon />}
        </IconButton>
        <Typography variant="caption">{dislikes}</Typography>
        <IconButton component={Link} to={`/post`}>
          <ChatBubbleOutlineIcon />
        </IconButton>
        <Typography variant="caption">{post.comments}</Typography>
        <IconButton>
          <RepeatIcon />
        </IconButton>
        <Typography variant="caption">{post.retweets}</Typography>
        <Button component={Link} to={`/post`} size="small" color="primary" style={{textTransform: 'none'}}>
          Show this thread
        </Button>
      </CardActions>
    </Card>
  );
};

export default Post;