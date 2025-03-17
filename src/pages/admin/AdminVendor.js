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
    Select,
    MenuItem,
    Checkbox,
    ListItemButton,
    ListItemIcon,
    FormControlLabel
} from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DescriptionIcon from '@mui/icons-material/Description';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const API_BASE_URL = "https://r0rvz7pf-3000.inc1.devtunnels.ms/api";

const VendorManagementPage = () => {
    const [vendors, setVendors] = useState([]);
    const [filteredVendors, setFilteredVendors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [vendorDetailsOpen, setVendorDetailsOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [allServices, setAllServices] = useState([]);
    const [servicesLoading, setServicesLoading] = useState(false);
    const [shopUpdateDialogOpen, setShopUpdateDialogOpen] = useState(false);
    const [shopFormData, setShopFormData] = useState({
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: ''
    });

    // Service selection dialog
    const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
    const [selectedServices, setSelectedServices] = useState([]);

    useEffect(() => {
        fetchVendors();
        fetchAllServices();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredVendors(vendors);
        } else {
            const filtered = vendors.filter(vendor =>
                (vendor.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (vendor.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()))
            );
            setFilteredVendors(filtered);
        }
    }, [searchQuery, vendors]);

    const fetchVendors = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/vendor/getAllVendors`);
            if (response.data && response.data.data) {
                setVendors(response.data.data);
                setFilteredVendors(response.data.data);
            } else {
                setVendors([]);
                setFilteredVendors([]);
                showSnackbar("No vendors found or invalid response format", "info");
            }
        } catch (error) {
            console.error("Error fetching vendors:", error);
            showSnackbar("Failed to load vendors: " + (error.response?.data?.message || error.message), "error");
            setVendors([]);
            setFilteredVendors([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllServices = async () => {
        setServicesLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/service/getAllServices`);
            if (response.data && response.data.data) {
                setAllServices(response.data.data);
            } else {
                setAllServices([]);
            }
        } catch (error) {
            console.error("Error fetching services:", error);
            setAllServices([]);
        } finally {
            setServicesLoading(false);
        }
    };

    const handleVendorClick = (vendor) => {
        // Set the selected vendor directly from the data we already have
        setSelectedVendor(vendor);
        setSelectedServices(vendor.servicesProvided || []);
        setVendorDetailsOpen(true);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleCloseDetails = () => {
        setVendorDetailsOpen(false);
        setSelectedVendor(null);
    };

    const openServiceDialog = () => {
        setServiceDialogOpen(true);
    };

    const handleServiceDialogClose = () => {
        setServiceDialogOpen(false);
    };

    const handleServiceToggle = (serviceId) => {
        const currentIndex = selectedServices.indexOf(serviceId);
        const newSelectedServices = [...selectedServices];

        if (currentIndex === -1) {
            newSelectedServices.push(serviceId);
        } else {
            newSelectedServices.splice(currentIndex, 1);
        }

        setSelectedServices(newSelectedServices);
    };
    const openShopUpdateDialog = () => {
        if (selectedVendor && selectedVendor.shopAddress && selectedVendor.shopAddress.length > 0) {
            setShopFormData({
                addressLine1: selectedVendor.shopAddress[0].addressLine1 || '',
                addressLine2: selectedVendor.shopAddress[0].addressLine2 || '',
                city: selectedVendor.shopAddress[0].city || '',
                state: selectedVendor.shopAddress[0].state || '',
                zipCode: selectedVendor.shopAddress[0].zipCode || ''
            });
        }
        setShopUpdateDialogOpen(true);
    };

    // Add this function to handle input changes
    const handleShopFormChange = (e) => {
        const { name, value } = e.target;
        setShopFormData({
            ...shopFormData,
            [name]: value
        });
    };

    // Add this function to handle the shop details update
    const updateShopDetails = async () => {
        const { addressLine1, city, state, zipCode } = shopFormData;
        if (!addressLine1 || !city || !state || !zipCode) {
            showSnackbar("Please fill in all required fields.", "error");
            return;
        }
        try {
            await axios.put(`${API_BASE_URL}/vendor/updateVendor/${selectedVendor._id}`, {
                shopAddress: [{
                    ...shopFormData
                }]
            });

            showSnackbar("Shop details updated successfully", "success");

            // Update local state
            const updatedVendor = {
                ...selectedVendor,
                shopAddress: [{
                    ...shopFormData
                }]
            };

            setSelectedVendor(updatedVendor);

            const updatedVendors = vendors.map(v =>
                v._id === selectedVendor._id ? updatedVendor : v
            );
            setVendors(updatedVendors);
            setFilteredVendors(updatedVendors);

            setShopUpdateDialogOpen(false);
        } catch (error) {
            console.error("Error updating shop details:", error);
            showSnackbar(
                "Failed to update shop details: " + (error.response?.data?.message || error.message),
                "error"
            );
        }
    };
    const updateVendorServices = async () => {
        
        try {
            // Send only the selected services list (backend will handle add/remove logic)
            await axios.put(`${API_BASE_URL}/vendor/updateService/${selectedVendor._id}/add-service`, {
                servicesProvided: selectedServices
            });

            showSnackbar("Vendor services updated successfully", "success");

            // Update local state directly with selected services
            const updatedVendor = {
                ...selectedVendor,
                servicesProvided: selectedServices
            };

            setSelectedVendor(updatedVendor);

            const updatedVendors = vendors.map(v =>
                v._id === selectedVendor._id ? updatedVendor : v
            );
            setVendors(updatedVendors);
            setFilteredVendors(updatedVendors);

            setServiceDialogOpen(false);
        } catch (error) {
            console.error("Error updating vendor services:", error);
            showSnackbar(
                "Failed to update vendor services: " + (error.response?.data?.message || error.message),
                "error"
            );
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

    // Get service name by ID
    const getServiceName = (serviceId) => {
        const service = allServices.find(s => s._id === serviceId);
        return service ? service.name : 'Unknown Service';
    };

    return (
        <Box sx={{ p: 3, maxWidth: '1200px', margin: '0 auto' }}>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Vendor Management
                </Typography>

                <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
                    <InputLabel htmlFor="search-vendors">Search Vendors</InputLabel>
                    <OutlinedInput
                        id="search-vendors"
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        endAdornment={
                            <InputAdornment position="end">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        }
                        label="Search Vendors"
                    />
                </FormControl>

                <Divider sx={{ mb: 3 }} />

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {filteredVendors.length > 0 ? (
                            filteredVendors.map((vendor) => (
                                <Grid item xs={12} sm={6} md={4} key={vendor._id}>
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
                                            onClick={() => handleVendorClick(vendor)}
                                            sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
                                        >
                                            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                    <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                                                        <PersonIcon />
                                                    </Avatar>
                                                    <Typography variant="h6" component="h2" noWrap>
                                                        {vendor.user?.name || 'Unknown Vendor'}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                    <EmailIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                                    <Typography variant="body2" color="text.secondary">
                                                        {vendor.user?.email || 'No email available'}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                    <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                                    <Typography variant="body2" color="text.secondary">
                                                        {vendor.user?.phone || 'No phone available'}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                    <LocationOnIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                                    <Typography variant="body2" color="text.secondary" noWrap>
                                                        {vendor.shopAddress && vendor.shopAddress.length > 0
                                                            ? `${vendor.shopAddress[0].city}, ${vendor.shopAddress[0].state}`
                                                            : 'No address available'}
                                                    </Typography>
                                                </Box>
                                                {vendor.servicesProvided && vendor.servicesProvided.length > 0 && (
                                                    <Box sx={{ mt: 1 }}>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Services:
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                                                            {vendor.servicesProvided.slice(0, 3).map((serviceId, index) => (
                                                                <Chip
                                                                    key={index}
                                                                    label={getServiceName(serviceId)}
                                                                    size="small"
                                                                    color="primary"
                                                                    variant="outlined"
                                                                />
                                                            ))}
                                                            {vendor.servicesProvided.length > 3 && (
                                                                <Chip
                                                                    label={`+${vendor.servicesProvided.length - 3}`}
                                                                    size="small"
                                                                    color="primary"
                                                                    variant="outlined"
                                                                />
                                                            )}
                                                        </Box>
                                                    </Box>
                                                )}


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
                                            ? "No vendors match your search"
                                            : "No vendors available"}
                                    </Typography>
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                )}
            </Paper>

            {/* Vendor Details Dialog */}
            <Dialog
                open={vendorDetailsOpen}
                onClose={handleCloseDetails}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    elevation: 5,
                    sx: { borderRadius: 2 }
                }}
            >
                {selectedVendor && (
                    <>
                        <DialogTitle>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h5" component="div">
                                    {selectedVendor.user?.name || 'Vendor Details'}
                                </Typography>
                                <DialogActions>
                                    <Button onClick={handleCloseDetails} color="primary">
                                        <closeIcon />
                                    </Button>
                                </DialogActions>
                            </Box>
                        </DialogTitle>
                        <DialogContent dividers>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Card elevation={2} sx={{ mb: 3 }}>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                Contact Information
                                            </Typography>
                                            <List dense>
                                                <ListItem>
                                                    <ListItemAvatar>
                                                        <Avatar sx={{ bgcolor: 'primary.light' }}>
                                                            <PersonIcon />
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText primary="Name:" secondary={selectedVendor.user?.name || 'N/A'} />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemAvatar>
                                                        <Avatar sx={{ bgcolor: 'primary.light' }}>
                                                            <EmailIcon />
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText primary="Email:" secondary={selectedVendor.user?.email || 'N/A'} />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemAvatar>
                                                        <Avatar sx={{ bgcolor: 'primary.light' }}>
                                                            <PhoneIcon />
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText primary="Phone:" secondary={selectedVendor.user?.phone || 'N/A'} />
                                                </ListItem>

                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Card elevation={2} sx={{ mb: 1 }}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="h6" gutterBottom>
                                                    Shop Details
                                                </Typography>
                                                <IconButton
                                                    color="primary"
                                                    onClick={openShopUpdateDialog}
                                                    title="Update Shop Details"
                                                    aria-label="Update Shop Details"
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </Box>
                                            <List dense>
                                                {selectedVendor.shopAddress && selectedVendor.shopAddress.length > 0 && (
                                                    <>
                                                        <ListItem>
                                                            <ListItemAvatar>
                                                                <Avatar sx={{ bgcolor: 'primary.light' }}>
                                                                    <LocationOnIcon />
                                                                </Avatar>
                                                            </ListItemAvatar>
                                                            <ListItemText
                                                                primary="Address Line 1"
                                                                secondary={selectedVendor.shopAddress[0].addressLine1 || 'N/A'}
                                                            />
                                                        </ListItem>
                                                        <ListItem>
                                                            <ListItemAvatar>
                                                                <Avatar sx={{ bgcolor: 'primary.light' }}>
                                                                    <LocationOnIcon />
                                                                </Avatar>
                                                            </ListItemAvatar>
                                                            <ListItemText
                                                                primary="Address Line 2"
                                                                secondary={selectedVendor.shopAddress[0].addressLine2 || 'N/A'}
                                                            />
                                                        </ListItem>
                                                        <ListItem>
                                                            <ListItemAvatar>
                                                                <Avatar sx={{ bgcolor: 'primary.light' }}>
                                                                    <LocationOnIcon />
                                                                </Avatar>
                                                            </ListItemAvatar>
                                                            <ListItemText
                                                                primary="City, State, Zip"
                                                                secondary={`${selectedVendor.shopAddress[0].city || ''}, ${selectedVendor.shopAddress[0].state || ''} ${selectedVendor.shopAddress[0].zipCode || ''}`}
                                                            />
                                                        </ListItem>
                                                    </>
                                                )}
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12}>
                                    <Card elevation={2}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                <Typography variant="h6">
                                                    Services Offered
                                                </Typography>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    startIcon={<EditIcon />}
                                                    onClick={openServiceDialog}
                                                >
                                                    Manage Services
                                                </Button>
                                            </Box>
                                            {selectedVendor.servicesProvided && selectedVendor.servicesProvided.length > 0 ? (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                                                    {selectedVendor.servicesProvided.map((serviceId, index) => (
                                                        <Chip
                                                            key={index}
                                                            label={getServiceName(serviceId)}
                                                            color="primary"
                                                            variant="outlined"
                                                            size="medium"

                                                        />
                                                    ))}
                                                </Box>
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">
                                                    No services assigned to this vendor
                                                </Typography>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDetails} color="primary">
                                Close
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
            {/* Shop Details Update Dialog */}
            <Dialog
                open={shopUpdateDialogOpen}
                onClose={() => setShopUpdateDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Update Shop Details</DialogTitle>
                <DialogContent dividers>
                    <Box component="form" sx={{ '& .MuiTextField-root': { my: 1 } }}>
                        <TextField
                            fullWidth
                            label="Address Line 1"
                            name="addressLine1"
                            required
                            value={shopFormData.addressLine1}
                            onChange={handleShopFormChange}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Address Line 2"
                            name="addressLine2"
                            value={shopFormData.addressLine2}
                            onChange={handleShopFormChange}
                            margin="normal"
                        />
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={5}>
                                <TextField
                                    fullWidth
                                    label="City"
                                    name="city"
                                    required
                                    value={shopFormData.city}
                                    onChange={handleShopFormChange}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label="State"
                                    name="state"
                                    required
                                    value={shopFormData.state}
                                    onChange={handleShopFormChange}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    fullWidth
                                    label="Zip Code"
                                    name="zipCode"
                                    required
                                    value={shopFormData.zipCode}
                                    onChange={handleShopFormChange}
                                    margin="normal"
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShopUpdateDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={updateShopDetails} color="primary" variant="contained">
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>
            {/* Service Selection Dialog */}
            <Dialog
                open={serviceDialogOpen}
                onClose={handleServiceDialogClose}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Edit Vendor Services</DialogTitle>
                <DialogContent dividers>
                    {servicesLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                            <CircularProgress size={24} />
                        </Box>
                    ) : allServices.length > 0 ? (
                        <List sx={{ width: '100%' }}>
                            {allServices.map((service) => (
                                <ListItem key={service._id} disablePadding>
                                    <ListItemButton dense onClick={() => handleServiceToggle(service._id)}>
                                        <ListItemIcon>
                                            <Checkbox
                                                edge="start"
                                                checked={selectedServices.indexOf(service._id) !== -1}
                                                tabIndex={-1}
                                                disableRipple
                                            />
                                        </ListItemIcon>
                                        <ListItemText primary={service.name} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                            No services available
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleServiceDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={updateVendorServices} color="primary" variant="contained">
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box >
    );
};

export default VendorManagementPage;