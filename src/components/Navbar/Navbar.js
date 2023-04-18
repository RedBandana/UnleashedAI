import React from 'react';
import './Navbar.css';

function Navbar(props) {
    const { sidebarIsOpen } = props;
  
    return (
    <nav className="navbar" data-sidebar-is-open={sidebarIsOpen}>
      <div className="navbar-left">
        <button className="navbar-toggle" onClick={props.onToggleSidebar}>
          <i className="fa fa-bars"></i>
        </button>
      </div>
      <div className="navbar-right">
        <div className="navbar-brand">GPT Unlimited</div>
      </div>
    </nav>
  );
}

export default Navbar;