import { StrictMode } from 'react';
import { AudioProvider } from './state/AudioContext';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AudioProvider>
        <App />
      </AudioProvider>
    </ThemeProvider>
  </StrictMode>,
);
