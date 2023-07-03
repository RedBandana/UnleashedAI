import React, { useEffect, useState } from 'react';
import './Navbar.scss';

function Navbar(props) {
  const { sidebarIsOpen, conversationTitle } = props;
  const [navbarTitle, setNavbarTitle] = useState(false);

  useEffect(() => {
    if (conversationTitle.length > 16) {
      setNavbarTitle(conversationTitle.substr(0, 16) + '...');
    }
    else {
      setNavbarTitle(conversationTitle);
    }
  }, [conversationTitle])

  return (
    <nav className="navbar" data-sidebar-is-open={sidebarIsOpen} data-is-mobile={process.env.REACT_APP_CLIENT_TYPE === 'mobile'}>
      <div className='navbar-container'>
        <div className="navbar-left">
          <button className="navbar-toggle" onClick={props.onToggleSidebar}>
            <i className="fa fa-bars"></i>
          </button>
        </div>
        <div className='navbar-center'>
          <div className='navbar-item'>{navbarTitle}</div>
        </div>
        <div className="navbar-right">
          <div className="navbar-brand hide">GPTU</div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;