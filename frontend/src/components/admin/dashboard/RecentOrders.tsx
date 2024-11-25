import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

interface Order {
  id: string;
  customer: string;
  date: string;
  amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  items: number;
}

const recentOrders: Order[] = [
  {
    id: 'ORD-001',
    customer: 'John Smith',
    date: '2023-11-15',
    amount: 245.99,
    status: 'pending',
    items: 3,
  },
  {
    id: 'ORD-002',
    customer: 'Sarah Johnson',
    date: '2023-11-15',
    amount: 789.50,
    status: 'processing',
    items: 5,
  },
  {
    id: 'ORD-003',
    customer: 'Michael Brown',
    date: '2023-11-14',
    amount: 129.99,
    status: 'shipped',
    items: 2,
  },
  {
    id: 'ORD-004',
    customer: 'Emma Wilson',
    date: '2023-11-14',
    amount: 459.99,
    status: 'delivered',
    items: 4,
  },
];

const getStatusColor = (status: Order['status']) => {
  const colors = {
    pending: 'warning',
    processing: 'info',
    shipped: 'primary',
    delivered: 'success',
  };
  return colors[status];
};

export const RecentOrders: React.FC = () => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Recent Orders
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>${order.amount.toFixed(2)}</TableCell>
                <TableCell>{order.items}</TableCell>
                <TableCell>
                  <Chip
                    label={order.status}
                    color={getStatusColor(order.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="View Order">
                    <IconButton size="small">
                      <ViewIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit Order">
                    <IconButton size="small">
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};