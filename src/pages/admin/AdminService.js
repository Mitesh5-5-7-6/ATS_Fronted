import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  Divider,
  Snackbar,
  Alert,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Chip,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
  Fab
} from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DescriptionIcon from '@mui/icons-material/Description';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const API_BASE_URL = "https://r0rvz7pf-3000.inc1.devtunnels.ms/api";

const ServiceVendorDashboard = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [vendorDetails, setVendorDetails] = useState([]);
  const [vendorLoading, setVendorLoading] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchQuery, setSearchQuery] = useState('');

  // Service form state
  const [serviceFormOpen, setServiceFormOpen] = useState(false);
  const [serviceFormMode, setServiceFormMode] = useState('add'); // 'add' or 'edit'
  const [serviceFormData, setServiceFormData] = useState({ name: '', description: '' });

  // Delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredServices(services);
    } else {
      const filtered = services.filter(service =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (service.description && service.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredServices(filtered);
    }
  }, [searchQuery, services]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/service/getAllServices`);
      if (response.data && response.data.data) {
        setServices(response.data.data);
        setFilteredServices(response.data.data);
      } else {
        setServices([]);
        setFilteredServices([]);
        showSnackbar("No services found or invalid response format", "info");
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      showSnackbar("Failed to load services: " + (error.response?.data?.message || error.message), "error");
      setServices([]);
      setFilteredServices([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchVendorsByService = async (serviceId) => {
    setVendorLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/vendor/getVendorByService/${serviceId}`);

      if (response.data && response.data.data) {
        setVendorDetails(response.data.data);
      } else {
        setVendorDetails([]);
        showSnackbar("No vendors found for this service", "info");
      }
    } catch (error) {
      console.error("Error fetching vendor details:", error);
      showSnackbar("Failed to load vendor details: " + (error.response?.data?.message || error.message), "error");
      setVendorDetails([]);
    } finally {
      setVendorLoading(false);
    }
  };

  const handleServiceClick = (service) => {
    setSelectedService(service);
    fetchVendorsByService(service._id);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Service form handlers
  const openAddServiceForm = () => {
    setServiceFormData({ name: '', description: '' });
    setServiceFormMode('add');
    setServiceFormOpen(true);
  };

  const openEditServiceForm = (service, event) => {
    event.stopPropagation(); // Prevent opening the vendor details dialog
    setServiceFormData({ ...service });
    setServiceFormMode('edit');
    setServiceFormOpen(true);
  };

  const handleServiceFormClose = () => {
    setServiceFormOpen(false);
  };

  const handleServiceFormChange = (event) => {
    const { name, value } = event.target;
    setServiceFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceFormSubmit = async () => {
    if (!serviceFormData.name.trim()) {
      showSnackbar("Service name is required", "error");
      return;
    }

    try {
      if (serviceFormMode === 'add') {
        await axios.post(`${API_BASE_URL}/service/createService`, serviceFormData);
        showSnackbar("Service added successfully", "success");
      } else {
        await axios.put(`${API_BASE_URL}/service/updateService/${serviceFormData._id}`, serviceFormData);
        showSnackbar("Service updated successfully", "success");
      }
      setServiceFormOpen(false);
      fetchServices();
    } catch (error) {
      console.error("Error saving service:", error);
      showSnackbar("Failed to save service: " + (error.response?.data?.message || error.message), "error");
    }
  };

  // Delete handlers
  const openDeleteDialog = (service, event) => {
    event.stopPropagation(); // Prevent opening the vendor details dialog
    setServiceToDelete(service);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteService = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/service/deleteService/${serviceToDelete._id}`);
      showSnackbar("Service deleted successfully", "success");
      fetchServices();
    } catch (error) {
      console.error("Error deleting service:", error);
      showSnackbar("Failed to delete service: " + (error.response?.data?.message || error.message), "error");
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ p: 3, maxWidth: '1200px', margin: '0 auto' }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Services Catalog
          </Typography>
          <Fab
            color="primary"
            aria-label="add"
            onClick={openAddServiceForm}
            size="medium"
          >
            <AddIcon />
          </Fab>
        </Box>

        <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
          <InputLabel htmlFor="search-services">Search Services</InputLabel>
          <OutlinedInput
            id="search-services"
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            endAdornment={
              <InputAdornment position="end">
                <SearchIcon color="action" />
              </InputAdornment>
            }
            label="Search Services"
          />
        </FormControl>

        <Divider sx={{ mb: 3 }} />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <Grid item xs={12} sm={6} md={4} key={service._id}>
                  <Card
                    elevation={3}
                    sx={{
                      height: '100%',
                      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 6
                      }
                    }}
                  >
                    <CardActionArea
                      onClick={() => handleServiceClick(service)}
                      sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
                    >
                      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                            <StorefrontIcon />
                          </Avatar>
                          <Typography variant="h6" component="h2" gutterBottom>
                            {service.name}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                          {service.description || 'No description available'}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                          <Box>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={(e) => openEditServiceForm(service, e)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={(e) => openDeleteDialog(service, e)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                          <Chip
                            label="View vendors"
                            color="primary"
                            size="small"
                            clickable
                          />
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Box sx={{ textAlign: 'center', p: 5 }}>
                  <Typography variant="h6" color="text.secondary">
                    {searchQuery.trim() !== ''
                      ? "No services match your search"
                      : "No services available"}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        )}
      </Paper>

      {/* Vendor Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
        PaperProps={{
          elevation: 5,
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle>
          <Typography variant="h5" component="div">
            Vendors for {selectedService?.name}
          </Typography>
        </DialogTitle>
        <DialogContent dividers sx={{ maxHeight: '400px', overflowY: 'auto' }}>
  {vendorLoading ? (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
      <CircularProgress />
    </Box>
  ) : vendorDetails.length > 0 ? (
    <Grid container spacing={1}>
      {vendorDetails.map((vendor) => (
        <Grid item xs={12} sm={6} md={4} key={vendor._id}>
          <Box
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              p: 1.5,
              boxShadow: 1,
              
            }}
          >
            <Typography
              variant="body1"
              sx={{ fontWeight: 'bold', color: '#1976D2' }}
            >
              {vendor.user?.name || 'N/A'}
            </Typography>

            <Typography variant="body2" sx={{ mt: 0.5 }}>
              <strong>Email:</strong> {vendor.user?.email || 'N/A'}
            </Typography>

            <Typography variant="body2" sx={{ mt: 0.5 }}>
              <strong>Contact:</strong> {vendor.user?.phone || 'N/A'}
            </Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  ) : (
    <Typography variant="body1" textAlign="center">
      No vendors found.
    </Typography>
  )}
</DialogContent>





        <DialogActions>
          <Button onClick={handleCloseDetails} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Service Form Dialog */}
      <Dialog open={serviceFormOpen} onClose={handleServiceFormClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {serviceFormMode === 'add' ? 'Add New Service' : 'Edit Service'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            name="name"
            label="Service Name"
            type="text"
            fullWidth
            variant="outlined"
            value={serviceFormData.name}
            onChange={handleServiceFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            id="description"
            name="description"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={serviceFormData.description}
            onChange={handleServiceFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleServiceFormClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleServiceFormSubmit} color="primary" variant="contained">
            {serviceFormMode === 'add' ? 'Add' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the service "{serviceToDelete?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteService} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ServiceVendorDashboard;
