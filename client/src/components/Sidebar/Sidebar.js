import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Capacitor } from '@capacitor/core';

import { getChatSelectedIndex, getSidebarIsOpen } from '../../redux/selectors/uiSelectors';
import { setSidebarIsOpen } from '../../redux/actions/uiActions';

import SidebarItem from './SidebarItem';
import './Sidebar.scss';
import { fetchChatsLoading, fetchChatsPageReceived } from '../../redux/selectors/chatSelectors';
import Loading from '../Loading/Loading';

function Sidebar(props) {
  const { items, crudEvents, fileEvents, uiEvents } = props;

  const dispatch = useDispatch();
  const sidebarIsOpen = useSelector(getSidebarIsOpen);
  const chatSelectedIndex = useSelector(getChatSelectedIndex);
  const isLoading = useSelector(fetchChatsLoading);
  const chatsPageReceived = useSelector(fetchChatsPageReceived);
  
  const sidebarRef = useRef(null);
  const sidebarListRef = useRef(null);
  
  const isNativePlatform = Capacitor.isNativePlatform();
  
  useEffect(() => {

    function handleClickOutside(event) {
      if (!isNativePlatform) {
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
  }, []);

  useEffect(() => {
    if (!chatsPageReceived) {
      return;
    }

    sidebarListRef.current.scrollTop -= 5;
  }, [chatsPageReceived])

  useEffect(() => {
    sidebarListRef.current.addEventListener('scroll', handleScroll);

    return () => {
      sidebarListRef.current.removeEventListener('scroll', handleScroll);
    };
  }, [sidebarListRef, isLoading, handleScroll]);

  function handleScroll() {
    if (isLoading) {
      return;
    }

    if (sidebarListRef.current.scrollHeight - sidebarListRef.current.scrollTop === sidebarListRef.current.clientHeight) {
      crudEvents.onScrollBottom();
    }
  }

  function handleOnAddItem() {
    crudEvents.onCreate();
  }

  function handleOnClickItem(id, index) {
    crudEvents.onRead(id, index);
  }

  function handleOnEditItem(id, index, newTitle) {
    crudEvents.onUpdate(id, index, newTitle);
  }

  function handleOnDeleteItem(id, index) {
    crudEvents.onDelete(id, index);
  }

  function handleOnClearItems() {
    crudEvents.onClear();
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
    uiEvents?.onToggleTheme();
  }

  const sidebarItemsCrudEvents = {
    onRead: handleOnClickItem,
    onUpdate: handleOnEditItem,
    onDelete: handleOnDeleteItem
  }

  return (
    <div className="sidebar" data-sidebar-is-open={sidebarIsOpen} data-is-mobile={isNativePlatform} ref={sidebarRef}>
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
        <div className="sidebar-list" ref={sidebarListRef}>
          {items.map((item, index) => (
            <SidebarItem
              key={item.id}
              index={index}
              id={item.id}
              title={item.title}
              isSelected={index === chatSelectedIndex}
              crudEvents={sidebarItemsCrudEvents}
            />
          ))}
          {isLoading && (<Loading />)}
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

export default Sidebar;