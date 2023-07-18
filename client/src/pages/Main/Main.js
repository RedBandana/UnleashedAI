import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Capacitor } from '@capacitor/core';

import Chat from '../../components/Chat/Chat';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import AlertDialog from '../../components/AlertDialog/AlertDialog';
import ChatEmpty from '../../components/Chat/ChatEmpty';

import { createChatRequest, deleteChatRequest, editChatRequest, fetchChatsRequest, fetchChatRequest, clearChatsRequest } from '../../redux/actions/chatActions';
import { clearMessagesSuccess, createMessageRequest, deleteMessageRequest, fetchChoiceRequest, fetchMessagesRequest } from '../../redux/actions/messageActions';
import { setChatSelectedIndex, setSidebarIsOpen, setThemeIsLight, toggleTheme } from '../../redux/actions/uiActions';
import { getChatSelectedIndex, getThemeIsLight } from '../../redux/selectors/uiSelectors';
import { createChatValue, deleteChatValue, fetchChatValue, fetchChatsValue } from '../../redux/selectors/chatSelectors';

import { USER_ID } from '../../utils/constants'
import '@fortawesome/fontawesome-free/css/all.css';
import '../../index.scss';
import { fetchMessagesValue } from '../../redux/selectors/messageSelectors';

function Main() {
  const dispatch = useDispatch();
  const chats = useSelector(fetchChatsValue);
  const chat = useSelector(fetchChatValue);
  const chatDeleted = useSelector(deleteChatValue);
  const chatCreated = useSelector(createChatValue);
  const messages = useSelector(fetchMessagesValue);
  
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
      dispatchDisplayInfo(chats[0].id, 0);
      setIsInitialize(true);
    }
  }, [chats]);

  useEffect(() => {
    if (chats.length > 0 && chatDeleted) {
      dispatchDisplayInfo(chats[0].id, 0);
    }
  }, [chatDeleted])

  useEffect(() => {
    if (chats.length > 0 && chatCreated) {
      const sidebarIndex = chats.length - 1;
      dispatchDisplayInfo(chats[sidebarIndex].id, sidebarIndex);
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

  function dispatchDisplayInfo(chatId, sidebarIndex) {
    dispatch(fetchChatRequest({ userId: USER_ID, chatId: chatId }));
    dispatch(fetchMessagesRequest({ userId: USER_ID, chatId: chatId }));
    dispatch(setChatSelectedIndex(sidebarIndex));
  }

  function handleOnToggleTheme() {
    dispatch(toggleTheme());
    localStorage.setItem("themeIsLight", themeIsLight);
  };

  function handleOnClickItem(chatId, sidebarIndex) {
    dispatchDisplayInfo(chatId, sidebarIndex);
  }

  function handleOnAddItem() {
    dispatch(createChatRequest({ userId: USER_ID }));
  }

  function handleOnEditItem(chatId, chatIndex, newTitle) {
    dispatch(editChatRequest({
      userId: USER_ID,
      chatId: chatId,
      chatIndex: chatIndex,
      chat: {
        title: newTitle
      }
    }));
  }

  function handleOnEditSettings(chatId, settings) {
    dispatch(editChatRequest({
      userId: USER_ID,
      chatId: chatId,
      chatIndex: chatSelectedIndex,
      chat: {
        settings: settings
      }
    }));
  }

  function handleOnDeleteItem(index, chatIndex) {
    dispatch(deleteChatRequest({
      userId: USER_ID,
      chatId: index,
      chatIndex: chatIndex,
    }));
    dispatch(clearMessagesSuccess);
  }

  function handleOnClearItems() {
    dispatch(clearChatsRequest({ userId: USER_ID }));
    dispatch(clearMessagesSuccess);
  }

  function handleOnSendMessage(chatId, message) {
    dispatch(createMessageRequest({
      userId: USER_ID,
      chatId: chatId,
      message: message
    }));
  }

  function handleOnDeleteMessage(chatId, messageId) {
    dispatch(deleteMessageRequest({
      userId: USER_ID,
      chatId: chatId,
      messageId: messageId
    }));
  }

  function handleOnSelectChoice(chatId, messageId, choiceIndex) {
    dispatch(fetchChoiceRequest({
      userId: USER_ID,
      chatId: chatId,
      messageId: messageId,
      choiceIndex: choiceIndex
    }));
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
    onSelectChoice: handleOnSelectChoice,
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
        {messages && chat?.id ? (
          <Chat
            id={chat.id}
            messages={messages}
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