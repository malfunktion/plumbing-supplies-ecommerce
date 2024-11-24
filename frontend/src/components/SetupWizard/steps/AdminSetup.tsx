import { useState } from 'react';
import axios from 'axios';

interface AdminSetupProps {
  data: {
    email: string;
    password: string;
    isCreated: boolean;
  };
  onUpdate: (data: Partial<{ email: string; password: string; isCreated: boolean }>) => void;
  onNext: () => void;
}

const AdminSetup = ({ data, onUpdate, onNext }: AdminSetupProps) => {
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const createAdmin = async () => {
    if (data.password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setCreating(true);
    setError('');

    try {
      const response = await axios.post('/api/setup/create-admin', {
        email: data.email,
        password: data.password
      });

      if (response.data.success) {
        onUpdate({ isCreated: true });
        onNext();
      } else {
        setError('Could not create admin account');
      }
    } catch (err) {
      setError('Failed to create admin account');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">
          Create Admin Account
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Set up your administrator account to manage your store
        </p>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email Address
        </label>
        <div className="mt-1">
          <input
            type="email"
            id="email"
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            value={data.email}
            onChange={(e) => onUpdate({ email: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <div className="mt-1">
          <input
            type="password"
            id="password"
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            value={data.password}
            onChange={(e) => onUpdate({ password: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700"
        >
          Confirm Password
        </label>
        <div className="mt-1">
          <input
            type="password"
            id="confirmPassword"
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
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
            creating || !data.email || !data.password || !confirmPassword
              ? 'opacity-50 cursor-not-allowed'
              : ''
          }`}
          onClick={createAdmin}
          disabled={creating || !data.email || !data.password || !confirmPassword}
        >
          {creating ? (
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
              Creating Account...
            </>
          ) : (
            'Create Account & Continue'
          )}
        </button>
      </div>
    </div>
  );
};

export default AdminSetup;
