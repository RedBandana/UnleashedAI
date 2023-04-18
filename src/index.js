import React from 'react';
import { createRoot } from 'react-dom/client';
import Chatbot from './components/Chatbot/Chatbot';
import '@fortawesome/fontawesome-free/css/all.css';
import './index.css'

const rootElement = document.getElementById('root');
createRoot(rootElement).render(
  <React.StrictMode>
    <Chatbot />
  </React.StrictMode>
);