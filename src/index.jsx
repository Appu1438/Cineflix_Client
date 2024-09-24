import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthContextProvider } from './context/authContext/AuthContext';
import { FavContextProvider } from './context/favContext/FavContext';
import { HistoryContextProvider } from './context/historyContext/HistoryContext';
import { WatchLaterContextProvider } from './context/watchLaterContext/WatchLaterContext';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <WatchLaterContextProvider>
      <HistoryContextProvider>
        <FavContextProvider>
          <AuthContextProvider>
            <App />
          </AuthContextProvider>
        </FavContextProvider>
      </HistoryContextProvider>
    </WatchLaterContextProvider>

  </React.StrictMode>
);

