/* PROGRAM OtherProfilePage - the component showing other user's profile
 * PROGRAMMER: YU Zhuofeng SID: 1155159772
 * CALLING SEQUENCE: OtherProfilePage()
 * PURPOSE: rendering other user's profile, including Bio, tweets he created, tweets he retweeted.
 * ALGORITHM: use Location hook to obtain the username of the target user,
 *  fetching the object of the user, and fetching the tweets of the user,
 *  for the follow function, fetching the status to indicate whether "I" am following the user.
 */
import React, { useState, useEffect } from "react";

import { Avatar, Button } from "@material-ui/core";

import Post from "./Post";

import { useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  Button: {
    textTransform: "none",
    backgroundColor: "#F47458",
    borderRadius: "25px",
    fontWeight: "bold",
    color: "white",
  },
});

function OtherProfilePage() {
  const myUsername = sessionStorage.getItem("username");
  const classes = useStyles();

  const [user, setUser] = useState({});
  const [posts, setPosts] = useState({});

  const [status, setStatus] = useState(""); //"status" can be "not following", "Accepted" or "Pending"

  const location = useLocation();
  const username = location.state.username;

  //fetching the object of the user, and fetching the tweets of the user
  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(
        `http://${window.location.hostname}:3000/user/searchUser?username=${username}&exactMatch=true`
      );
      const data = await response.json();
      setUser(data);
    };
    const fetchPosts = async () => {
      const response = await fetch(
        `http://${window.location.hostname}:3000/tweet/searchOtherTweet?lookForUsername=${username}&myUsername=${myUsername}`
      );
      const data = await response.json();
      setPosts(data);
    };
    fetchUser();
    fetchPosts();
  }, [username]);

  //fetching the status to indicate whether "I" am following the user
  useEffect(() => {
    var data = {};
    const fetchStatus = async () => {
      const response1 = await fetch(
        `http://${window.location.hostname}:3000/user/searchFollow?follower=${myUsername}&followee=${username}&status=Pending`
      );
      data = await response1.json();
      if (data.result.length === 0) {
        const response2 = await fetch(
          `http://${window.location.hostname}:3000/user/searchFollow?follower=${myUsername}&followee=${username}&status=Accepted`
        );
        data = await response2.json();
      }
      if (data.result.length === 0) {
        setStatus("not following");
      } else {
        setStatus(data.result[0].status);
      }
    };
    fetchStatus();
  }, [myUsername, username]);

  //handle the clicking on the follow button according to the status
  const handleFollow = () => {
    if (status == "not following") {
      const data = {
        follower: myUsername,
        followee: username,
        status: "Pending",
      };
      fetch("http://" + window.location.hostname + ":3000/user/followUser", {
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
      setStatus("Pending");
    } else if (status == "Accepted") {
      const data = {
        follower: myUsername,
        followee: username,
      };
      fetch("http://" + window.location.hostname + ":3000/user/followUser", {
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
      setStatus("not following");
    }
  };

  return (
    <div>
      <div className="up">
        <Avatar
          aria-label="recipe"
          style={{ width: 150, height: 150 }}
          src={user.result && user?.result[0].profilePic}
        />

        {user.result && user.result.length > 0 && (
          <div
            className="nameAndBio"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <h1>{user.result[0].username}</h1>
            <p>{user.result[0].personalBio}</p>
          </div>
        )}

        <Button className={classes.Button} onClick={handleFollow}>
          {status === "not following"
            ? "Follow"
            : status === "Pending"
            ? "Requested"
            : "Following"}
        </Button>
      </div>

      <h2 style={{ margin: "30px auto 20px 400px" }}>Post</h2>

      <div className="post">
        {posts.result?.length === 0 && <h4>none</h4>}
        {Array.isArray(posts.result) &&
          posts.result.map((post) => <Post key={post.tweetId} post={post} />)}
      </div>
    </div>
  );
}

export default OtherProfilePage;
