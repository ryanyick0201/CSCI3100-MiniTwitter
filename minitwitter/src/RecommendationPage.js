import React from 'react';
import './recommendationPage.css';
import Post from './Post'
import { Link } from 'react-router-dom';




const RecommendationPage = ({ posts }) => {
  return (
  <div>
    <div style={{margin: '20px auto 10px 400px'}}>
      <h2>You may be interested in...</h2>
    </div>
    
    <div className="card">
      {posts.map(post => (
        <Post key={post.id} post={post} />
      ))}
    </div>


  </div>
    
  );
};

export default RecommendationPage