import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ThemeProvider } from './ThemeContext'; // Assuming this exists
import { Web3Provider } from './Web3Context';     // Assuming this exists
import { WatchlistProvider } from './context/WatchlistContext'; // Import the new provider
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <Web3Provider>
        <WatchlistProvider>
          <App />
        </WatchlistProvider>
      </Web3Provider>
    </ThemeProvider>
  </StrictMode>
);
