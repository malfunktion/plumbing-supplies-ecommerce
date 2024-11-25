import React, { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
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
import DatabaseSetup from './steps/DatabaseSetup';
import AdminSetup from './steps/AdminSetup';
import SampleDataSetup from './steps/SampleDataSetup';
import { DeploymentSetup } from './steps/DeploymentSetup';
import BackendSetup from './steps/BackendSetup';
import FinishSetup from './steps/FinishSetup';
import { SetupStep, SetupData } from '@/types/setup';

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

const steps = [
  'Backend Setup',
  'Database Configuration',
  'Admin Setup',
  'Sample Data Setup',
  'Deployment Configuration',
  'Finish Setup'
];

const SetupWizard = () => {
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
      isConfigured: false
    }
  });

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSetupDataUpdate = <K extends keyof SetupData>(
    step: K,
    data: Partial<SetupData[K]>
  ) => {
    setSetupData((prevData) => ({
      ...prevData,
      [step]: { ...prevData[step], ...data }
    }));
  };

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <BackendSetup
            data={setupData.backend}
            onUpdate={(data: Partial<SetupData['backend']>) => handleSetupDataUpdate('backend', data)}
            onNext={handleNext}
          />
        );
      case 1:
        return (
          <DatabaseSetup
            data={setupData.database}
            onUpdate={(data: Partial<SetupData['database']>) => handleSetupDataUpdate('database', data)}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <AdminSetup
            data={setupData.admin}
            onUpdate={(data: Partial<SetupData['admin']>) => handleSetupDataUpdate('admin', data)}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <SampleDataSetup
            data={setupData.sampleData}
            onUpdate={(data: Partial<SetupData['sampleData']>) => handleSetupDataUpdate('sampleData', data)}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <DeploymentSetup
            data={setupData.deployment}
            onUpdate={(data: Partial<SetupData['deployment']>) => handleSetupDataUpdate('deployment', data)}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 5:
        return (
          <FinishSetup
            setupData={setupData}
            onNext={() => navigate('/')}
            onBack={handleBack}
          />
        );
      default:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" color="primary">
              Step {activeStep + 1}
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              This step is under construction.
            </Typography>
          </Box>
        );
    }
  };

  return (
    <StyledContainer maxWidth="lg">
      <StyledPaper>
        <Typography 
          variant="h4" 
          sx={{ 
            mb: 4,
            color: 'primary.main',
            fontWeight: 600,
            textAlign: 'center',
          }}
        >
          Setup Wizard
        </Typography>

        <StyledStepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </StyledStepper>

        {renderStep()}
      </StyledPaper>
    </StyledContainer>
  );
};

export default SetupWizard;
