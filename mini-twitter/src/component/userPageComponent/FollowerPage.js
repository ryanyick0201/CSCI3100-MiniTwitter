/* PROGRAM FollowerPage - the component shows the list of requests, following and followers
 * PROGRAMMER: YU Zhuofeng SID: 1155159772
 * CALLING SEQUENCE: FollowerPage()
 * PURPOSE: rendering the list of requests, following and followers,
 *  and let user manage his requests, following and followers.
 * ALGORITHM: the way to obtaining requests, following and followers users:
 *  fetching the ID of requests, following and followers, and fetching the list of all users,
 *  then filtering out the requests, following and followers from all users according to the IDs.
 */
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
} from "@material-ui/core";
import "./followerPage.css";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  Button: {
    textTransform: "none",
    backgroundColor: "#F47458",
    borderRadius: "25px",
    fontWeight: "bold",
    color: "white",
  },
  viewButton: {
    textTransform: "none",
    backgroundColor: "#F47458",
    borderRadius: "25px",
    fontWeight: "bold",
    color: "white",
    width: "100%",
  },
  Avatar: {
    marginLeft: "10px",
  },
});

function FollowerPage() {
  const myUsername = sessionStorage.getItem("username");
  const classes = useStyles();

  const [requestsId, setRequestsId] = useState([]);
  const [followersId, setFollowersId] = useState([]);
  const [followeesId, setFolloweesId] = useState([]);
  const [users, setUsers] = useState({});
  const [requests, setRequests] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [followees, setFollowees] = useState([]);
  const [newState, setNewState] = useState(0); //"newState" is the tool to render the component again after the list change

  //fecthing the IDs of requests, following and followers, and fetching the list of all users
  useEffect(() => {
    const fetchRequests = async () => {
      const response = await fetch(
        `http://${window.location.hostname}:3000/user/searchFollow?followee=${myUsername}&status=Pending`
      );
      const data = await response.json();
      setRequestsId(data.result?.map((result) => result.follower));
    };
    const fetchFollowees = async () => {
      const response = await fetch(
        `http://${window.location.hostname}:3000/user/searchFollow?follower=${myUsername}&status=Accepted`
      );
      const data = await response.json();
      setFolloweesId(data.result?.map((result) => result.followee));
    };
    const fetchFollowers = async () => {
      const response = await fetch(
        `http://${window.location.hostname}:3000/user/searchFollow?followee=${myUsername}&status=Accepted`
      );
      const data = await response.json();
      setFollowersId(data.result?.map((result) => result.follower));
    };
    const fetchUsers = async () => {
      const response = await fetch(
        `http://${window.location.hostname}:3000/user/searchUser?exactMatch=true`
      );
      const data = await response.json();
      setUsers(data);
    };
    fetchRequests();
    fetchFollowees();
    fetchFollowers();
    fetchUsers();
  }, [myUsername, newState]);

  //filtering out the requests, following and followers from all users according to the IDs
  useEffect(() => {
    setRequests(
      users.result?.filter((user) => requestsId.includes(user.userId))
    );
    setFollowees(
      users.result?.filter((user) => followeesId.includes(user.userId))
    );
    setFollowers(
      users.result?.filter((user) => followersId.includes(user.userId))
    );
  }, [followeesId, followersId, requestsId, users]);

  //It is the controller. When the list is too long, user can click "view more", then "showAllRequests" becomes true and render the whole list.
  const [showAllRequests, setShowAllRequests] = useState(false);

  const handleAccept = (username) => {
    const data = {
      follower: username,
      followee: myUsername,
      status: "Accepted",
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
        setNewState(newState + 1); //after "newState" change, it triggers the re-rendering of the list with new data
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDecline = (username) => {
    const data = {
      follower: username,
      followee: myUsername,
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
        setNewState(newState + 1);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleRemoveFollowee = (username) => {
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
        setNewState(newState + 1);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleRemoveFollower = (username) => {
    const data = {
      follower: username,
      followee: myUsername,
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
        setNewState(newState + 1);
      })
      .catch((error) => {
        console.error(error);
      });
    setNewState(!newState);
  };

  return (
    <div className="list">
      <div style={{ display: "flex", flexDirection: "column" }}>
        <h2>Requests({requests?.length})</h2>
        {requests?.length === 0 && <h4>none</h4>}
        {requests //if the length list is below 2, then just render it
          ?.slice(0, showAllRequests ? requests?.length : 2)
          .map((request) => (
            <Card
              key={request.userId}
              style={{ display: "flex", alignItems: "center" }}
              className="car"
            >
              <Avatar src={request.profilePic} className={classes.Avatar} />
              <CardContent>
                <h4>{request.username}</h4>
              </CardContent>
              <CardActions
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginLeft: "auto",
                }}
              >
                <Button
                  className={classes.Button}
                  size="small"
                  onClick={() => handleAccept(request.username)}
                >
                  Accept
                </Button>
                <Button
                  className={classes.Button}
                  size="small"
                  onClick={() => handleDecline(request.username)}
                >
                  Decline
                </Button>
              </CardActions>
            </Card>
          ))}
        {requests?.length > 2 &&
          !showAllRequests && ( //if the length is above 2, render the "view more" button. Clicking it then render the whole list.
            <div>
              <div style={{ height: 16 }} />
              <Button
                className={classes.viewButton}
                onClick={() => setShowAllRequests(true)}
              >
                View More
              </Button>
            </div>
          )}
      </div>

      <div style={{ height: "40px" }} />

      <div style={{ display: "flex", flexDirection: "column" }}>
        <h2>You are following({followees?.length})</h2>
        {followees?.length === 0 && <h4>none</h4>}
        {followees?.map((followee) => (
          <Card
            key={followee.userId}
            style={{ display: "flex", alignItems: "center" }}
            className="car"
          >
            <Avatar
              alt={followee.username}
              src={followee.profilePic}
              className={classes.Avatar}
            />
            <CardContent>
              <h4>{followee.username}</h4>
            </CardContent>
            <CardActions style={{ marginLeft: "auto" }}>
              <Button
                className={classes.Button}
                size="small"
                onClick={() => handleRemoveFollowee(followee.username)}
              >
                Remove
              </Button>
            </CardActions>
          </Card>
        ))}
      </div>

      <div style={{ height: "40px" }} />

      <div style={{ display: "flex", flexDirection: "column" }}>
        <h2>Your followers({followers?.length})</h2>
        {followers?.length === 0 && <h4>none</h4>}
        {followers?.map((follower) => (
          <Card
            key={follower.userId}
            style={{ display: "flex", alignItems: "center" }}
            className="car"
          >
            <Avatar
              alt={follower.username}
              src={follower.profilePic}
              className={classes.Avatar}
            />
            <CardContent>
              <h4>{follower.username}</h4>
            </CardContent>
            <CardActions style={{ marginLeft: "auto" }}>
              <Button
                className={classes.Button}
                size="small"
                onClick={() => handleRemoveFollower(follower.username)}
              >
                Remove
              </Button>
            </CardActions>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default FollowerPage;
