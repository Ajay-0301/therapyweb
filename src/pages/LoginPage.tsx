import React, { useState } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AppContext';
import { AutoAwesome as EcoIcon } from '@mui/icons-material';

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(8),
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
}));

const Form = styled('form')(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(1),
}));

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (err) {
      setError('Please use demo@thanya.com / demo123 to log in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <StyledPaper>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <EcoIcon sx={{ color: 'primary.main', fontSize: 40 }} />
          <Typography variant="h4" component="h1">
            Thanya Therapy Notes
          </Typography>
        </Box>

        <Form onSubmit={handleSubmit}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />

          <TextField
            variant="outlined"
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

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isLoading}
            sx={{ mt: 3, mb: 2 }}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>

          <Button
            fullWidth
            variant="outlined"
            color="primary"
            disabled={isLoading}
            sx={{ mb: 2 }}
          >
            Enable Two-Factor Authentication
          </Button>

          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
            Note: Backend integration pending. This is a frontend-only version.
          </Typography>
          <Typography variant="body2" color="primary" align="center">
            Demo Login Credentials:<br />
            Email: demo@thanya.com<br />
            Password: demo123
          </Typography>
        </Form>
      </StyledPaper>
    </Container>
  );
};

export default LoginPage;