import React, { useState } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Container,
  Paper,
  Button,
  styled,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import WelcomeStep from './steps/WelcomeStep';
import DeploymentStep from './steps/DeploymentStep';
import DatabaseStep from './steps/DatabaseStep';
import FinishStep from './steps/FinishStep';
import type { SetupStep, DeploymentSetupData, DatabaseSetupData } from '@/types/setup';

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
}));

const steps: SetupStep[] = [
  {
    id: 'welcome',
    title: 'Welcome',
    description: 'Welcome to the Plumbing Supplies E-Commerce setup wizard',
    isCompleted: false,
  },
  {
    id: 'deployment',
    title: 'Deployment',
    description: 'Configure your deployment settings',
    isCompleted: false,
  },
  {
    id: 'database',
    title: 'Database',
    description: 'Set up your database connection',
    isCompleted: false,
  },
  {
    id: 'finish',
    title: 'Finish',
    description: 'Complete the setup process',
    isCompleted: false,
  },
];

const SetupWizard: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [setupData, setSetupData] = useState<{
    deployment?: DeploymentSetupData;
    database?: DatabaseSetupData;
  }>({});

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // Complete setup
      navigate('/');
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleDeploymentUpdate = (data: DeploymentSetupData) => {
    setSetupData((prev) => ({
      ...prev,
      deployment: data,
    }));
  };

  const handleDatabaseUpdate = (data: DatabaseSetupData) => {
    setSetupData((prev) => ({
      ...prev,
      database: data,
    }));
  };

  const getCurrentStep = () => {
    switch (activeStep) {
      case 0:
        return <WelcomeStep />;
      case 1:
        return (
          <DeploymentStep
            data={setupData.deployment || {
              frontendDeployment: '',
              backendDeployment: '',
              domain: '',
            }}
            onUpdate={handleDeploymentUpdate}
          />
        );
      case 2:
        return (
          <DatabaseStep
            data={setupData.database || {
              uri: '',
              name: '',
              provider: '',
            }}
            onUpdate={handleDatabaseUpdate}
          />
        );
      case 3:
        return <FinishStep />;
      default:
        return null;
    }
  };

  return (
    <StyledContainer maxWidth="md">
      <StyledPaper>
        <Typography variant="h4" gutterBottom>
          Setup Wizard
        </Typography>
        <StyledStepper activeStep={activeStep}>
          {steps.map((step) => (
            <Step key={step.id} completed={step.isCompleted}>
              <StepLabel>{step.title}</StepLabel>
            </Step>
          ))}
        </StyledStepper>
        <Box mt={4}>
          {getCurrentStep()}
          <Box mt={4} display="flex" justifyContent="space-between">
            <Button
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
            >
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </Box>
      </StyledPaper>
    </StyledContainer>
  );
};

export default SetupWizard;
