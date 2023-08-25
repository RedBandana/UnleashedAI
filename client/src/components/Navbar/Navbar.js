import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import './Navbar.scss';
import { getIsMobile, getSidebarIsOpen } from '../../redux/selectors/uiSelectors';
import { fetchChatValue } from '../../redux/selectors/chatSelectors';
import { toggleSidebar } from '../../redux/actions/uiActions';

function Navbar() {
  const dispatch = useDispatch();

  const sidebarIsOpen = useSelector(getSidebarIsOpen);
  const chat = useSelector(fetchChatValue);
  const isMobile = useSelector(getIsMobile);

  function handleToggleSidebar() {
    dispatch(toggleSidebar());
  }

  return (
    <nav className="navbar" data-sidebar-is-open={sidebarIsOpen} data-is-mobile={isMobile}>
      <div className='navbar-container'>
        <div className="navbar-left">
          <button className="navbar-toggle" onClick={handleToggleSidebar}>
            <i className="fa fa-bars"></i>
          </button>
        </div>
        <div className='navbar-center'>
          {chat?.title}
        </div>
        <div className="navbar-right">
          <div className="navbar-brand hide">Unleashed AI</div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;