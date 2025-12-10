import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
} from '@mui/material';
import { Client } from '../types';

interface AddClientModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (client: Omit<Client, 'id' | 'status'>) => void;
}

const AddClientModal: React.FC<AddClientModalProps> = ({ open, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    if (!age || isNaN(Number(age)) || Number(age) <= 0) {
      setError('Please enter a valid age');
      return;
    }
    if (!email && !phone) {
      setError('Either email or phone number is required');
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (phone && !/^\d{10}$/.test(phone)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    onAdd({
      name: name.trim(),
      age: Number(age),
      email: email || undefined,
      phone: phone || undefined,
    });

    // Reset form
    setName('');
    setAge('');
    setEmail('');
    setPhone('');
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Client</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <Box sx={{ display: 'grid', gap: 2 }}>
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              helperText="Either email or phone is required"
            />
            <TextField
              label="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              fullWidth
              helperText="10-digit number"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Add Client
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddClientModal;