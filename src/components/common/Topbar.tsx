import React from 'react';
import { Box, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

const TopBar: React.FC = () => {
  return (
    <Box
    sx={{
        width: '100%',
        backgroundColor: '#000', // Adjust background color as needed
        padding: '10px 0',
        textAlign: 'center',
        position: 'fixed',
        top: 0,
        zIndex: 1000, // Ensure it stays above other content
        color: '#ffffff', // Adjust font color as needed
      }}
    >
      <Typography variant="body2" color="inherit">
        Made with <FavoriteIcon sx={{ verticalAlign: 'middle', color: 'red' }} /> from Latam by 
        <a href="https://x.com/TechRebelWorld" target="_blank" rel="noopener noreferrer" style={{ color: '#ffffff', marginLeft: '5px' }}>
          Tech Rebel
        </a>. Support this product: -&gt; Snapshooter.eth
      </Typography>
    </Box>
  );
};

export default TopBar;
