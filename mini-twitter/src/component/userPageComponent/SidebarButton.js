/* PROGRAM SidebarButton - the sidebar button component
 * PROGRAMMER: YU Zhuofeng SID: 1155159772
 * CALLING SEQUENCE: SidebarButton({ text, Icon, to, selected, onClick })
 *   where text is the wording of the button,
 *   Icon is the displayed icon,
 *   to is the path the button linking to
 *   selected is the boolean indicator, indicate whether the button has been selected
 *   onClick is the callback function
 * PURPOSE: providing a button which is the component of the sidebar
 */
import "./sidebarButton.css";

import { Link } from "react-router-dom";

function SidebarButton({ text, Icon, to, selected, onClick }) {
  return (
    <Link to={to} style={{ textDecoration: "none" }} onClick={onClick}>
      <div className={`button ${selected ? "selected" : ""}`}>
        <Icon />
        <h2>{text}</h2>
      </div>
    </Link>
  );
}

export default SidebarButton;
