// Setup step types
export type SetupStep = 'backend' | 'database' | 'admin' | 'sample-data' | 'deployment' | 'finish';

// Backend setup types
export interface BackendData {
  url: string;
  isConnected: boolean;
}

// Database setup types
export interface DatabaseData {
  uri: string;
  isConnected: boolean;
}

// Admin setup types
export interface AdminData {
  email: string;
  password: string;
  isCreated: boolean;
}

// Sample data setup types
export interface SampleDataData {
  install: boolean;
  isInstalled: boolean;
}

// Deployment setup types
export interface DeploymentData {
  frontendDeployment: string;
  backendDeployment: string;
  isConfigured: boolean;
}

// Combined setup data
export interface SetupData {
  backend: BackendData;
  database: DatabaseData;
  admin: AdminData;
  sampleData: SampleDataData;
  deployment: DeploymentData;
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
  data: BackendData;
  onUpdate: (data: Partial<BackendData>) => void;
  onNext: () => void;
}

// Database setup props
export interface DatabaseSetupProps extends BaseStepProps {
  data: DatabaseData;
  onUpdate: (data: Partial<DatabaseData>) => void;
}

// Admin setup props
export interface AdminSetupProps extends BaseStepProps {
  data: AdminData;
  onUpdate: (data: Partial<AdminData>) => void;
}

// Sample data setup props
export interface SampleDataSetupProps extends BaseStepProps {
  data: SampleDataData;
  onUpdate: (data: Partial<SampleDataData>) => void;
}

// Deployment setup props
export interface DeploymentSetupProps extends BaseStepProps {
  data: DeploymentData;
  onUpdate: (data: Partial<DeploymentData>) => void;
}

// Finish setup props
export interface FinishSetupProps extends BaseStepProps {
  setupData: SetupData;
}
