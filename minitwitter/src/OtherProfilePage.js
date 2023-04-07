import React from 'react';

import { Avatar, Button } from '@material-ui/core';

import Post from './Post'
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  Button: {
    textTransform: 'none',
    backgroundColor: '#F47458',
    borderRadius: '25px',
    fontWeight: 'bold', 
    color: 'white',
  },
});




function OtherProfilePage({posts}) {
  const classes = useStyles();

  return (
    <div >
      <div className="up">
        <Avatar aria-label="recipe"  style={{width: 150, height: 150}}>
            R
        </Avatar>
        
        
        <div className="nameAndBio" style={{ display: 'flex', flexDirection: 'column' }}>
        <h1>user</h1>
        <p>this is user's bio.</p>
        </div>


        <Button className={classes.Button} >
            follow
        </Button>

      </div>


      
      <h2 style={{margin: '30px auto 20px 400px'}}>Post</h2>
      
      <div className="post">
      {posts.map(post => (
        <Post key={post.id} post={post} />
      ))}
      </div>
    
    </div>
  );
}

export default OtherProfilePage