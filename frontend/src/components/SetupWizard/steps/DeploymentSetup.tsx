import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Alert,
  styled,
  Paper,
} from '@mui/material';
import { DeploymentConfigForm } from './DeploymentConfig';
import { deploymentPlatforms } from '@/services/deploymentValidation';
import { TokenInputModal } from '../modals/TokenInputModal';
import { CredentialsModal } from '../modals/CredentialsModal';
import type { DeploymentSetupProps } from '@/types/setup';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  '& .MuiTypography-h5': {
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(3),
  },
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiInputLabel-root': {
    color: theme.palette.text.secondary,
  },
  '& .MuiOutlinedInput-root': {
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  '&.MuiButton-containedPrimary': {
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}));

const deploymentOptions = {
  frontend: [
    {
      id: 'github-pages',
      name: 'GitHub Pages',
      description: 'Free hosting for static sites directly from your GitHub repository',
      features: ['Free forever', 'Easy GitHub integration', 'Automatic builds'],
      auth: {
        type: 'oauth',
        provider: 'github',
        scope: ['repo', 'workflow'],
        setupUrl: 'https://github.com/login/oauth/authorize'
      }
    },
    {
      id: 'vercel',
      name: 'Vercel',
      description: 'Zero-config deployments for static and JAMstack sites',
      features: ['Generous free tier', 'Automatic HTTPS', 'Global CDN'],
      auth: {
        type: 'oauth',
        provider: 'vercel',
        scope: ['read', 'write', 'deploy'],
        setupUrl: 'https://vercel.com/api/auth'
      }
    },
    {
      id: 'netlify',
      name: 'Netlify',
      description: 'All-in-one platform for automating modern web projects',
      features: ['Free tier available', 'Form handling', 'Identity service'],
      auth: {
        type: 'oauth',
        provider: 'netlify',
        scope: ['deploy', 'site'],
        setupUrl: 'https://app.netlify.com/authorize'
      }
    },
    {
      id: 'cloudflare-pages',
      name: 'Cloudflare Pages',
      description: 'Fast, secure hosting for frontend developers',
      features: ['Free tier with unlimited sites', 'Global CDN', 'Automatic git integration'],
      auth: {
        type: 'api-token',
        provider: 'cloudflare',
        setupUrl: 'https://dash.cloudflare.com/profile/api-tokens'
      }
    },
    {
      id: 'surge',
      name: 'Surge',
      description: 'Simple, single-command web publishing',
      features: ['Free tier available', 'Custom domain support', 'Easy CLI deployment'],
      auth: {
        type: 'credentials',
        provider: 'surge',
        setupUrl: 'https://surge.sh/help/adding-collaborators'
      }
    }
  ],
  backend: [
    {
      id: 'render',
      name: 'Render',
      description: 'Unified platform to build and run all your apps',
      features: ['Free tier available', 'Automatic HTTPS', 'Built-in CDN'],
      auth: {
        type: 'api-key',
        provider: 'render',
        setupUrl: 'https://render.com/docs/api'
      }
    },
    {
      id: 'railway',
      name: 'Railway',
      description: 'Infrastructure, Instantly',
      features: ['Free tier for development', 'One-click deployments', 'Built-in databases'],
      auth: {
        type: 'oauth',
        provider: 'railway',
        scope: ['project', 'deploy'],
        setupUrl: 'https://railway.app/cli'
      }
    },
    {
      id: 'fly-io',
      name: 'Fly.io',
      description: 'Run your full-stack apps close to your users',
      features: ['Generous free tier', 'Global deployment', 'Docker support'],
      auth: {
        type: 'api-token',
        provider: 'fly',
        setupUrl: 'https://fly.io/docs/flyctl/auth-token/'
      }
    },
    {
      id: 'cyclic',
      name: 'Cyclic',
      description: 'Fullstack JavaScript deployment made simple',
      features: ['Free tier available', 'Auto-scaling', 'Built-in monitoring'],
      auth: {
        type: 'oauth',
        provider: 'github',
        scope: ['repo'],
        setupUrl: 'https://app.cyclic.sh/api/login'
      }
    },
    {
      id: 'adaptable',
      name: 'Adaptable',
      description: 'Simple deployment platform for Node.js apps',
      features: ['Free tier for hobby projects', 'Auto-scaling', 'Easy database integration'],
      auth: {
        type: 'oauth',
        provider: 'github',
        scope: ['repo'],
        setupUrl: 'https://adaptable.io/docs/api-reference'
      }
    }
  ]
};

