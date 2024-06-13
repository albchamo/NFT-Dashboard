// CSVButton.tsx
import React, { useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

interface CSVButtonProps {
  onCSVUploadClick: () => void;
  onCSVExportClick: () => void;
}

const CSVButton: React.FC<CSVButtonProps> = ({ onCSVUploadClick, onCSVExportClick }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleCSVClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCSVClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        aria-controls="csv-menu"
        aria-haspopup="true"
        onClick={handleCSVClick}
        style={{
          borderColor: '#ffffff',
          color: '#ffffff',
          borderWidth: '1px',
          borderStyle: 'solid',
          padding: '8px 16px',
          margin: '0 12px',
        }}
      >
        CSV <ArrowDropDownIcon />
      </Button>
      <Menu
        id="csv-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCSVClose}
        PaperProps={{
          style: {
            backgroundColor: '#ffffff',
            color: '#000000',
          },
        }}
      >
        <MenuItem
          onClick={() => { handleCSVClose(); onCSVUploadClick(); }}
          style={{ color: '#000000' }}
        >
          Upload CSV
        </MenuItem>
        <MenuItem
          onClick={() => { handleCSVClose(); onCSVExportClick(); }}
          style={{ color: '#000000' }}
        >
          Export CSV
        </MenuItem>
      </Menu>
    </>
  );
};

export default CSVButton;
