import { CardHeader, Avatar } from "@material-ui/core";

// typeof name ==> string
const getPicUrl = (name) => {
  var returnUrl = "https://bit.ly/dan-abramov"; //default return
  const fetchUrl = `http://${window.location.hostname}:3000/user/searchUser?username=${name}&exactMatch=true`;
  fetch(fetchUrl, { mode: "cors" })
    .then((res) => res.json())
    .then((data) => data.result.profilePic)
    .then((pic) => {
      console.log("enter pic");
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
