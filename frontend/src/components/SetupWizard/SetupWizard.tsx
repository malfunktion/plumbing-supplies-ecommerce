import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatabaseSetup from './steps/DatabaseSetup';
import AdminSetup from './steps/AdminSetup';
import SampleDataSetup from './steps/SampleDataSetup';
import DeploymentSetup from './steps/DeploymentSetup';
import FinishSetup from './steps/FinishSetup';

export type SetupStep = 'database' | 'admin' | 'sample-data' | 'deployment' | 'finish';

const SetupWizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<SetupStep>('database');
  const [setupData, setSetupData] = useState({
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
    const steps: SetupStep[] = ['database', 'admin', 'sample-data', 'deployment', 'finish'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    } else {
      navigate('/');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'database':
        return (
          <DatabaseSetup
            data={setupData.database}
            onUpdate={(data) => updateSetupData('database', data)}
            onNext={handleNext}
          />
        );
      case 'admin':
        return (
          <AdminSetup
            data={setupData.admin}
            onUpdate={(data) => updateSetupData('admin', data)}
            onNext={handleNext}
          />
        );
      case 'sample-data':
        return (
          <SampleDataSetup
            data={setupData.sampleData}
            onUpdate={(data) => updateSetupData('sample-data', data)}
            onNext={handleNext}
          />
        );
      case 'deployment':
        return (
          <DeploymentSetup
            data={setupData.deployment}
            onUpdate={(data) => updateSetupData('deployment', data)}
            onNext={handleNext}
          />
        );
      case 'finish':
        return (
          <FinishSetup
            setupData={setupData}
            onNext={handleNext}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Setup Wizard
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Let's get your plumbing supplies store up and running
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="bg-white p-8 rounded-lg shadow">
            {renderStep()}
          </div>

          <div className="flex justify-between">
            <div className="flex space-x-2">
              {['database', 'admin', 'sample-data', 'deployment', 'finish'].map((step, index) => (
                <div
                  key={step}
                  className={`h-2 w-2 rounded-full ${
                    currentStep === step
                      ? 'bg-blue-600'
                      : index < ['database', 'admin', 'sample-data', 'deployment', 'finish'].indexOf(currentStep)
                      ? 'bg-blue-400'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupWizard;
