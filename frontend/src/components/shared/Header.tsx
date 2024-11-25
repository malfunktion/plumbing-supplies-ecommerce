import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Badge,
  Tooltip,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Mail as MailIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

export const Header: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setNotificationsAnchor(null);
  };

  const handleLogout = () => {
    // Implement logout logic here
    handleMenuClose();
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {/* Notifications */}
      <Tooltip title="Notifications">
        <IconButton
          size="large"
          color="inherit"
          onClick={handleNotificationsOpen}
        >
          <Badge badgeContent={4} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={notificationsAnchor}
        open={Boolean(notificationsAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { width: 320, maxHeight: 400 },
        }}
      >
        <MenuItem>
          <Box sx={{ width: '100%' }}>
            <Typography variant="subtitle2">New Order #1234</Typography>
            <Typography variant="body2" color="text.secondary">
              A new order has been placed
            </Typography>
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem>
          <Box sx={{ width: '100%' }}>
            <Typography variant="subtitle2">Low Stock Alert</Typography>
            <Typography variant="body2" color="text.secondary">
              Product XYZ is running low
            </Typography>
          </Box>
        </MenuItem>
      </Menu>

      {/* Messages */}
      <Tooltip title="Messages">
        <IconButton size="large" color="inherit">
          <Badge badgeContent={2} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      {/* Profile */}
      <Tooltip title="Account settings">
        <IconButton
          size="large"
          edge="end"
          onClick={handleProfileMenuOpen}
          color="inherit"
          sx={{ ml: 1 }}
        >
          <Avatar sx={{ width: 32, height: 32 }}>A</Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { width: 220 },
        }}
      >
        <MenuItem onClick={handleMenuClose}>
          <PersonIcon sx={{ mr: 2 }} />
          Profile
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <SettingsIcon sx={{ mr: 2 }} />
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <LogoutIcon sx={{ mr: 2 }} />
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};