import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import Chatbot from './components/Chatbot/Chatbot';
import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/Navbar/Navbar';
import { saveJSONToFile, readJSONFromUserInput } from './utils/FileStream'
import '@fortawesome/fontawesome-free/css/all.css';
import './index.scss'

const rootElement = document.getElementById('root');
createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

function App() {
  const [selectedConversationIndex, setSelectedConversationIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState([]);

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
          system: '',
          temperature: 0.7,
          topP: 1,
          quantity: 1,
          stream: false,
          stop: '',
          maxTokens: 0,
          presencePenalty: 0,
          frequencyPenalty: 0,
          user: ''
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
    <div className="app">
      <Navbar onToggleSidebar={handleToggleSidebar} sidebarIsOpen={isSidebarOpen} />
      <div className="main">
        <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} sidebarItems={getSidebarItem()}
          onClickItem={(index) => handleClick(index)} onEditItem={(index, newTitle) => handleEdit(index, newTitle)}
          onDeleteItem={(index) => handleDelete(index)} onAddItem={handleAdd} onClearItems={handleClear}
          onSave={handleSave} onSaveAs={handleSaveAs} onRead={handleRead} />
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
              No conversation to display
              <div className='no-conversation-open'>
                <label>
                  <input className='hide' type="file" onChange={handleRead} />
                  Open a conversation <div className="fas fa-folder-open"></div>
                </label>
              </div>
            </div>
          )}

      </div>
    </div>
  );
}