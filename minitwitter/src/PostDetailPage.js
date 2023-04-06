import React from 'react';
import './postDetailPage.css';
import PostWithBox from './PostWithBox'
import CommentList from './CommentList'
import Button from '@material-ui/core/Button';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  returnButton: {
    textTransform: 'none',
    backgroundColor: '#F47458',
    borderRadius: '25px',
    height: '46px',
    width: '100px',
    fontWeight: 'bold', 
    color: 'white',
    position: 'fixed',
    margin: 'auto auto auto 300px',
  },
});



const PostDetailPage = ({ posts , comments }) => {
  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <div >
        <Button  onClick={() => navigate(-1)} size="large" className={classes.returnButton}>
          Return
        </Button>

      
      
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