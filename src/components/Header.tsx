import React from 'react';
import { AppBar, Toolbar, Button } from '@mui/material';
import { useDashboard } from '../hooks/useDashboard';

const Header = () => {
  const { toggleDrawer, drawerOpen, onClickNodesExport } = useDashboard();

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
          {drawerOpen ? 'Close' : 'Contracts'}
        </Button>
        <Button
          onClick={onClickNodesExport} // Ensure this is correctly named
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
