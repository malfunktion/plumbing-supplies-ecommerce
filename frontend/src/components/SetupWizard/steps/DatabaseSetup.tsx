import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  FormControlLabel,
  Switch,
  styled
} from '@mui/material';
import type { DatabaseSetupProps } from '@/types/setup';

enum DatabaseType {
  MONGODB_ATLAS = 'MONGODB_ATLAS',
  MONGODB_LOCAL = 'MONGODB_LOCAL'
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

export const DatabaseSetup = ({ data, onUpdate, onNext, onBack }: DatabaseSetupProps) => {
  const theme = useTheme();
  const [dbType, setDbType] = useState<DatabaseType>(DatabaseType.MONGODB_ATLAS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // MongoDB Atlas fields
  const [atlasUsername, setAtlasUsername] = useState('');
  const [atlasPassword, setAtlasPassword] = useState('');
  const [atlasClusterUrl, setAtlasClusterUrl] = useState('');
  const [includeSampleData, setIncludeSampleData] = useState(true);

  const validateMongoDBUri = (uri: string): boolean => {
    const mongoDbUriPattern = /^mongodb(\+srv)?:\/\/.+/;
    return mongoDbUriPattern.test(uri);
  };

  const handleTestConnection = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const uri = `mongodb+srv://${atlasUsername}:${atlasPassword}@${atlasClusterUrl}/?retryWrites=true&w=majority`;
      
      if (!validateMongoDBUri(uri)) {
        throw new Error('Invalid MongoDB URI format');
      }

      // Store the URI in the setup data
      onUpdate({ 
        uri,
        isConnected: true,
        includeSampleData
      });
      
      onNext();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to validate connection string');
      onUpdate({ isConnected: false });
    }
    
    setLoading(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <StyledPaper>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Database Setup
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 3 }}>
          Configure your MongoDB Atlas database connection
        </Typography>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Atlas Username"
            value={atlasUsername}
            onChange={(e) => setAtlasUsername(e.target.value)}
            margin="normal"
            disabled={loading}
          />
          
          <TextField
            fullWidth
            type="password"
            label="Atlas Password"
            value={atlasPassword}
            onChange={(e) => setAtlasPassword(e.target.value)}
            margin="normal"
            disabled={loading}
          />
          
          <TextField
            fullWidth
            label="Atlas Cluster URL"
            value={atlasClusterUrl}
            onChange={(e) => setAtlasClusterUrl(e.target.value)}
            margin="normal"
            disabled={loading}
            placeholder="cluster0.xxxxx.mongodb.net"
          />

          <FormControlLabel
            control={
              <Switch
                checked={includeSampleData}
                onChange={(e) => setIncludeSampleData(e.target.checked)}
                disabled={loading}
              />
            }
            label="Include sample data"
          />
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            variant="outlined"
            onClick={onBack}
            disabled={loading}
          >
            Back
          </Button>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              onClick={handleTestConnection}
              disabled={loading || !atlasUsername || !atlasPassword || !atlasClusterUrl}
            >
              {loading ? 'Validating...' : 'Validate & Continue'}
            </Button>
          </Box>
        </Box>
      </StyledPaper>
    </Box>
  );
};
