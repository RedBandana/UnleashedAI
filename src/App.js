import React, { useState, useEffect, useRef } from 'react';
import Chatbot from './components/Chatbot/Chatbot';
import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/Navbar/Navbar';
import { saveJSONToFile, readJSONFromUserInput } from './utils/FileStream'
import '@fortawesome/fontawesome-free/css/all.css';
import './index.scss'

function App() {
  const [selectedConversationIndex, setSelectedConversationIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [isLightMode, setIsLightMode] = useState(true);
  const [conversationUpdate, setConversationUpdate] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("isLightMode");
    if (savedTheme != null) {
      const savedThemeIsLightMode = savedTheme === "true";
      if (savedThemeIsLightMode !== isLightMode) {
        setIsLightMode(savedThemeIsLightMode);
      }
    }

    if (isLightMode === false) {
      document.body.classList.add("theme-dark");
    }
    else {
      document.body.classList.remove("theme-dark");
    }
  }, [isLightMode])

  function toggleTheme() {
    const updatedIsLightMode = !isLightMode;
    setIsLightMode(updatedIsLightMode);
    localStorage.setItem("isLightMode", updatedIsLightMode);
  }

  function handleOnRead(event) {
    handleRead(event.target.files[0])
  }

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
    }
    catch (error) {
      console.log(error);
    }
  };

  const handleSaveAs = async () => {
    try {
      await saveJSONToFile(conversations, 'chat.gptu');
    }
    catch (error) {
      console.log(error);
    }
  };

  const handleClick = (conversationIndex) => {
    setSelectedConversationIndex(conversationIndex);
    setConversationUpdate(!conversationIndex);
  };

  const handleAdd = () => {
    setConversations([
      ...conversations, {
        title: `Chat ${conversations.length}`,
        messages: [],
        settings: {
          model: 'gpt-3.5-turbo',
          system: 'You are a helpful assistant.',
          temperature: 0.7,
          topP: 1,
          quantity: 1,
          stream: false,
          stop: '',
          maxTokens: 0,
          presencePenalty: 0,
          frequencyPenalty: 0,
          user: '',
          devOptions: false
        }
      },
    ]);
  }

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
        if (distance > 50) { // Open sidebar when dragging over 50 pixels to the right
          setIsSidebarOpen(true);
          touchIsDragging.current = false;
          setSidebarChanged(true);
        }
        else if (distance < -50) {
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

  function handleToggleSidebar(event) {
    event.stopPropagation();
    setIsSidebarOpen(!isSidebarOpen);
  }

  function handleCloseSidebar() {
    if (sidebarChanged === false) {
      setIsSidebarOpen(false);
    }
  }

  function getSidebarItem() {
    const sidebarItems = conversations.map((convo, index) => ({
      title: convo.title,
      index: index,
    }));

    return sidebarItems;
  }

  return (
    <div className={`app ${isLightMode ? 'theme-light' : 'theme-dark'}`}>
      <Navbar onToggleSidebar={handleToggleSidebar} sidebarIsOpen={isSidebarOpen} conversationTitle={conversations[selectedConversationIndex]?.title ?? ''} />
      <div className="main">
        <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} sidebarItems={getSidebarItem()}
          onClickItem={(index) => handleClick(index)} onEditItem={(index, newTitle) => handleEdit(index, newTitle)}
          onDeleteItem={(index) => handleDelete(index)} onAddItem={handleAdd} onClearItems={handleClear}
          onSave={handleSave} onSaveAs={handleSaveAs} onRead={handleRead} onToggleTheme={toggleTheme} />
        {conversations.length > 0 ?
          (selectedConversationIndex < conversations.length ?
            (
              <Chatbot
                conversation={conversations[selectedConversationIndex]}
                sidebarIsOpen={isSidebarOpen}
                onToggleSidebar={handleToggleSidebar}
                conversationUpdate={conversationUpdate} />
            ) :
            (
              <Chatbot
                conversation={conversations[conversations.length - 1]}
                sidebarIsOpen={isSidebarOpen}
                onToggleSidebar={handleToggleSidebar}
                conversationUpdate={conversationUpdate} />
            )
          ) :
          (
            <div data-sidebar-is-open={isSidebarOpen} data-is-mobile={process.env.REACT_APP_CLIENT_TYPE === 'mobile'} className='no-conversation-container'>
              <div className='no-conversation-options'>
                <div className='no-conversation-options-child no-conversation-open'>
                  <label>
                    <input className='hide' type="file" onChange={handleOnRead} />
                    Open conversations <div className="fas fa-folder-open"></div>
                  </label>
                </div>
                <div onClick={handleAdd} className='no-conversation-options-child no-conversation-new'>New chat +</div>
              </div>
            </div>
          )}

      </div>
    </div>
  );
}

export default App;