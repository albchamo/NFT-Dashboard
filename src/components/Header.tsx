import React from 'react';
import { AppBar, Toolbar, Button } from '@mui/material';

interface HeaderProps {
  onControlClick: () => void;
  onFetchDataClick: () => void;
  onCSVUploadClick: () => void;
  onCSVExportClick: () => void;
  isDrawerOpen: boolean;
}

const Header = ({
  onControlClick,
  onFetchDataClick,
  onCSVUploadClick,
  onCSVExportClick,
  isDrawerOpen
}: HeaderProps) => {
  return (
    <AppBar
      position="fixed"
      style={{ top: 'auto', bottom: 0, background: '#000000', color: '#ffffff' }}
    >
      <Toolbar style={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          onClick={onControlClick}
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
          onClick={onCSVExportClick} // This will trigger the export function passed as a prop
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
