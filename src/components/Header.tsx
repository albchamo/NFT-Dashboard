// Header.tsx
import React from 'react';
import { AppBar, Toolbar, Button } from '@mui/material';
import CSVButton from './CSVButton';

interface HeaderProps {
  onControlClick: () => void;
  onFetchDataClick: () => void;
  onCSVUploadClick: () => void;
  onCSVExportClick: () => void;
  isDrawerOpen: boolean;
}

const Header = ({ onControlClick, onFetchDataClick, onCSVUploadClick, onCSVExportClick, isDrawerOpen }: HeaderProps) => {
  return (
    <AppBar position="static" style={{ background: '#000000', color: '#ffffff' }}>
      <Toolbar style={{ display: 'flex', justifyContent: 'center' }}>
        <CSVButton onCSVUploadClick={onCSVUploadClick} onCSVExportClick={onCSVExportClick} />
        <Button
          onClick={onControlClick}
          style={{
            borderColor: '#ffffff',
            color: '#ffffff',
            borderWidth: '1px',
            borderStyle: 'solid',
            padding: '8px 16px',
            margin: '0 12px',
          }}
        >
          {isDrawerOpen ? 'Close Control' : 'Open Control'}
        </Button>
        <Button
          onClick={onFetchDataClick}
          style={{
            borderColor: '#ffffff',
            color: '#ffffff',
            borderWidth: '1px',
            borderStyle: 'solid',
            padding: '8px 16px',
            margin: '0 12px',
          }}
        >
          Fetch Data
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
