import "./sidebarButton.css";

import { Link } from 'react-router-dom';

function SidebarButton({ text, Icon, to }) {
    return(
      <Link to={to} style={{ textDecoration: 'none' }}>
      <div className="button">
          <Icon />
          <h2>{text}</h2>
      </div>
      </Link>
    );
  }
  
export default SidebarButton;