import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Avatar, Button, TextField, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import './editProfile.css'
import UploadButtonIma from './UploadButtonIma';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  submitButton: {
    textTransform: 'none',
    backgroundColor: '#F47458',
    borderRadius: '25px',
    fontWeight: 'bold', 
    color: 'white',
    margin: '20px auto 20px 600px',
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

const myUsername = sessionStorage.getItem('username');


const EditProfile = () => {
  const classes = useStyles();

  const [newUsername, setNewUsername] = useState('');
  const [newBio, setNewBio] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPrivacySetting, setPrivacySetting] = useState("public");
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      oldUsername: myUsername,
      newUsername: newUsername,
      password: newPassword,
      personalBio: newBio,
      privacySetting: newPrivacySetting
    };
    const response = await fetch('http://localhost:2000/user/updateUser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    console.log(result);
    navigate(-1);
  };

  const navigate = useNavigate();

  return (
    <div>
      <Button  onClick={() => navigate(-1)} size="large" className={classes.returnButton}>
          Return
        </Button>
    <div className="edit">
      <div className="conta">
      <Avatar style={{width: 150, height: 150}}/>
      <div style={{width: "100px"}}></div>
      <UploadButtonIma variant="contained">change profile picture</UploadButtonIma>
      </div>

      <div className="name">
        <span>username:</span>
        <div style={{width: "50px"}}></div>
        <TextField label="new username" variant="outlined" style={{width: '60%'}} onChange={(e) => setNewUsername(e.target.value)}/>
      </div>

      <div className="pass">
        <span>bio:</span>
        <div style={{width: "96px"}}></div>
        <TextField label="new bio" variant="outlined" multiline minRows={5} style={{width: '60%'}} onChange={(e) => setNewBio(e.target.value)}/>
      </div>

      <div className="pass">
        <span>password:</span>
        <div style={{width: "50px"}}></div>
        <TextField type="password" label="new password" variant="outlined" style={{width: '60%'}} onChange={(e) => setNewPassword(e.target.value)}/>
      </div>

      <div className="select">
        <span>privacy setting</span>
        <div style={{width: "50px"}}></div>
        <RadioGroup value={newPrivacySetting} onChange={(e) => setPrivacySetting(e.target.value)}>
          <FormControlLabel value="public" control={<Radio />} label="show to public" />
          <FormControlLabel value="private" control={<Radio />} label="show to followers only" />
          <FormControlLabel value="only me" control={<Radio />} label="show to myself only" />
        </RadioGroup>
      </div>


      <Button className={classes.submitButton} variant="contained" onClick={handleSubmit}>save</Button>

      
    </div>
    </div>
  );
};

export default EditProfile;