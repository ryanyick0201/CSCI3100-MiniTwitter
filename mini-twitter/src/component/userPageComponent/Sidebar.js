/* PROGRAM Sidebar - the sidebar component
 * PROGRAMMER: YU Zhuofeng SID: 1155159772
 * CALLING SEQUENCE: Sidebar({ setLogInAs })
 *   where setLogInAs is the access right of login
 * PURPOSE: providing buttons to go to different pages
 */
import "./sidebar.css";
import SidebarButton from "./SidebarButton";

import HomeIcon from "@material-ui/icons/Home";
import SearchIcon from "@material-ui/icons/Search";
import PeopleIcon from "@material-ui/icons/People";
import ChatIcon from "@material-ui/icons/Chat";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import { useState } from "react";

function Sidebar({ setLogInAs }) {
  const [clickedButton, setClickedButton] = useState("Home"); //record which of the button is clicked

  return (
    <div className="sidebar">
      <SidebarButton
        text="Home"
        Icon={HomeIcon}
        to="/userHome"
        selected={clickedButton === "Home"}
        onClick={() => setClickedButton("Home")}
      />
      <SidebarButton
        text="Profile"
        Icon={AccountCircleIcon}
        to="/my profile"
        selected={clickedButton === "Profile"}
        onClick={() => setClickedButton("Profile")}
      />
      <SidebarButton
        text="Followers"
        Icon={PeopleIcon}
        to="/followers"
        selected={clickedButton === "Followers"}
        onClick={() => setClickedButton("Followers")}
      />
      <SidebarButton
        text="Chat"
        Icon={ChatIcon}
        to="/chat"
        selected={clickedButton === "Chat"}
        onClick={() => setClickedButton("Chat")}
      />
      <SidebarButton
        text="Search"
        Icon={SearchIcon}
        to="/search"
        selected={clickedButton === "Search"}
        onClick={() => setClickedButton("Search")}
      />
      <SidebarButton
        text="Recommendation"
        Icon={ThumbUpIcon}
        to="/recommendation"
        selected={clickedButton === "Recommendation"}
        onClick={() => setClickedButton("Recommendation")}
      />
      <SidebarButton
        text="Sign out"
        Icon={ExitToAppIcon}
        to="/"
        onClick={() => {
          setClickedButton("");
          setLogInAs("");
        }}
      />
    </div>
  );
}

export default Sidebar;
