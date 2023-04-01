import React from 'react';
import { Avatar, Button, TextField, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import './editProfile.css'
import UploadButton from './UploadButton';


const EditProfile = () => {
  const [value, setValue] = React.useState('1');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div className="edit">
      <Avatar style={{width: 150, height: 150}}/>
      <UploadButton variant="contained">change profile picture</UploadButton>
      <div className="name">
        <span>username:</span>
        <TextField label="new username" variant="outlined" />
      </div>
      <div className="pass">
        <span>password:</span>
        <TextField type="password" label="new password" variant="outlined" />
      </div>
      <div className="select">
        <span>privacy setting</span>
        <RadioGroup value={value} onChange={handleChange}>
          <FormControlLabel value="1" control={<Radio />} label="show to public" />
          <FormControlLabel value="2" control={<Radio />} label="show to followers only" />
          <FormControlLabel value="3" control={<Radio />} label="show to myself only" />
        </RadioGroup>
      </div>
      <Button variant="contained">submit</Button>
    </div>
  );
};

export default EditProfile;