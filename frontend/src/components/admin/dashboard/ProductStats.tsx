import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';

const topProducts = [
  {
    name: 'Copper Pipe 15mm',
    sales: 245,
    trend: 'up',
    percentage: 12,
  },
  {
    name: 'Basin Mixer Tap',
    sales: 190,
    trend: 'up',
    percentage: 8,
  },
  {
    name: 'Shower Head',
    sales: 175,
    trend: 'down',
    percentage: 5,
  },
  {
    name: 'PVC Pipe 22mm',
    sales: 156,
    trend: 'up',
    percentage: 15,
  },
];

export const ProductStats: React.FC = () => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Top Products
      </Typography>
      <List>
        {topProducts.map((product, index) => (
          <React.Fragment key={product.name}>
            <ListItem>
              <ListItemAvatar>
                <Avatar
                  sx={{
                    bgcolor: product.trend === 'up' ? 'success.light' : 'error.light',
                  }}
                >
                  {product.trend === 'up' ? (
                    <TrendingUpIcon />
                  ) : (
                    <TrendingDownIcon />
                  )}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={product.name}
                secondary={`${product.sales} sales`}
              />
              <Typography
                variant="body2"
                sx={{
                  color: product.trend === 'up' ? 'success.main' : 'error.main',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {product.trend === 'up' ? '+' : '-'}
                {product.percentage}%
              </Typography>
            </ListItem>
            {index < topProducts.length - 1 && <Divider variant="inset" />}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};