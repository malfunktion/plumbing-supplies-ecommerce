import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatabaseSetup from './steps/DatabaseSetup';
import AdminSetup from './steps/AdminSetup';
import SampleDataSetup from './steps/SampleDataSetup';
import { DeploymentSetup } from './steps/DeploymentSetup';
import BackendSetup from './steps/BackendSetup';
import FinishSetup from './steps/FinishSetup';
import { SetupStep, SetupData } from '@/types/setup';

const SetupWizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<SetupStep>('backend');
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

  const updateSetupData = <K extends keyof SetupData>(
    step: K,
    data: Partial<SetupData[K]>
  ) => {
    setSetupData(prev => ({
      ...prev,
      [step]: { ...prev[step], ...data }
    }));
  };

  const handleNext = () => {
    const steps: SetupStep[] = ['backend', 'database', 'admin', 'sample-data', 'deployment', 'finish'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: SetupStep[] = ['backend', 'database', 'admin', 'sample-data', 'deployment', 'finish'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {currentStep === 'backend' && (
        <BackendSetup
          data={setupData.backend}
          onUpdate={(data: Partial<SetupData['backend']>) => updateSetupData('backend', data)}
          onNext={handleNext}
        />
      )}

      {currentStep === 'database' && (
        <DatabaseSetup
          data={setupData.database}
          onUpdate={(data: Partial<SetupData['database']>) => updateSetupData('database', data)}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}

      {currentStep === 'admin' && (
        <AdminSetup
          data={setupData.admin}
          onUpdate={(data: Partial<SetupData['admin']>) => updateSetupData('admin', data)}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}

      {currentStep === 'sample-data' && (
        <SampleDataSetup
          data={setupData.sampleData}
          onUpdate={(data: Partial<SetupData['sampleData']>) => updateSetupData('sampleData', data)}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}

      {currentStep === 'deployment' && (
        <DeploymentSetup
          data={setupData.deployment}
          onUpdate={(data: Partial<SetupData['deployment']>) => updateSetupData('deployment', data)}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}

      {currentStep === 'finish' && (
        <FinishSetup
          setupData={setupData}
          onNext={() => navigate('/')}
          onBack={handleBack}
        />
      )}
    </div>
  );
};

export default SetupWizard;
