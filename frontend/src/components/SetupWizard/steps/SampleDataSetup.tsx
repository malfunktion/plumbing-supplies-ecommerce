import { useState } from 'react';
import axios from 'axios';

interface SampleDataSetupProps {
  data: {
    install: boolean;
    isInstalled: boolean;
  };
  onUpdate: (data: Partial<{ install: boolean; isInstalled: boolean }>) => void;
  onNext: () => void;
}

const SampleDataSetup = ({ data, onUpdate, onNext }: SampleDataSetupProps) => {
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
      const response = await axios.post('/api/setup/install-sample-data');

      if (response.data.success) {
        onUpdate({ isInstalled: true });
        onNext();
      } else {
        setError('Could not install sample data');
      }
    } catch (err) {
      setError('Failed to install sample data');
    } finally {
      setInstalling(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">
          Sample Data
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Would you like to install sample plumbing products data?
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            id="install-sample-data"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            checked={data.install}
            onChange={(e) => onUpdate({ install: e.target.checked })}
          />
          <label
            htmlFor="install-sample-data"
            className="ml-2 block text-sm text-gray-900"
          >
            Yes, install 200 sample plumbing products
          </label>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="text-sm font-medium text-gray-900">
            Sample data includes:
          </h4>
          <ul className="mt-2 text-sm text-gray-500 list-disc list-inside space-y-1">
            <li>Various categories of plumbing supplies</li>
            <li>Realistic product descriptions and specifications</li>
            <li>Sample prices and stock levels</li>
            <li>Product images</li>
          </ul>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            installing ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={handleInstall}
          disabled={installing}
        >
          {installing ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Installing Sample Data...
            </>
          ) : (
            data.install ? 'Install & Continue' : 'Skip & Continue'
          )}
        </button>
      </div>
    </div>
  );
};

export default SampleDataSetup;
