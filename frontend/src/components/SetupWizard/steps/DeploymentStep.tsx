import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  FormControl,
  FormLabel,
  styled,
} from '@mui/material';
import type { DeploymentSetupData } from '@/types/setup';

const StyledCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

interface DeploymentStepProps {
  data: DeploymentSetupData;
  onUpdate: (data: DeploymentSetupData) => void;
}

const deploymentOptions = [
  {
    value: 'github-pages',
    label: 'GitHub Pages',
    description: 'Deploy frontend to GitHub Pages with a separate backend',
  },
  {
    value: 'vercel',
    label: 'Vercel',
    description: 'Deploy both frontend and backend to Vercel',
  },
  {
    value: 'custom',
    label: 'Custom Deployment',
    description: 'Configure custom deployment settings',
  },
];

const DeploymentStep: React.FC<DeploymentStepProps> = ({ data, onUpdate }) => {
  const [deployment, setDeployment] = useState(data.frontendDeployment || 'github-pages');
  const [domain, setDomain] = useState(data.domain || '');

  const handleDeploymentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDeployment = event.target.value;
    setDeployment(newDeployment);
    onUpdate({
      ...data,
      frontendDeployment: newDeployment,
      backendDeployment: newDeployment === 'vercel' ? 'vercel' : 'custom',
      domain,
    });
  };

  const handleDomainChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDomain = event.target.value;
    setDomain(newDomain);
    onUpdate({
      ...data,
      domain: newDomain,
    });
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Deployment Configuration
      </Typography>
      <Typography variant="body1" paragraph>
        Choose how you want to deploy your e-commerce platform.
      </Typography>

      <StyledCard>
        <CardContent>
          <StyledFormControl component="fieldset">
            <FormLabel component="legend">Deployment Platform</FormLabel>
            <RadioGroup
              value={deployment}
              onChange={handleDeploymentChange}
            >
              {deploymentOptions.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="subtitle1">{option.label}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {option.description}
                      </Typography>
                    </Box>
                  }
                />
              ))}
            </RadioGroup>
          </StyledFormControl>

          <TextField
            fullWidth
            label="Domain (optional)"
            variant="outlined"
            value={domain}
            onChange={handleDomainChange}
            helperText="Enter your custom domain if you have one"
            sx={{ mt: 2 }}
          />
        </CardContent>
      </StyledCard>

      <Typography variant="body2" color="textSecondary">
        You can change these settings later in the admin dashboard.
      </Typography>
    </Box>
  );
};

export default DeploymentStep;
