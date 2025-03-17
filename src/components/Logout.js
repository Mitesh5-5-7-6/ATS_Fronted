import React, { useEffect } from 'react';
import { Box, Typography, CircularProgress, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';

const LogoutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Remove token from local storage
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');

       
        // You can remove any other auth-related items here
        
        // Optional: Add a small delay for UX purposes
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Redirect to login page
        navigate('/login', { replace: true });
      } catch (error) {
        console.error('Logout error:', error);
        // Even if there's an error, still try to redirect
        navigate('/login', { replace: true });
      }
    };

    performLogout();
  }, [navigate]);

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        backgroundColor: theme => theme.palette.grey[100]
      }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          p: 5, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          maxWidth: 400,
          width: '100%',
          borderRadius: 2
        }}
      >
        <LogoutIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        <Typography variant="h5" component="h1" sx={{ mb: 2 }}>
          Logging Out
        </Typography>
        <CircularProgress size={30} sx={{ mb: 2 }} />
        <Typography variant="body1" color="text.secondary" align="center">
          Please wait while we securely log you out...
        </Typography>
      </Paper>
    </Box>
  );
};

export default LogoutPage;