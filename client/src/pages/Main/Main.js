import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Capacitor } from '@capacitor/core';

import Chat from '../../components/Chat/Chat';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import AlertDialog from '../../components/AlertDialog/AlertDialog';
import ChatEmpty from '../../components/Chat/ChatEmpty';

import { createChatRequest, deleteChatRequest, editChatRequest, fetchChatsRequest, fetchChatRequest, clearChatsRequest } from '../../redux/actions/chatActions';
import { createMessageRequest, deleteMessageRequest, fetchMessagesRequest } from '../../redux/actions/messageActions';
import { setChatSelectedIndex, setSidebarIsOpen, setThemeIsLight, toggleTheme } from '../../redux/actions/uiActions';
import { getChatSelectedIndex, getThemeIsLight } from '../../redux/selectors/uiSelectors';
import { createChatValue, deleteChatValue, fetchChatValue, fetchChatsValue } from '../../redux/selectors/chatSelectors';

import { USER_ID } from '../../utils/constants'
import '@fortawesome/fontawesome-free/css/all.css';
import '../../index.scss';

function Main() {
  const dispatch = useDispatch();
  const chats = useSelector(fetchChatsValue);
  const chat = useSelector(fetchChatValue);
  const chatDeleted = useSelector(deleteChatValue);
  const chatCreated = useSelector(createChatValue);

  const chatSelectedIndex = useSelector(getChatSelectedIndex);
  const themeIsLight = useSelector(getThemeIsLight);

  const touchStartX = useRef(0);
  const touchIsDragging = useRef(false);
  const [sidebarChanged, setSidebarChanged] = useState(false);
  const [isInitialized, setIsInitialize] = useState(false);

  useEffect(() => {
    dispatch(fetchChatsRequest({ userId: USER_ID }));

    if (!Capacitor.isNativePlatform()) {
      dispatch(setSidebarIsOpen(true));
      document.body.classList.toggle("native-platform", false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isInitialized && chats?.length > 0) {
      dispatch(fetchMessagesRequest({ userId: USER_ID, chatIndex: 0 }));
      dispatch(fetchChatRequest({ userId: USER_ID, chatIndex: 0 }));
      setIsInitialize(true);
    }
  }, [chats]);

  useEffect(() => {
    if (chats.length > 0 && chatDeleted) {
      dispatch(fetchChatRequest({ userId: USER_ID, chatIndex: 0 }));
      dispatch(setChatSelectedIndex(0));
    }
  }, [chatDeleted])

  useEffect(() => {
    if (chats.length > 0 && chatCreated) {
      const chatIndex = chats.length - 1;
      dispatch(fetchChatRequest({ userId: USER_ID, chatIndex: chatIndex }));
      dispatch(setChatSelectedIndex(chatIndex));
    }
  }, [chatCreated])

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

  function handleOnToggleTheme() {
    dispatch(toggleTheme());
    localStorage.setItem("themeIsLight", themeIsLight);
  };

  function handleOnClickItem(chatIndex) {
    dispatch(fetchChatRequest({ userId: USER_ID, chatIndex: chatIndex }));
  }

  function handleOnAddItem() {
    dispatch(createChatRequest({ userId: USER_ID }));
  }

  function handleOnEditItem(chatIndex, newTitle) {
    dispatch(editChatRequest({
      userId: USER_ID,
      chatIndex: chatIndex,
      chat: {
        title: newTitle
      }
    }));
  }

  function handleOnDeleteItem(index) {
    dispatch(deleteChatRequest({ userId: USER_ID, chatIndex: index }));
  }

  function handleOnClearItems() {
    dispatch(clearChatsRequest({ userId: USER_ID }))
  }

  function handleOnEditSettings(chatIndex, settings) {
    dispatch(editChatRequest({
      userId: USER_ID,
      chatIndex: chatIndex,
      chat: {
        settings: settings
      }
    }));
  }

  function handleOnSendMessage(chatIndex, message) {
    dispatch(createMessageRequest({
      userId: USER_ID,
      chatIndex: chatIndex,
      message: message
    }))
  }

  function handleOnDeleteMessage(chatIndex, messageIndex) {
    dispatch(deleteMessageRequest({
      userId: USER_ID,
      chatIndex: chatIndex,
      messageIndex: messageIndex
    }))
  }

  const sidebarCrudEvents = {
    onCreate: handleOnAddItem,
    onRead: handleOnClickItem,
    onUpdate: handleOnEditItem,
    onDelete: handleOnDeleteItem,
    onClear: handleOnClearItems,
  };

  const sidebarUiEvents = {
    onToggleTheme: handleOnToggleTheme
  };

  const chatCrudEvents = {
    onSettingsUpdate: handleOnEditSettings,
    onCreate: handleOnSendMessage,
    onDelete: handleOnDeleteMessage,
  }

  return (
    <div className={`chat ${themeIsLight ? 'theme-light' : 'theme-dark'}`}>
      <Navbar />
      <div className="main">
        <AlertDialog
          text="Hello, Chat Unleashed AI is still in early stages. If you have any feedback, please contact us at contact@email.com"
        />
        {
          chats && (
            <Sidebar
              items={chats}
              crudEvents={sidebarCrudEvents}
              uiEvents={sidebarUiEvents}
            />
          )
        }
        {chat && chats.length > 0 ? (
          <Chat
            index={chatSelectedIndex}
            messages={chat.messages}
            crudEvents={chatCrudEvents}
          />
        ) : (
          <ChatEmpty onAdd={handleOnAddItem} />
        )}
      </div>
    </div>
  );
}

export default Main;