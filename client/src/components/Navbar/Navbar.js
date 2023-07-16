import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Capacitor } from '@capacitor/core';

import './Navbar.scss';
import { getSidebarIsOpen } from '../../redux/selectors/uiSelectors';
import { fetchChatValue } from '../../redux/selectors/chatSelectors';
import { toggleSidebar } from '../../redux/actions/uiActions';

function Navbar() {
  const dispatch = useDispatch();

  const sidebarIsOpen = useSelector(getSidebarIsOpen);
  const chat = useSelector(fetchChatValue);

  const [navbarTitle, setNavbarTitle] = useState(false);
  
  useEffect(() => {
    if (!chat) {
      setNavbarTitle('');
      return;
    }
    setNavbarTitle(chat.title);
  }, [chat]);

  function handleToggleSidebar() {
    dispatch(toggleSidebar());
  }

  return (
    <nav className="navbar" data-sidebar-is-open={sidebarIsOpen} data-is-mobile={Capacitor.isNativePlatform()}>
      <div className='navbar-container'>
        <div className="navbar-left">
          <button className="navbar-toggle" onClick={handleToggleSidebar}>
            <i className="fa fa-bars"></i>
          </button>
        </div>
        <div className='navbar-center'>
          <div className='navbar-item'>{navbarTitle}</div>
        </div>
        <div className="navbar-right">
          <div className="navbar-brand hide">Unleashed AI</div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;