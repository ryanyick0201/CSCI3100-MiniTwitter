/* PROGRAM PostWithBox - the component rendering the content of a tweet and providing a textfield
 * PROGRAMMER: YU Zhuofeng SID: 1155159772
 * CALLING SEQUENCE: PostWithBox = ({ post, AddComment })
 *  where post is an object of a tweet, from the parent component, and AddComment is a callback function
 * PURPOSE: rendering the content of a tweet,
 *  including username, time, tweet text, hashtag, like, dislike, comment count, retweet count
 *  and providing a textfield for "me" to add comments
 * ALGORITHM: for the like and dislike function, fetching the status of like and set states called "liked" and "disliked"
 *  using the states to control the rendering of like and dislike icons and the query to the server.
 *  for the retweet function, fetching the status to set the state of "retweeted",
 *  using the state to control the rendering of retweet icon and the query to the server.
 */
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
  const [status, setStatus] = useState(""); //indicate whether "I" am liking or disliking the tweet
  const [likes, setLikes] = useState(post.likes);
  const [dislikes, setDislikes] = useState(post.dislikes);
  const [retweets, setRetweets] = useState([]);
  const [retweeted, setRetweeted] = useState(false); //indicate whether "I" have retweeted the tweet
  const [retweetCount, setRetweetCount] = useState(post.retweet);
  const [commentCount, setCommentCount] = useState(post.comment);
  const [user, setUser] = useState({}); //the user created the tweet

  //fetching the status of like and the list of tweets retweeted and the object of the user
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
    const fetchRetweets = async () => {
      const response = await fetch(
        `http://${window.location.hostname}:3000/tweet/viewRetweet?senderUsername=${myUsername}`
      );
      const data = await response.json();
      setRetweets(data.result);
    };
    const fetchUser = async () => {
      const response = await fetch(
        `http://${window.location.hostname}:3000/user/searchUser?username=${post.username}&exactMatch=true`
      );
      const data = await response.json();
      setUser(data.result[0]);
    };
    fetchStatus();
    fetchRetweets();
    fetchUser();
  }, [myUsername]);

  //setting the states of liked and disliked and retweeted
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
    //there are two steps, first is updated to the server, second is updated the states of liked and disliked
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

  //the content of a new comment
  const [comment, setComment] = useState("");

  //handle submission of the new comment
  const handleSubmit = (event) => {
    event.preventDefault();
    AddComment(comment);
    setComment(""); //clear the state and the text field
    setCommentCount(commentCount + 1); //update the count of the comments
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
          avatar={<Avatar src={user?.profilePic} />}
          title={post.username}
          subheader={new Date(post.postTime).toLocaleString("en-US")}
          onClick={() => handleUserClick(post)}
          className={classes.use}
        />
        {post.image && <CardMedia image={post.image} />}
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
