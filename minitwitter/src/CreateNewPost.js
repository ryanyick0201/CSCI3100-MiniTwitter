import React, { useState } from 'react';
import { Avatar, Button, TextField, MenuItem, Select } from '@material-ui/core';
import './createNewPost.css'
import UploadButton from './UploadButton'

import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  submitButton: {
    textTransform: 'none',
    backgroundColor: '#F47458',
    borderRadius: '25px',
    height: '50px',
    width: '100px',
    fontWeight: 'bold', 
    color: 'white',
    margin: '40px auto 60px 300px',
  },
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





const CreateNewPost = () => {
  const myUsername = sessionStorage.getItem('username');
  const classes = useStyles();

  const [postContent, setPostContent] = useState('');
  const [hashtag, setHashtag] = useState('');
  const [media, setMedia] = useState(null);

  const handlePostContentChange = (event) => {
    setPostContent(event.target.value);
  };

  const handleHashtagChange = (event) => {
    setHashtag(event.target.value);
  };

  const handleMediaChange = (event) => {
    setMedia(event.target.files[0]);
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      username: myUsername,
      tweetContent: postContent,
      category: hashtag,
    };
    const response = await fetch('http://localhost:2000/tweet/createTweet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    console.log(result);
    navigate(-1);
  };
  
  




  return (
    <div>
      <Button  onClick={() => navigate(-1)} size="large" className={classes.returnButton}>
          Return
      </Button>
    <div className="newpost">
      
      <h2>Create new post</h2>

      <div className="nameAndAvatar">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <Avatar src alt={myUsername} />
      <p>{myUsername}</p>
      </div>  
      </div>


      <TextField
        label="Post content"
        variant="outlined"
        multiline
        minRows={4}
        fullWidth
        value={postContent}
        onChange={handlePostContentChange}
      />

      <div className="select">
      <span>hashtags: </span>&nbsp;  
      <Select value={hashtag} onChange={handleHashtagChange}>
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <MenuItem value={'science'}>science</MenuItem>
        <MenuItem value={'programming'}>programming</MenuItem>
        <MenuItem value={'travel'}>travel</MenuItem>
        <MenuItem value={'sports'}>sports</MenuItem>
        <MenuItem value={'pets'}>pets</MenuItem>
      </Select>
      </div>

      <div className="file-input">
      <span>Add a picture/ video: </span>&nbsp;   
      <UploadButton onChange={handleMediaChange}/>
      </div>


      <Button onClick={handleSubmit} className={classes.submitButton}>Submit</Button>

    </div>
    </div>
  );
};

export default CreateNewPost;