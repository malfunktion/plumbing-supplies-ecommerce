import React from 'react';
import { useTheme } from '@mui/material/styles';
import { createPortal } from 'react-dom';
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
  title?: string;
  description?: string;
}

export const TokenInputModal = ({
  open,
  onClose,
  onSubmit,
  title = 'Enter Token',
  description = 'Please enter your authentication token',
}: TokenInputModalProps) => {
  const [token, setToken] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      setError('Token is required');
      return;
    }
    onSubmit(token);
    setToken('');
    setError('');
    onClose();
  };

  return createPortal(
    <StyledDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <StyledDialogTitle>
          <Typography variant="h6">
            {title}
          </Typography>
        </StyledDialogTitle>
        <StyledDialogContent>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {description}
          </Typography>
          <Box sx={{ mt: 2 }}>
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
              required
            />
          </Box>
        </StyledDialogContent>
        <StyledDialogActions>
          <Button 
            onClick={onClose}
            sx={{
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
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
      </form>
    </StyledDialog>,
    document.body
  );
};

export const showTokenInputModal = (platformName: string): Promise<string | null> => {
  return new Promise((resolve) => {
    const handleClose = () => {
      resolve(null);
    };

    const handleSubmit = (token: string) => {
      resolve(token);
    };

    const modal = (
      <TokenInputModal
        open={true}
        onClose={handleClose}
        onSubmit={handleSubmit}
        title={`Enter ${platformName} API Token`}
        description={`Please enter your API token from ${platformName}. You can find this in your account settings or developer dashboard.`}
      />
    );

    return modal;
  });
};
