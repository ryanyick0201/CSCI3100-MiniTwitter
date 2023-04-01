
import React, { useState } from 'react';
import { Card, CardContent, CardActions, Button, Avatar } from '@material-ui/core';
import './followerPage.css'




function FollowerPage({ followers, following, followRequests }) {
  const [showAllRequests, setShowAllRequests] = useState(false);

  return (
    <div className="list">
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h2>Follow Requests</h2>
        {showAllRequests ? (
          followRequests.map((request) => (
            <Card key={request.id} style={{ display: 'flex', alignItems: 'center' }}>
              <Avatar alt="user avatar" src="/path/to/avatar.jpg" />
              <CardContent>
                <h4>{request.name}</h4>                
              </CardContent>
              <CardActions style={{ display: 'flex', justifyContent: 'space-between', marginLeft: 'auto' }}>
                <Button size="small">Accept</Button>
                <Button size="small">Decline</Button>
              </CardActions>
            </Card>
          ))
        ) : (
          <>
            {followRequests.slice(0, 3).map((request) => (
              <Card key={request.id} style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar alt="user avatar" src="/path/to/avatar.jpg" />
                <CardContent>
                  <h4>{request.name}</h4>                  
                </CardContent>
                <CardActions style={{ display: 'flex', justifyContent: 'space-between', marginLeft: 'auto' }}>
                  <Button size="small">Accept</Button>
                  <Button size="small">Decline</Button>
                </CardActions>
              </Card>
            ))}
            {followRequests.length > 3 && (
              <>
                
                <div style={{ height: 16 }} />
                
                <Button variant="outlined" onClick={() => setShowAllRequests(true)}>
                  View More
                </Button>
              </>
            )}
          </>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h2>Followers</h2>
        {followers.map((follower) => (
          <Card key={follower.id} style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar alt="user avatar" src="/path/to/avatar.jpg" />
            <CardContent>
              <h4>{follower.name}</h4>              
            </CardContent>            
            <CardActions style={{ marginLeft: 'auto' }}>
              <Button size="small">Remove</Button>
            </CardActions>
          </Card>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h2>Following</h2>
        {following.map((followee) => (
          <Card key={followee.id} style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar alt="user avatar" src="/path/to/avatar.jpg" />
            <CardContent>
              <h4>{followee.name}</h4>              
            </CardContent>
            <CardActions style={{ marginLeft: 'auto' }}>
              <Button size="small">Remove</Button>
            </CardActions>
          </Card>
        ))}
      </div>

      

    </div>
  );
}

export default FollowerPage