import React, { useState } from 'react';
import axios from 'axios';

enum BackendProvider {
  RAILWAY = 'RAILWAY',
  HEROKU = 'HEROKU',
  CUSTOM = 'CUSTOM'
}

interface BackendSetupProps {
  onNext: (backendUrl: string) => void;
  onBack?: () => void;
}

const BackendSetup: React.FC<BackendSetupProps> = ({ onNext, onBack }) => {
  const [provider, setProvider] = useState<BackendProvider>(BackendProvider.RAILWAY);
  const [customUrl, setCustomUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeploy = async () => {
    setLoading(true);
    setError(null);

    try {
      if (provider === BackendProvider.RAILWAY) {
        // Open Railway deployment page in new tab
        window.open('https://railway.app/new', '_blank');
      } else if (provider === BackendProvider.HEROKU) {
        // Open Heroku deployment page in new tab
        window.open('https://heroku.com/deploy?template=https://github.com/malfunktion/plumbing-supplies-ecommerce', '_blank');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initiate deployment');
    }

    setLoading(false);
  };

  const handleTestConnection = async () => {
    setLoading(true);
    setError(null);

    try {
      const url = provider === BackendProvider.CUSTOM ? customUrl : '';
      if (!url && provider === BackendProvider.CUSTOM) {
        throw new Error('Please enter a backend URL');
      }

      const response = await axios.get(`${url}/health`);
      
      if (response.data.status === 'ok') {
        onNext(url);
      } else {
        throw new Error('Backend health check failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to backend');
    }

    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Backend Setup</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Select Backend Provider</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={provider}
            onChange={(e) => setProvider(e.target.value as BackendProvider)}
          >
            <option value={BackendProvider.RAILWAY}>Railway (Recommended)</option>
            <option value={BackendProvider.HEROKU}>Heroku</option>
            <option value={BackendProvider.CUSTOM}>Custom URL</option>
          </select>
        </div>

        {provider === BackendProvider.CUSTOM && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Backend URL</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="https://your-backend-url.com"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
            />
          </div>
        )}

        {provider !== BackendProvider.CUSTOM && (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="text-lg font-medium text-blue-800">Deployment Instructions</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ol className="list-decimal list-inside space-y-2">
                  <li>Click the "Deploy Backend" button below</li>
                  <li>Follow the provider's setup instructions</li>
                  <li>Once deployed, copy your backend URL</li>
                  <li>Switch to "Custom URL" option above</li>
                  <li>Paste your backend URL and test the connection</li>
                </ol>
              </div>
            </div>

            <button
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={handleDeploy}
              disabled={loading}
            >
              {loading ? 'Deploying...' : 'Deploy Backend'}
            </button>
          </div>
        )}

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <div className="flex justify-between">
          {onBack && (
            <button
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              onClick={onBack}
              disabled={loading}
            >
              Back
            </button>
          )}
          
          <button
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={handleTestConnection}
            disabled={loading || (provider === BackendProvider.CUSTOM && !customUrl)}
          >
            {loading ? 'Testing...' : 'Test Connection & Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BackendSetup;
