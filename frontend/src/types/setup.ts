// Setup step types
export type SetupStep = 'backend' | 'database' | 'admin' | 'sample-data' | 'deployment' | 'finish';

// Backend setup types
export interface BackendSetupData {
  url: string;
  isConnected: boolean;
}

// Database setup types
export interface DatabaseSetupData {
  uri: string;
  isConnected: boolean;
  includeSampleData?: boolean;
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

// Authentication types
export type AuthType = 'oauth' | 'token' | 'basic';

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
  frontendConfig: Record<string, any>;
  backendConfig: Record<string, any>;
  frontendAuth?: AuthConfig;
  backendAuth?: AuthConfig;
  validation?: DeploymentValidation;
  isConfigured: boolean;
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
export interface BackendSetupProps {
  data: BackendSetupData;
  onUpdate: (data: Partial<BackendSetupData>) => void;
  onNext: () => void;
}

// Database setup props
export interface DatabaseSetupProps {
  data: DatabaseSetupData;
  onUpdate: (data: Partial<DatabaseSetupData>) => void;
  onNext: () => void;
  onBack: () => void;
}

// Admin setup props
export interface AdminSetupProps {
  data: AdminSetupData;
  onUpdate: (data: Partial<AdminSetupData>) => void;
  onNext: () => void;
  onBack: () => void;
}

// Sample data setup props
export interface SampleDataSetupProps {
  data: SampleDataSetupData;
  onUpdate: (data: Partial<SampleDataSetupData>) => void;
  onNext: () => void;
  onBack: () => void;
}

// Deployment setup props
export interface DeploymentSetupProps {
  data: DeploymentSetupData;
  onUpdate: (data: Partial<DeploymentSetupData>) => void;
  onNext: () => void;
  onBack: () => void;
}

// Finish setup props
export interface FinishSetupProps {
  setupData: SetupData;
  onNext: () => void;
  onBack: () => void;
}

// Theme types
export interface ThemeCustomizerProps {
  onClose: () => void;
}
