import React from 'react';
import { Button } from '@material-ui/core';

const UploadButtonIma = ({ onChange }) => {
  const inputRef = React.useRef();

  const handleClick = () => {
    inputRef.current.click();
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        onChange={onChange}
        style={{ display: 'none' }}
        accept="image/*"
      />
      <Button style={{backgroundColor: 'orange'}} onClick={handleClick}>select from computer</Button>
    </>
  );
};

export default UploadButtonIma;