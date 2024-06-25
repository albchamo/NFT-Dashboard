import React from 'react';
import { Backdrop, CircularProgress, Typography, Box } from '@mui/material';

interface LoadingModalProps {
  open: boolean;
  message?: string;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ open, message }) => {
  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
    >
      <Box display="flex" flexDirection="column" alignItems="center">
        <CircularProgress color="inherit" />
        {message && (
          <Typography variant="h6" sx={{ mt: 2 }}>
            {message}
          </Typography>
        )}
      </Box>
    </Backdrop>
  );
};

export default LoadingModal;
