import React, { useState } from 'react';
import { Card, RadioGroup, Button, Alert } from '@/components/ui';
import { DeploymentSetupProps } from '@/types/setup';

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

const deploymentOptions: DeploymentOption[] = [
  {
    id: 'github-pages',
    name: 'GitHub Pages',
    description: 'Free static site hosting by GitHub',
    type: 'frontend',
    requirements: ['GitHub account', 'Git repository'],
    setupSteps: [
      'Enable GitHub Pages in repository settings',
      'Configure GitHub Actions workflow',
      'Push your code to main branch'
    ],
    freeFeatures: [
      'Free hosting',
      'Custom domain support',
      'SSL certificates',
      'CDN delivery'
    ],
    limitations: [
      'Static content only',
      'Limited to public repositories for free tier'
    ]
  },
  {
    id: 'railway',
    name: 'Railway',
    description: 'Zero-configuration deployment platform',
    type: 'backend',
    requirements: ['GitHub account'],
    setupSteps: [
      'Connect your GitHub account',
      'Select your repository',
      'Configure environment variables'
    ],
    freeFeatures: [
      'Automatic deployments',
      'Custom domains',
      'SSL certificates',
      'Database support'
    ],
    limitations: [
      'Limited free tier resources',
      'Usage-based pricing after free tier'
    ]
  }
];

export const DeploymentSetup = ({ data, onUpdate, onNext, onBack }: DeploymentSetupProps) => {
  const [error, setError] = useState('');

  const handleFrontendDeploymentChange = (value: string) => {
    onUpdate({ frontendDeployment: value });
  };

  const handleBackendDeploymentChange = (value: string) => {
    onUpdate({ backendDeployment: value });
  };

  const handleSubmit = () => {
    if (!data.frontendDeployment || !data.backendDeployment) {
      setError('Please select both frontend and backend deployment options');
      return;
    }
    onUpdate({ isConfigured: true });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-4">Deployment Configuration</h2>
        <p className="mt-1 text-gray-600">
          Configure how you want to deploy your application.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Frontend Deployment</label>
          <RadioGroup
            name="frontend-deployment"
            value={data.frontendDeployment}
            onChange={handleFrontendDeploymentChange}
            options={deploymentOptions
              .filter(opt => opt.type === 'frontend')
              .map(opt => ({
                id: opt.id,
                label: opt.name,
                value: opt.id,
                description: opt.description
              }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Backend Deployment</label>
          <RadioGroup
            name="backend-deployment"
            value={data.backendDeployment}
            onChange={handleBackendDeploymentChange}
            options={deploymentOptions
              .filter(opt => opt.type === 'backend')
              .map(opt => ({
                id: opt.id,
                label: opt.name,
                value: opt.id,
                description: opt.description
              }))}
          />
        </div>

        {error && (
          <Alert type="error" title={error} />
        )}

        <div className="flex justify-between pt-4">
          <Button
            variant="secondary"
            onClick={onBack}
          >
            Back
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!data.frontendDeployment || !data.backendDeployment}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
