import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Capacitor } from '@capacitor/core';

import Chat from '../../components/Chat/Chat';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import AlertDialog from '../../components/AlertDialog/AlertDialog';

import { USER_ID } from '../../utils/constants'
import '@fortawesome/fontawesome-free/css/all.css';
import '../../index.scss';

import { fetchChatsRequest } from '../../redux/actions/chatActions';
import { fetchMessagesRequest } from '../../redux/actions/messageActions';
import { fetchChatRequest } from '../../redux/actions/chatActions';
import { fetchChats } from '../../redux/selectors/chatSelectors';
import ChatEmpty from '../../components/Chat/ChatEmpty';
import { setSidebarIsOpen, setThemeIsLight, toggleSidebar, toggleTheme } from '../../redux/actions/uiActions';
import { getSidebarIsOpen, getThemeIsLight } from '../../redux/selectors/uiSelectors';

function Main() {
  const dispatch = useDispatch();
  dispatch(fetchChatsRequest(USER_ID));

  const chats = useSelector(fetchChats);
  const sidebarIsOpen = useSelector(getSidebarIsOpen);
  const themeIsLight = useSelector(getThemeIsLight);

  const touchStartX = useRef(0);
  const touchIsDragging = useRef(false);
  const [sidebarChanged, setSidebarChanged] = useState(false);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      dispatch(setSidebarIsOpen(true));
      document.body.classList.toggle("native-platform", false);
    }
  }, [sidebarIsOpen]);

  useEffect(() => {
    if (chats && chats.length.length > 0) {
      dispatch(fetchMessagesRequest({ userId: USER_ID, chatIndex: 0 }));
      dispatch(fetchChatRequest({ userId: USER_ID, chatIndex: 0 }));
    }
  }, [chats])

  useEffect(() => {
    const savedThemeIsLight = localStorage.getItem("themeIsLight");
    if (savedThemeIsLight === "true" && !themeIsLight) {
      dispatch(setThemeIsLight(false));
    }

    document.body.classList.toggle("theme-dark", !themeIsLight);
  }, [themeIsLight]);

  useEffect(() => {
    function handleStart(event) {
      touchIsDragging.current = true;
      touchStartX.current = event.touches[0].pageX;
      setSidebarChanged(false);
    }

    function handleMove(event) {
      if (touchIsDragging.current) {
        const distance = event.touches[0].pageX - touchStartX.current;

        if (distance > 50) {
          dispatch(setSidebarIsOpen(true));
          touchIsDragging.current = false;
          setSidebarChanged(true);
        }
        else if (distance < -50) {
          dispatch(setSidebarIsOpen(false));
          touchIsDragging.current = false;
          setSidebarChanged(true);
        }
      }
    }

    function handleEnd() {
      touchIsDragging.current = false;
    }

    document.addEventListener('touchstart', handleStart);
    document.addEventListener('touchmove', handleMove);
    document.addEventListener('touchend', handleEnd);

    return () => {
      document.removeEventListener('touchstart', handleStart);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [sidebarChanged]);

  return (
    <div className={`chat ${themeIsLight ? 'theme-light' : 'theme-dark'}`}>
      <Navbar />
      <div className="main">
        <AlertDialog text="Hello, Chat Unleashed AI is still in early stages. If you have any feedback, please contact us at contact@email.com" />
        <Sidebar />
        {chats.length == 0 ? (
          <ChatEmpty />
        ) : (
          <Chat />
        )}
      </div>
    </div>
  );
}

export default Main;