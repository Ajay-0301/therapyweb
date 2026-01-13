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
  Autocomplete,
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
  const [clientName, setClientName] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [duration, setDuration] = useState('60');
  const [error, setError] = useState<string | null>(null);
  // Profile fields for standalone sessions
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [occupation, setOccupation] = useState<string>('');
  const [age, setAge] = useState<string>('');

  const clientOptions = clients.map(c => c.name);
  const isExistingClient = clients.some(c => c.name.toLowerCase() === clientName.toLowerCase());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!clientName.trim()) {
      setError('Please enter a client name');
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

    // Always create standalone session
    const clientId = undefined;

    // Combine date and time - ensure proper local date handling
    const sessionDate = new Date(selectedDate!);
    const sessionTime = new Date(selectedTime!);
    
    // Set the time from the time picker to the date
    sessionDate.setHours(sessionTime.getHours());
    sessionDate.setMinutes(sessionTime.getMinutes());
    sessionDate.setSeconds(0);
    sessionDate.setMilliseconds(0);

    // Format date as YYYY-MM-DD local time (not UTC)
    const year = sessionDate.getFullYear();
    const month = String(sessionDate.getMonth() + 1).padStart(2, '0');
    const day = String(sessionDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    // Format time as HH:MM in 24-hour format
    const hours = String(sessionDate.getHours()).padStart(2, '0');
    const minutes = String(sessionDate.getMinutes()).padStart(2, '0');
    const timeStr = `${hours}:${minutes}`;

    const sessionData: Omit<Session, 'id'> = {
      clientId,
      clientName: clientName.trim(),
      date: dateStr,
      time: timeStr,
      duration: Number(duration),
      isFromCalendarModal: true,
    };

    // Always add profile fields for calendar sessions
    sessionData.email = email.trim() || undefined;
    sessionData.phone = phone.trim() || undefined;
    sessionData.occupation = occupation.trim() || undefined;
    sessionData.age = age ? Number(age) : undefined;
    sessionData.status = 'Active';

    onAdd(sessionData);

    // Reset form
    setClientName('');
    setSelectedDate(null);
    setSelectedTime(null);
    setDuration('60');
    setEmail('');
    setPhone('');
    setOccupation('');
    setAge('');
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
            <Autocomplete
              freeSolo
              options={clientOptions}
              value={clientName}
              onChange={(event, newValue) => {
                setClientName(newValue || '');
              }}
              inputValue={clientName}
              onInputChange={(event, newInputValue) => {
                setClientName(newInputValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Client Name"
                  placeholder="Enter or select client name"
                  required
                />
              )}
            />

            {clientName.trim() && (
              <>
                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Occupation"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  fullWidth
                  InputProps={{
                    inputProps: { min: 0 }
                  }}
                />
              </>
            )}

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