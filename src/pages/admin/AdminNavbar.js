import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";

import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Dashboard as DashboardIcon,
  People as UsersIcon,
  Store as ProductsIcon,
  ShoppingCart as OrdersIcon,
  Settings as SettingsIcon,
  ChevronLeft as ChevronLeftIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;
const miniDrawerWidth = 64;

const AdminNavbar = () => {
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const profileOpen = Boolean(profileAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setProfileAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleNavigate = (path) => {
    navigate(path);
    
  };
  const handleDrawerOpenToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
    { text: "Users", icon: <UsersIcon />, path: "/admin/users" },
    { text: "Vendor", icon: <UsersIcon />, path: "/admin/vendors" },
    { text: "Service", icon: <ProductsIcon />, path: "/admin/services" },
    { text: "Orders", icon: <OrdersIcon />, path: "/admin/orders" },
  ];

  const drawer = (
    <>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: drawerOpen ? 'flex-end' : 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
      }}>
        {drawerOpen && (
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              ml: 2,
              fontWeight: 'bold'
            }}
          >
            Admin Panel
          </Typography>
        )}
        <IconButton onClick={handleDrawerOpenToggle}>
          {drawerOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => {
          const isSelected = location.pathname === item.path;

          return (
            <Tooltip
              title={!drawerOpen ? item.text : ""}
              placement="right"
              arrow
              disableHoverListener={drawerOpen}
            >
              <ListItem
                button
                key={item.text}
                onClick={() => {
                  navigate(item.path);
                  if (mobileOpen) handleDrawerToggle();
                }}
                sx={{
                  minHeight: 48,
                  justifyContent: drawerOpen ? 'initial' : 'center',
                  px: 2.5,
                  borderLeft: isSelected ? '4px solid' : 'none',
                  borderColor: isSelected ? 'primary.main' : 'transparent',
                  backgroundColor: isSelected ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.08)',
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: drawerOpen ? 3 : 'auto',
                    justifyContent: 'center',
                    color: isSelected ? 'primary.main' : 'inherit'
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {drawerOpen && (
                  <ListItemText
                    primary={item.text}
                    sx={{
                      opacity: drawerOpen ? 1 : 0,
                      color: isSelected ? 'primary.main' : 'inherit',
                      fontWeight: isSelected ? 'bold' : 'normal',
                    }}
                  />
                )}
              </ListItem>
            </Tooltip>
          );
        })}
      </List>
    </>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          width: { sm: drawerOpen ? `calc(100% - ${drawerWidth}px)` : `calc(100% - ${miniDrawerWidth}px)` },
          ml: { sm: drawerOpen ? `${drawerWidth}px` : `${miniDrawerWidth}px` },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Admin Portal
          </Typography>

          {/* Notification Icon */}
          <IconButton color="inherit" size="large">
            <NotificationsIcon />
          </IconButton>

          {/* Profile Section */}
          <Box sx={{ ml: 2 }}>
            <Tooltip title="Account settings">
              <IconButton
                onClick={handleProfileMenuOpen}
                size="small"
                aria-controls={profileOpen ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={profileOpen ? "true" : undefined}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={profileAnchorEl}
              id="account-menu"
              open={profileOpen}
              onClose={handleMenuClose}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={() => { handleNavigate('/admin/profile'); handleMenuClose(); }}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>My Profile</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => { handleNavigate('/logout'); handleMenuClose(); }}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Permanent drawer (desktop) */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerOpen ? drawerWidth : miniDrawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerOpen ? drawerWidth : miniDrawerWidth,
            boxSizing: "border-box",
            overflowX: 'hidden',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
          display: { xs: "none", sm: "block" },
        }}
        open={drawerOpen}
      >
        {drawer}
      </Drawer>

      {/* Temporary drawer (mobile) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
        }}
      >
        {drawer}
      </Drawer>


    </>
  );
};

export default AdminNavbar;