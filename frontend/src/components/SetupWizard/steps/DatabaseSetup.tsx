import React, { useState } from 'react';
import axios from 'axios';

enum DatabaseType {
  MONGODB_ATLAS = 'MONGODB_ATLAS',
  MONGODB_LOCAL = 'MONGODB_LOCAL'
}

interface DatabaseSetupProps {
  onNext: () => void;
  onBack?: () => void;
}

const DatabaseSetup: React.FC<DatabaseSetupProps> = ({ onNext, onBack }) => {
  const [dbType, setDbType] = useState<DatabaseType>(DatabaseType.MONGODB_ATLAS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // MongoDB Atlas fields
  const [atlasUsername, setAtlasUsername] = useState('');
  const [atlasPassword, setAtlasPassword] = useState('');
  const [atlasClusterUrl, setAtlasClusterUrl] = useState('');
  
  // Direct Atlas Integration
  const [atlasApiKey, setAtlasApiKey] = useState('');
  const [atlasOrgId, setAtlasOrgId] = useState('');
  const [atlasProjectName, setAtlasProjectName] = useState('plumbing-supplies');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleAtlasLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      // Call MongoDB Atlas API to create/configure database
      const response = await axios.post('/api/setup/mongodb-atlas', {
        apiKey: atlasApiKey,
        orgId: atlasOrgId,
        projectName: atlasProjectName
      });

      if (response.data.success) {
        // Auto-fill the connection details from the response
        const { username, password, clusterUrl } = response.data;
        setAtlasUsername(username);
        setAtlasPassword(password);
        setAtlasClusterUrl(clusterUrl);
        setSuccess(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to MongoDB Atlas');
    }
    setLoading(false);
  };

  const handleTestConnection = async () => {
    setLoading(true);
    setError(null);
    try {
      let uri;
      if (dbType === DatabaseType.MONGODB_ATLAS) {
        uri = `mongodb+srv://${atlasUsername}:${atlasPassword}@${atlasClusterUrl}/?retryWrites=true&w=majority`;
      }

      const response = await axios.post('/api/setup/test-database', { uri });
      
      if (response.data.success) {
        setSuccess(true);
        // Save the connection details securely
        await axios.post('/api/setup/save-config', {
          type: dbType,
          uri,
          atlasOrgId: atlasOrgId || undefined,
          atlasProjectName: atlasProjectName || undefined
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to test connection');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Database Setup</h2>
        
        <div className="space-y-4">
          <div className="flex space-x-4">
            <button
              className={`px-4 py-2 rounded ${
                dbType === DatabaseType.MONGODB_ATLAS
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200'
              }`}
              onClick={() => setDbType(DatabaseType.MONGODB_ATLAS)}
            >
              MongoDB Atlas (Recommended)
            </button>
            <button
              className={`px-4 py-2 rounded ${
                dbType === DatabaseType.MONGODB_LOCAL
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200'
              }`}
              onClick={() => setDbType(DatabaseType.MONGODB_LOCAL)}
            >
              Local MongoDB
            </button>
          </div>

          {dbType === DatabaseType.MONGODB_ATLAS && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Connect with MongoDB Atlas for a fully managed database solution.
                </p>
                
                <div className="mb-4">
                  <button
                    className="text-blue-600 text-sm"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                  >
                    {showAdvanced ? 'Hide' : 'Show'} Advanced Options (Direct Atlas Integration)
                  </button>
                </div>

                {showAdvanced ? (
                  <>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Atlas API Key
                        </label>
                        <input
                          type="password"
                          value={atlasApiKey}
                          onChange={(e) => setAtlasApiKey(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                          placeholder="Enter your Atlas API Key"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Organization ID
                        </label>
                        <input
                          type="text"
                          value={atlasOrgId}
                          onChange={(e) => setAtlasOrgId(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                          placeholder="Enter your Atlas Organization ID"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Project Name
                        </label>
                        <input
                          type="text"
                          value={atlasProjectName}
                          onChange={(e) => setAtlasProjectName(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                          placeholder="Enter project name"
                        />
                      </div>
                      <button
                        onClick={handleAtlasLogin}
                        disabled={loading}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                      >
                        {loading ? 'Connecting...' : 'Connect with Atlas'}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Username
                        </label>
                        <input
                          type="text"
                          value={atlasUsername}
                          onChange={(e) => setAtlasUsername(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                          placeholder="Enter your Atlas username"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Password
                        </label>
                        <input
                          type="password"
                          value={atlasPassword}
                          onChange={(e) => setAtlasPassword(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                          placeholder="Enter your Atlas password"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Cluster URL
                        </label>
                        <input
                          type="text"
                          value={atlasClusterUrl}
                          onChange={(e) => setAtlasClusterUrl(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                          placeholder="cluster0.xxxxx.mongodb.net"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="text-red-600 text-sm p-2 bg-red-50 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="text-green-600 text-sm p-2 bg-green-50 rounded">
              Successfully connected to database!
            </div>
          )}

          <div className="flex justify-between pt-4">
            {onBack && (
              <button
                onClick={onBack}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Back
              </button>
            )}
            <div className="space-x-4">
              <button
                onClick={handleTestConnection}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Testing...' : 'Test Connection'}
              </button>
              <button
                onClick={onNext}
                disabled={!success}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseSetup;
