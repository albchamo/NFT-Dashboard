'use client';

import React, { ReactNode } from 'react';
import { AppBar, Toolbar, Typography, CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { GlobalStyles } from '@mui/system';

interface LayoutProps {
  children: ReactNode;
}

const theme = createTheme({
  palette: {
    background: {
      default: '#000000',  // Dark background
    },
    text: {
      primary: '#ffffff',  // White text
    },
  },
});

const globalStyles = {
  'html, body': {
    backgroundColor: '#000000',
    color: '#ffffff',
  },
  '::-webkit-scrollbar': {
    width: '8px',
    backgroundColor: '#000000',
  },
  '::-webkit-scrollbar-thumb': {
    backgroundColor: '#ffffff',
    borderRadius: '4px',
    border: '2px solid #000000',
  },
  '::-webkit-scrollbar-thumb:hover': {
    backgroundColor: '#cccccc',
  },
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={globalStyles} />
      <div style={{ padding: 0 }}> {/* Removed Container and set padding to 0 */}
        {children}
      </div>
    </ThemeProvider>
  );
};

export default Layout;

