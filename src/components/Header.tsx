'use client';

import React from 'react';
import { AppBar, Toolbar, Button } from '@mui/material';
import { useDashboard } from '../hooks/useDashboard';
import CSVExport from './CSVExport';
import { useDrawer } from '../context/DrawerContext';

const Header = () => {
  const { exportList } = useDashboard();
  const { isDrawerOpen, toggleDrawer } = useDrawer();

  console.log('Header exportList:', Array.from(exportList)); // Inspect exportList

  // Transform exportList to the required structure
  const exportData = Array.from(exportList).map(holder => ({ holder }));

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
        <CSVExport
          data={exportData} // Ensure exportList is transformed to the required structure
          filename="holders.csv"
        />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
