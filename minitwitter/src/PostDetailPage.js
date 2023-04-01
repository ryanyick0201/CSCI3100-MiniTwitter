import React from 'react';
import './postDetailPage.css';
import PostWithBox from './PostWithBox'
import CommentList from './CommentList'
import Button from '@material-ui/core/Button';
import { useNavigate } from 'react-router-dom';



const PostDetailPage = ({ posts , comments }) => {
  const navigate = useNavigate();

  return (
    <div >
      <div className="returnbutton">
        <Button  onClick={() => navigate(-1)} size="large" >
          Return
        </Button>
      </div>

      
      
      <div className="post">      
        <PostWithBox key={posts[0].id} post={posts[0]} />      
      </div>

      <div className="comment-list">
      {comments.map(comment => (        
        <CommentList  comment={comment}/>
      ))}
      </div>
    </div>
  );
};

export default PostDetailPage;