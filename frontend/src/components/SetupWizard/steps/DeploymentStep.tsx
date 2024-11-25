import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  styled,
  SelectChangeEvent,
} from '@mui/material';
import type { DeploymentSetupData, DeploymentOption } from '@/types/setup';

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

const deploymentOptions: DeploymentOption[] = [
  {
    id: 'github-pages',
    name: 'GitHub Pages',
    description: 'Free hosting for static websites directly from your GitHub repository',
    features: ['Static site hosting', 'GitHub integration', 'Custom domains'],
    pricing: {
      free: true,
      startingPrice: '$0',
      plans: [
        {
          name: 'Free',
          price: '$0',
          features: ['1GB storage', 'GitHub Actions minutes', 'Custom domains'],
        },
      ],
    },
    auth: {
      type: 'oauth',
      provider: 'github',
      scope: ['repo', 'workflow'],
    },
    requirements: {
      minMemory: '512MB',
      minStorage: '1GB',
      minCpu: '1 core',
      requiredEnvironmentVars: ['GITHUB_TOKEN'],
    },
  },
  {
    id: 'vercel',
    name: 'Vercel',
    description: 'Zero-configuration deployment platform for frontend applications',
    features: ['Serverless functions', 'Edge network', 'Automatic HTTPS'],
    pricing: {
      free: true,
      startingPrice: '$0',
      plans: [
        {
          name: 'Hobby',
          price: '$0',
          features: ['Unlimited deployments', 'HTTPS', 'CI/CD'],
        },
        {
          name: 'Pro',
          price: '$20',
          features: ['Team collaboration', 'Advanced analytics', 'Priority support'],
        },
      ],
    },
    auth: {
      type: 'oauth',
      provider: 'vercel',
      scope: ['deployments', 'projects'],
    },
    requirements: {
      minMemory: '1GB',
      minStorage: '2GB',
      minCpu: '1 core',
      requiredEnvironmentVars: ['VERCEL_TOKEN'],
    },
  },
  {
    id: 'netlify',
    name: 'Netlify',
    description: 'All-in-one platform for automating modern web projects',
    features: ['CDN', 'Continuous deployment', 'Form handling'],
    pricing: {
      free: true,
      startingPrice: '$0',
      plans: [
        {
          name: 'Starter',
          price: '$0',
          features: ['Manual deploys', 'Basic build minutes', 'Community support'],
        },
        {
          name: 'Pro',
          price: '$19',
          features: ['Background functions', 'Password protection', 'Priority support'],
        },
      ],
    },
    auth: {
      type: 'oauth',
      provider: 'netlify',
      scope: ['deploy', 'sites'],
    },
    requirements: {
      minMemory: '1GB',
      minStorage: '2GB',
      minCpu: '1 core',
      requiredEnvironmentVars: ['NETLIFY_AUTH_TOKEN'],
    },
  },
];

const DeploymentStep: React.FC<DeploymentStepProps> = ({ data, onUpdate }) => {
  const [frontendDeployment, setFrontendDeployment] = useState(data.frontendDeployment || 'github-pages');
  const [backendDeployment, setBackendDeployment] = useState(data.backendDeployment || 'vercel');
  const [domain, setDomain] = useState(data.domain || '');

  const handleFrontendDeploymentChange = (event: SelectChangeEvent<string>) => {
    const newFrontendDeployment = event.target.value;
    setFrontendDeployment(newFrontendDeployment);
    onUpdate({
      ...data,
      frontendDeployment: newFrontendDeployment,
    });
  };

  const handleBackendDeploymentChange = (event: SelectChangeEvent<string>) => {
    const newBackendDeployment = event.target.value;
    setBackendDeployment(newBackendDeployment);
    onUpdate({
      ...data,
      backendDeployment: newBackendDeployment,
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
        Configure your deployment settings for both frontend and backend.
      </Typography>

      <StyledCard>
        <CardContent>
          <StyledFormControl fullWidth>
            <InputLabel id="frontend-deployment-label">Frontend Deployment</InputLabel>
            <Select
              labelId="frontend-deployment-label"
              value={frontendDeployment}
              label="Frontend Deployment"
              onChange={handleFrontendDeploymentChange}
            >
              {deploymentOptions.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  <Box>
                    <Typography variant="subtitle1">
                      {option.name}
                      {option.pricing?.free && (
                        <Typography component="span" color="success.main" sx={{ ml: 1 }}>
                          (Free)
                        </Typography>
                      )}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {option.description}
                    </Typography>
                    {option.pricing?.startingPrice && (
                      <Typography variant="body2" color="primary">
                        Starting from {option.pricing.startingPrice}
                      </Typography>
                    )}
                  </Box>
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Choose your frontend deployment platform</FormHelperText>
          </StyledFormControl>

          <StyledFormControl fullWidth>
            <InputLabel id="backend-deployment-label">Backend Deployment</InputLabel>
            <Select
              labelId="backend-deployment-label"
              value={backendDeployment}
              label="Backend Deployment"
              onChange={handleBackendDeploymentChange}
            >
              {deploymentOptions.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  <Box>
                    <Typography variant="subtitle1">
                      {option.name}
                      {option.pricing?.free && (
                        <Typography component="span" color="success.main" sx={{ ml: 1 }}>
                          (Free)
                        </Typography>
                      )}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {option.description}
                    </Typography>
                    {option.pricing?.startingPrice && (
                      <Typography variant="body2" color="primary">
                        Starting from {option.pricing.startingPrice}
                      </Typography>
                    )}
                  </Box>
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Choose your backend deployment platform</FormHelperText>
          </StyledFormControl>

          <StyledFormControl fullWidth>
            <TextField
              label="Domain"
              value={domain}
              onChange={handleDomainChange}
              helperText="Enter your custom domain (optional)"
            />
          </StyledFormControl>
        </CardContent>
      </StyledCard>
    </Box>
  );
};

export default DeploymentStep;
