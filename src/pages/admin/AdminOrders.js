import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  Tabs,
  Tab,
  Paper,
  CircularProgress,
  Avatar
} from "@mui/material";
import {
  ArrowBack,
  Assignment,
  LocationOn,
  Person,
  Build,
  Inventory
} from "@mui/icons-material";
import axios from "axios";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://r0rvz7pf-3000.inc1.devtunnels.ms/api/order/getMyOrders");
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        console.error("Failed to fetch orders:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getFilteredOrders = () => {
    switch (tabValue) {
      case 0: // All
        return orders;
      case 1: // Pending
        return orders.filter(order => order.orderStatus === "Pending");
      case 2: // Completed
        return orders.filter(order => order.orderStatus === "Completed");
      case 3: // Cancelled
        return orders.filter(order => order.orderStatus === "Cancelled");
      default:
        return orders;
    }
  };

  const getStatusChip = (status) => {
    let backgroundColor;

    switch (status) {
      case "Pending":
        backgroundColor = "#FFF3E0";
        return (
          <Box
            sx={{
              display: "inline-block",
              borderRadius: 1,
              px: 2,
              py: 0.5,
              backgroundColor: "#FFF3E0",
              color: "#FF9800",
              fontWeight: "medium"
            }}
          >
            {status}
          </Box>
        );
      case "Completed":
        return (
          <Box
            sx={{
              display: "inline-block",
              borderRadius: 1,
              px: 2,
              py: 0.5,
              backgroundColor: "#E8F5E9",
              color: "#4CAF50",
              fontWeight: "medium"
            }}
          >
            {status}
          </Box>
        );
      case "Cancelled":
        return (
          <Box
            sx={{
              display: "inline-block",
              borderRadius: 1,
              px: 2,
              py: 0.5,
              backgroundColor: "#FFEBEE",
              color: "#F44336",
              fontWeight: "medium"
            }}
          >
            {status}
          </Box>
        );
      default:
        return (
          <Box
            sx={{
              display: "inline-block",
              borderRadius: 1,
              px: 2,
              py: 0.5,
              backgroundColor: "#F5F5F5",
              color: "#9E9E9E",
              fontWeight: "medium"
            }}
          >
            {status}
          </Box>
        );
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Orders
        </Typography>

        <Box sx={{ mt: 4, mb: 3, display: "flex", alignItems: "center" }}>
          <Avatar sx={{ mr: 2, bgcolor: "#f0f0f0" }}>
            <Inventory sx={{ color: "#333" }} />
          </Avatar>
          <Typography variant="h5" component="h2">
            My Orders
          </Typography>
        </Box>

        <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: "divider" }}
            TabIndicatorProps={{
              style: {
                backgroundColor: "#2196F3"
              }
            }}
          >
            <Tab
              label="All"
              sx={{
                textTransform: "none",
                fontWeight: tabValue === 0 ? "bold" : "normal",
                color: tabValue === 0 ? "#2196F3" : "inherit"
              }}
            />
            <Tab
              label="Pending"
              sx={{
                textTransform: "none",
                fontWeight: tabValue === 1 ? "bold" : "normal",
                color: tabValue === 1 ? "#2196F3" : "inherit"
              }}
            />
            <Tab
              label="Completed"
              sx={{
                textTransform: "none",
                fontWeight: tabValue === 2 ? "bold" : "normal",
                color: tabValue === 2 ? "#2196F3" : "inherit"
              }}
            />
            <Tab
              label="Cancelled"
              sx={{
                textTransform: "none",
                fontWeight: tabValue === 3 ? "bold" : "normal",
                color: tabValue === 3 ? "#2196F3" : "inherit"
              }}
            />
          </Tabs>

          <Box sx={{ p: 2 }}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={2}>
                {getFilteredOrders().map((order) => (
                  <Grid item xs={12} sm={6} md={4} key={order._id}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                        borderRadius: 2,
                        cursor: "pointer",
                        transition: "transform 0.2s, box-shadow 0.2s",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)"
                        }
                      }}
                      onClick={() => handleViewOrder(order)}
                    >
                      <CardContent sx={{ flexGrow: 1, "&:last-child": { pb: 2 } }}>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                          <Assignment sx={{ color: "#2196F3", mr: 1 }} />
                          <Typography variant="h6" component="div" color="primary">
                            Order ID: {order.orderID}
                          </Typography>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                          <LocationOn sx={{ color: "#FF5722", mr: 1, mt: 0.5, fontSize: 20 }} />
                          <Typography variant="body2" color="text.secondary">
                            {order.propertyAddress.addressLine1}, {order.propertyAddress.city}, {order.propertyAddress.state} {order.propertyAddress.zipCode}
                          </Typography>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                          <Person sx={{ color: "#3F51B5", mr: 1, fontSize: 20 }} />
                          <Typography variant="body2" color="text.secondary">
                            {order.ownerDetails.name} ({order.ownerDetails.email})
                          </Typography>
                        </Box>

                        <Box sx={{ mt: 1 }}>
                          {getStatusChip(order.orderStatus)}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Paper>
      </Box>

      {/* Order Detail Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {selectedOrder && (
          <>
            <DialogTitle>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Button
                  startIcon={<ArrowBack />}
                  onClick={handleCloseDialog}
                  sx={{ mr: 2, minWidth: "40px", p: 0 }}
                >
                  Back
                </Button>
                <Typography variant="h6">Order Details</Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 3 }}>
                
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  
                  <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%', borderRadius: 2, boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}>
                      <CardContent>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                          <Assignment sx={{ color: "#2196F3", mr: 1 }} />
                          <Typography variant="h6" component="div" color="primary">
                            Order Information
                          </Typography>
                        </Box>

                        <Box sx={{
                          mt: 2,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <Typography variant="body1">
                            <strong>Order ID:</strong> {selectedOrder.orderID}
                          </Typography>

                          
                        </Box>

                        <Typography variant="body1" sx={{ mt: 2 }}>
                          <strong>Date & Time :</strong> {new Date(selectedOrder.createdAt).toLocaleString()}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 2 }}>
                        {getStatusChip(selectedOrder.orderStatus)}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Property Address Card - Right side */}
                  <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%', borderRadius: 2, boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}>
                      <CardContent>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                          <LocationOn sx={{ color: "#FF5722", mr: 1 }} />
                          <Typography variant="h6" component="div" color="primary">
                            Property Address
                          </Typography>
                        </Box>
                        <Box sx={{ mt: 2 }}>
                          <Grid container spacing={1}>
                            <Grid item xs={5} sm={4}>
                              <Typography variant="body2"><strong>Address Line 1:</strong></Typography>
                            </Grid>
                            <Grid item xs={7} sm={8}>
                              <Typography variant="body2">{selectedOrder.propertyAddress.addressLine1}</Typography>
                            </Grid>

                            {selectedOrder.propertyAddress.addressLine2 && (
                              <>
                                <Grid item xs={5} sm={4}>
                                  <Typography variant="body2"><strong>Address Line 2:</strong></Typography>
                                </Grid>
                                <Grid item xs={7} sm={8}>
                                  <Typography variant="body2">{selectedOrder.propertyAddress.addressLine2}</Typography>
                                </Grid>
                              </>
                            )}

                            <Grid item xs={5} sm={4}>
                              <Typography variant="body2"><strong>City:</strong></Typography>
                            </Grid>
                            <Grid item xs={7} sm={8}>
                              <Typography variant="body2">{selectedOrder.propertyAddress.city}</Typography>
                            </Grid>

                            <Grid item xs={5} sm={4}>
                              <Typography variant="body2"><strong>State:</strong></Typography>
                            </Grid>
                            <Grid item xs={7} sm={8}>
                              <Typography variant="body2">{selectedOrder.propertyAddress.state}</Typography>
                            </Grid>

                            <Grid item xs={5} sm={4}>
                              <Typography variant="body2"><strong>ZIP Code:</strong></Typography>
                            </Grid>
                            <Grid item xs={7} sm={8}>
                              <Typography variant="body2">{selectedOrder.propertyAddress.zipCode}</Typography>
                            </Grid>
                          </Grid>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* Second row: Owner Details and Agent Details side by side */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  {/* Owner Details Card - Left side */}
                  <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%', borderRadius: 2, boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}>
                      <CardContent>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                          <Person sx={{ color: "#3F51B5", mr: 1 }} />
                          <Typography variant="h6" component="div" color="primary">
                            Owner Details
                          </Typography>
                        </Box>

                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body1">
                            <strong>Name:</strong> {selectedOrder.ownerDetails.name}
                          </Typography>
                          <Typography variant="body1">
                            <strong>Email:</strong> {selectedOrder.ownerDetails.email}
                          </Typography>
                          <Typography variant="body1">
                            <strong>Contact:</strong> {selectedOrder.ownerDetails.contactNumber}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Agent Details Card - Right side */}
                  <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%', borderRadius: 2, boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}>
                      <CardContent>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                          <Person sx={{ color: "#E91E63", mr: 1 }} />
                          <Typography variant="h6" component="div" color="primary">
                            Agent Details
                          </Typography>
                        </Box>

                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body1">
                            <strong>Name:</strong> {selectedOrder.agentId.name}
                          </Typography>
                          <Typography variant="body1">
                            <strong>Email:</strong> {selectedOrder.agentId.email}
                          </Typography>
                          <Typography variant="body1">
                            <strong>Contact:</strong> {selectedOrder.agentId.phone}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* Third row: Services (full width) */}
                <Card sx={{ borderRadius: 2, boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Build sx={{ color: "#4CAF50", mr: 1 }} />
                      <Typography variant="h6" component="div" color="primary">
                        Services
                      </Typography>
                    </Box>

                    {selectedOrder.services.map((service, index) => (
                      <Box key={service._id} sx={{ mt: 2 }}>
                        <Typography variant="body1">
                          <strong>{index + 1}. Service:</strong> {service.serviceType.name}
                        </Typography>

                        <Box sx={{ mt: 1, pl: 2, borderLeft: "3px solid #1976D2" }}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                            Vendor Details:
                          </Typography>
                          <Typography variant="body2" sx={{ ml: 2 }}>
                            <strong>Name:</strong> {service.vendor.name} <br />
                            <strong>Email:</strong> {service.vendor.email}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default OrdersPage;