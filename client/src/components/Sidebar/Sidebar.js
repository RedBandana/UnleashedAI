import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getChatSelectedIndex, getIsMobile, getSidebarIsOpen } from '../../redux/selectors/uiSelectors';
import { setSidebarIsOpen, setUserSettingsIsOpen } from '../../redux/actions/uiActions';

import SidebarItem from './SidebarItem';
import './Sidebar.scss';
import { fetchChatsLoading, fetchChatsPageReceived } from '../../redux/selectors/chatSelectors';
import Loading from '../Loading/Loading';
import { fetchUserValue } from '../../redux/selectors/userSelectors';
import { useNavigate } from 'react-router-dom';
import { removeSessionCookie } from '../../utils/functions';
import { clearChatsSuccess, deleteChatSuccess } from '../../redux/actions/chatActions';
import { logoutUserSuccess } from '../../redux/actions/userActions';

function Sidebar(props) {
  const { items, crudEvents, fileEvents, uiEvents } = props;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const sidebarIsOpen = useSelector(getSidebarIsOpen);
  const chatSelectedIndex = useSelector(getChatSelectedIndex);
  const isLoading = useSelector(fetchChatsLoading);
  const chatsPageReceived = useSelector(fetchChatsPageReceived);
  const user = useSelector(fetchUserValue);
  const isMobile = useSelector(getIsMobile);

  const sidebarRef = useRef(null);
  const sidebarListRef = useRef(null);

  const [displaySettings, setDisplaySettings] = useState(false);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [handleClickOutside]);

  function handleClickOutside(event) {
    const isOutsideSideBar = sidebarRef.current && !sidebarRef.current.contains(event.target);
    const canMoveSidebar = event.target.className.includes("sidebar-no-move") === false &&
      (event.target.parentElement == null || event.target.parentElement.className.includes("sidebar-no-move-parent") === false);
    const isNavBarToogle = event.target.parentElement?.className.includes("navbar-toggle");

    if (canMoveSidebar) {
      setDisplaySettings(false);
    }

    if (!isMobile) {
      return;
    }

    if (!isNavBarToogle && (isOutsideSideBar || canMoveSidebar)) {
      dispatch(setSidebarIsOpen(false));
    }
  }

  useEffect(() => {
    if (!chatsPageReceived) {
      return;
    }

    sidebarListRef.current.scrollTop -= 5;
  }, [chatsPageReceived])

  useEffect(() => {
    sidebarListRef.current?.addEventListener('scroll', handleScroll);

    return () => {
      sidebarListRef.current?.removeEventListener('scroll', handleScroll);
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

  function handleOnOpen(event) {
    fileEvents?.onRead(event.target.files[0])
  }

  function handleOnSave() {
    fileEvents?.onSave();
  }

  function handleOnSaveAs() {
    fileEvents?.onSaveAs();
  }

  function handleDisplaySettings() {
    setDisplaySettings(!displaySettings);
  }

  function handleOpenUserSettings() {
    setDisplaySettings(false);
    dispatch(setUserSettingsIsOpen(true));
  }

  function handleLogOut() {
    setDisplaySettings(false);
    removeSessionCookie();
    navigate('/login');
  }

  function handleOpenUpgradePlus() {

  }

  function getUserEmail() {
    let userEmail = user?.email;
    if (!userEmail) {
      userEmail = 'guest session';
    }

    return userEmail;
  }

  const sidebarItemsCrudEvents = {
    onRead: handleOnClickItem,
    onUpdate: handleOnEditItem,
    onDelete: handleOnDeleteItem
  }

  return (
    <div className="sidebar" data-sidebar-is-open={sidebarIsOpen} data-is-mobile={isMobile} ref={sidebarRef}>
      <div className="sidebar-body">
        <div className='sidebar-header sidebar-no-move-parent'>
          <div className="sidebar-header-row" onClick={handleOnAddItem}>
            <div className='sidebar-header-row-item'>+ new chat</div>
          </div>
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
        <div className='bordered-top'></div>
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
        {displaySettings && (
          <div className='sidebar-settings'>
            <div className='sidebar-settings-row' onClick={handleOpenUserSettings}>
              <div className='sidebar-settings-row-item'>
                settings
              </div>
              <div className='sidebar-settings-row-icon'>
                <div className="fas fa-cog"></div>
              </div>
            </div>
            <div className='sidebar-settings-row' onClick={handleLogOut}>
              <div className='sidebar-settings-row-item'>
                {user?.type == 0 ? 'leave' : 'log out'}
              </div>
              <div className='sidebar-settings-row-icon'>
                <div className="fas fa-sign-out-alt"></div>
              </div>
            </div>
          </div>
        )}
        <div className='bordered-top'></div>
        <div className="sidebar-footer">
          <div className='sidebar-footer-row sidebar-no-move-parent hide' onClick={handleOpenUpgradePlus}>
            <div className="sidebar-footer-row-item">upgrade to Plus</div>
            <div className='sidebar-footer-row-icon accent-color sidebar-no-move-parent' onClick={handleOpenUpgradePlus}>
              <div className="fas fa-rocket"></div>
            </div>
          </div>
          <div className='sidebar-footer-row sidebar-no-move-parent' onClick={handleDisplaySettings}>
            <div className="sidebar-footer-row-item">{getUserEmail()}</div>
            <div className='sidebar-footer-row-icon sidebar-no-move-parent'>
              <div className="fas fa-ellipsis-h"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;