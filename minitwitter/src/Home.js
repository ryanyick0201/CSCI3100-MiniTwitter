import React from 'react';
import './home.css';
import Post from './Post'
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  newPostButton: {
    textTransform: 'none',
    backgroundColor: '#F47458',
    borderRadius: '25px',
    height: '50px',
    width: '50px',
    fontWeight: 'bold', 
    color: 'white',
    position: 'fixed',
    margin: '500px auto auto 1100px',
  },
});



const Home = ({ posts }) => {
  const classes = useStyles();
  return (
  <div>
    <Button  component={Link} to="/createNewPost" size="large" className={classes.newPostButton} >
      +
    </Button>
    


    <div className="card">
      {posts.map(post => (
        <Post key={post.id} post={post} />
      ))}
    </div>


  </div>
    
  );
};

export default Home;