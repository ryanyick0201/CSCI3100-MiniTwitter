/** NameTag - Name Tag component
 * PROGRAMMER: Choi, Man Wai (SID: 1155159354)
 * CALLING SEQUENCE: NameTag({name})
 *  Where name is the username of string type to be put in the tag
 * PURPOSE: A reusable component that render both the profile piture and name for a given username
 * ALGORITHM: getPicUrl(name) takes username of string type, then fetch and return the profile picture URL of that user
 *            Using <CardHeader avatar={...}/> from Material UI for layout
 */

import { CardHeader, Avatar } from "@material-ui/core";

// Receive username of string type, then fetch and return the profile picture URL of that user
const getPicUrl = (name) => {
  var returnUrl = "/"; //default return
  const fetchUrl = `http://${window.location.hostname}:3000/user/searchUser?username=${name}&exactMatch=true`;
  fetch(fetchUrl, { mode: "cors" })
    .then((res) => res.json()) // Retrieve user data from server response
    .then((data) => data.result.profilePic) // Retrieve only the profile picture URL from the user data
    .then((pic) => {
      console.log(`Profile pic of ${name} is "${pic}"`);
      returnUrl = pic ? pic : returnUrl;
    })
    .catch((err) => console.error(err.message));
  return returnUrl;
};

const NameTag = ({ name }) => {
  var picSrc = getPicUrl(name);
  console.log("picSrc", picSrc);
  return (
    <CardHeader avatar={<Avatar alt={name} src={picSrc} />} title={name} />
  );
};

export default NameTag;
