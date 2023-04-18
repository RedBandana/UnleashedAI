import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import Chatbot from './components/Chatbot/Chatbot';
import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/Navbar/Navbar';
import '@fortawesome/fontawesome-free/css/all.css';
import './index.css'

const rootElement = document.getElementById('root');
createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  function handleToggleSidebar(event) {
    event.stopPropagation();
    setIsSidebarOpen(!isSidebarOpen);
  }

  function handleCloseSidebar() {
    setIsSidebarOpen(false);
  }

  return (
    <div className="app">
      <Navbar onToggleSidebar={handleToggleSidebar} sidebarIsOpen={isSidebarOpen} />
      <div className="main">
        <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />
        <Chatbot sidebarIsOpen={isSidebarOpen} onToggleSidebar={handleToggleSidebar} />
      </div>
    </div>
  );
}