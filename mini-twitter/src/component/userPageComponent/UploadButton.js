/* PROGRAM UploadButton - the button used to upload media
 * PROGRAMMER: YU Zhuofeng SID: 1155159772
 * CALLING SEQUENCE: UploadButton = ({ onChange })
 *   where onChange is the callback function of event handler when the value of the input element change
 * PURPOSE: providing a button which is used to upload image and video for creating a tweet
 * ALGORITHM: using the Ref hook to create a reference to the input element,
 *  then it can trigger a click event on the input element when clicking on the button
 *  then the input element can be invisible
 * Idea Reference: https://react.dev/reference/react/useRef
 */
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
    //trigger a click event on the input element
    inputRef.current.click();
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        onChange={onChange}
        style={{ display: "none" }} //the input element can be invisible
        accept="image/*,video/*"
      />
      <Button className={classes.uploadButton} onClick={handleClick}>
        select from computer
      </Button>
    </>
  );
};

export default UploadButton;
