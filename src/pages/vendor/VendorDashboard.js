import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Container, 
  Paper,
  CircularProgress
} from '@mui/material';
import { 
  PieChart, Pie, ResponsiveContainer, Legend, Tooltip, Cell
} from 'recharts';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import axios from 'axios';

const Dashboard = () => {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://r0rvz7pf-3000.inc1.devtunnels.ms/api/order/summary');
        setOrderData(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchOrderData();
  }, []);

  // Prepare data for pie chart (including total)
  const preparePieChartData = () => {
    if (!orderData) return [];
    
    return [
      { name: 'Total', value: orderData.totalOrders, color: '#3B82F6' }, // Bright blue
      { name: 'Completed', value: orderData.completedOrders, color: '#10B981' }, // Bright green
      { name: 'Pending', value: orderData.pendingOrders, color: '#F59E0B' }, // Bright amber
      { name: 'Cancelled', value: orderData.cancelledOrders, color: '#EF4444' } // Bright red
    ];
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard Overview
        </Typography>
      </Box>

      {/* Summary Cards with consistent styling */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            height: '100%',
            borderLeft: '4px solid #3B82F6', // Bright blue
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <ShoppingCartIcon sx={{ color: '#3B82F6', mr: 1 }} />
                <Typography variant="h6" component="div">
                  Total Orders
                </Typography>
              </Box>
              <Typography variant="h3" component="div" sx={{ mt: 1 }}>
                {orderData?.totalOrders || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            height: '100%',
            borderLeft: '4px solid #10B981', // Bright green
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CheckCircleIcon sx={{ color: '#10B981', mr: 1 }} />
                <Typography variant="h6" component="div">
                  Completed
                </Typography>
              </Box>
              <Typography variant="h3" component="div" sx={{ mt: 1 }}>
                {orderData?.completedOrders || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            height: '100%',
            borderLeft: '4px solid #F59E0B', // Bright amber
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PendingIcon sx={{ color: '#F59E0B', mr: 1 }} />
                <Typography variant="h6" component="div">
                  Pending
                </Typography>
              </Box>
              <Typography variant="h3" component="div" sx={{ mt: 1 }}>
                {orderData?.pendingOrders || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            height: '100%',
            borderLeft: '4px solid #EF4444', // Bright red
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CancelIcon sx={{ color: '#EF4444', mr: 1 }} />
                <Typography variant="h6" component="div">
                  Cancelled
                </Typography>
              </Box>
              <Typography variant="h3" component="div" sx={{ mt: 1 }}>
                {orderData?.cancelledOrders || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Full-width Pie Chart with improved spacing */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper 
            sx={{ 
              p: 2, // Increased padding
              display: 'flex', 
              flexDirection: 'column', 
              height: 500,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            {/* Fixed title with more space and higher prominence */}
            <Typography 
              variant="h5" 
              component="h2" 
              gutterBottom 
              sx={{ 
                mb: 3,
                textAlign: 'center',
                fontWeight: 'medium'
              }}
            >
              Order Status Distribution
            </Typography>
            
            <Box sx={{ height: 'calc(100% - 60px)', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                  <Pie
                    data={preparePieChartData()}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={150} // Reduced slightly to ensure it fits
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {preparePieChartData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} orders`, name]} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;