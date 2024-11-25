import React from 'react';
import { Box, Container, Paper, Stepper, Step, StepLabel, Typography } from '@mui/material';

interface SetupWizardLayoutProps {
  children: React.ReactNode;
  activeStep: number;
  steps: string[];
}

export const SetupWizardLayout: React.FC<SetupWizardLayoutProps> = ({
  children,
  activeStep,
  steps,
}) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'background.default',
        py: 8,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h4" gutterBottom>
            Plumbing Supplies E-Commerce Setup
          </Typography>
          
          <Stepper activeStep={activeStep} sx={{ width: '100%', mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {children}
        </Paper>
      </Container>
    </Box>
  );
};
