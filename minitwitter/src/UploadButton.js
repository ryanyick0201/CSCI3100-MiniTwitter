import React from 'react';
import { Button } from '@material-ui/core';

const UploadButton = ({ onChange }) => {
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
        accept="image/*,video/*"
      />
      <Button onClick={handleClick}>select from computer</Button>
    </>
  );
};

export default UploadButton;