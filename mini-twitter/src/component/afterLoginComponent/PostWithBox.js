import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  Typography,
  TextField,
} from "@material-ui/core";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import ThumbDownAltOutlinedIcon from "@material-ui/icons/ThumbDownAltOutlined";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import RepeatIcon from "@material-ui/icons/Repeat";
import RepeatOneIcon from "@material-ui/icons/RepeatOne";
import { makeStyles } from "@material-ui/core/styles";

import { useNavigate } from "react-router-dom";

const useStyles = makeStyles({
  submitButton: {
    textTransform: "none",
    backgroundColor: "#F47458",
    borderRadius: "25px",
    fontWeight: "bold",
    color: "white",
  },
  use: {
    "&:hover": {
      background: "linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1))",
    },
  },
});

const PostWithBox = ({ post, AddComment }) => {
  const myUsername = sessionStorage.getItem("username");
  const classes = useStyles();

  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [status, setStatus] = useState("");
  const [likes, setLikes] = useState(post.likes);
  const [dislikes, setDislikes] = useState(post.dislikes);
  const [retweets, setRetweets] = useState([]);
  const [retweeted, setRetweeted] = useState(false);
  const [retweetCount, setRetweetCount] = useState(post.retweet);
  const [commentCount, setCommentCount] = useState(post.comment);

  useEffect(() => {
    const fetchStatus = async () => {
      const response = await fetch(
        `http://' + window.location.hostname + ':3000/tweet/viewLikeTweet?username=${myUsername}&tweetId=${post.tweetId}`
      );
      const data = await response.json();
      if (data.result.length == 0) {
        setStatus("neither");
      } else {
        setStatus(data.result[0].status);
      }
    };
    const fetchRetweets = async () => {
      const response = await fetch(
        `http://' + window.location.hostname + ':3000/tweet/viewRetweet?senderUsername=${myUsername}`
      );
      const data = await response.json();
      setRetweets(data.result);
    };
    fetchStatus();
    fetchRetweets();
  }, [myUsername]);

  useEffect(() => {
    if (status == "neither") {
      setLiked(false);
      setDisliked(false);
    } else if (status == "like") {
      setLiked(true);
      setDisliked(false);
    } else if (status == "dislike") {
      setLiked(false);
      setDisliked(true);
    }

    setRetweeted(retweets?.some((retweet) => retweet.tweetId === post.tweetId));
  }, [status, retweets, post.tweetId]);

  const handleLike = () => {
    const data = {
      username: myUsername,
      tweetId: post.tweetId,
      status: liked ? null : "like",
    };

    fetch("http://" + window.location.hostname + ":3000/tweet/likeTweet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
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
      status: disliked ? null : "dislike",
    };

    fetch("http://" + window.location.hostname + ":3000/tweet/likeTweet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
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

  const [comment, setComment] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    AddComment(comment);
    setComment("");
    setCommentCount(commentCount + 1);
  };

  const navigate = useNavigate();

  const handleUserClick = (post) => {
    navigate("/other profile", { state: { username: post.username } });
  };

  const handleRetweet = (post) => {
    if (!retweeted) {
      const data = {
        senderUsername: myUsername,
        tweetId: post.tweetId,
      };
      fetch("http://" + window.location.hostname + ":3000/tweet/retweet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.error(error);
        });

      setRetweetCount(retweetCount + 1);
    }
    setRetweeted(true);
  };

  return (
    <div>
      <Card>
        <CardHeader
          avatar={<Avatar src />}
          title={post.username}
          subheader={new Date(post.postTime).toLocaleString("en-US")}
          onClick={() => handleUserClick(post)}
          className={classes.use}
        />
        {/*post.image && <CardMedia image />*/}
        <CardContent>
          <Typography variant="body1">{post.tweetContent}</Typography>
          <Button
            size="small"
            color="primary"
            style={{ textTransform: "none" }}
          >
            #{post.category}
          </Button>
        </CardContent>
        <CardActions>
          <IconButton onClick={handleLike}>
            {liked ? (
              <FavoriteIcon color="secondary" />
            ) : (
              <FavoriteBorderIcon />
            )}
          </IconButton>
          <Typography variant="caption">{likes}</Typography>
          <IconButton onClick={handleDislike}>
            {disliked ? (
              <ThumbDownIcon color="primary" />
            ) : (
              <ThumbDownAltOutlinedIcon />
            )}
          </IconButton>
          <Typography variant="caption">{dislikes}</Typography>
          <IconButton>
            <ChatBubbleOutlineIcon />
          </IconButton>
          <Typography variant="caption">{commentCount}</Typography>
          <IconButton onClick={() => handleRetweet(post)}>
            {retweeted || post.username == myUsername ? (
              <RepeatOneIcon />
            ) : (
              <RepeatIcon />
            )}
          </IconButton>
          <Typography variant="caption">{retweetCount}</Typography>
        </CardActions>
      </Card>

      <div className="comment-input">
        <h3>Comments</h3>
        <TextField
          variant="outlined"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          label="leave your comment"
          multiline
          minRows={4}
          fullWidth
        />
        <Button className={classes.submitButton} onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default PostWithBox;
