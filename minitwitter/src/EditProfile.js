import React from 'react';
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
});


const EditProfile = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState('1');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div className="edit">
      <div className="conta">
      <Avatar style={{width: 150, height: 150}}/>
      <div style={{width: "100px"}}></div>
      <UploadButtonIma variant="contained">change profile picture</UploadButtonIma>
      </div>

      <div className="name">
        <span>username:</span>
        <div style={{width: "50px"}}></div>
        <TextField label="new username" variant="outlined" />
      </div>

      <div className="pass">
        <span>password:</span>
        <div style={{width: "50px"}}></div>
        <TextField type="password" label="new password" variant="outlined" />
      </div>

      <div className="select">
        <span>privacy setting</span>
        <div style={{width: "50px"}}></div>
        <RadioGroup value={value} onChange={handleChange}>
          <FormControlLabel value="1" control={<Radio />} label="show to public" />
          <FormControlLabel value="2" control={<Radio />} label="show to followers only" />
          <FormControlLabel value="3" control={<Radio />} label="show to myself only" />
        </RadioGroup>
      </div>


      <Button className={classes.submitButton} variant="contained">submit</Button>

      
    </div>
  );
};

export default EditProfile;