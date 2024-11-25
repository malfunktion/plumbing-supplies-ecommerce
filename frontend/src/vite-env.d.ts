/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_DEPLOYMENT_PLATFORM: string;
  readonly VITE_BASE_URL: string;
  readonly VITE_SETUP_ENABLED: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
