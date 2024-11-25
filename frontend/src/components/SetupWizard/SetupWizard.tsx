import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Container,
  Paper,
  styled,
} from '@mui/material';
import { DatabaseSetup } from './steps/DatabaseSetup';
import { AdminSetup } from './steps/AdminSetup';
import { SampleDataSetup } from './steps/SampleDataSetup';
import { DeploymentSetup } from './steps/DeploymentSetup';
import { BackendSetup } from './steps/BackendSetup';
import { FinishSetup } from './steps/FinishSetup';
import type { SetupStep, SetupData } from '@/types/setup';

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
}));

const StyledStepper = styled(Stepper)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  '& .MuiStepLabel-root': {
    '& .MuiStepLabel-label': {
      color: theme.palette.text.secondary,
      '&.Mui-active': {
        color: theme.palette.primary.main,
        fontWeight: 600,
      },
      '&.Mui-completed': {
        color: theme.palette.success.main,
      },
    },
    '& .MuiStepIcon-root': {
      '&.Mui-active': {
        color: theme.palette.primary.main,
      },
      '&.Mui-completed': {
        color: theme.palette.success.main,
      },
    },
  },
}));

const steps: Array<{ label: string; key: SetupStep }> = [
  { label: 'Backend Setup', key: 'backend' },
  { label: 'Database Configuration', key: 'database' },
  { label: 'Admin Setup', key: 'admin' },
  { label: 'Sample Data Setup', key: 'sample-data' },
  { label: 'Deployment Configuration', key: 'deployment' },
  { label: 'Finish Setup', key: 'finish' }
];

export const SetupWizard: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [setupData, setSetupData] = useState<SetupData>({
    backend: {
      url: '',
      isConnected: false
    },
    database: {
      uri: '',
      isConnected: false
    },
    admin: {
      email: '',
      password: '',
      isCreated: false
    },
    sampleData: {
      install: false,
      isInstalled: false
    },
    deployment: {
      frontendDeployment: '',
      backendDeployment: '',
      frontendConfig: {},
      backendConfig: {},
      validation: {
        isValid: false,
        errors: [],
        warnings: []
      },
      isConfigured: false
    }
  });

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleUpdate = (stepData: Partial<SetupData>) => {
    setSetupData((prevData) => ({
      ...prevData,
      ...stepData,
    }));
  };

  const getCurrentStep = () => {
    const currentStepKey = steps[activeStep].key;

    switch (currentStepKey) {
      case 'backend':
        return (
          <BackendSetup
            data={setupData.backend}
            onUpdate={(data) => handleUpdate({ backend: data })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 'database':
        return (
          <DatabaseSetup
            data={setupData.database}
            onUpdate={(data) => handleUpdate({ database: data })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 'admin':
        return (
          <AdminSetup
            data={setupData.admin}
            onUpdate={(data) => handleUpdate({ admin: data })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 'sample-data':
        return (
          <SampleDataSetup
            data={setupData.sampleData}
            onUpdate={(data) => handleUpdate({ sampleData: data })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 'deployment':
        return (
          <DeploymentSetup
            data={setupData.deployment}
            onUpdate={(data) => handleUpdate({ deployment: data })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 'finish':
        return (
          <FinishSetup
            data={setupData}
            onBack={handleBack}
            onComplete={() => navigate('/')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <StyledContainer maxWidth="lg">
      <StyledPaper>
        <StyledStepper activeStep={activeStep} alternativeLabel>
          {steps.map(({ label }) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </StyledStepper>

        {getCurrentStep()}
      </StyledPaper>
    </StyledContainer>
  );
};
