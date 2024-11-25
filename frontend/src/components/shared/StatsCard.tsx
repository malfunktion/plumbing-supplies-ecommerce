import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  description,
  trend,
  color,
}) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        '&:before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100%',
          height: '100%',
          background: color || theme.palette.primary.main,
          opacity: 0.1,
          borderRadius: 1,
        },
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ color: color || theme.palette.primary.main }}>
            {icon}
          </Box>
          {description && (
            <Tooltip title={description} arrow placement="top">
              <IconButton size="small">
                <InfoIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="h4" component="div">
            {value}
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{ color: theme.palette.text.secondary }}
          >
            {title}
          </Typography>
        </Box>

        {trend && (
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
            <Typography
              variant="body2"
              sx={{
                color: trend.isPositive
                  ? theme.palette.success.main
                  : theme.palette.error.main,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: theme.palette.text.secondary, ml: 1 }}
            >
              from last month
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};