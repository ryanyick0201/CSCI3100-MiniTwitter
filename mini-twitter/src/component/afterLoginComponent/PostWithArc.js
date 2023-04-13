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
} from "@material-ui/core";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import ThumbDownAltOutlinedIcon from "@material-ui/icons/ThumbDownAltOutlined";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import RepeatOneIcon from "@material-ui/icons/RepeatOne";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles({
  archiveButton: {
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

const Post = ({ post }) => {
  const myUsername = sessionStorage.getItem("username");
  const classes = useStyles();

  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [status, setStatus] = useState("");
  const [likes, setLikes] = useState(post.likes);
  const [dislikes, setDislikes] = useState(post.dislikes);

  useEffect(() => {
    const fetchStatus = async () => {
      const response = await fetch(
        `http://${window.location.hostname}:3000/tweet/viewLikeTweet?username=${myUsername}&tweetId=${post.tweetId}`
      );
      const data = await response.json();
      if (data.result.length == 0) {
        setStatus("neither");
      } else {
        setStatus(data.result[0].status);
      }
    };
    fetchStatus();
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
  }, [status]);

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

  const navigate = useNavigate();

  const handleUserClick = (post) => {
    if (post.username != myUsername) {
      navigate("/other profile", { state: { username: post.username } });
    }
  };
  const handleTweetClick = (post) => {
    navigate("/post", { state: { tweetId: post.tweetId } });
  };

  const handleArchive = () => {};

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "flex-start",
      }}
    >
      <Card style={{ flex: "1" }}>
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
          <IconButton onClick={() => handleTweetClick(post)}>
            <ChatBubbleOutlineIcon />
          </IconButton>
          <Typography variant="caption">{post.comment}</Typography>
          <IconButton>
            <RepeatOneIcon />
          </IconButton>
          <Typography variant="caption">{post.retweet}</Typography>
          <Button
            onClick={() => handleTweetClick(post)}
            size="small"
            color="primary"
            style={{ textTransform: "none" }}
          >
            Show this thread
          </Button>
        </CardActions>
      </Card>

      <Button className={classes.archiveButton} onClick={handleArchive}>
        archive
      </Button>
    </div>
  );
};

export default Post;
