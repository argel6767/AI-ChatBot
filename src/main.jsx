import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { dark } from "@clerk/themes";
import { ClerkProvider } from '@clerk/clerk-react';
import './utils/chartjs-setup.js';  // Ensure this is imported before using charts

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider appearance={{
      baseTheme: dark
    }} publishableKey = {PUBLISHABLE_KEY}>
      <App />
      </ClerkProvider>
  </React.StrictMode>,
)
