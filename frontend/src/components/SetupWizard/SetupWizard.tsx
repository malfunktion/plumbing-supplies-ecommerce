import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatabaseSetup from './steps/DatabaseSetup';
import AdminSetup from './steps/AdminSetup';
import SampleDataSetup from './steps/SampleDataSetup';
import DeploymentSetup from './steps/DeploymentSetup';
import BackendSetup from './steps/BackendSetup';
import FinishSetup from './steps/FinishSetup';

export type SetupStep = 'backend' | 'database' | 'admin' | 'sample-data' | 'deployment' | 'finish';

const SetupWizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<SetupStep>('backend');
  const [setupData, setSetupData] = useState({
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

  const updateSetupData = (
    step: SetupStep,
    data: Partial<typeof setupData[keyof typeof setupData]>
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
    } else {
      navigate('/');
    }
  };

  const handleBack = () => {
    const steps: SetupStep[] = ['backend', 'database', 'admin', 'sample-data', 'deployment', 'finish'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'backend':
        return (
          <BackendSetup
            onNext={(url) => {
              updateSetupData('backend', { url, isConnected: true });
              handleNext();
            }}
          />
        );
      case 'database':
        return (
          <DatabaseSetup
            data={setupData.database}
            onUpdate={(data) => updateSetupData('database', data)}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 'admin':
        return (
          <AdminSetup
            data={setupData.admin}
            onUpdate={(data) => updateSetupData('admin', data)}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 'sample-data':
        return (
          <SampleDataSetup
            data={setupData.sampleData}
            onUpdate={(data) => updateSetupData('sample-data', data)}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 'deployment':
        return (
          <DeploymentSetup
            data={setupData.deployment}
            onUpdate={(data) => updateSetupData('deployment', data)}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 'finish':
        return (
          <FinishSetup
            setupData={setupData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default SetupWizard;
