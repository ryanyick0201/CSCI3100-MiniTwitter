/* PROGRAM Post - the component rendering the content of a tweet
 * PROGRAMMER: YU Zhuofeng SID: 1155159772
 * CALLING SEQUENCE: Post = ({ post })
 *  where post is an object of a tweet, from the parent component
 * PURPOSE: rendering the content of a tweet,
 *  including username, time, tweet text, hashtag, like, dislike, comment count, retweet count
 *  and an archive button
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
  const [status, setStatus] = useState(""); //indicate whether "I" am liking or disliking the tweet
  const [likes, setLikes] = useState(post.likes);
  const [dislikes, setDislikes] = useState(post.dislikes);
  const [user, setUser] = useState({}); //the user created the tweet
  const [archived, setArchived] = useState(false); //indicate whether the tweet has been archived

  //fetching the status of like and the object of the user
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
    const fetchUser = async () => {
      const response = await fetch(
        `http://${window.location.hostname}:3000/user/searchUser?username=${post.username}&exactMatch=true`
      );
      const data = await response.json();
      setUser(data.result[0]);
    };
    fetchStatus();
    fetchUser();
  }, [myUsername]);

  //setting the states of liked and disliked and archived
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

    if (post.archived == null) {
      setArchived(false);
    } else {
      setArchived(true);
    }
  }, [status]);

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

  const navigate = useNavigate();

  //handle the clicking on the header of a card
  const handleUserClick = (post) => {
    if (post.username != myUsername) {
      navigate("/other profile", { state: { username: post.username } });
    }
  };
  const handleTweetClick = (post) => {
    navigate("/post", { state: { tweetId: post.tweetId } });
  };

  const handleArchive = () => {
    if (post.username != myUsername) {
      //cannot archive the tweet which is not created by "me"
      return;
    }
    if (archived) {
      const data = {
        tweetId: post.tweetId,
      };

      fetch("http://" + window.location.hostname + ":3000/tweet/archiveTweet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      setArchived(!archived);
    } else {
      const data = {
        tweetId: post.tweetId,
        status: "Archived",
      };

      fetch("http://" + window.location.hostname + ":3000/tweet/archiveTweet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      setArchived(!archived);
    }
  };

  console.log(post.image);

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
        {archived ? "unarchive" : "archive"}
      </Button>
    </div>
  );
};

export default Post;
