import React, { useState, useEffect, useRef } from 'react';
import Chatbot from '../../components/Chatbot/Chatbot';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import { saveJSONToFile, readJSONFromUserInput } from '../../utils/FileStream';
import '@fortawesome/fontawesome-free/css/all.css';
import '../../index.scss';
import { Capacitor } from '@capacitor/core';
import AlertDialog from '../../components/AlertDialog/AlertDialog';

function Chat() {
  const [selectedConversationIndex, setSelectedConversationIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [isLightMode, setIsLightMode] = useState(true);
  const [conversationUpdate, setConversationUpdate] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("isLightMode");
    if (savedTheme !== null) {
      const savedThemeIsLightMode = savedTheme === "true";
      if (savedThemeIsLightMode !== isLightMode) {
        setIsLightMode(savedThemeIsLightMode);
      }
    }

    document.body.classList.toggle("theme-dark", !isLightMode);
    document.body.classList.toggle("native-platform", Capacitor.isNativePlatform());
  }, [isLightMode]);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      setIsSidebarOpen(true);
      setIsInitialized(true);
    }
  }, [isInitialized]);

  const toggleTheme = () => {
    const updatedIsLightMode = !isLightMode;
    setIsLightMode(updatedIsLightMode);
    localStorage.setItem("isLightMode", updatedIsLightMode);
  };

  const handleRead = async (fileInput) => {
    try {
      const conversations = await readJSONFromUserInput(fileInput);
      setConversations(conversations);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async () => {
    try {
      await saveJSONToFile(conversations, 'chat.gptu');
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveAs = handleSave;

  const handleClick = (conversationIndex) => {
    setSelectedConversationIndex(conversationIndex);
    setConversationUpdate(!conversationUpdate);
  };

  const handleAdd = () => {
    setConversations([
      ...conversations,
      {
        title: `Chat ${conversations.length}`,
        messages: [],
        settings: {
          model: 'gpt-3.5-turbo',
          system: 'You are a helpful assistant.',
          temperature: 0.7,
          memory: 10,
          topP: 1,
          quantity: 1,
          stream: false,
          stop: '',
          maxTokens: 0,
          presencePenalty: 0,
          frequencyPenalty: 0,
          user: '',
          devOptions: false,
        },
      },
    ]);
  };

  const handleEdit = (conversationIndex, newTitle) => {
    const updatedConversations = [...conversations];
    updatedConversations[conversationIndex].title = newTitle;
    setConversations(updatedConversations);
  };

  const handleDelete = (conversationIndex) => {
    setConversations(conversations.filter((_, index) => index !== conversationIndex));
  };

  const handleClear = () => {
    setConversations([]);
  };

  const touchStartX = useRef(0);
  const touchIsDragging = useRef(false);
  const [sidebarChanged, setSidebarChanged] = useState(false);

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
          setIsSidebarOpen(true);
          touchIsDragging.current = false;
          setSidebarChanged(true);
        } else if (distance < -50) {
          setIsSidebarOpen(false);
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

  const handleToggleSidebar = (event) => {
    event.stopPropagation();
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCloseSidebar = () => {
    if (!sidebarChanged) {
      setIsSidebarOpen(false);
    }
  };

  const getSidebarItems = () => {
    return conversations.map((convo, index) => ({
      title: convo.title,
      index: index,
    }));
  };

  const selectedConversation =
    selectedConversationIndex < conversations.length
      ? conversations[selectedConversationIndex]
      : conversations[conversations.length - 1];

  const noConversations = conversations.length === 0;
  const isMobile = Capacitor.isNativePlatform();

  return (
    <div className={`Chat ${isLightMode ? 'theme-light' : 'theme-dark'}`}>
      <Navbar
        onToggleSidebar={handleToggleSidebar}
        sidebarIsOpen={isSidebarOpen}
        conversationTitle={selectedConversation?.title ?? ''}
      />
      <div className="main">
        <AlertDialog text="Hello, Chat Unleashed AI is still in early stages. If you have any feedback, please contact us at contact@email.com" />
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={handleCloseSidebar}
          sidebarItems={getSidebarItems()}
          onClickItem={handleClick}
          onEditItem={handleEdit}
          onDeleteItem={handleDelete}
          onAddItem={handleAdd}
          onClearItems={handleClear}
          onSave={handleSave}
          onSaveAs={handleSaveAs}
          onRead={handleRead}
          onToggleTheme={toggleTheme}
        />
        {noConversations ? (
          <div
            data-sidebar-is-open={isSidebarOpen}
            data-is-mobile={isMobile}
            className="no-conversation-container"
          >
            <div className="no-conversation-options">
              <div className="no-conversation-options-child no-conversation-open">
                <label>
                  <input className="hide" type="file" onChange={handleRead} />
                  Open conversations <div className="fas fa-folder-open"></div>
                </label>
              </div>
              <div onClick={handleAdd} className="no-conversation-options-child no-conversation-new">
                New chat +
              </div>
            </div>
          </div>
        ) : (
          <Chatbot
            conversation={selectedConversation}
            sidebarIsOpen={isSidebarOpen}
            onToggleSidebar={handleToggleSidebar}
            conversationUpdate={conversationUpdate}
          />
        )}
      </div>
    </div>
  );
}

export default Chat;