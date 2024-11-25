import React, { useState } from 'react';
import axios from 'axios';
import { BackendSetupProps } from '@/types/setup';

enum BackendProvider {
  RAILWAY = 'RAILWAY',
  HEROKU = 'HEROKU',
  CUSTOM = 'CUSTOM'
}

const BackendSetup: React.FC<BackendSetupProps> = ({ data, onUpdate, onNext }) => {
  const [provider, setProvider] = useState<BackendProvider>(BackendProvider.RAILWAY);
  const [customUrl, setCustomUrl] = useState(data.url || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeploy = async () => {
    setLoading(true);
    setError(null);

    try {
      // Deployment logic here
      onUpdate({ isConnected: true });
      onNext();
    } catch (err) {
      setError('Failed to deploy backend');
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setLoading(true);
    setError(null);

    try {
      const url = provider === BackendProvider.CUSTOM ? customUrl : data.url;
      const response = await axios.get(`${url}/health`);
      
      if (response.status === 200) {
        onUpdate({ isConnected: true });
      } else {
        setError('Could not connect to backend server');
      }
    } catch (err) {
      setError('Failed to connect to backend server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Backend Setup</h2>
      <p className="text-gray-600">Choose where to deploy your backend server</p>

      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Select Deployment Platform
          </label>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value as BackendProvider)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            disabled={loading}
          >
            <option value={BackendProvider.RAILWAY}>Railway</option>
            <option value={BackendProvider.HEROKU}>Heroku</option>
            <option value={BackendProvider.CUSTOM}>Custom URL</option>
          </select>
        </div>

        {provider === BackendProvider.CUSTOM && (
          <div className="flex flex-col space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Backend URL
            </label>
            <input
              type="text"
              value={customUrl}
              onChange={(e) => {
                setCustomUrl(e.target.value);
                onUpdate({ url: e.target.value });
              }}
              placeholder="https://your-backend-url.com"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              disabled={loading}
            />
          </div>
        )}

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={handleTestConnection}
            disabled={loading || (provider === BackendProvider.CUSTOM && !customUrl)}
          >
            {loading ? 'Testing...' : 'Test Connection'}
          </button>

          <button
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            onClick={onNext}
            disabled={loading || !data.isConnected}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default BackendSetup;
