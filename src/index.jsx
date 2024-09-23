import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthContextProvider } from './context/authContext/AuthContext';
import { FavContextProvider } from './context/favContext/FavContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <FavContextProvider>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </FavContextProvider>

  </React.StrictMode>
);

