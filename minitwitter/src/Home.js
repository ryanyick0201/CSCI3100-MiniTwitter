import React from 'react';
import './home.css';
import Post from './Post'
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';



const Home = ({ posts }) => {
  return (
  <div>
    <div className="createPostButton">
      <Button  component={Link} to="/createNewPost" size="large" >
        +
      </Button>
    </div>


    <div className="card">
      {posts.map(post => (
        <Post key={post.id} post={post} />
      ))}
    </div>


  </div>
    
  );
};

export default Home;