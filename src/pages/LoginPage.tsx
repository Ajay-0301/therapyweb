import React, { useState } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
  Avatar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AppContext';
import { api } from '../utils/api';
import { LockOutlined } from '@mui/icons-material';

const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `linear-gradient(135deg, ${theme.palette.primary.light}20 0%, ${theme.palette.secondary.light}20 100%)`,
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `radial-gradient(circle at 20% 80%, ${theme.palette.primary.main}10 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${theme.palette.secondary.main}10 0%, transparent 50%)`,
    pointerEvents: 'none',
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(8),
  padding: theme.spacing(6),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: theme.spacing(3),
  boxShadow: `0 20px 40px ${theme.palette.primary.main}15, 0 8px 16px ${theme.palette.secondary.main}10`,
  backdropFilter: 'blur(10px)',
  background: 'rgba(255, 255, 255, 0.95)',
  border: `1px solid ${theme.palette.primary.light}20`,
  position: 'relative',
  zIndex: 1,
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  margin: theme.spacing(1),
  backgroundColor: theme.palette.primary.main,
  width: 64,
  height: 64,
  boxShadow: `0 8px 16px ${theme.palette.primary.main}30`,
}));

const Form = styled('form')(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(3),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(2),
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(2),
  fontSize: '1.1rem',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: `0 4px 12px ${theme.palette.primary.main}30`,
  '&:hover': {
    boxShadow: `0 6px 20px ${theme.palette.primary.main}40`,
    transform: 'translateY(-1px)',
  },
  transition: 'all 0.2s ease-in-out',
}));

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isRegistering) {
        await api.auth.register(email, password, name);
        setError('Registration successful! Please log in.');
        setIsRegistering(false);
        setName('');
      } else {
        await login(email, password);
        navigate('/dashboard');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Authentication failed. Please check your credentials.';
      setDialogMessage(errorMessage);
      setDialogOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyledContainer maxWidth="sm">
      <StyledPaper>
        <StyledAvatar>
          <LockOutlined />
        </StyledAvatar>
        <Typography component="h1" variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
          {isRegistering ? 'Create Account' : 'Welcome Back'}
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
          {isRegistering ? 'Sign up for your therapy management dashboard' : 'Sign in to your therapy management dashboard'}
        </Typography>

        <Form onSubmit={handleSubmit}>
          {error && (
            <Alert severity={error.includes('successful') ? 'success' : 'error'} sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {isRegistering && (
            <StyledTextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Full Name"
              name="name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          )}

          <StyledTextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus={!isRegistering}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />

          <StyledTextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />

          <StyledButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isLoading ? (isRegistering ? 'Creating Account...' : 'Signing in...') : (isRegistering ? 'Create Account' : 'Sign In')}
          </StyledButton>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
                setName('');
                setEmail('');
                setPassword('');
              }}
              sx={{ textTransform: 'none' }}
            >
              {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </Button>
          </Box>

          <Alert severity="info" sx={{ borderRadius: 2, mt: 2 }}>
            <Typography variant="body2">
              <strong>Note:</strong> Full-stack therapy management system with permanent data storage.
            </Typography>
          </Alert>
        </Form>
      </StyledPaper>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Typography>{dialogMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>OK</Button>
        </DialogActions>
      </Dialog>
    </StyledContainer>
  );
};

export default LoginPage;