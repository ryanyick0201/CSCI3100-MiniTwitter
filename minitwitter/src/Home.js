import React, { useState, useEffect } from 'react';
import './home.css';
import Post from './Post'
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  newPostButton: {
    textTransform: 'none',
    backgroundColor: '#F47458',
    borderRadius: '50px',
    height: '50px',
    width: '50px',
    fontWeight: 'bold', 
    color: 'white',
    position: 'fixed',
    margin: '500px auto auto 1100px',
  },
});



const Home = () => {
  const classes = useStyles();

  const [posts, setPosts] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('http://localhost:2000/tweet/searchTweet?username=user2');
      const data = await response.json();
      setPosts(data);
    };
    fetchPosts();
  }, []);
  






  return (
  <div>
    <Button  component={Link} to="/createNewPost" size="large" className={classes.newPostButton} >
      +
    </Button>
    


    <div className="card">
      {Array.isArray(posts.result) && posts.result.map(post => (
        <Post key={post.tweetId} post={post} />
      ))}
    </div>


  </div>
    
  );
};

export default Home;