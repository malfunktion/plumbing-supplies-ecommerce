import { useState } from 'react';
import axios from 'axios';

interface DatabaseSetupProps {
  data: {
    uri: string;
    isConnected: boolean;
  };
  onUpdate: (data: Partial<{ uri: string; isConnected: boolean }>) => void;
  onNext: () => void;
}

const DatabaseSetup = ({ data, onUpdate, onNext }: DatabaseSetupProps) => {
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState('');

  const testConnection = async () => {
    setTesting(true);
    setError('');

    try {
      const response = await axios.post('/api/setup/test-database', {
        uri: data.uri
      });

      if (response.data.success) {
        onUpdate({ isConnected: true });
        onNext();
      } else {
        setError('Could not connect to database');
      }
    } catch (err) {
      setError('Failed to test database connection');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">
          Database Connection
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Enter your MongoDB connection string to get started
        </p>
      </div>

      <div>
        <label
          htmlFor="uri"
          className="block text-sm font-medium text-gray-700"
        >
          MongoDB URI
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="uri"
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="mongodb://username:password@host:port/database"
            value={data.uri}
            onChange={(e) => onUpdate({ uri: e.target.value })}
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Your database connection string, including credentials and database name
        </p>
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
            testing || !data.uri ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={testConnection}
          disabled={testing || !data.uri}
        >
          {testing ? (
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
              Testing Connection...
            </>
          ) : (
            'Test Connection & Continue'
          )}
        </button>
      </div>
    </div>
  );
};

export default DatabaseSetup;
