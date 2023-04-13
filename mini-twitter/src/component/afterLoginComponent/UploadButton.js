import React from "react";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  uploadButton: {
    textTransform: "none",
    backgroundColor: "#F47458",
    borderRadius: "25px",

    fontWeight: "bold",
    color: "white",
  },
});

const UploadButton = ({ onChange }) => {
  const classes = useStyles();
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
        style={{ display: "none" }}
        accept="image/*,video/*"
      />
      <Button className={classes.uploadButton} onClick={handleClick}>
        select from computer
      </Button>
    </>
  );
};

export default UploadButton;
