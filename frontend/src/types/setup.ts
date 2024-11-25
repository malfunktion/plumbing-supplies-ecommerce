export type SetupStep = 'backend' | 'database' | 'admin' | 'sample-data' | 'deployment' | 'finish';

export interface SetupData {
  backend: {
    url: string;
    isConnected: boolean;
  };
  database: {
    uri: string;
    isConnected: boolean;
  };
  admin: {
    email: string;
    password: string;
    isCreated: boolean;
  };
  sampleData: {
    install: boolean;
    isInstalled: boolean;
  };
  deployment: {
    provider: string;
    url: string;
    isDeployed: boolean;
  };
}

export interface StepProps {
  onNext: (data: any) => void;
  onBack?: () => void;
  data?: any;
}
