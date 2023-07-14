import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Capacitor } from '@capacitor/core';
import PropTypes from 'prop-types';

import { getSidebarIsOpen } from '../../redux/selectors/uiSelectors';
import { setSidebarIsOpen } from '../../redux/actions/uiActions';

import SidebarItem from './SidebarItem';
import './Sidebar.scss';

function Sidebar(props) {
  const { items, crudEvents, fileEvents, uiEvents } = props;
  const { onClickItem, onAddItem, onEditItem, onDeleteItem, onClearItems } = crudEvents;
  const { onSave, onSaveAs, onRead } = fileEvents;
  const { onToggleTheme } = uiEvents;

  const dispatch = useDispatch();
  const sidebarIsOpen = useSelector(getSidebarIsOpen);

  const sidebarRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    function handleClickOutside(event) {
      if (!Capacitor.isNativePlatform()) {
        return;
      }

      const isOutsideSideBar = sidebarRef.current && !sidebarRef.current.contains(event.target);
      const canMoveSidebar = event.target.className.includes("sidebar-no-move") === false &&
        (event.target.parentElement == null || event.target.parentElement.className.includes("sidebar-no-move-parent") === false);

      if (isOutsideSideBar || canMoveSidebar) {
        dispatch(setSidebarIsOpen(false));
      }
    }

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [dispatch]);

  function handleOnAddItem() {
    onAddItem();
  }

  function handleOnClickItem(index) {
    onClickItem(index);
    setSelectedIndex(index);
  }

  function handleOnDeleteItem(index) {
    onDeleteItem(index);
  }

  function handleOnEditItem(index, newTitle) {
    onEditItem(index, newTitle);
  }

  function handleOnRead(event) {
    onRead(event.target.files[0])
  }

  function handleOnSave() {
    onSave();
  }

  function handleOnSaveAs() {
    onSaveAs();
  }

  function handleOnClearItems() {
    onClearItems();
  }

  function handleOnToggleTheme() {
    onToggleTheme();
  }

  return (
    <div className="sidebar" data-sidebar-is-open={sidebarIsOpen} data-is-mobile={Capacitor.isNativePlatform()} ref={sidebarRef}>
      <div className="sidebar-body">
        <div className='sidebar-filestream-container sidebar-no-move-parent'>
          <div className="sidebar-add-button" onClick={handleOnAddItem}>+ New chat</div>
          <div className='sidebar-filestream-options sidebar-filestream-save hide'>
            <button onClick={handleOnSave}>
              <div className="fas fa-save"></div>
            </button>
          </div>
          <div className='sidebar-filestream-options sidebar-filestream-saveas'>
            <button onClick={handleOnSaveAs}>
              <div className="fas fa-file-download"></div>
            </button>
          </div>
          <label className='sidebar-filestream-options sidebar-filestream-open'>
            <input className='hide' type="file" onChange={handleOnRead} />
            <div className="fas fa-folder-open"></div>
          </label>
        </div>
        <div className="sidebar-list">
          {items.map((item, index) => (
            <SidebarItem
              key={index}
              index={index}
              title={item.title}
              isSelected={index === selectedIndex}
              onClick={handleOnClickItem}
              onEdit={handleOnEditItem}
              onDelete={handleOnDeleteItem}
            />
          ))}
        </div>
        <div className="sidebar-footer sidebar-no-move-parent">
          <div className="sidebar-clear-button" onClick={handleOnClearItems}>Clear conversations</div>
          <div className='sidebar-help-button sidebar-no-move-parent' onClick={handleOnToggleTheme}>
            <div className="fas fa-moon"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

Sidebar.propTypes = {
  onClickItem: PropTypes.func.isRequired,
  onAddItem: PropTypes.func.isRequired,
  onEditItem: PropTypes.func.isRequired,
  onDeleteItem: PropTypes.func.isRequired,
  onClearItems: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onSaveAs: PropTypes.func.isRequired,
  onRead: PropTypes.func.isRequired,
  onToggleTheme: PropTypes.func.isRequired,
};

export default Sidebar;