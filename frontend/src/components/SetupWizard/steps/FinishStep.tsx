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
  CheckCircle as CheckIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

const StyledCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const nextSteps = [
  {
    title: 'Add Products',
    description: 'Start adding your plumbing supplies to the catalog',
  },
  {
    title: 'Configure Categories',
    description: 'Organize your products into categories',
  },
  {
    title: 'Customize Theme',
    description: 'Adjust the look and feel of your store',
  },
  {
    title: 'Set Up Payment',
    description: 'Configure payment methods and pricing',
  },
];

const FinishStep: React.FC = () => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Setup Complete!
      </Typography>
      <Typography variant="body1" paragraph>
        Congratulations! Your e-commerce platform is now configured and ready to use.
      </Typography>

      <StyledCard>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Next Steps
          </Typography>
          <List>
            {nextSteps.map((step, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <CheckIcon color="success" />
                </ListItemIcon>
                <ListItemText
                  primary={step.title}
                  secondary={step.description}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </StyledCard>

      <StyledCard>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <InfoIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">
              Need Help?
            </Typography>
          </Box>
          <Typography variant="body1" paragraph>
            Visit our documentation for detailed guides on:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="• Product management best practices" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Order processing workflows" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Customer management features" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Advanced configuration options" />
            </ListItem>
          </List>
        </CardContent>
      </StyledCard>

      <Typography variant="body2" color="textSecondary">
        Click 'Finish' to go to your store dashboard.
      </Typography>
    </Box>
  );
};

export default FinishStep;
