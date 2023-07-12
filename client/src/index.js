import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import store from './store/configureStore';

const rootElement = document.getElementById('root');
createRoot(rootElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);