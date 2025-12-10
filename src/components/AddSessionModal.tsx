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
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { Client, Session } from '../types';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers';
import { TimePicker } from '@mui/x-date-pickers';
import '@mui/x-date-pickers/AdapterDateFns';
import '@mui/x-date-pickers/LocalizationProvider';
import '@mui/x-date-pickers/DatePicker';
import '@mui/x-date-pickers/TimePicker';

interface AddSessionModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (session: Omit<Session, 'id'>) => void;
  clients: Client[];
}

const AddSessionModal: React.FC<AddSessionModalProps> = ({ open, onClose, onAdd, clients }) => {
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [duration, setDuration] = useState('60');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!selectedClient) {
      setError('Please select a client');
      return;
    }
    if (!selectedDate) {
      setError('Please select a date');
      return;
    }
    if (!selectedTime) {
      setError('Please select a time');
      return;
    }
    if (!duration || isNaN(Number(duration)) || Number(duration) <= 0) {
      setError('Please enter a valid duration');
      return;
    }

    const client = clients.find(c => c.id === selectedClient);
    if (!client) {
      setError('Invalid client selected');
      return;
    }

    // Combine date and time
    const sessionTime = new Date(selectedTime);
    const sessionDate = new Date(selectedDate);
    sessionDate.setHours(sessionTime.getHours());
    sessionDate.setMinutes(sessionTime.getMinutes());

    onAdd({
      clientId: selectedClient,
      clientName: client.name,
      date: sessionDate.toISOString().split('T')[0],
      time: sessionTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      duration: Number(duration),
    });

    // Reset form
    setSelectedClient('');
    setSelectedDate(null);
    setSelectedTime(null);
    setDuration('60');
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Schedule New Session</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <Box sx={{ display: 'grid', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Client</InputLabel>
              <Select
                value={selectedClient}
                label="Client"
                onChange={(e) => setSelectedClient(e.target.value)}
                required
              >
                {clients.map((client) => (
                  <MenuItem key={client.id} value={client.id}>
                    {client.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Date"
                value={selectedDate}
                onChange={(newValue: Date | null) => setSelectedDate(newValue)}
                slotProps={{ textField: { fullWidth: true, required: true } }}
              />
              <TimePicker
                label="Time"
                value={selectedTime}
                onChange={(newValue: Date | null) => setSelectedTime(newValue)}
                slotProps={{ textField: { fullWidth: true, required: true } }}
              />
            </LocalizationProvider>

            <TextField
              label="Duration (minutes)"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              fullWidth
              required
              InputProps={{
                inputProps: { min: 15, step: 15 }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Schedule Session
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddSessionModal;