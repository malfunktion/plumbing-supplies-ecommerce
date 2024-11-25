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
  Grid,
  Card,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { deploymentPlatforms } from '@/services/deploymentValidation';
import { TokenInputModal } from '../modals/TokenInputModal';
import { CredentialsModal } from '../modals/CredentialsModal';
import type { DeploymentSetupProps, AuthConfig } from '@/types/setup';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius * 2,
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
}));

const StyledCardActions = styled(CardActions)(({ theme }) => ({
  padding: theme.spacing(2),
  justifyContent: 'flex-end',
}));

const FeatureList = styled(List)(({ theme }) => ({
  padding: 0,
}));

const FeatureItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(0.5, 0),
}));

export const DeploymentSetup: React.FC<DeploymentSetupProps> = ({ data, onUpdate, onNext, onBack }) => {
  const theme = useTheme();
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<'frontend' | 'backend'>('frontend');
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  const handlePlatformSelect = (platform: 'frontend' | 'backend') => {
    setSelectedPlatform(platform);
    setSelectedProvider(null);
  };

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId);
    const provider = deploymentPlatforms[selectedPlatform].find(p => p.id === providerId);
    if (provider?.auth.type === 'api-token') {
      setShowTokenModal(true);
    } else {
      setShowCredentialsModal(true);
    }
  };

  const handleAuthComplete = (config: AuthConfig) => {
    onUpdate({
      ...data,
      [`${selectedPlatform}Deployment`]: selectedProvider,
      [`${selectedPlatform}Config`]: config,
      validation: {
        isValid: true,
        errors: [],
        warnings: [],
      },
      isConfigured: true,
    });
    setShowTokenModal(false);
    setShowCredentialsModal(false);
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Select Deployment Platform
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant={selectedPlatform === 'frontend' ? 'contained' : 'outlined'}
              onClick={() => handlePlatformSelect('frontend')}
              sx={{ py: 2 }}
            >
              Frontend Deployment
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant={selectedPlatform === 'backend' ? 'contained' : 'outlined'}
              onClick={() => handlePlatformSelect('backend')}
              sx={{ py: 2 }}
            >
              Backend Deployment
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        {deploymentPlatforms[selectedPlatform].map((platform) => (
          <Grid item xs={12} md={4} key={platform.id}>
            <StyledCard>
              <StyledCardContent>
                <Typography variant="h6" gutterBottom>
                  {platform.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {platform.description}
                </Typography>
                <FeatureList>
                  {platform.features.map((feature, index) => (
                    <FeatureItem key={index}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleOutlineIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={feature} />
                    </FeatureItem>
                  ))}
                </FeatureList>
              </StyledCardContent>
              <StyledCardActions>
                <Button
                  variant="contained"
                  onClick={() => handleProviderSelect(platform.id)}
                  disabled={data[`${selectedPlatform}Deployment`] === platform.id}
                >
                  {data[`${selectedPlatform}Deployment`] === platform.id ? 'Selected' : 'Select'}
                </Button>
              </StyledCardActions>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      {(data.frontendDeployment || data.backendDeployment) && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={onBack}>Back</Button>
          <Button
            variant="contained"
            onClick={onNext}
            disabled={!data.frontendDeployment || !data.backendDeployment}
          >
            Next
          </Button>
        </Box>
      )}

      <TokenInputModal
        open={showTokenModal}
        onClose={() => setShowTokenModal(false)}
        onSubmit={handleAuthComplete}
        platform={selectedProvider ? deploymentPlatforms[selectedPlatform].find(p => p.id === selectedProvider)! : null}
      />

      <CredentialsModal
        open={showCredentialsModal}
        onClose={() => setShowCredentialsModal(false)}
        onSubmit={handleAuthComplete}
        platform={selectedProvider ? deploymentPlatforms[selectedPlatform].find(p => p.id === selectedProvider)! : null}
      />
    </Box>
  );
};
