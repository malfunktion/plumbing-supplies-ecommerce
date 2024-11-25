import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', sales: 4000, orders: 240 },
  { month: 'Feb', sales: 3000, orders: 198 },
  { month: 'Mar', sales: 2000, orders: 150 },
  { month: 'Apr', sales: 2780, orders: 190 },
  { month: 'May', sales: 1890, orders: 170 },
  { month: 'Jun', sales: 2390, orders: 210 },
  { month: 'Jul', sales: 3490, orders: 250 },
];

export const SalesChart: React.FC = () => {
  const theme = useTheme();

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Sales Overview
      </Typography>
      <Box sx={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="sales"
              stroke={theme.palette.primary.main}
              activeDot={{ r: 8 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="orders"
              stroke={theme.palette.secondary.main}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};