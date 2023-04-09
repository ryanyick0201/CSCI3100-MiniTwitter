import React, { useState, useEffect} from 'react';
import './postDetailPage.css';
import PostWithBox from './PostWithBox'
import CommentList from './CommentList'
import Button from '@material-ui/core/Button';
import { useNavigate, useLocation } from 'react-router-dom';
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



const PostDetailPage = () => {
  const classes = useStyles();
  
  const [comments, setComments] = useState({});
  const [posts, setPosts] = useState({});
  const [post, setPost] = useState({});

  const location = useLocation();
  const tweetId = location.state?.tweetId;

  console.log(tweetId);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`http://localhost:2000/tweet/searchTweet?`);
      const data = await response.json();
      setPosts(data);
      
    };
    const fetchComments = async () => {
      const response = await fetch(`http://localhost:2000/tweet/searchCommentByTweetId?tweetId=${tweetId}`);
      const data = await response.json();
      setComments(data);
    };
    fetchPosts();
    fetchComments();
  }, [tweetId]);

  

  useEffect(() => {
    if (posts.result){
      console.log(posts.result);
      const targetPost = posts.result.find((post) => post.tweetId === tweetId);
      setPost(targetPost);
    }
    
  }, [posts]);
  

  

  const navigate = useNavigate();




  return (
    <div >
        <Button  onClick={() => navigate(-1)} size="large" className={classes.returnButton}>
          Return
        </Button>

      
      
      <div className="post">      
        <PostWithBox key={post.tweetId} post={post} />      
      </div>


      
      <div className="comment-list">
      {Array.isArray(comments.result) && comments.result.map(comment => (        
        <CommentList  comment={comment}/>
      ))}
      </div>
    </div>
  );
};

export default PostDetailPage;