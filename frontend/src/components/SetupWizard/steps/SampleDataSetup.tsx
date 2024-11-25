import { useState } from 'react';
import axios from 'axios';
import { SampleDataSetupProps } from '@/types/setup';

const SampleDataSetup = ({ data, onUpdate, onNext, onBack }: SampleDataSetupProps) => {
  const [installing, setInstalling] = useState(false);
  const [error, setError] = useState('');

  const handleInstall = async () => {
    if (!data.install) {
      onNext();
      return;
    }

    setInstalling(true);
    setError('');

    try {
      const response = await axios.post('/api/sample-data/install');
      
      if (response.status === 200) {
        onUpdate({ isInstalled: true });
        onNext();
      } else {
        setError('Failed to install sample data');
      }
    } catch (err) {
      setError('An error occurred while installing sample data');
    } finally {
      setInstalling(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Sample Data</h2>
        <p className="mt-1 text-gray-600">
          Would you like to install sample products and categories?
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="install-sample-data"
            checked={data.install}
            onChange={(e) => onUpdate({ install: e.target.checked })}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            disabled={installing}
          />
          <label
            htmlFor="install-sample-data"
            className="ml-2 block text-sm text-gray-900"
          >
            Install sample data
          </label>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <div className="flex justify-between">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            disabled={installing}
          >
            Back
          </button>

          <button
            type="button"
            onClick={handleInstall}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={installing}
          >
            {installing ? 'Installing...' : data.install ? 'Install & Continue' : 'Skip & Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SampleDataSetup;
