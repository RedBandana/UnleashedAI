import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import Chatbot from './components/Chatbot/Chatbot';
import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/Navbar/Navbar';
import '@fortawesome/fontawesome-free/css/all.css';
import './index.scss'

const rootElement = document.getElementById('root');
createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState([
    {
      title: 'Programmer Expert',
      model: 'gpt-3.5-turbo',
      system: 'You are a professional programmer.',
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
  ]);

  const handleClick = (conversationToDelete) => {
  };

  const handleDelete = (conversationToDeleteTitle) => {
    setConversations(conversations.filter(conversation => conversation.title !== conversationToDeleteTitle));
  };

  const handleEdit = (messageToDelete) => {
  };

  function handleToggleSidebar(event) {
    event.stopPropagation();
    setIsSidebarOpen(!isSidebarOpen);
  }

  function handleCloseSidebar() {
    setIsSidebarOpen(false);
  }

  function getSidebarItem() {
    let sidebarItems = [];
    conversations.forEach(convo => {
      sidebarItems.push({"title": convo.title});
    });

    return sidebarItems;
  }

  return (
    <div className="app">
      <Navbar onToggleSidebar={handleToggleSidebar} sidebarIsOpen={isSidebarOpen} />
      <div className="main">
        <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} sidebarItems={getSidebarItem()}
          onClickItem={handleClick} onEditItem={handleEdit} onDeleteItem={handleDelete} />
        <Chatbot sidebarIsOpen={isSidebarOpen} onToggleSidebar={handleToggleSidebar} />
      </div>
    </div>
  );
}