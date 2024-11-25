import React, { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Typography,
  Alert,
  Chip,
  Grid,
  Link,
  styled,
} from '@mui/material';

const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  '& .MuiTypography-h6': {
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(3),
  },
  '& .MuiFormControl-root': {
    marginBottom: theme.spacing(2),
  },
  '& .MuiChip-root': {
    margin: theme.spacing(0.5),
  },
}));

const StyledSection = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  '& .MuiTypography-subtitle1': {
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1),
  },
}));

import {
  DeploymentOption,
  DeploymentConfig,
  ValidationStatus,
} from '@/types/setup';
import { DeploymentValidationService } from '@/services/deploymentValidation';

interface DeploymentConfigProps {
  platform: DeploymentOption;
  config: DeploymentConfig;
  onChange: (config: DeploymentConfig) => void;
  onValidation: (status: ValidationStatus) => void;
}

export const DeploymentConfigForm: React.FC<DeploymentConfigProps> = ({
  platform,
  config,
  onChange,
  onValidation,
}) => {
  const [localConfig, setLocalConfig] = useState<DeploymentConfig>(config);
  const [validation, setValidation] = useState<ValidationStatus>({
    isValid: true,
    errors: [],
    warnings: [],
  });

  useEffect(() => {
    validateConfig();
  }, [localConfig]);

  const validateConfig = async () => {
    const status = DeploymentValidationService.validateConfig(localConfig, platform);
    setValidation(status);
    onValidation(status);
  };

  const handleChange = (field: keyof DeploymentConfig, value: any) => {
    const newConfig = { ...localConfig, [field]: value };
    setLocalConfig(newConfig);
    onChange(newConfig);
  };

  const handleEnvVarChange = (key: string, value: string) => {
    const newEnvVars = { ...localConfig.environmentVars, [key]: value };
    handleChange('environmentVars', newEnvVars);
  };

  return (
    <StyledBox>
      <Typography variant="h6">
        Configuration for {platform.name}
      </Typography>

      {platform.docs && (
        <Link
          href={platform.docs}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            display: 'block',
            mb: 3,
            color: 'primary.main',
            '&:hover': {
              color: 'primary.dark',
            },
          }}
        >
          View Documentation
        </Link>
      )}

      <Grid container spacing={3}>
        {/* Basic Configuration */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            variant="outlined"
            label="Branch"
            value={localConfig.branch || ''}
            onChange={(e) => handleChange('branch', e.target.value)}
            helperText="Git branch to deploy from"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            variant="outlined"
            label="Build Command"
            value={localConfig.buildCommand || ''}
            onChange={(e) => handleChange('buildCommand', e.target.value)}
            helperText="Command to build your application"
          />
        </Grid>

        {/* Framework Selection */}
        {platform.requirements.supportedFrameworks && (
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Framework</InputLabel>
              <Select
                value={localConfig.framework || ''}
                onChange={(e) => handleChange('framework', e.target.value)}
                label="Framework"
              >
                {platform.requirements.supportedFrameworks.map((fw) => (
                  <MenuItem key={fw} value={fw}>
                    {fw}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        {/* Node Version */}
        {platform.requirements.minimumNodeVersion && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              label="Node.js Version"
              value={localConfig.nodeVersion || ''}
              onChange={(e) => handleChange('nodeVersion', e.target.value)}
              helperText={`Minimum required: ${platform.requirements.minimumNodeVersion}`}
            />
          </Grid>
        )}

        {/* Environment Variables */}
        {platform.requirements.requiredEnvironmentVars && (
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Environment Variables
            </Typography>
            <Grid container spacing={2}>
              {platform.requirements.requiredEnvironmentVars.map((envVar) => (
                <Grid item xs={12} md={6} key={envVar}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label={envVar}
                    value={localConfig.environmentVars?.[envVar] || ''}
                    onChange={(e) => handleEnvVarChange(envVar, e.target.value)}
                    required
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        )}

        {/* Custom Domain */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            variant="outlined"
            label="Custom Domain"
            value={localConfig.customDomain || ''}
            onChange={(e) => handleChange('customDomain', e.target.value)}
            helperText="Optional: Set up a custom domain"
          />
        </Grid>

        {/* Auto-scaling */}
        <Grid item xs={12}>
          <FormControl>
            <InputLabel>Auto-scaling</InputLabel>
            <Select
              value={localConfig.autoScaling || false}
              onChange={(e) => handleChange('autoScaling', e.target.value)}
              label="Auto-scaling"
            >
              <MenuItem value={true}>Enabled</MenuItem>
              <MenuItem value={false}>Disabled</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Validation Messages */}
        <Grid item xs={12}>
          <Box sx={{ mt: 2 }}>
            {validation.errors.map((error, index) => (
              <Alert
                severity="error"
                key={`error-${index}`}
                sx={{
                  mb: 1,
                  borderRadius: 1,
                }}
              >
                {error}
              </Alert>
            ))}
            {validation.warnings.map((warning, index) => (
              <Alert
                severity="warning"
                key={`warning-${index}`}
                sx={{
                  mb: 1,
                  borderRadius: 1,
                }}
              >
                {warning}
              </Alert>
            ))}
          </Box>
        </Grid>

        {/* Platform Features */}
        <Grid item xs={12}>
          <StyledSection>
            <Typography variant="subtitle1">
              Available Features
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {platform.features.map((feature) => (
                <Chip
                  key={feature}
                  label={feature}
                  color="primary"
                  variant="outlined"
                  sx={{
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: 'primary.light',
                      color: 'primary.contrastText',
                    },
                  }}
                />
              ))}
            </Box>
          </StyledSection>
        </Grid>

        {/* Pricing Information */}
        {platform.pricing && (
          <Grid item xs={12}>
            <StyledSection>
              <Typography variant="subtitle1">
                Free Tier Features
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {platform.pricing.free.map((feature) => (
                  <Chip
                    key={feature}
                    label={feature}
                    color="success"
                    variant="outlined"
                    sx={{
                      borderRadius: 1,
                      '&:hover': {
                        backgroundColor: 'success.light',
                        color: 'success.contrastText',
                      },
                    }}
                  />
                ))}
              </Box>
              {platform.pricing.paid.length > 0 && (
                <>
                  <Typography variant="subtitle1" sx={{ mt: 2 }}>
                    Paid Features
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {platform.pricing.paid.map((feature) => (
                      <Chip
                        key={feature}
                        label={feature}
                        color="secondary"
                        variant="outlined"
                        sx={{
                          borderRadius: 1,
                          '&:hover': {
                            backgroundColor: 'secondary.light',
                            color: 'secondary.contrastText',
                          },
                        }}
                      />
                    ))}
                  </Box>
                </>
              )}
            </StyledSection>
          </Grid>
        )}
      </Grid>
    </StyledBox>
  );
};
