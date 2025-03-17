import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Snackbar,
  TextField,
  Typography,
  Alert,
  IconButton,
  Stack,
  Tooltip
} from '@mui/material';
import { Email, Phone, Person, Edit, Lock } from '@mui/icons-material';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const [editForm, setEditForm] = useState({ name: '', phone: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://r0rvz7pf-3000.inc1.devtunnels.ms/api/user/loggedUser', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });

        if (response.data.success) {
          setUser(response.data.data);
          setEditForm({
            name: response.data.data.name,
            phone: response.data.data.phone,
            email: response.data.data.email
          });
        } else {
          setError('Failed to fetch user data');
        }
      } catch (err) {
        setError('An error occurred while fetching user data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const getInitials = (name) => (name ? name.charAt(0).toUpperCase() : '?');

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Card elevation={4} sx={{ p: 4, maxWidth: 800, mx: 'auto', borderRadius: 3 }}>
        {/* Header Section with Avatar & Buttons */}
        <Stack direction="row" alignItems="center" spacing={3} mb={3}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 72, height: 72, fontSize: '2rem' }}>
            {getInitials(user?.name)}
          </Avatar>

          <Box>
            <Typography variant="h4" fontWeight="bold">
              {user?.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {user?.role || 'N/A'}
            </Typography>
          </Box>


          <Stack
            direction="row"
            spacing={2}
            sx={{ ml: 'auto', justifyContent: 'flex-end', width: '100%' }}  // Ensures right alignment
          >
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={() => setOpenEditDialog(true)}
            >
              Edit Profile
            </Button>

            <Button
              variant="outlined"
              color="secondary"
              startIcon={<Lock />}
              onClick={() => setOpenPasswordDialog(true)}
            >
              Change Password
            </Button>
          </Stack>

        </Stack>

        <CardContent>
          <Grid container spacing={2}>

            {/* Email & Phone with better alignment */}
            <Grid item xs={12}>
              <Box display="flex" gap={4} alignItems="center">
                <Box flex={1}>
                  <Typography variant="body2" color="textSecondary">Email</Typography>
                  <Typography variant="h6">{user?.email || 'N/A'}</Typography>
                </Box>

                <Box flex={1}>
                  <Typography variant="body2" color="textSecondary">Phone</Typography>
                  <Typography variant="h6">{user?.phone || 'N/A'}</Typography>
                </Box>
              </Box>
            </Grid>

            {/* Member Since & isActive with improved alignment */}
            <Grid item xs={12}>
              <Box display="flex" gap={4} alignItems="center">
                <Box flex={1}>
                  <Typography variant="body2" color="textSecondary">Member Since</Typography>
                  <Typography variant="h6">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Box>

                <Box flex={1}>
                  <Typography variant="body2" color="textSecondary">isActive</Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: user?.isActive ? '#2196F3' : 'grey',
                      fontWeight: 'bold',
                      textShadow: user?.isActive ? '0 0 4px #2196F3' : 'none'
                    }}
                  >
                    {user?.isActive ? 'Active' : 'Inactive'}
                  </Typography>
                </Box>
              </Box>
            </Grid>

          </Grid>
        </CardContent>






      </Card>

      {/* Edit Profile Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Stack spacing={2} py={2}>
            <TextField label="Name" name="name" fullWidth value={editForm.name} />
            <TextField label="Phone" name="phone" fullWidth value={editForm.phone} />
            <TextField
              label="Email (Contact admin to change)"
              name="email"
              fullWidth
              value={editForm.email}
              disabled
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button color="primary" variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Stack spacing={2} py={2}>
            <TextField label="Current Password" name="oldPassword" type="password" fullWidth />
            <TextField label="New Password" name="newPassword" type="password" fullWidth />
            <TextField label="Confirm Password" name="confirmPassword" type="password" fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPasswordDialog(false)}>Cancel</Button>
          <Button color="primary" variant="contained">Change Password</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserProfile;
