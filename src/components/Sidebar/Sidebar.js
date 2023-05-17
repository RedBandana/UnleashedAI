import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Sidebar.scss';
import SidebarItem from '../SidebarItem/SidebarItem';

function Sidebar(props) {
  const { sidebarItems, isOpen, onClose, onClickItem, onEditItem, onDeleteItem, onAddItem, onClearItems } = props;
  const sidebarRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) &&
        event.target.className.includes("sidebaritem") === false &&
        (event.target.parentElement == null ||
          event.target.parentElement.className.includes("sidebaritem") === false)) {
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
        <div className="sidebar-add-button" onClick={onAddItem}>Add Conversation</div>
        <div className="sidebar-list">
          {sidebarItems.map((item, index) => (
            <SidebarItem key={index} index={index} title={item.title}
              onClick={onClickItem} onDelete={onDeleteItem} onEdit={onEditItem} />
          ))}
        </div>
      </div>
      <div className="sidebar-footer">
        <div className="sidebar-clear-button" onClick={onClearItems}>Clear Conversations</div>
        <a className='sidebar-help-button' href="https://www.google.com" target="_blank" rel="noopener noreferrer">
          <div className="fas fa-question-circle"></div>
        </a>
      </div>
    </div>
  );
}

Sidebar.propTypes = {
  conversationsTitles: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
    })
  ).isRequired
};

export default Sidebar;