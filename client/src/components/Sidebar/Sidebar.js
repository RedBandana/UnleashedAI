import React, { useRef, useEffect, useState } from 'react';
import './Sidebar.scss';
import SidebarItem from '../SidebarItem/SidebarItem';

function Sidebar(props) {
  const { sidebarItems, isOpen, onClose, onClickItem, onEditItem, onDeleteItem,
    onAddItem, onClearItems, onSave, onSaveAs, onRead, onToggleTheme } = props;
  const sidebarRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    function handleClickOutside(event) {
      const isMobile = process.env.REACT_APP_CLIENT_TYPE === 'mobile';
      if (!isMobile)
        return;

      const isOutsideSideBar = sidebarRef.current && !sidebarRef.current.contains(event.target);
      const canMoveSidebar = event.target.className.includes("sidebar-no-move") === false &&
        (event.target.parentElement == null || event.target.parentElement.className.includes("sidebar-no-move-parent") === false);

      if (isOutsideSideBar || canMoveSidebar) {
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
    <div className="sidebar" data-sidebar-is-open={isOpen} data-is-mobile={process.env.REACT_APP_CLIENT_TYPE === 'mobile'} ref={sidebarRef}>
      <div className="sidebar-body">
        <div className='sidebar-filestream-container sidebar-no-move-parent'>
          <div className="sidebar-add-button" onClick={onAddItem}>+ New chat</div>
          <div className='sidebar-filestream-options sidebar-filestream-save hide'>
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
        <div className="sidebar-footer sidebar-no-move-parent">
          <div className="sidebar-clear-button" onClick={onClearItems}>Clear conversations</div>
          <div className='sidebar-help-button sidebar-no-move-parent' onClick={onToggleTheme}>
            <div className="fas fa-moon"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;