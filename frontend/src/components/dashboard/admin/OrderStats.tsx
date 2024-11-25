import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { name: 'Pending', value: 25 },
  { name: 'Processing', value: 15 },
  { name: 'Shipped', value: 40 },
  { name: 'Delivered', value: 20 },
];

const COLORS = ['#ffa726', '#29b6f6', '#66bb6a', '#9575cd'];

export const OrderStats: React.FC = () => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Order Statistics
      </Typography>
      <Box sx={{ width: '100%', height: 200 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>
      <List>
        {data.map((item, index) => (
          <React.Fragment key={item.name}>
            <ListItem>
              <ListItemText
                primary={item.name}
                secondary={`${item.value} orders (${((item.value / total) * 100).toFixed(1)}%)`}
              />
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: COLORS[index % COLORS.length],
                }}
              />
            </ListItem>
            {index < data.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};