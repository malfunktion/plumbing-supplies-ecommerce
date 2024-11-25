// Setup step types
export interface SetupStep {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isOptional?: boolean;
  data?: any;
}

// Backend setup types
export interface BackendSetupData {
  url: string;
  isConnected: boolean;
}

// Database setup types
export interface DatabaseSetupData {
  uri: string;
  name: string;
  provider: string;
}

// Admin setup types
export interface AdminSetupData {
  email: string;
  password: string;
  isCreated: boolean;
}

// Sample data setup types
export interface SampleDataSetupData {
  install: boolean;
  isInstalled: boolean;
}

// Validation status types
export interface ValidationStatus {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface PlatformRequirements {
  minMemory?: string;
  minStorage?: string;
  minCpu?: string;
  requiredEnvironmentVars?: string[];
  minimumNodeVersion?: string;
  supportedFrameworks?: string[];
}

// Deployment config types
export interface DeploymentConfig {
  provider: string;
  region?: string;
  environment: 'development' | 'staging' | 'production';
  platform?: string;
  resources: {
    memory: string;
    storage: string;
    cpu: string;
  };
  auth: {
    type: 'oauth' | 'api-token' | 'credentials';
    provider: string;
    scope?: string[];
    setupUrl?: string;
    host?: string;
    username?: string;
    password?: string;
    secure?: boolean;
  };
  environmentVars?: Record<string, string>;
  framework?: string;
  buildCommand?: string;
  outputDir?: string;
  customDomain?: string;
  nodeVersion?: string;
}

// Deployment option types
export interface DeploymentOption {
  id: string;
  name: string;
  description: string;
  features: string[];
  auth: {
    type: 'oauth' | 'api-token' | 'credentials';
    provider: string;
    scope?: string[];
    setupUrl?: string;
    host?: string;
    username?: string;
    password?: string;
    secure?: boolean;
    validationUrl?: string;
  };
  requirements: PlatformRequirements;
}

// Authentication types
export type AuthType = 'oauth' | 'api-token' | 'credentials';

export interface AuthConfig {
  type: AuthType;
  provider: string;
  setupUrl: string;
  isAuthenticated: boolean;
}

// Deployment validation types
export interface DeploymentValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Deployment setup types
export interface DeploymentSetupData {
  frontendDeployment: string;
  backendDeployment: string;
  domain: string;
}

// Combined setup data
export interface SetupData {
  backend: BackendSetupData;
  database: DatabaseSetupData;
  admin: AdminSetupData;
  sampleData: SampleDataSetupData;
  deployment: DeploymentSetupData;
}

// Base props for all setup components
export interface BaseProps {
  onNext: () => void;
}

// Base props for setup steps (includes back button)
export interface BaseStepProps extends BaseProps {
  onBack: () => void;
}

// Backend setup props
export interface BackendSetupProps extends BaseProps {
  data: BackendSetupData;
  onUpdate: (data: Partial<BackendSetupData>) => void;
}

// Database setup props
export interface DatabaseSetupProps extends BaseStepProps {
  data: DatabaseSetupData;
  onUpdate: (data: Partial<DatabaseSetupData>) => void;
}

// Admin setup props
export interface AdminSetupProps extends BaseStepProps {
  data: AdminSetupData;
  onUpdate: (data: Partial<AdminSetupData>) => void;
}

// Sample data setup props
export interface SampleDataSetupProps extends BaseStepProps {
  data: SampleDataSetupData;
  onUpdate: (data: Partial<SampleDataSetupData>) => void;
}

// Deployment setup props
export interface DeploymentSetupProps extends BaseStepProps {
  data: DeploymentSetupData;
  onUpdate: (data: Partial<DeploymentSetupData>) => void;
}

// Finish setup props
export interface FinishSetupProps extends BaseStepProps {
  setupData: SetupData;
}

// Theme types
export interface ThemeCustomizerProps {
  onClose: () => void;
}
