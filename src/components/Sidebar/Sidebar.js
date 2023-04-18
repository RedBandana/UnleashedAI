import React, { useRef, useEffect } from 'react';
import './Sidebar.css';

function Sidebar(props) {
  const { isOpen, onClose } = props;
  const sidebarRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    }

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="sidebar" data-is-open={isOpen} ref={sidebarRef}>
      <div className="sidebar-body">
        <div className="sidebar-add-button">Add Conversation</div>
        <div className="sidebar-list">
          {props.children}
        </div>
      </div>
      <div className="sidebar-footer">
        <div className="sidebar-clear-button">Clear Conversations</div>
        <a href="https://www.google.com" target="_blank" rel="noopener noreferrer">
          <div className="sidebar-help-button">Get Help</div>
        </a>
      </div>
    </div>
  );
}

export default Sidebar;