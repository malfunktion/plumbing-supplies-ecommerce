import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  styled,
} from '@mui/material';
import type { DatabaseSetupProps } from '@/types/setup';

const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  '& .MuiTextField-root': {
    marginBottom: theme.spacing(2),
  },
}));

export const DatabaseSetup: React.FC<DatabaseSetupProps> = ({ data, onUpdate, onNext, onBack }) => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateConnectionString = (uri: string): boolean => {
    try {
      const url = new URL(uri);
      return url.protocol === 'mongodb:' || url.protocol === 'mongodb+srv:';
    } catch {
      return false;
    }
  };

  const handleUriChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uri = event.target.value;
    onUpdate({
      ...data,
      uri,
      isConnected: false,
    });
    setError(null);
  };

  const handleTestConnection = async () => {
    if (!validateConnectionString(data.uri)) {
      setError('Invalid MongoDB connection string format');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // In the frontend, we'll just validate the format
      const isValid = validateConnectionString(data.uri);
      
      if (isValid) {
        onUpdate({
          ...data,
          isConnected: true,
        });
      } else {
        setError('Invalid connection string format');
      }
    } catch (err) {
      setError('Failed to connect to database. Please check your connection string.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyledBox>
      <Typography variant="h5" gutterBottom>
        Database Configuration
      </Typography>

      <TextField
        fullWidth
        label="MongoDB Connection String"
        value={data.uri}
        onChange={handleUriChange}
        placeholder="mongodb://username:password@host:port/database"
        error={!!error}
        helperText={error || 'Enter your MongoDB connection string'}
        disabled={isLoading}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={onBack} disabled={isLoading}>
          Back
        </Button>
        <Box>
          <Button
            onClick={handleTestConnection}
            disabled={!data.uri || isLoading}
            sx={{ mr: 2 }}
          >
            {isLoading ? (
              <CircularProgress size={24} />
            ) : (
              'Test Connection'
            )}
          </Button>
          <Button
            variant="contained"
            onClick={onNext}
            disabled={!data.isConnected || isLoading}
          >
            Next
          </Button>
        </Box>
      </Box>
    </StyledBox>
  );
};
