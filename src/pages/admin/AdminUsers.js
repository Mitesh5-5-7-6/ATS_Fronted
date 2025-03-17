import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    DialogContentText,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
    InputAdornment,
    IconButton,
    AppBar,
    Toolbar,
    Chip,
    Card,
    CardContent,
    Divider,
    CircularProgress,
    Alert,
    Snackbar,
    Checkbox,
    FormGroup,
    FormLabel,
    FormControlLabel
} from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import {
    Add as AddIcon,
    Search as SearchIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Refresh as RefreshIcon,
    Person as PersonIcon,
    AdminPanelSettings as AdminIcon,
    Support as AgentIcon,
    Store as VendorIcon,
    FilterList as FilterIcon
} from "@mui/icons-material";
import axios from "axios";

const API_BASE_URL = "https://r0rvz7pf-3000.inc1.devtunnels.ms/api";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [roleFilter, setRoleFilter] = useState("All");
    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [openUserDialog, setOpenUserDialog] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isEditMode, setIsEditMode] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [openVendorDetailsDialog, setOpenVendorDetailsDialog] = useState(false);
    const [currentVendorId, setCurrentVendorId] = useState(null);
    const [dataLoading, setDataLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    // Separate state for register and update
    const [registerUser, setRegisterUser] = useState({
        name: "",
        email: "",
        phone: "",
        role: "",
        // No isActive field for registration
    });

    const [updateUser, setUpdateUser] = useState({
        name: "",
        email: "",
        phone: "",
        // No role field for update
        isActive: true, // Changed from empty string to boolean
    });

    const [vendorDetails, setVendorDetails] = useState({
        user: '',
        servicesProvided: [], // Changed to array for multiple selection
        shopAddress: {
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            zipCode: ''
        }
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (openVendorDetailsDialog) {
            fetchServices();
        }
    }, [openVendorDetailsDialog]);

    useEffect(() => {
        filterUsers();
    }, [roleFilter, users, searchQuery]);

    const fetchServices = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/service/getAllServices`);
            setServices(response.data.data || []);
        } catch (error) {
            showSnackbar("Failed to load services", "error");
            setServices([]);
        } finally {
            setIsLoading(false);
        }
    };

    const filterUsers = () => {
        let filtered = users;

        // Filter by role
        if (roleFilter !== "All") {
            filtered = filtered.filter(user => user.role === roleFilter);
        }

        // Filter by search query (name or email)
        if (searchQuery.trim() !== "") {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(user =>
                (user.name && user.name.toLowerCase().includes(query)) ||
                (user.email && user.email.toLowerCase().includes(query))
            );
        }

        setFilteredUsers(filtered);
    };

    const resetForm = () => {
        setRegisterUser({
            name: "",
            email: "",
            phone: "",
            role: "",
        });

        setUpdateUser({
            name: "",
            email: "",
            phone: "",
            isActive: true,
        });

        setVendorDetails({
            user: '',
            servicesProvided: [], // Reset as empty array
            shopAddress: {
                addressLine1: '',
                addressLine2: '',
                city: '',
                state: '',
                zipCode: ''
            }
        });

        setIsEditMode(false);
        setSelectedUser(null);
    };

    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterUser({
            ...registerUser,
            [name]: value
        });
    };

    const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        
        // Handle isActive specifically for the dropdown
        if (name === "isActive") {
            setUpdateUser({
                ...updateUser,
                [name]: value === "true" // Convert string to boolean
            });
        } else {
            setUpdateUser({
                ...updateUser,
                [name]: value
            });
        }
    };

    const fetchUsers = async () => {
        setDataLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/user/getAllUsers`);

            if (response.data && Array.isArray(response.data.data)) {
                const formattedUsers = response.data.data.map((user, index) => ({
                    ...user,
                    id: user._id || `temp-${index}`,
                    isActive: user.isActive ? "Active" : "Inactive"
                }));
                setUsers(formattedUsers);
                setFilteredUsers(formattedUsers);
            } else if (response.data && Array.isArray(response.data)) {
                const formattedUsers = response.data.map((user, index) => ({
                    ...user,
                    id: user._id || `temp-${index}`,
                    isActive: user.isActive ? "Active" : "Inactive"
                }));
                setUsers(formattedUsers);
                setFilteredUsers(formattedUsers);
            } else {
                setUsers([]);
                setFilteredUsers([]);
            }
        } catch (error) {
            showSnackbar("Failed to load users", "error");
            setUsers([]);
            setFilteredUsers([]);
        } finally {
            setDataLoading(false);
        }
    };

    const handleUserSubmit = async () => {
        try {
            if (isEditMode && selectedUser) {
                // Use updateUser state for editing
                const userToUpdate = {
                    name: updateUser.name,
                    email: updateUser.email,
                    phone: updateUser.phone,
                    isActive: updateUser.isActive, // Now properly set as boolean
                };

                // Keep existing role
                if (selectedUser.role) {
                    userToUpdate.role = selectedUser.role;
                }

                await axios.put(`${API_BASE_URL}/user/updateUser/${selectedUser._id}`, userToUpdate);
                showSnackbar("User updated successfully", "success");
                setOpenUserDialog(false);
                resetForm();
                fetchUsers();
            } else {
                const userToRegister = {
                    ...registerUser,
                    // Auto-set isActive to true for new users
                    isActive: true
                };

                const response = await axios.post(`${API_BASE_URL}/user/createUser`, userToRegister);

                if (userToRegister.role === "Vendor" && response.data && response.data.user && response.data.user._id) {
                    const userId = response.data.user._id;
                    setCurrentVendorId(userId);

                    setVendorDetails({
                        user: userId,
                        servicesProvided: [], // Initialize as empty array
                        shopAddress: {
                            addressLine1: '',
                            addressLine2: '',
                            city: '',
                            state: '',
                            zipCode: ''
                        }
                    });

                    setOpenUserDialog(false);
                    showSnackbar("User created. Please provide vendor details.", "info");

                    setTimeout(() => {
                        setOpenVendorDetailsDialog(true);
                    }, 300);

                    fetchServices();
                } else {
                    showSnackbar("User created successfully", "success");
                    setOpenUserDialog(false);
                    resetForm();
                    fetchUsers();
                }
            }
        } catch (error) {
            showSnackbar("Operation failed: " + (error.response?.data?.message || error.message), "error");

            // Local fallback for demo purposes
            if (isEditMode && selectedUser) {
                const updatedUsers = users.map(user =>
                    user.id === selectedUser.id ? {
                        ...user,
                        name: updateUser.name,
                        email: updateUser.email,
                        phone: updateUser.phone,
                        isActive: updateUser.isActive ? "Active" : "Inactive",
                        // status: updateUser.isActive 
                    } : user
                );
                setUsers(updatedUsers);
                setOpenUserDialog(false);
                resetForm();
            } else {
                const newUserWithId = {
                    ...registerUser,
                    isActive: true,
                    // status: "Active",
                    id: Math.random().toString(36).substr(2, 9),
                    _id: Math.random().toString(36).substr(2, 9),
                    isDeleted: false,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };

                setUsers([...users, newUserWithId]);

                if (registerUser.role === "Vendor") {
                    setCurrentVendorId(newUserWithId.id);
                    setVendorDetails({
                        user: newUserWithId.id,
                        servicesProvided: [], // Initialize as empty array for multiple selection
                        shopAddress: {
                            addressLine1: '',
                            addressLine2: '',
                            city: '',
                            state: '',
                            zipCode: ''
                        }
                    });

                    setOpenUserDialog(false);

                    setTimeout(() => {
                        setOpenVendorDetailsDialog(true);
                    }, 300);
                } else {
                    setOpenUserDialog(false);
                    resetForm();
                }
            }
        }
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setUpdateUser({
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            isActive: user.isActive !== undefined ? user.isActive : true,
        });
        setIsEditMode(true);
        setOpenUserDialog(true);
    };

    const handleDeleteUser = (user) => {
        setSelectedUser(user);
        setOpenDeleteDialog(true);
    };

    const confirmDeleteUser = async () => {
        try {
            await axios.delete(`${API_BASE_URL}/user/deleteUser/${selectedUser._id}`);
            showSnackbar("User deleted successfully", "success");
            // Filter out the deleted user
            const updatedUsers = users.filter(user => user.id !== selectedUser.id);
            setUsers(updatedUsers);
            setOpenDeleteDialog(false);
            setSelectedUser(null);
        } catch (error) {
            showSnackbar("Failed to delete user", "error");
            // Fallback to local deletion for demo
            const updatedUsers = users.filter(user => user.id !== selectedUser.id);
            setUsers(updatedUsers);
            setOpenDeleteDialog(false);
            setSelectedUser(null);
        }
    };

    const handleVendorDetailsChange = (e) => {
        const { name, value } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setVendorDetails({
                ...vendorDetails,
                [parent]: {
                    ...vendorDetails[parent],
                    [child]: value
                }
            });
        } else {
            setVendorDetails({
                ...vendorDetails,
                [name]: value
            });
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // New handler for service checkbox changes
    const handleServiceCheckboxChange = (serviceId) => {
        const currentServices = [...vendorDetails.servicesProvided];

        if (currentServices.includes(serviceId)) {
            // Remove the service if already selected
            const updatedServices = currentServices.filter(id => id !== serviceId);
            setVendorDetails({
                ...vendorDetails,
                servicesProvided: updatedServices
            });
        } else {
            // Add the service if not selected
            setVendorDetails({
                ...vendorDetails,
                servicesProvided: [...currentServices, serviceId]
            });
        }
    };

    const handleVendorDetailsSubmit = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/vendor/createVendor`, vendorDetails);
            showSnackbar("Vendor details saved successfully", "success");
            setOpenVendorDetailsDialog(false);
            fetchUsers();
            resetForm();
        } catch (error) {
            showSnackbar("Failed to save vendor details", "error");
            setOpenVendorDetailsDialog(false);
            fetchUsers();
            resetForm();
        }
    };

    const showSnackbar = (message, severity = "success") => {
        setSnackbar({
            open: true,
            message,
            severity
        });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({
            ...snackbar,
            open: false
        });
    };

    const getRoleIcon = (role) => {
        switch (role) {
            case "Admin":
                return <AdminIcon color="primary" />;
            case "Agent":
                return <AgentIcon color="secondary" />;
            case "Vendor":
                return <VendorIcon style={{ color: "#4caf50" }} />;
            default:
                return <PersonIcon />;
        }
    };

    const getStatusChip = (isActive) => {
        return isActive === "true" ? (
            <Chip
                label="Active"
                color="success"
                size="small"
                variant="outlined"
            />
        ) : (
            <Chip
                label="Inactive"
                color="error"
                size="small"
                variant="outlined"
            />
        );
    };

    const columns = [
        {
            field: "name",
            headerName: "Name",
            flex: 2,
        },
        
        { field: "email", headerName: "Email", flex: 2 },
        { field: "phone", headerName: "Phone", flex: 1 },
        {
            field: "role",
            headerName: "Role",
            flex: 1,
            renderCell: (params) => (
                <Box display="flex" alignItems="center" gap={1}>
                    {getRoleIcon(params.value)}
                    <Typography variant="body2">{params.value}</Typography>
                </Box>
            ),
        },
        {
            field: "isActive",
            headerName: "Status",
            flex: 1,
            renderCell: (params) => getStatusChip(params.value),
        },
        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            flex: 1,
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<EditIcon />}
                    label="Edit"
                    onClick={() => handleEditUser(params.row)}
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete"
                    onClick={() => handleDeleteUser(params.row)}
                />,
            ],
        },
    ];

    return (
        <Container maxWidth="xl">
            <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h5" component="h1">
                        User Management
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => {
                            resetForm();
                            setOpenUserDialog(true);
                        }}
                    >
                        Add User
                    </Button>
                </Box>

                <Box display="flex" mb={3} gap={2} flexWrap="wrap" alignItems="center">
                    <TextField
                        placeholder="Search users..."
                        variant="outlined"
                        size="small"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ minWidth: 250 }}
                    />
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel id="role-filter-label">Role</InputLabel>
                        <Select
                            labelId="role-filter-label"
                            id="role-filter"
                            value={roleFilter}
                            label="Role"
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <MenuItem value="All">All Roles</MenuItem>
                            <MenuItem value="Admin">Admin</MenuItem>
                            <MenuItem value="Agent">Agent</MenuItem>
                            <MenuItem value="Vendor">Vendor</MenuItem>
                        </Select>
                    </FormControl>
                    <IconButton onClick={fetchUsers} color="primary" title="Refresh">
                        <RefreshIcon />
                    </IconButton>
                </Box>

                <Box sx={{ height: 500, width: '100%' }}>
                    {dataLoading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                            <CircularProgress />
                        </Box>
                    ) : (
                        <DataGrid
                            rows={filteredUsers}
                            columns={columns}
                            pageSize={10}
                            rowsPerPageOptions={[5, 10, 25]}
                            disableSelectionOnClick
                            density="comfortable"
                            initialState={{
                                pagination: {
                                    pageSize: 10,
                                },
                                sorting: {
                                    sortModel: [{ field: 'name', sort: 'asc' }],
                                },
                            }}
                        />
                    )}
                </Box>
            </Paper>

            {/* User Registration/Edit Dialog */}
            <Dialog
                open={openUserDialog}
                onClose={() => setOpenUserDialog(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>{isEditMode ? "Edit User" : "Add New User"}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                label="Name"
                                name="name"
                                value={isEditMode ? updateUser.name : registerUser.name}
                                onChange={isEditMode ? handleUpdateChange : handleRegisterChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Email"
                                name="email"
                                type="email"
                                value={isEditMode ? updateUser.email : registerUser.email}
                                onChange={isEditMode ? handleUpdateChange : handleRegisterChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Phone"
                                name="phone"
                                value={isEditMode ? updateUser.phone : registerUser.phone}
                                onChange={isEditMode ? handleUpdateChange : handleRegisterChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        {!isEditMode && (
                            <Grid item xs={12}>
                                <FormControl fullWidth required>
                                    <InputLabel>Role</InputLabel>
                                    <Select
                                        name="role"
                                        value={registerUser.role}
                                        onChange={handleRegisterChange}
                                        label="Role"
                                    >
                                        <MenuItem value="Admin">Admin</MenuItem>
                                        <MenuItem value="Agent">Agent</MenuItem>
                                        <MenuItem value="Vendor">Vendor</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        )}
                        {isEditMode && (
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        name="isActive"
                                        value={updateUser.isActive.toString()}
                                        onChange={handleUpdateChange}
                                        label="Status"
                                    >
                                        <MenuItem value="true">Active</MenuItem>
                                        <MenuItem value="false">Inactive</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        )}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenUserDialog(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUserSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress size={24} /> : isEditMode ? "Update" : "Register"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Vendor Details Dialog */}
            <Dialog
                open={openVendorDetailsDialog}
                onClose={() => setOpenVendorDetailsDialog(false)}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>Vendor Details</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom>
                                Services Provided
                            </Typography>
                            {isLoading ? (
                                <CircularProgress size={24} />
                            ) : (
                                <FormGroup row>
                                    {services.map((service) => (
                                        <FormControlLabel
                                            key={service._id}
                                            control={
                                                <Checkbox
                                                    checked={vendorDetails.servicesProvided.includes(service._id)}
                                                    onChange={() => handleServiceCheckboxChange(service._id)}
                                                    name={`service-${service._id}`}
                                                />
                                            }
                                            label={service.name}
                                        />
                                    ))}
                                </FormGroup>
                            )}
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom>
                                Shop Address
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Address Line 1"
                                name="shopAddress.addressLine1"
                                value={vendorDetails.shopAddress.addressLine1}
                                onChange={handleVendorDetailsChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Address Line 2"
                                name="shopAddress.addressLine2"
                                value={vendorDetails.shopAddress.addressLine2}
                                onChange={handleVendorDetailsChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="City"
                                name="shopAddress.city"
                                value={vendorDetails.shopAddress.city}
                                onChange={handleVendorDetailsChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="State"
                                name="shopAddress.state"
                                value={vendorDetails.shopAddress.state}
                                onChange={handleVendorDetailsChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="Zip Code"
                                name="shopAddress.zipCode"
                                value={vendorDetails.shopAddress.zipCode}
                                onChange={handleVendorDetailsChange}
                                fullWidth
                                required
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenVendorDetailsDialog(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleVendorDetailsSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress size={24} /> : "Save Details"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete user "{selectedUser?.name}"? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={confirmDeleteUser}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default AdminUsers;