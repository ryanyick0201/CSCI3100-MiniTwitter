import "./sidebar.css";
import SidebarButton from "./SidebarButton";

import HomeIcon from "@material-ui/icons/Home";
import SearchIcon from "@material-ui/icons/Search";
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import ListAltIcon from "@material-ui/icons/ListAlt";
import PermIdentityIcon from "@material-ui/icons/PermIdentity";





function Sidebar(){
  return(
    <div className="sidebar">
        <SidebarButton text="Home" Icon={HomeIcon} to="/" />
        <SidebarButton text="Profile" Icon={PermIdentityIcon} to="/profile" />
        <SidebarButton text="Followers" Icon={NotificationsNoneIcon} to="/followers" />
        <SidebarButton text="Chat" Icon={MailOutlineIcon} to="/chat" />
        <SidebarButton text="Search" Icon={SearchIcon} to="/search" />
        <SidebarButton text="Recommendation" Icon={ListAltIcon} to="/recommendation" />
        <SidebarButton text="Sign out" Icon={PermIdentityIcon} to="/sign out" />
  
    </div>
  );
}

export default Sidebar;