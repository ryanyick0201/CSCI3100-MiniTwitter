import React, { useState, useEffect} from 'react';

import { Avatar, Button } from '@material-ui/core';

import Post from './Post'

import { useLocation } from 'react-router-dom';
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




function OtherProfilePage() {
  const classes = useStyles();

  const [user, setUser] = useState({});
  const [posts, setPosts] = useState({});

  const location = useLocation();
  const username = location.state.username;

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(`http://localhost:2000/user/searchUser?username=${username}`);
      const data = await response.json();
      setUser(data);
    };
    const fetchPosts = async () => {
      const response = await fetch(`http://localhost:2000/tweet/searchTweet?username=${username}`);
      const data = await response.json();
      setPosts(data);
    };
    fetchUser();
    fetchPosts();
  }, [username]);

  

  


  return (
    <div >
      <div className="up">
        <Avatar aria-label="recipe"  style={{width: 150, height: 150}}>
            
        </Avatar>
        
        {user.result && user.result.length > 0 && (
          <div className="nameAndBio" style={{ display: 'flex', flexDirection: 'column' }}>
          <h1>{user.result[0].username}</h1>
          <p>{user.result[0].personalBio}</p>
          </div>
        )}


        <Button className={classes.Button} >
            follow
        </Button>

      </div>


      
      <h2 style={{margin: '30px auto 20px 400px'}}>Post</h2>
      
      <div className="post">
      {Array.isArray(posts.result) && posts.result.map(post => (
        <Post key={post.tweetId} post={post} />
      ))}
      </div>
    
    </div>
  );
}

export default OtherProfilePage