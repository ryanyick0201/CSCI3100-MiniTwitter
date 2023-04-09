
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
  Avatar: {
    marginLeft: '10px',
  }
});

const myUsername = sessionStorage.getItem('username');


function FollowerPage({ followers, following, followRequests }) {
  const classes = useStyles();

  /* const [requests, setRequests] = useState({});
  const [followers, setFollowers] = useState({});
  const [followees, setFollowees] = useState({});

  useEffect(() => {
    const fetchRequessts = async () => {
      const response = await fetch(`http://localhost:2000/user/searchFollow?follower=${myUsername}&status=Pending`);
      const data = await response.json();
      setRequests(data);
    };
    const fetchFollowees = async () => {
      const response = await fetch(`http://localhost:2000/user/searchFollow?follower=${myUsername}&status=Accepted`);
      const data = await response.json();
      setFollowees(data);
    };
    const fetchFollowers = async () => {
      const response = await fetch(`http://localhost:2000/user/searchFollow?followee=${myUsername}&status=Accepted`);
      const data = await response.json();
      setFollowers(data);
    };
    fetchRequessts();
    fetchFollowees();
    fetchFollowers();
  }, []); */

  const [showAllRequests, setShowAllRequests] = useState(false);

  return (
    <div className="list">
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h2>Requests</h2>
        {followRequests.slice(0, showAllRequests ? followRequests.length : 2).map((request) => (
          <Card key={request.id} style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar alt="user avatar" src="/path/to/avatar.jpg" className={classes.Avatar}/>
            <CardContent>
              <h4>{request.name}</h4>                
            </CardContent>
            <CardActions style={{ display: 'flex', justifyContent: 'space-between', marginLeft: 'auto'}}>
              <Button className={classes.Button} size="small">Accept</Button>
              <Button className={classes.Button} size="small">Decline</Button>
            </CardActions>
          </Card>
        ))}
        {followRequests.length > 2 && !showAllRequests && (
          <div>
            <div style={{ height: 16 }} />
            <Button className={classes.Button}  onClick={() => setShowAllRequests(true)}>
              View More
            </Button>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h2>Your followers</h2>
        {followers.map((follower) => (
          <Card key={follower.id} style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar alt="user avatar" src="/path/to/avatar.jpg" className={classes.Avatar}/>
            <CardContent>
              <h4>{follower.name}</h4>              
            </CardContent>            
            <CardActions style={{ marginLeft: 'auto' }}>
              <Button className={classes.Button} size="small">Remove</Button>
            </CardActions>
          </Card>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h2>You are following</h2>
        {following.map((followee) => (
          <Card key={followee.id} style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar alt="user avatar" src="/path/to/avatar.jpg" className={classes.Avatar}/>
            <CardContent>
              <h4>{followee.name}</h4>              
            </CardContent>
            <CardActions style={{ marginLeft: 'auto' }}>
              <Button className={classes.Button} size="small">Remove</Button>
            </CardActions>
          </Card>
        ))}
      </div>

      

    </div>
  );
}

export default FollowerPage