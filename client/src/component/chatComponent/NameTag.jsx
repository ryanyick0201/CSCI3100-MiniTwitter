import { CardHeader, Avatar } from "@material-ui/core";

// typeof name ==> string
const getPicUrl = async (name) => {
  try {
    const url = `http://${window.location.hostname}:3000/user/searchUser?username=${name}&exactMatch=true`;
    const res = await fetch(url, { mode: "cors" });
    const data = await res.json();
    const picSrc = data.result.profilePic ? data.result.profilePic : "/";
    console.log("getPicUrl for name", name, "res", picSrc);
    return picSrc;
  } catch (error) {
    console.error(error.message);
    return "/";
  }
};

const NameTag = ({ name }) => {
  var picSrc = getPicUrl(name);
  return (
    <CardHeader avatar={<Avatar alt={name} src={picSrc} />} title={name} />
  );
};

export default NameTag;
