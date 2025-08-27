import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack';
import { OverlayProvider } from 'overlay-kit';
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.tsx';

const theme = createTheme();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        <OverlayProvider>
          <App />
        </OverlayProvider>
      </SnackbarProvider>
    </ThemeProvider>
  </React.StrictMode>
);
