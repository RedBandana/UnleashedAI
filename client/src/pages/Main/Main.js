import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Capacitor } from '@capacitor/core';
import { Helmet } from "react-helmet";

import Chat from '../../components/Chat/Chat';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import AlertDialog from '../../components/AlertDialog/AlertDialog';
import ChatEmpty from '../../components/Chat/ChatEmpty';

import { createChatRequest, deleteChatRequest, editChatRequest, fetchChatsRequest, fetchChatRequest, clearChatsRequest, fetchChatsPageRequest } from '../../redux/actions/chatActions';
import { clearMessagesSuccess, createMessageRequest, deleteMessageRequest, fetchChoiceRequest, fetchMessagesPageRequest, fetchMessagesRequest } from '../../redux/actions/messageActions';
import { setChatSelectedIndex, setIsMobile, setSidebarIsOpen, setThemeIsLight, toggleTheme } from '../../redux/actions/uiActions';
import { getChatSelectedIndex, getThemeIsLight } from '../../redux/selectors/uiSelectors';
import { createChatValue, deleteChatValue, fetchChatValue, fetchChatsValue } from '../../redux/selectors/chatSelectors';

import { COUNT_CHATS, COUNT_MESSAGES, MOBILE_DEVICE_PATTERNS } from '../../utils/constants'
import '@fortawesome/fontawesome-free/css/all.css';
import '../../index.scss';
import { fetchMessagesValue } from '../../redux/selectors/messageSelectors';
import { fetchUserRequest } from '../../redux/actions/userActions';
import UserSettings from '../../components/Settings/UserSettings';

