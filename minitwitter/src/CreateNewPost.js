import React from 'react';
import { Avatar, Button, TextField, MenuItem, Select } from '@material-ui/core';
import './createNewPost.css'
import UploadButton from './UploadButton'
import { Link } from 'react-router-dom';

const CreateNewPost = ({ username, avatar }) => {
  const [postContent, setPostContent] = React.useState('');
  const [hashtag, setHashtag] = React.useState('');
  const [media, setMedia] = React.useState(null);

  const handlePostContentChange = (event) => {
    setPostContent(event.target.value);
  };

  const handleHashtagChange = (event) => {
    setHashtag(event.target.value);
  };

  const handleMediaChange = (event) => {
    setMedia(event.target.files[0]);
  };

  const handleSubmit = () => {
    // Submit the post data
  };

  return (
    <div className="newpost">
      
      <h2>Create new post</h2>

      <div className="nameAndAvatar">
      <p>{username}</p>
      <Avatar src={avatar} alt={username} />
      </div>

      <div className="text-field">
      <TextField
        label="Post content"
        variant="outlined"
        multiline
        minRows={4}
        fullWidth
        value={postContent}
        onChange={handlePostContentChange}
      />
      </div>

      <div className="select">
      <span>hashtags: </span>&nbsp;  
      <Select value={hashtag} onChange={handleHashtagChange}>
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <MenuItem value={'animals'}>animals</MenuItem>
        <MenuItem value={'flowers'}>flowers</MenuItem>
      </Select>
      </div>

      <div className="file-input">
      <span>Add a picture/ video: </span>&nbsp;   
      <UploadButton onChange={handleMediaChange}/>
      </div>

      <div className="submit">
      <Button component={Link} to="/" onClick={handleSubmit}>Submit</Button>
      </div>
    </div>
  );
};

export default CreateNewPost;