import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  styled,
  SelectChangeEvent,
} from '@mui/material';
import type { DatabaseSetupData } from '@/types/setup';

const StyledCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

interface DatabaseStepProps {
  data: DatabaseSetupData;
  onUpdate: (data: DatabaseSetupData) => void;
}

const databaseProviders = [
  {
    value: 'mongodb',
    label: 'MongoDB',
    description: 'NoSQL database for flexible data storage',
  },
  {
    value: 'postgresql',
    label: 'PostgreSQL',
    description: 'Robust relational database with ACID compliance',
  },
  {
    value: 'mysql',
    label: 'MySQL',
    description: 'Popular open-source relational database',
  },
];

const DatabaseStep: React.FC<DatabaseStepProps> = ({ data, onUpdate }) => {
  const [provider, setProvider] = useState(data.provider || 'mongodb');
  const [uri, setUri] = useState(data.uri || '');
  const [name, setName] = useState(data.name || '');

  const handleProviderChange = (event: SelectChangeEvent<string>) => {
    const newProvider = event.target.value;
    setProvider(newProvider);
    onUpdate({
      ...data,
      provider: newProvider,
      isConnected: false,
    });
  };

  const handleUriChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUri = event.target.value;
    setUri(newUri);
    onUpdate({
      ...data,
      uri: newUri,
      isConnected: false,
    });
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    setName(newName);
    onUpdate({
      ...data,
      name: newName,
      isConnected: false,
    });
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Database Configuration
      </Typography>
      <Typography variant="body1" paragraph>
        Configure your database connection settings.
      </Typography>

      <StyledCard>
        <CardContent>
          <StyledFormControl fullWidth>
            <InputLabel id="database-provider-label">Database Provider</InputLabel>
            <Select
              labelId="database-provider-label"
              value={provider}
              label="Database Provider"
              onChange={handleProviderChange}
            >
              {databaseProviders.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Box>
                    <Typography variant="subtitle1">{option.label}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {option.description}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Choose your preferred database provider</FormHelperText>
          </StyledFormControl>

          <TextField
            fullWidth
            label="Database URI"
            variant="outlined"
            value={uri}
            onChange={handleUriChange}
            helperText="Enter your database connection URI"
            sx={{ mt: 2 }}
          />

          <TextField
            fullWidth
            label="Database Name"
            variant="outlined"
            value={name}
            onChange={handleNameChange}
            helperText="Enter the name of your database"
            sx={{ mt: 2 }}
          />
        </CardContent>
      </StyledCard>

      <Typography variant="body2" color="textSecondary">
        Make sure your database is accessible from your deployment environment.
      </Typography>
    </Box>
  );
};

export default DatabaseStep;