function Main() {
  const dispatch = useDispatch();
  const chats = useSelector(fetchChatsValue);
  const chat = useSelector(fetchChatValue);
  const chatDeleted = useSelector(deleteChatValue);
  const chatCreated = useSelector(createChatValue);
  const messages = useSelector(fetchMessagesValue);

  const chatSelectedIndex = useSelector(getChatSelectedIndex);
  const themeIsLight = useSelector(getThemeIsLight);

  const [showAlertDialog, setShowAlertDialog] = useState(true);
  const [isInitialized, setIsInitialize] = useState(false);
  const [themeIsInitialized, setThemeIsInitialized] = useState(false);
  const [chatsPage, setChatsPage] = useState(1);
  const [messagesPage, setMessagesPage] = useState(1);

  useEffect(() => {
    const isMobile = Capacitor.isNativePlatform() || MOBILE_DEVICE_PATTERNS.test(navigator.userAgent);
    dispatch(setIsMobile(isMobile));
    dispatch(fetchChatsRequest({ page: 1, count: COUNT_CHATS }));

    if (!isMobile) {
      dispatch(setSidebarIsOpen(true));
      document.body.classList.toggle("native-platform", false);
    }

    const savedThemeIsLight = localStorage.getItem("themeIsLight");
    if (savedThemeIsLight === null) {
      dispatch(setThemeIsLight(true));
      localStorage.setItem("themeIsLight", themeIsLight);
    }
    else {
      dispatch(setThemeIsLight(savedThemeIsLight === "true"));
    }

    setThemeIsInitialized(true);
    dispatch(fetchUserRequest());
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
      dispatchDisplayInfo(chats[0].id, 0);
    }
  }, [chatCreated])

  useEffect(() => {
    if (themeIsLight) {
      document.body.classList.remove("theme-dark");
    }
    else {
      document.body.classList.add("theme-dark");
    }

    if (themeIsInitialized) {
      localStorage.setItem("themeIsLight", themeIsLight);
    }
  }, [themeIsLight]);

  function dispatchDisplayInfo(chatId, sidebarIndex) {
    dispatch(fetchChatRequest({ chatId: chatId }));
    dispatch(fetchMessagesRequest({ chatId: chatId, page: 1, count: COUNT_MESSAGES }));
    dispatch(setChatSelectedIndex(sidebarIndex));
    setMessagesPage(1);
  }

  function handleOnToggleTheme() {
    dispatch(toggleTheme());
  };

  function handleOnClickItem(chatId, sidebarIndex) {
    dispatchDisplayInfo(chatId, sidebarIndex);
  }

  function handleOnAddItem() {
    dispatch(createChatRequest());
  }

  function handleOnEditItem(chatId, chatIndex, newTitle) {
    dispatch(editChatRequest({
      chatId: chatId,
      chatIndex: chatIndex,
      chat: {
        title: newTitle
      }
    }));
  }

  function handleOnEditSettings(chatId, settings) {
    dispatch(editChatRequest({
      chatId: chatId,
      chatIndex: chatSelectedIndex,
      chat: {
        settings: settings
      }
    }));
  }

  function handleOnDeleteItem(chatId, chatIndex) {
    dispatch(deleteChatRequest({
      chatId: chatId,
      chatIndex: chatIndex,
    }));
    dispatch(clearMessagesSuccess());
  }

  function handleOnClearItems() {
    dispatch(clearChatsRequest());
    dispatch(clearMessagesSuccess());
  }

  function handleOnSendMessage(chatId, message) {
    dispatch(createMessageRequest({
      chatId: chatId,
      message: message
    }));
  }

  function handleOnDeleteMessage(chatId, messageId) {
    dispatch(deleteMessageRequest({
      chatId: chatId,
      messageId: messageId
    }));
  }

  function handleOnSelectChoice(chatId, messageId, choiceIndex) {
    dispatch(fetchChoiceRequest({
      chatId: chatId,
      messageId: messageId,
      choiceIndex: choiceIndex
    }));
  }

  function handleOnScrollTopMessages(chatId) {
    const maxPage = Math.ceil(chat.messageCount / COUNT_MESSAGES);
    const nextPage = messagesPage + 1;
    if (nextPage > maxPage) {
      return;
    }

    setMessagesPage(nextPage);
    dispatch(fetchMessagesPageRequest({ chatId: chatId, page: nextPage, count: COUNT_MESSAGES }));
  }

  function handleOnScrollBottomChats() {
    const user = { chatCount: COUNT_MESSAGES * 2 };
    const maxPage = Math.ceil(user.chatCount / COUNT_MESSAGES);
    const nextPage = chatsPage + 1;
    if (nextPage > maxPage) {
      return;
    }

    setChatsPage(nextPage);
    dispatch(fetchChatsPageRequest({ page: nextPage, count: COUNT_CHATS }));
  }

  function handleCloseAlertDialog() {
    setShowAlertDialog(false);
  }

  const sidebarCrudEvents = {
    onCreate: handleOnAddItem,
    onRead: handleOnClickItem,
    onUpdate: handleOnEditItem,
    onDelete: handleOnDeleteItem,
    onClear: handleOnClearItems,
    onScrollBottom: handleOnScrollBottomChats,
  };

  const sidebarUiEvents = {
    onToggleTheme: handleOnToggleTheme
  };

  const chatCrudEvents = {
    onSettingsUpdate: handleOnEditSettings,
    onCreate: handleOnSendMessage,
    onDelete: handleOnDeleteMessage,
    onScrollTop: handleOnScrollTopMessages,
    onSelectChoice: handleOnSelectChoice,
  }

  return (
    <div className={`chat ${themeIsLight ? 'theme-light' : 'theme-dark'}`}>
      <Helmet>
        <title>Unleashed AI Chat</title>
        <meta name="description" content="Experience the limitless possibilities of ChatGPT and discover the true potential behind personalized queries with Unleashed AI." />
        <meta name="keywords" content="unleashed,ai,chat,chatbot" />
      </Helmet>
      <Navbar />
      <div className="main">
        {
          showAlertDialog && (
            <AlertDialog
              title="Unleashed AI"
              text="Hello, Unleashed AI is presently in its initial phase. Expect further enhancements and updates soon."
              onOk={handleCloseAlertDialog} onClose={handleCloseAlertDialog}
            />
          )
        }
        <UserSettings />
        {
          chats && (
            <Sidebar
              items={chats}
              crudEvents={sidebarCrudEvents}
              uiEvents={sidebarUiEvents}
            />
          )
        }
        {messages != null && chat?.id != null ? (
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