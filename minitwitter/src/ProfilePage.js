import React from 'react';

import { Avatar, Button } from '@material-ui/core';
import './profilePage.css'
import PostWithArc from './PostWithArc'
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  settingButton: {
    textTransform: 'none',
    backgroundColor: '#F47458',
    borderRadius: '25px',
    fontWeight: 'bold', 
    color: 'white',
    margin: 'auto 0 auto auto',
  },
});



function ProfilePage({posts}) {
  const classes = useStyles();

  return (
    <div >
      <div className="up">
        <Avatar aria-label="recipe"  style={{width: 150, height: 150}}>
            R
        </Avatar>
        
        
        <div className="nameAndBio" >
        <h1>user</h1>
        <p>this is user's bio.</p>
        </div>


        <Button variant="contained" className={classes.settingButton} component={Link} to="/profileedit">
            Edit Profile/setting
        </Button>

      </div>


      
      <h2 style={{margin: '30px auto 20px 400px'}}>Post</h2>
      
      <div className="pos">
      {posts.map(post => (
        <PostWithArc key={post.id} post={post} />
      ))}
      </div>
    
    </div>
  );
}

export default ProfilePage