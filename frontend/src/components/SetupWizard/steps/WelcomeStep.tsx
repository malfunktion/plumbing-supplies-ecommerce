import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  styled,
} from '@mui/material';
import {
  Store as StoreIcon,
  ShoppingCart as CartIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

const StyledCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const features = [
  {
    icon: <StoreIcon color="primary" />,
    title: 'Product Management',
    description: 'Easily manage your plumbing supplies inventory',
  },
  {
    icon: <CartIcon color="primary" />,
    title: 'Order Processing',
    description: 'Streamlined order management and fulfillment',
  },
  {
    icon: <PeopleIcon color="primary" />,
    title: 'Customer Management',
    description: 'Track customer information and purchase history',
  },
  {
    icon: <SettingsIcon color="primary" />,
    title: 'Flexible Configuration',
    description: 'Customize the platform to your specific needs',
  },
];

const WelcomeStep: React.FC = () => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Welcome to Your Plumbing Supplies E-Commerce Platform
      </Typography>
      <Typography variant="body1" paragraph>
        This setup wizard will guide you through configuring your e-commerce platform.
        Follow the steps to get your store up and running quickly.
      </Typography>

      <StyledCard>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Key Features
          </Typography>
          <List>
            {features.map((feature, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  {feature.icon}
                </ListItemIcon>
                <ListItemText
                  primary={feature.title}
                  secondary={feature.description}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </StyledCard>

      <Typography variant="body2" color="textSecondary">
        Click 'Next' to begin the setup process.
      </Typography>
    </Box>
  );
};

export default WelcomeStep;
