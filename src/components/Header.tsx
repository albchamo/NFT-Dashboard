'use client';

import React from 'react';
import { AppBar, Toolbar, Button } from '@mui/material';
import { useDashboard } from '../hooks/useDashboard';
import { useDrawer } from '../context/DrawerContext';

const Header = () => {
  const { onClickHoldersExport, exportList } = useDashboard();
  const { isDrawerOpen, toggleDrawer } = useDrawer();

  console.log('Header exportList:', exportList); // Add log for exportList in Header

  return (
    <AppBar
      position="fixed"
      style={{ top: 'auto', bottom: 0, background: '#000000', color: '#ffffff' }}
    >
      <Toolbar style={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          onClick={toggleDrawer}
          style={{
            borderColor: '#ffffff',
            color: '#ffffff',
            borderWidth: '3px',
            borderStyle: 'solid',
            padding: '12px 18px',
            margin: '0 12px',
            fontSize: "18px",
            borderRadius: "12px",
          }}
        >
          {isDrawerOpen ? 'Close' : 'Contracts'}
        </Button>
        <Button
          onClick={onClickHoldersExport}
          style={{
            borderColor: '#ffffff',
            color: '#ffffff',
            borderWidth: '3px',
            borderStyle: 'solid',
            padding: '12px 18px',
            margin: '0 12px',
            fontSize: "18px",
            borderRadius: "12px",
          }}
        >
          Export List
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

