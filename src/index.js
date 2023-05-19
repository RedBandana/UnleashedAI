import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '@fortawesome/fontawesome-free/css/all.css';
import './index.scss'

const rootElement = document.getElementById('root');
createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);