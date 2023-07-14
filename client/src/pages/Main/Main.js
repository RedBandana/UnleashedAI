import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Capacitor } from '@capacitor/core';

import Chat from '../../components/Chat/Chat';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import AlertDialog from '../../components/AlertDialog/AlertDialog';
import ChatEmpty from '../../components/Chat/ChatEmpty';

import { createChatRequest, deleteChatRequest, editChatRequest, fetchChatsRequest, fetchChatRequest } from '../../redux/actions/chatActions';
import { fetchMessagesRequest } from '../../redux/actions/messageActions';
import { setSidebarIsOpen, setThemeIsLight, toggleTheme } from '../../redux/actions/uiActions';
import { getThemeIsLight } from '../../redux/selectors/uiSelectors';
import { fetchChats } from '../../redux/selectors/chatSelectors';

import { USER_ID } from '../../utils/constants'
import '@fortawesome/fontawesome-free/css/all.css';
import '../../index.scss';

function Main() {
  const dispatch = useDispatch();
  const chats = useSelector(fetchChats);
  const themeIsLight = useSelector(getThemeIsLight);

  const touchStartX = useRef(0);
  const touchIsDragging = useRef(false);
  const [sidebarChanged, setSidebarChanged] = useState(false);

  const sidebarCrudEvents = {
    read: handleOnClickItem,
    create: handleOnAddItem,
    update: handleOnEditItem,
    delete: handleOnDeleteItem,
    clear: handleOnClearItems,
  };

  const sidebarUiEvents = {
    toggleTheme: handleOnToggleTheme
  };

  useEffect(() => {
    console.log(`fetchChatsRequest`);
    dispatch(fetchChatsRequest(USER_ID));

    if (!Capacitor.isNativePlatform()) {
      dispatch(setSidebarIsOpen(true));
      document.body.classList.toggle("native-platform", false);
    }
  }, [dispatch]);

  useEffect(() => {
    console.log(`fetchMessagesRequest`);
    if (chats && chats.length > 0) {
      dispatch(fetchMessagesRequest({ userId: USER_ID, chatIndex: 0 }));
      dispatch(fetchChatRequest({ userId: USER_ID, chatIndex: 0 }));
    }
  }, [dispatch, chats]);

  useEffect(() => {
    console.log(`setThemeIsLight`);
    const savedThemeIsLight = localStorage.getItem("themeIsLight");
    if (savedThemeIsLight === "true" && !themeIsLight) {
      dispatch(setThemeIsLight(false));
    }

    document.body.classList.toggle("theme-dark", !themeIsLight);
  }, [dispatch, themeIsLight]);

  useEffect(() => {
    console.log(`setSidebarChanged`);

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
  }, [dispatch, sidebarChanged]);

  function handleOnToggleTheme() {
    dispatch(toggleTheme());
    localStorage.setItem("themeIsLight", themeIsLight);
  };

  function handleOnClickItem(index) {
    dispatch(fetchChatRequest({ userId: USER_ID, chatIndex: index }));
  }

  function handleOnAddItem() {
    dispatch(createChatRequest({ userId: USER_ID, chat: {} }));
  }

  function handleOnEditItem(index, newTitle) {
    dispatch(editChatRequest({
      userId: USER_ID,
      chatIndex: index,
      chat: {
        title: newTitle
      }
    }));
  }

  function handleOnDeleteItem(index) {
    dispatch(deleteChatRequest({ userId: USER_ID, chatIndex: index }));
  }

  function handleOnClearItems() {
    dispatch(deleteChatRequest({ userId: USER_ID }))
  }

  return (
    <div className={`chat ${themeIsLight ? 'theme-light' : 'theme-dark'}`}>
      <Navbar />
      <div className="main">
        <AlertDialog
          text="Hello, Chat Unleashed AI is still in early stages. If you have any feedback, please contact us at contact@email.com"
        />
        <Sidebar
          items={chats}
          crudEvents={sidebarCrudEvents}
          uiEvents={sidebarUiEvents}
        />
        {chats && chats.length > 0 ? (
          <Chat />
        ) : (
          <ChatEmpty />
        )}
      </div>
    </div>
  );
}

export default Main;