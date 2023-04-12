import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardActions, Button, Avatar } from '@material-ui/core';
import './followerPage.css'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  Button: {
    textTransform: 'none',
    backgroundColor: '#F47458',
    borderRadius: '25px',
    fontWeight: 'bold', 
    color: 'white',
  },
  viewButton: {
    textTransform: 'none',
    backgroundColor: '#F47458',
    borderRadius: '25px',
    fontWeight: 'bold', 
    color: 'white',
    width: '100%',
  },
  Avatar: {
    marginLeft: '10px',
  }
});




function FollowerPage() {
  const myUsername = sessionStorage.getItem('username');
  const classes = useStyles();

  const [requestsId, setRequestsId] = useState([]);
  const [followersId, setFollowersId] = useState([]);
  const [followeesId, setFolloweesId] = useState([]);
  const [users, setUsers] = useState({});
  const [requests, setRequests] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [followees, setFollowees] = useState([]);
  const [newState, setNewState] = useState(0);

  useEffect(() => {
    const fetchRequests = async () => {
      const response = await fetch(`http://localhost:2000/user/searchFollow?followee=${myUsername}&status=Pending`);
      const data = await response.json();
      setRequestsId(data.result?.map(result => result.follower));
    };
    const fetchFollowees = async () => {
      const response = await fetch(`http://localhost:2000/user/searchFollow?follower=${myUsername}&status=Accepted`);
      const data = await response.json();
      setFolloweesId(data.result?.map(result => result.followee));
    };
    const fetchFollowers = async () => {
      const response = await fetch(`http://localhost:2000/user/searchFollow?followee=${myUsername}&status=Accepted`);
      const data = await response.json();
      setFollowersId(data.result?.map(result => result.follower));
    };
    const fetchUsers = async () => {
      const response = await fetch(`http://localhost:2000/user/searchUser?exactMatch=true`);
      const data = await response.json();
      setUsers(data);
    };
    fetchRequests();
    fetchFollowees();
    fetchFollowers();
    fetchUsers();
    
  }, [myUsername, newState]);


  useEffect(() => {
      setRequests ( users.result?.filter(user => requestsId.includes(user.userId))  );
      setFollowees ( users.result?.filter(user => followeesId.includes(user.userId))  );
      setFollowers ( users.result?.filter(user => followersId.includes(user.userId))  );
  }, [followeesId, followersId, requestsId, users]);


  const [showAllRequests, setShowAllRequests] = useState(false);


  const handleAccept = (username) => {
    const data = {
      follower: username,
      followee: myUsername,
      status: "Accepted",
    };
    fetch('http://localhost:2000/user/followUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setNewState(newState+1);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const handleDecline = (username) => {
    const data = {
      follower: username,
      followee: myUsername,
    };
    fetch('http://localhost:2000/user/followUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setNewState(newState+1);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const handleRemoveFollowee = (username) => {
    const data = {
      follower: myUsername,
      followee: username,
    };
    fetch('http://localhost:2000/user/followUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setNewState(newState+1);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const handleRemoveFollower = (username) => {
    const data = {
      follower: username,
      followee: myUsername,
    };
    fetch('http://localhost:2000/user/followUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setNewState(newState+1);
      })
      .catch((error) => {
        console.error(error);
      });
      setNewState(!newState);
  }

  return (
    <div className="list">
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h2>Requests({requests?.length})</h2>
        {requests?.length === 0 && <h4>none</h4>}
        {requests?.slice(0, showAllRequests ? requests?.length : 2).map((request) => (
          <Card key={request.userId} style={{ display: 'flex', alignItems: 'center' }} className="car">
            <Avatar alt={request.username} src className={classes.Avatar}/>
            <CardContent>
              <h4>{request.username}</h4>                
            </CardContent>
            <CardActions style={{ display: 'flex', justifyContent: 'space-between', marginLeft: 'auto'}}>
              <Button className={classes.Button} size="small" onClick={() => handleAccept(request.username)}>Accept</Button>
              <Button className={classes.Button} size="small" onClick={() => handleDecline(request.username)}>Decline</Button>
            </CardActions>
          </Card>
        ))}
        {requests?.length > 2 && !showAllRequests && (
          <div>
            <div style={{ height: 16 }} />
            <Button className={classes.viewButton}  onClick={() => setShowAllRequests(true)}>
              View More
            </Button>
          </div>
        )}
      </div>

      <div style={{ height: '40px'}} />

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h2>You are following({followees?.length})</h2>
        {followees?.length === 0 && <h4>none</h4>}
        {followees?.map((followee) => (
          <Card key={followee.userId} style={{ display: 'flex', alignItems: 'center' }} className="car">
            <Avatar alt={followee.username} src className={classes.Avatar}/>
            <CardContent>
              <h4>{followee.username}</h4>              
            </CardContent>            
            <CardActions style={{ marginLeft: 'auto' }}>
              <Button className={classes.Button} size="small" onClick={() => handleRemoveFollowee(followee.username)}>Remove</Button>
            </CardActions>
          </Card>
        ))}
      </div>

      <div style={{ height: '40px'}} />


      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h2>Your followers({followers?.length})</h2>
        {followers?.length === 0 && <h4>none</h4>}
        {followers?.map((follower) => (
          <Card key={follower.userId} style={{ display: 'flex', alignItems: 'center' }} className="car">
            <Avatar alt={follower.username} src className={classes.Avatar}/>
            <CardContent>
              <h4>{follower.username}</h4>              
            </CardContent>
            <CardActions style={{ marginLeft: 'auto' }}>
              <Button className={classes.Button} size="small" onClick={() => handleRemoveFollower(follower.username)}>Remove</Button>
            </CardActions>
          </Card>
        ))}
      </div>

      

    </div>
  );
}

export default FollowerPage