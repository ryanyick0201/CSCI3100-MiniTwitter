import React, { useState, useEffect} from 'react';

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



function ProfilePage() {
  const myUsername = sessionStorage.getItem('username');
  const classes = useStyles();

  const [user, setUser] = useState({});
  const [posts, setPosts] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(`http://localhost:2000/user/searchUser?username=${myUsername}`);
      const data = await response.json();
      setUser(data);
    };
    const fetchPosts = async () => {
      const response = await fetch(`http://localhost:2000/tweet/searchTweet?username=${myUsername}`);
      const data = await response.json();
      setPosts(data);
    };
    fetchUser();
    fetchPosts();
  }, [myUsername]);



  return (
    <div >
      <div className="up">
        <Avatar aria-label="recipe"  style={{width: 150, height: 150}} />

        
        
        {user.result && user.result.length > 0 && (
          <div className="nameAndBio" style={{ display: 'flex', flexDirection: 'column' }}>
          <h1>{myUsername}</h1>
          <p>{user.result[0].personalBio}</p>
          </div>
        )}


        <Button variant="contained" className={classes.settingButton} component={Link} to="/profileedit">
            Edit Profile/setting
        </Button>

      </div>


      
      <h2 style={{margin: '30px auto 20px 400px'}}>Post</h2>
      
      <div className="pos">
      {Array.isArray(posts.result) && posts.result.map(post => (
        <PostWithArc key={post.tweetId} post={post} />
      ))}
      </div>
    
    </div>
  );
}

export default ProfilePage