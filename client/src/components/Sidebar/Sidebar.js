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
        console.log(`Sidebar setSidebarIsOpen`);
        dispatch(setSidebarIsOpen(false));
      }
    }

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [dispatch]);

  function handleOnAddItem() {
    crudEvents.create();
  }

  function handleOnClickItem(index) {
    crudEvents.read(index);
    setSelectedIndex(index);
  }

  function handleOnEditItem(index, newTitle) {
    crudEvents.update(index, newTitle);
  }

  function handleOnDeleteItem(index) {
    crudEvents.delete(index);
  }

  function handleOnClearItems() {
    crudEvents.clear();
  }

  function handleOnOpen(event) {
    fileEvents?.onRead(event.target.files[0])
  }

  function handleOnSave() {
    fileEvents?.onSave();
  }

  function handleOnSaveAs() {
    fileEvents?.onSaveAs();
  }

  function handleOnToggleTheme() {
    uiEvents?.toggleTheme();
  }

  return (
    <div className="sidebar" data-sidebar-is-open={sidebarIsOpen} data-is-mobile={Capacitor.isNativePlatform()} ref={sidebarRef}>
      <div className="sidebar-body">
        <div className='sidebar-filestream-container sidebar-no-move-parent'>
          <div className="sidebar-add-button" onClick={handleOnAddItem}>+ New chat</div>
          {
            uiEvents?.save && (
              <div className='sidebar-filestream-options sidebar-filestream-save hide'>
                <button onClick={handleOnSave}>
                  <div className="fas fa-save"></div>
                </button>
              </div>
            )
          }
          {
            uiEvents?.saveAs && (
              <div className='sidebar-filestream-options sidebar-filestream-saveas'>
                <button onClick={handleOnSaveAs}>
                  <div className="fas fa-file-download"></div>
                </button>
              </div>
            )
          }
          {
            uiEvents?.open && (
              <label className='sidebar-filestream-options sidebar-filestream-open'>
                <input className='hide' type="file" onChange={handleOnOpen} />
                <div className="fas fa-folder-open"></div>
              </label>
            )
          }
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
  crudEvents: PropTypes.shape({
    create: PropTypes.func.isRequired,
    read: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    delete: PropTypes.func.isRequired,
    clear: PropTypes.func.isRequired,
  }).isRequired,
  fileEvents: PropTypes.shape({
    save: PropTypes.func,
    saveAs: PropTypes.func,
    open: PropTypes.func,
  }),
  uiEvents: PropTypes.shape({
    toggleTheme: PropTypes.func,
  }),
  items: PropTypes.array.isRequired,
};

export default Sidebar;