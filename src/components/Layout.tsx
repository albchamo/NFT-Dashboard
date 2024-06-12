'use client';

import React, { ReactNode } from 'react';
import { AppBar, Container, Toolbar, Typography, CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

interface LayoutProps {
  children: ReactNode;
}

const theme = createTheme();

const Layout = ({ children }: LayoutProps) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        {children}
      </Container>
    </ThemeProvider>
  );
};

export default Layout;
