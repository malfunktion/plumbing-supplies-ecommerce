import { useState } from 'react';
import axios from 'axios';
import { AdminSetupProps } from '@/types/setup';

const AdminSetup = ({ data, onUpdate, onNext, onBack }: AdminSetupProps) => {
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
      const response = await axios.post('/api/admin/create', {
        email: data.email,
        password: data.password,
      });

      if (response.status === 201) {
        onUpdate({ isCreated: true });
        onNext();
      } else {
        setError('Failed to create admin account');
      }
    } catch (err) {
      setError('An error occurred while creating the admin account');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Admin Account Setup</h2>
        <p className="mt-1 text-gray-600">Create your administrator account</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => onUpdate({ email: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="admin@example.com"
            disabled={creating}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={data.password}
            onChange={(e) => onUpdate({ password: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            disabled={creating}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            disabled={creating}
          />
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
            disabled={creating}
          >
            Back
          </button>

          <button
            type="button"
            onClick={createAdmin}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={creating || !data.email || !data.password || !confirmPassword}
          >
            {creating ? 'Creating...' : 'Create Admin Account'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSetup;
