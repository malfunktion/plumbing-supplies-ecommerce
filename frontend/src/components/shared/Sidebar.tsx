import React from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Collapse,
  Divider,
  Box,
  Typography,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  ShoppingCart as OrdersIcon,
  People as CustomersIcon,
  Person as EmployeesIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

interface MenuItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    path: '/admin/dashboard',
    icon: <DashboardIcon />,
  },
  {
    title: 'Products',
    path: '/admin/products',
    icon: <InventoryIcon />,
    children: [
      {
        title: 'All Products',
        path: '/admin/products/list',
        icon: <InventoryIcon />,
      },
      {
        title: 'Categories',
        path: '/admin/products/categories',
        icon: <CategoryIcon />,
      },
    ],
  },
  {
    title: 'Orders',
    path: '/admin/orders',
    icon: <OrdersIcon />,
    children: [
      {
        title: 'All Orders',
        path: '/admin/orders/list',
        icon: <OrdersIcon />,
      },
      {
        title: 'Pending',
        path: '/admin/orders/pending',
        icon: <OrdersIcon />,
      },
    ],
  },
  {
    title: 'Customers',
    path: '/admin/customers',
    icon: <CustomersIcon />,
  },
  {
    title: 'Employees',
    path: '/admin/employees',
    icon: <EmployeesIcon />,
  },
  {
    title: 'Reports',
    path: '/admin/reports',
    icon: <ReportsIcon />,
  },
  {
    title: 'Settings',
    path: '/admin/settings',
    icon: <SettingsIcon />,
  },
];

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  const handleMenuClick = (item: MenuItem) => {
    if (item.children) {
      setOpenMenus(prev => ({
        ...prev,
        [item.path]: !prev[item.path],
      }));
    } else {
      navigate(item.path);
    }
  };

  const renderMenuItem = (item: MenuItem, depth: number = 0) => {
    const isSelected = location.pathname === item.path;
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openMenus[item.path];

    return (
      <React.Fragment key={item.path}>
        <ListItem
          disablePadding
          sx={{ display: 'block' }}
        >
          <ListItemButton
            selected={isSelected}
            onClick={() => handleMenuClick(item)}
            sx={{
              minHeight: 48,
              justifyContent: 'initial',
              pl: depth * 2 + 2,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: 3,
                justifyContent: 'center',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.title}
              sx={{ opacity: 1 }}
            />
            {hasChildren && (
              isOpen ? <ExpandLess /> : <ExpandMore />
            )}
          </ListItemButton>
        </ListItem>
        {hasChildren && (
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map(child => renderMenuItem(child, depth + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  return (
    <Box sx={{ overflow: 'auto' }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" color="primary">
          Plumbing Supplies
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map(item => renderMenuItem(item))}
      </List>
    </Box>
  );
};