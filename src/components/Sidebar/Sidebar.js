import React, { useRef, useEffect, useState } from 'react';
import './Sidebar.scss';
import SidebarItem from '../SidebarItem/SidebarItem';

function Sidebar(props) {
  const { sidebarItems, isOpen, onClose, onClickItem, onEditItem, onDeleteItem, onAddItem, onClearItems, onSave, onSaveAs, onRead } = props;
  const sidebarRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

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

  function handleOnClickItem(index) {
    onClickItem(index);
    setSelectedIndex(index);
  }

  function handleOnRead(event) {
    onRead(event.target.files[0])
  }

  return (
    <div className="sidebar" data-is-open={isOpen} ref={sidebarRef}>
      <div className="sidebar-body">
        <div className="sidebar-add-button" onClick={onAddItem}>Add Conversation</div>
        <div className='sidebar-filestream-container'>
          <div className='sidebar-filestream-options sidebar-filestream-save'>
            <button onClick={onSave}>
            <div className="fas fa-save"></div>
            </button>
          </div>
          <div className='sidebar-filestream-options sidebar-filestream-saveas'>
            <button onClick={onSaveAs}>
            <div className="fas fa-file-download"></div>
            </button>
          </div>
          <label className='sidebar-filestream-options sidebar-filestream-open'>
            <input className='hide' type="file" onChange={handleOnRead} />
            <div className="fas fa-folder-open"></div>
          </label>
        </div>
        <div className="sidebar-list">
          {sidebarItems.map((item, index) => (
            <SidebarItem key={index} index={index} title={item.title}
              onClick={handleOnClickItem} onDelete={onDeleteItem} onEdit={onEditItem} isSelected={index === selectedIndex} />
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

export default Sidebar;