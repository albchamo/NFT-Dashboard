'use client';

import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';
import CSVExport from '../../utils/CSVExport';
import { useDrawer } from '../../context/DrawerContext';
import { useExportList } from '../../context/ExportListContext';
import FavoriteIcon from '@mui/icons-material/Favorite';

const Footer = () => {
  const { isDrawerOpen, toggleDrawer } = useDrawer();
  const { exportList } = useExportList();
  const [exportListCount, setExportListCount] = useState(0);

  // Update the exportListCount state whenever exportList changes
  useEffect(() => {
    setExportListCount(exportList.size);
    console.log(`Export list updated: ${exportList.size} holders`);
  }, [exportList]);

  // Transform exportList to the required structure
  const exportData = Array.from(exportList).map(holder => ({ holder }));

  return (
    <AppBar
      position="fixed"
      style={{ top: 'auto', bottom: 0, background: '#000000', color: '#ffffff' }}
    >
      <Toolbar style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" style={{ marginLeft: '30px' }}>
          Snapshooter
        </Typography>
        <Box style={{ flex: 1 }} /> {/* Empty box to push the button to center */}
        <Button
          onClick={toggleDrawer}
          style={{
            borderColor: '#ffffff',
            color: '#ffffff',
            borderWidth: '3px',
            borderStyle: 'solid',
            padding: '12px 18px',
            fontSize: '18px',
            borderRadius: '12px',
            position: 'absolute', // Absolute positioning to center
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          {isDrawerOpen ? 'Close' : 'Contracts'}
        </Button>
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            borderWidth: '3px',
            borderStyle: 'solid',
            borderColor: '#ffffff',
            borderRadius: '12px',
            paddingLeft: '20px',
            paddingRight: '0px',
          }}
        >
          <Typography variant="h6" style={{ marginRight: '30px' }}>
            Selected: {exportListCount} holders
          </Typography>
          <CSVExport data={exportData} filename="holders.csv" />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Footer;
