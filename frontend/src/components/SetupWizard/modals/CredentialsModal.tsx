import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  Box,
} from '@mui/material';

interface CredentialsModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (credentials: Record<string, string>) => void;
  fields: Array<{
    name: string;
    label: string;
    type?: string;
    default?: string;
  }>;
  title?: string;
}

export const CredentialsModal: React.FC<CredentialsModalProps> = ({
  open,
  onClose,
  onSubmit,
  fields,
  title = 'Enter Credentials',
}) => {
  const [credentials, setCredentials] = useState<Record<string, string>>(
    fields.reduce((acc, field) => ({
      ...acc,
      [field.name]: field.default || '',
    }), {})
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    // Validate all fields are filled
    const missingFields = fields
      .filter(field => !credentials[field.name])
      .map(field => field.label);

    if (missingFields.length > 0) {
      setError(`Please fill in: ${missingFields.join(', ')}`);
      return;
    }

    setError(null);
    onSubmit(credentials);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {fields.map((field) => (
            <TextField
              key={field.name}
              label={field.label}
              type={field.type || 'text'}
              value={credentials[field.name]}
              onChange={(e) =>
                setCredentials((prev) => ({
                  ...prev,
                  [field.name]: e.target.value,
                }))
              }
              fullWidth
            />
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const showCredentialsModal = (platformName: string, fields: Array<{
  name: string;
  label: string;
  type?: string;
  default?: string;
}>): Promise<Record<string, string> | null> => {
  return new Promise((resolve) => {
    const modalRoot = document.createElement('div');
    document.body.appendChild(modalRoot);

    const handleClose = () => {
      resolve(null);
      cleanup();
    };

    const handleSubmit = (credentials: Record<string, string>) => {
      resolve(credentials);
      cleanup();
    };

    const cleanup = () => {
      document.body.removeChild(modalRoot);
    };

    ReactDOM.render(
      <CredentialsModal
        open={true}
        onClose={handleClose}
        onSubmit={handleSubmit}
        fields={fields}
        title={`Enter ${platformName} Credentials`}
      />,
      modalRoot
    );
  });
};
