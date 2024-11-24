import React, { useState } from 'react';
import { Card, RadioGroup, Button, Alert } from '@/components/ui';

interface DeploymentOption {
  id: string;
  name: string;
  description: string;
  type: 'frontend' | 'backend';
  requirements: string[];
  setupSteps: string[];
  freeFeatures: string[];
  limitations: string[];
}

interface DeploymentSetupProps {
  data: {
    frontendDeployment: string;
    backendDeployment: string;
    isConfigured: boolean;
  };
  onUpdate: (data: Partial<{
    frontendDeployment: string;
    backendDeployment: string;
    isConfigured: boolean;
  }>) => void;
  onNext: () => void;
}

const deploymentOptions: DeploymentOption[] = [
  {
    id: 'github-pages',
    name: 'GitHub Pages',
    type: 'frontend',
    description: 'Host your frontend directly from your GitHub repository',
    requirements: ['GitHub account'],
    setupSteps: [
      'Enable GitHub Pages in repository settings',
      'Add homepage to package.json',
      'Setup GitHub Actions workflow'
    ],
    freeFeatures: [
      'Unlimited static site hosting',
      'Custom domain support',
      'SSL/HTTPS included',
      'GitHub Actions integration'
    ],
    limitations: [
      'Only static content',
      'Build time limited to 10 minutes'
    ]
  },
  {
    id: 'netlify',
    name: 'Netlify',
    type: 'frontend',
    description: 'Popular static site hosting with great features',
    requirements: ['GitHub account'],
    setupSteps: [
      'Connect with GitHub',
      'Select repository',
      'Configure build settings'
    ],
    freeFeatures: [
      '100GB bandwidth/month',
      'Custom domain support',
      'SSL/HTTPS included',
      'Form handling',
      'Continuous deployment'
    ],
    limitations: [
      'Build time limited to 300 minutes/month',
      'Limited serverless function calls'
    ]
  },
  {
    id: 'cyclic',
    name: 'Cyclic',
    type: 'backend',
    description: 'AWS-powered backend hosting with MongoDB integration',
    requirements: ['GitHub account'],
    setupSteps: [
      'Connect with GitHub',
      'Select repository',
      'Configure environment variables'
    ],
    freeFeatures: [
      '10GB bandwidth/month',
      'No sleep time',
      'MongoDB integration',
      'Custom domain support',
      'SSL/HTTPS included'
    ],
    limitations: [
      'Limited to 512MB storage',
      'Maximum 5 services per account'
    ]
  },
  {
    id: 'glitch',
    name: 'Glitch',
    type: 'backend',
    description: 'Easy-to-use platform for quick backend deployment',
    requirements: ['Email account'],
    setupSteps: [
      'Create Glitch account',
      'Import from GitHub',
      'Configure environment'
    ],
    freeFeatures: [
      '1000 hours/month',
      'Instant deployment',
      'Custom domain support',
      'SSL/HTTPS included'
    ],
    limitations: [
      'Sleeps after 5 minutes inactive',
      'Limited to 512MB storage',
      'Shared CPU resources'
    ]
  },
  {
    id: 'railway',
    name: 'Railway',
    type: 'backend',
    description: 'Developer platform with great performance',
    requirements: ['GitHub account'],
    setupSteps: [
      'Connect with GitHub',
      'Select repository',
      'Configure deployment'
    ],
    freeFeatures: [
      '500 hours/month',
      'Shared CPU',
      'Custom domain support',
      'SSL/HTTPS included'
    ],
    limitations: [
      'Limited to 512MB RAM',
      'Limited to 1GB storage',
      'Shared CPU resources'
    ]
  }
];

export const DeploymentSetup: React.FC<DeploymentSetupProps> = ({
  data,
  onUpdate,
  onNext
}) => {
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!data.frontendDeployment || !data.backendDeployment) {
      setError('Please select both frontend and backend deployment options');
      return;
    }

    onUpdate({ isConfigured: true });
    onNext();
  };

  const frontendOptions = deploymentOptions.filter(opt => opt.type === 'frontend');
  const backendOptions = deploymentOptions.filter(opt => opt.type === 'backend');

  const handleFrontendChange = (value: string) => {
    onUpdate({ frontendDeployment: value });
  };

  const handleBackendChange = (value: string) => {
    onUpdate({ backendDeployment: value });
  };

  const renderDeploymentGroup = (
    options: DeploymentOption[],
    selected: string,
    onChange: (value: string) => void,
    title: string
  ) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <RadioGroup
        value={selected}
        onChange={onChange}
        className="space-y-4"
      >
        {options.map(option => (
          <Card
            key={option.id}
            className={`p-4 cursor-pointer ${
              selected === option.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => onChange(option.id)}
          >
            <div className="flex items-start space-x-4">
              <RadioGroup.Item value={option.id} />
              <div className="flex-1">
                <h4 className="font-medium">{option.name}</h4>
                <p className="text-sm text-gray-600">{option.description}</p>
                
                <div className="mt-3 space-y-2">
                  <div>
                    <h5 className="text-sm font-medium">Features:</h5>
                    <ul className="text-sm text-gray-600 list-disc list-inside">
                      {option.freeFeatures.map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium">Limitations:</h5>
                    <ul className="text-sm text-gray-600 list-disc list-inside">
                      {option.limitations.map((limitation, i) => (
                        <li key={i}>{limitation}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium">Setup Steps:</h5>
                    <ol className="text-sm text-gray-600 list-decimal list-inside">
                      {option.setupSteps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </RadioGroup>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Deployment Configuration</h2>
        <p className="text-gray-600">
          Choose where to host your frontend and backend. All options below are completely free and don't require a credit card.
        </p>
      </div>

      {error && (
        <Alert variant="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {renderDeploymentGroup(
        frontendOptions,
        data.frontendDeployment,
        handleFrontendChange,
        'Frontend Deployment'
      )}

      {renderDeploymentGroup(
        backendOptions,
        data.backendDeployment,
        handleBackendChange,
        'Backend Deployment'
      )}

      <Button onClick={handleContinue} className="w-full">
        Continue
      </Button>
    </div>
  );
};
