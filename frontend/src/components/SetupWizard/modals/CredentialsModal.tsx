import React, { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  styled,
  Box,
} from '@mui/material';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  color: theme.palette.primary.main,
  '& .MuiTypography-root': {
    fontWeight: 600,
  },
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(2),
  '& .MuiTextField-root': {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(2),
  '& .MuiButton-root': {
    margin: theme.spacing(0, 1),
  },
}));

interface Credentials {
  username: string;
  password: string;
}

interface CredentialsModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (credentials: Credentials) => void;
  platformName: string;
}

export const CredentialsModal: React.FC<CredentialsModalProps> = ({
  open,
  onClose,
  onSubmit,
  platformName,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    username: '',
    password: '',
  });

  const validateForm = () => {
    const newErrors = {
      username: '',
      password: '',
    };

    if (!username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return !newErrors.username && !newErrors.password;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({ username, password });
      handleClose();
    }
  };

  const handleClose = () => {
    setUsername('');
    setPassword('');
    setErrors({
      username: '',
      password: '',
    });
    onClose();
  };

  return (
    <StyledDialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <StyledDialogTitle>
        <Typography variant="h6">
          Enter {platformName} Credentials
        </Typography>
      </StyledDialogTitle>

      <StyledDialogContent>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Please enter your {platformName} credentials to authenticate the deployment.
        </Typography>

        <TextField
          fullWidth
          label="Username"
          variant="outlined"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setErrors((prev) => ({ ...prev, username: '' }));
          }}
          error={!!errors.username}
          helperText={errors.username}
          autoFocus
        />

        <TextField
          fullWidth
          label="Password"
          variant="outlined"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrors((prev) => ({ ...prev, password: '' }));
          }}
          error={!!errors.password}
          helperText={errors.password}
        />
      </StyledDialogContent>

      <StyledDialogActions>
        <Button 
          onClick={handleClose}
          sx={{
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          sx={{
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          }}
        >
          Submit
        </Button>
      </StyledDialogActions>
    </StyledDialog>
  );
};

export const showCredentialsModal = (platformName: string): Promise<Credentials | null> => {
  return new Promise((resolve) => {
    const modalRoot = document.createElement('div');
    document.body.appendChild(modalRoot);

    const handleClose = () => {
      resolve(null);
      cleanup();
    };

    const handleSubmit = (credentials: Credentials) => {
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
        platformName={platformName}
      />,
      modalRoot
    );
  });
};
