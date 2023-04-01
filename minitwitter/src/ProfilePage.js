import React from 'react';

import { Avatar, Button } from '@material-ui/core';
import './profilePage.css'
import PostWithArc from './PostWithArc'
import { Link } from 'react-router-dom';



function ProfilePage({posts}) {
  

  return (
    <div >
      <div className="up">
        <Avatar aria-label="recipe"  style={{width: 150, height: 150}}>
            R
        </Avatar>
        
        
        <div className="nameBio" style={{ display: 'flex', flexDirection: 'column' }}>
        <h1>user</h1>
        <p>this is user's bio.</p>
        </div>

        <div className="editbutton">
        <Button variant="contained" component={Link} to="/profileedit">
            Edit Profile/setting
        </Button>
        </div>
      </div>


      
      <h2 className="mi">Post</h2>
      
      <div className="post">
      {posts.map(post => (
        <PostWithArc key={post.id} post={post} />
      ))}
      </div>
    
    </div>
  );
}

export default ProfilePage