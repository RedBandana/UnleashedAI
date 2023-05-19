import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (isLightMode === false) {
      document.body.classList.add("theme-dark");
    }
    else {
      document.body.classList.remove("theme-dark");
    }
  }, [isLightMode])

  function toggleTheme() {
    setIsLightMode(!isLightMode);
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
  };

  const handleAdd = () => {
    setConversations([
      ...conversations, {
        title: 'New Conversation',
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

  function handleToggleSidebar(event) {
    event.stopPropagation();
    setIsSidebarOpen(!isSidebarOpen);
  }

  function handleCloseSidebar() {
    setIsSidebarOpen(false);
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
      <Navbar onToggleSidebar={handleToggleSidebar} sidebarIsOpen={isSidebarOpen} />
      <div className="main">
        <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} sidebarItems={getSidebarItem()}
          onClickItem={(index) => handleClick(index)} onEditItem={(index, newTitle) => handleEdit(index, newTitle)}
          onDeleteItem={(index) => handleDelete(index)} onAddItem={handleAdd} onClearItems={handleClear}
          onSave={handleSave} onSaveAs={handleSaveAs} onRead={handleRead} onToggleTheme={toggleTheme} />
        {conversations.length > 0 ?
          (selectedConversationIndex < conversations.length ?
            (
              <Chatbot conversation={conversations[selectedConversationIndex]} sidebarIsOpen={isSidebarOpen} onToggleSidebar={handleToggleSidebar} />
            ) :
            (
              <Chatbot conversation={conversations[conversations.length - 1]} sidebarIsOpen={isSidebarOpen} onToggleSidebar={handleToggleSidebar} />
            )
          ) :
          (
            <div data-is-open={isSidebarOpen} className='no-conversation-container'>
              <div className='no-conversation-options'>
                <div className='no-conversation-options-child no-conversation-open'>
                  <label>
                    <input className='hide' type="file" onChange={handleOnRead} />
                    Open a conversation <div className="fas fa-folder-open"></div>
                  </label>
                </div>
                <div onClick={handleAdd} className='no-conversation-options-child no-conversation-new'>New conversation</div>
              </div>
            </div>
          )}

      </div>
    </div>
  );
}

export default App;