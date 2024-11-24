import axios from 'axios';
import { Router } from 'express';

const router = Router();

interface AtlasProject {
  id: string;
  name: string;
  orgId: string;
}

interface AtlasCluster {
  id: string;
  name: string;
  connectionStrings: {
    standardSrv: string;
  };
}

// MongoDB Atlas API endpoints
const ATLAS_API_BASE = 'https://cloud.mongodb.com/api/atlas/v1.0';

// Create or get existing project
async function getOrCreateProject(apiKey: string, orgId: string, projectName: string): Promise<AtlasProject> {
  try {
    // First, try to find existing project
    const projectsResponse = await axios.get(`${ATLAS_API_BASE}/groups`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      params: {
        name: projectName
      }
    });

    if (projectsResponse.data.results.length > 0) {
      return projectsResponse.data.results[0];
    }

    // If not found, create new project
    const createResponse = await axios.post(`${ATLAS_API_BASE}/groups`, {
      name: projectName,
      orgId
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    });

    return createResponse.data;
  } catch (error) {
    console.error('Error in getOrCreateProject:', error);
    throw new Error('Failed to create or get project');
  }
}

// Create free tier cluster
async function createCluster(apiKey: string, projectId: string): Promise<AtlasCluster> {
  try {
    // Check if cluster already exists
    const clustersResponse = await axios.get(`${ATLAS_API_BASE}/groups/${projectId}/clusters`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json'
      }
    });

    if (clustersResponse.data.results.length > 0) {
      return clustersResponse.data.results[0];
    }

    // Create new M0 (free tier) cluster
    const createResponse = await axios.post(`${ATLAS_API_BASE}/groups/${projectId}/clusters`, {
      name: 'Cluster0',
      providerSettings: {
        providerName: 'TENANT',
        instanceSizeName: 'M0'
      },
      backupEnabled: false
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    });

    // Wait for cluster to be ready
    let cluster;
    let attempts = 0;
    const maxAttempts = 30;

    while (attempts < maxAttempts) {
      const response = await axios.get(`${ATLAS_API_BASE}/groups/${projectId}/clusters/${createResponse.data.name}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json'
        }
      });

      cluster = response.data;
      if (cluster.stateName === 'IDLE') {
        break;
      }

      await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
      attempts++;
    }

    if (!cluster || cluster.stateName !== 'IDLE') {
      throw new Error('Cluster creation timeout');
    }

    return cluster;
  } catch (error) {
    console.error('Error in createCluster:', error);
    throw new Error('Failed to create cluster');
  }
}

// Create database user
async function createDatabaseUser(apiKey: string, projectId: string): Promise<{ username: string; password: string }> {
  try {
    const username = `plumbing-app-user-${Date.now()}`;
    const password = Math.random().toString(36).slice(-12);

    await axios.post(`${ATLAS_API_BASE}/groups/${projectId}/databaseUsers`, {
      username,
      password,
      roles: [{
        roleName: 'readWrite',
        databaseName: 'plumbing-supplies'
      }],
      scopes: [{
        name: 'Cluster0',
        type: 'CLUSTER'
      }]
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    });

    return { username, password };
  } catch (error) {
    console.error('Error in createDatabaseUser:', error);
    throw new Error('Failed to create database user');
  }
}

// Configure network access
async function configureNetworkAccess(apiKey: string, projectId: string): Promise<void> {
  try {
    await axios.post(`${ATLAS_API_BASE}/groups/${projectId}/accessList`, {
      ipAddress: '0.0.0.0/0',
      comment: 'Allow access from anywhere'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    });
  } catch (error) {
    console.error('Error in configureNetworkAccess:', error);
    throw new Error('Failed to configure network access');
  }
}

// Main setup endpoint
router.post('/mongodb-atlas', async (req, res) => {
  const { apiKey, orgId, projectName } = req.body;

  if (!apiKey || !orgId || !projectName) {
    return res.status(400).json({
      error: 'Missing required parameters'
    });
  }

  try {
    // Step 1: Create or get project
    const project = await getOrCreateProject(apiKey, orgId, projectName);

    // Step 2: Create cluster
    const cluster = await createCluster(apiKey, project.id);

    // Step 3: Create database user
    const { username, password } = await createDatabaseUser(apiKey, project.id);

    // Step 4: Configure network access
    await configureNetworkAccess(apiKey, project.id);

    // Return connection details
    res.json({
      success: true,
      username,
      password,
      clusterUrl: cluster.connectionStrings.standardSrv.replace('mongodb+srv://', '')
    });
  } catch (error) {
    console.error('MongoDB Atlas setup error:', error);
    res.status(500).json({
      error: 'Failed to set up MongoDB Atlas',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
