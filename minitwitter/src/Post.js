import React, { useState, useEffect }from 'react';
import { Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, IconButton, Typography } from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbDownAltOutlinedIcon from '@material-ui/icons/ThumbDownAltOutlined';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import RepeatIcon from '@material-ui/icons/Repeat';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  use: {
    '&:hover': {
      background: 'linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1))',
    },
  },
}));

const Post = ({ post }) => {
  const myUsername = sessionStorage.getItem('username');
  const classes = useStyles();

  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [status, setStatus] = useState("");
  const [likes, setLikes] = useState(post.likes);
  const [dislikes, setDislikes] = useState(post.dislikes);
  const [retweets, setRetweets] = useState([]);
  const [retweeted, setRetweeted] = useState();
  

  useEffect(() => {
    const fetchStatus = async () => {
      const response = await fetch(`http://localhost:2000/tweet/viewLikeTweet?username=${myUsername}&tweetId=${post.tweetId}`);
      const data = await response.json();
      if (data.result.length == 0 ) {
        setStatus("neither");
      }
      else {
        setStatus(data.result[0].status);
      }
    };
    const fetchRetweets = async () => {
      const response = await fetch(`http://localhost:2000/tweet/viewRetweet?senderUsername=${myUsername}`);
      const data = await response.json();
      setRetweets(data.result);
    };
    fetchStatus();
    fetchRetweets();
  }, [myUsername]);


  useEffect(() => {
    if (status == "neither"){
      setLiked(false);
      setDisliked(false);
    }
    else if (status == "like"){
      setLiked(true);
      setDisliked(false);
    }
    else if (status == "dislike"){
      setLiked(false);
      setDisliked(true);
    }

    /* setRetweeted( retweets?.filter(user => requestsId.includes(user.userId))) */
  }, [status]);


  const handleLike = () => {
    const data = {
      username: myUsername,
      tweetId: post.tweetId,
      status: liked ? null : 'like',
    };
  
    fetch('http://localhost:2000/tweet/likeTweet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch((error) => {
      console.error(error);
    });

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
    const data = {
      username: myUsername,
      tweetId: post.tweetId,
      status: disliked ? null : 'dislike',
    };
  
    fetch('http://localhost:2000/tweet/likeTweet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch((error) => {
      console.error(error);
    });

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
  const handleTweetClick = (post) => {
    navigate('/post', {state: { tweetId: post.tweetId }});
  };


  const handleRetweet = (post) => {
    const data = {
      senderUsername: myUsername,
      tweetId: post.tweetId,
    };
    fetch('http://localhost:2000/tweet/retweet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch((error) => {
      console.error(error);
    });
    
  }

  return (
    <Card>
      <CardHeader
        avatar={<Avatar src />}
        title={post.username}
        subheader={new Date(post.postTime).toLocaleString('en-US')}
        onClick={() => handleUserClick(post)}
        className={classes.use}
      />
      {/*post.image && <CardMedia image />*/}
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
        <Typography variant="caption">{likes}</Typography>
        <IconButton onClick={handleDislike}>
          {disliked ? <ThumbDownIcon color="primary" /> : <ThumbDownAltOutlinedIcon />}
        </IconButton>
        <Typography variant="caption">{dislikes}</Typography>
        <IconButton onClick={() => handleTweetClick(post)}>
          <ChatBubbleOutlineIcon />
        </IconButton>
        <Typography variant="caption">{post.comment}</Typography>
        <IconButton onClick={() => handleRetweet(post)}>
          <RepeatIcon />
        </IconButton>
        <Typography variant="caption">{post.retweet}</Typography>
        <Button onClick={() => handleTweetClick(post)} size="small" color="primary" style={{textTransform: 'none'}}>
          Show this thread
        </Button>
      </CardActions>
    </Card>
  );
};

export default Post;