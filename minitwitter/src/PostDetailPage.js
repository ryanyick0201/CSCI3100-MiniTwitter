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
    fontWeight: 'bold', 
    color: 'white',
    position: 'fixed',
    margin: 'auto auto auto 300px',
  },
});



const PostDetailPage = () => {
  const myUsername = sessionStorage.getItem('username');
  const classes = useStyles();
  
  const [comments, setComments] = useState({});
  const [posts, setPosts] = useState({});
  const [post, setPost] = useState({});
  const [me, setMe] = useState({});

  const location = useLocation();
  const tweetId = location.state?.tweetId;



  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`http://localhost:3000/tweet/searchMyTweet`);
      const data = await response.json();
      setPosts(data);
      
    };
    const fetchComments = async () => {
      const response = await fetch(`http://localhost:3000/tweet/searchCommentByTweetId?tweetId=${tweetId}`);
      const data = await response.json();
      setComments(data);
    };
    const fetchMe = async () => {
      const response = await fetch(`http://localhost:3000/user/searchUser?username=${myUsername}&exactMatch=true`);
      const data = await response.json();
      setMe(data.result[0]);
    };
    fetchPosts();
    fetchComments();
    fetchMe();
  }, [tweetId]);

  

  useEffect(() => {
    if (posts.result){
      console.log(posts.result);
      const targetPost = posts.result.find((post) => post.tweetId === tweetId);
      setPost(targetPost);
    }
    
  }, [posts]);
  

  

  const navigate = useNavigate();


  const handleAddComment = (comment) => {
    const data = {
      userId: me.userId,
      tweetId: post.tweetId,
      commentContent: comment,
    };

    fetch('http://localhost:3000/tweet/commentTweet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(() => {
      fetch(`http://localhost:3000/tweet/searchCommentByTweetId?tweetId=${tweetId}`)
      .then(response => response.json())
      .then(data => {
        setComments(data);
        console.log(comments);
      })
      .catch(error => console.log(error));
    })
    .catch((error) => {
      console.error(error);
    });
  };


  return (
    <div >
        <Button  onClick={() => navigate(-1)} size="large" className={classes.returnButton}>
          Return
        </Button>

      
      
      <div className="post">      
        <PostWithBox key={post.tweetId} post={post} AddComment={handleAddComment}/>      
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