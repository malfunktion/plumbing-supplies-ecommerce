import React from 'react';
import { Grid, Paper, Box } from '@mui/material';
import {
  ShoppingCart as OrdersIcon,
  Inventory as ProductsIcon,
  People as CustomersIcon,
  AttachMoney as RevenueIcon,
} from '@mui/icons-material';
import { StatsCard } from '../../shared/StatsCard';
import { SalesChart } from './SalesChart';
import { OrderStats } from './OrderStats';
import { ProductStats } from './ProductStats';
import { RecentOrders } from './RecentOrders';

export const AdminDashboard: React.FC = () => {
  return (
    <Box>
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Orders"
            value="156"
            icon={<OrdersIcon fontSize="large" />}
            trend={{ value: 12, isPositive: true }}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Products"
            value="2,345"
            icon={<ProductsIcon fontSize="large" />}
            trend={{ value: 5, isPositive: true }}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Customers"
            value="1,234"
            icon={<CustomersIcon fontSize="large" />}
            trend={{ value: 8, isPositive: true }}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Revenue"
            value="$45,678"
            icon={<RevenueIcon fontSize="large" />}
            trend={{ value: 15, isPositive: true }}
            color="#9c27b0"
          />
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <SalesChart />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <OrderStats />
          </Paper>
        </Grid>

        {/* Product Stats and Recent Orders */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <ProductStats />
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <RecentOrders />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};