export const DeploymentSetup = ({ data, onUpdate, onNext, onBack }: DeploymentSetupProps) => {
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFrontendDeploymentChange = (value: string) => {
    onUpdate({
      frontendDeployment: value,
      frontendConfig: {},
      frontendAuth: { isAuthenticated: false },
    });
  };

  const handleBackendDeploymentChange = (value: string) => {
    onUpdate({
      backendDeployment: value,
      backendConfig: {},
      backendAuth: { isAuthenticated: false },
    });
  };

  const handleFrontendConfigChange = (config: any) => {
    onUpdate({
      frontendConfig: config,
    });
  };

  const handleBackendConfigChange = (config: any) => {
    onUpdate({
      backendConfig: config,
    });
  };

  const handleValidationStatus = (status: any, isBackend: boolean) => {
    onUpdate({
      validation: {
        ...data.validation,
        [isBackend ? 'backendValid' : 'frontendValid']: status.isValid,
        isValid: isBackend
          ? status.isValid && (data.validation?.frontendValid ?? true)
          : status.isValid && (data.validation?.backendValid ?? true),
      },
    });
  };

  const selectedFrontend = deploymentOptions.frontend.find(
    (p) => p.id === data.frontendDeployment
  );

  const selectedBackend = deploymentOptions.backend.find(
    (p) => p.id === data.backendDeployment
  );

  const handleAuth = async (option: any, isBackend: boolean) => {
    const { auth } = option;

    try {
      switch (auth.type) {
        case 'oauth':
          // Open OAuth popup
          const width = 600;
          const height = 600;
          const left = window.innerWidth / 2 - width / 2;
          const top = window.innerHeight / 2 - height / 2;
          const popup = window.open(
            auth.setupUrl,
            'Auth',
            `width=${width},height=${height},left=${left},top=${top}`
          );

          // Handle OAuth callback
          const handleMessage = (event: MessageEvent) => {
            if (event.origin === window.location.origin && event.data?.type === 'oauth_callback') {
              const { token } = event.data;
              handleAuthSuccess(option, isBackend, token);
              window.removeEventListener('message', handleMessage);
              popup?.close();
            }
          };
          window.addEventListener('message', handleMessage);
          break;

        case 'api-token':
          const token = await showTokenInputModal(option.name);
          if (token) {
            handleAuthSuccess(option, isBackend, token);
          }
          break;

        case 'credentials':
          const credentials = await showCredentialsModal(option.name);
          if (credentials) {
            handleAuthSuccess(option, isBackend, JSON.stringify(credentials));
          }
          break;
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError('Authentication failed. Please try again.');
    }
  };

  const handleAuthSuccess = async (
    option: any,
    isBackend: boolean,
    token: string
  ) => {
    const isValid = await DeploymentValidationService.validateAuth(option, token);
    if (!isValid) {
      setError('Invalid authentication credentials. Please try again.');
      return;
    }

    onUpdate({
      [`${isBackend ? 'backend' : 'frontend'}Auth`]: {
        ...option.auth,
        token,
        isAuthenticated: true,
      },
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <StyledPaper>
        <Typography variant="h5">
          Deployment Setup
        </Typography>

        {/* Frontend Deployment Selection */}
        <StyledFormControl fullWidth>
          <InputLabel>Frontend Platform</InputLabel>
          <Select
            value={data.frontendDeployment || ''}
            onChange={(e) => handleFrontendDeploymentChange(e.target.value)}
            label="Frontend Platform"
          >
            {deploymentOptions.frontend.map((platform) => (
              <MenuItem key={platform.id} value={platform.id}>
                {platform.name}
              </MenuItem>
            ))}
          </Select>
        </StyledFormControl>

        {/* Frontend Configuration */}
        {selectedFrontend && data.frontendAuth?.isAuthenticated && (
          <Box sx={{ mb: 4 }}>
            <DeploymentConfigForm
              platform={selectedFrontend}
              config={data.frontendConfig || {}}
              onChange={handleFrontendConfigChange}
              onValidation={(status) => handleValidationStatus(status, false)}
            />
          </Box>
        )}

        {/* Backend Deployment Selection */}
        <StyledFormControl fullWidth>
          <InputLabel>Backend Platform</InputLabel>
          <Select
            value={data.backendDeployment || ''}
            onChange={(e) => handleBackendDeploymentChange(e.target.value)}
            label="Backend Platform"
          >
            {deploymentOptions.backend.map((platform) => (
              <MenuItem key={platform.id} value={platform.id}>
                {platform.name}
              </MenuItem>
            ))}
          </Select>
        </StyledFormControl>

        {/* Backend Configuration */}
        {selectedBackend && data.backendAuth?.isAuthenticated && (
          <Box sx={{ mb: 4 }}>
            <DeploymentConfigForm
              platform={selectedBackend}
              config={data.backendConfig || {}}
              onChange={handleBackendConfigChange}
              onValidation={(status) => handleValidationStatus(status, true)}
            />
          </Box>
        )}

        {/* Error Messages */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mt: 2,
              mb: 2,
              borderRadius: 1,
            }}
          >
            {error}
          </Alert>
        )}

        {/* Navigation Buttons */}
        <Box sx={{ 
          mt: 4, 
          display: 'flex', 
          justifyContent: 'space-between',
          borderTop: 1,
          borderColor: 'divider',
          pt: 3,
        }}>
          <StyledButton onClick={onBack}>
            Back
          </StyledButton>
          <StyledButton
            variant="contained"
            onClick={onNext}
            disabled={!data.validation?.isValid}
          >
            Next
          </StyledButton>
        </Box>
      </StyledPaper>

      {/* Modals */}
      <TokenInputModal
        open={showTokenModal}
        onClose={() => setShowTokenModal(false)}
        onSubmit={(token) => {
          // Handle token submission
          setShowTokenModal(false);
        }}
        title="Enter API Token"
        description="Please enter your API token to authenticate."
      />

      <CredentialsModal
        open={showCredentialsModal}
        onClose={() => setShowCredentialsModal(false)}
        onSubmit={(username, password) => {
          // Handle credentials submission
          setShowCredentialsModal(false);
        }}
        title="Enter Credentials"
        description="Please enter your credentials to authenticate."
      />
    </Box>
  );
};
