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

interface TokenInputModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (token: string) => void;
  title: string;
  description: string;
}

export const TokenInputModal = ({
  open,
  onClose,
  onSubmit,
  title,
  description,
}: TokenInputModalProps) => {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!token.trim()) {
      setError('Token is required');
      return;
    }
    onSubmit(token);
    setToken('');
    setError('');
  };

  const handleClose = () => {
    setToken('');
    setError('');
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
          {title}
        </Typography>
      </StyledDialogTitle>

      <StyledDialogContent>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          {description}
        </Typography>

        <TextField
          fullWidth
          label="API Token"
          variant="outlined"
          value={token}
          onChange={(e) => {
            setToken(e.target.value);
            setError('');
          }}
          error={!!error}
          helperText={error}
          type="password"
          autoFocus
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

export const showTokenInputModal = (platformName: string): Promise<string | null> => {
  return new Promise((resolve) => {
    const modalRoot = document.createElement('div');
    document.body.appendChild(modalRoot);

    const handleClose = () => {
      resolve(null);
      cleanup();
    };

    const handleSubmit = (token: string) => {
      resolve(token);
      cleanup();
    };

    const cleanup = () => {
      document.body.removeChild(modalRoot);
    };

    ReactDOM.render(
      <TokenInputModal
        open={true}
        onClose={handleClose}
        onSubmit={handleSubmit}
        title={`Enter ${platformName} API Token`}
        description={`Please enter your API token from ${platformName}. You can find this in your account settings or developer dashboard.`}
      />,
      modalRoot
    );
  });
};
