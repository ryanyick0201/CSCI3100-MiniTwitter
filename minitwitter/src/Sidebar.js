import "./sidebar.css";
import SidebarButton from "./SidebarButton";

import HomeIcon from "@material-ui/icons/Home";
import SearchIcon from "@material-ui/icons/Search";
import PeopleIcon from '@material-ui/icons/People';
import ChatIcon from '@material-ui/icons/Chat';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';





function Sidebar(){
  return(
    <div className="sidebar">
        <SidebarButton text="Home" Icon={HomeIcon} to="/" />
        <SidebarButton text="Profile" Icon={AccountCircleIcon} to="/my profile" />
        <SidebarButton text="Followers" Icon={PeopleIcon} to="/followers" />
        <SidebarButton text="Chat" Icon={ChatIcon} to="/chat" />
        <SidebarButton text="Search" Icon={SearchIcon} to="/search" />
        <SidebarButton text="Recommendation" Icon={ThumbUpIcon} to="/recommendation" />
        <SidebarButton text="Sign out" Icon={ExitToAppIcon} to="/out" />
  
    </div>
  );
}

export default Sidebar;