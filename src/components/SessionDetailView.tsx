import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Divider,
  Card,
  CardContent,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Session } from '../types';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import EventTag from './EventTag';

interface SessionDetailViewProps {
  session: Session;
  onUpdateSession: (sessionId: string, notes: string, followUp: { date: string; notes: string }) => void;
  onUpdateSessionProfile: (session: Session) => void;
  onDeleteSession?: (sessionId: string) => void;
}

const SessionDetailView: React.FC<SessionDetailViewProps> = ({
  session,
  onUpdateSession,
  onUpdateSessionProfile,
  onDeleteSession,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSession, setEditedSession] = useState(session);
  const [chiefComplaints, setChiefComplaints] = useState(session.chiefComplaints || '');
  const [hopi, setHopi] = useState(session.hopi || '');
  const [sessionNotes, setSessionNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState<Date | null>(null);
  const [followUpNotes, setFollowUpNotes] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleSave = async () => {
    try {
      const updatedSession: Session = {
        ...editedSession,
        chiefComplaints,
        hopi,
      };
      await onUpdateSessionProfile(updatedSession);
      setIsEditing(false);
      setSnackbarMessage('Profile updated successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Failed to update profile:', error);
      setSnackbarMessage('Failed to update profile. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Keep local editedSession in sync
  useEffect(() => {
    setEditedSession(session);
    setChiefComplaints(session.chiefComplaints || '');
    setHopi(session.hopi || '');
    setSessionNotes('');
    setFollowUpDate(null);
    setFollowUpNotes('');
  }, [session]);

  const handleAddSessionNotes = async () => {
    if (!sessionNotes.trim()) return;

    try {
      const followUp = followUpDate && followUpNotes.trim() ? {
        date: (() => {
          const year = followUpDate.getFullYear();
          const month = String(followUpDate.getMonth() + 1).padStart(2, '0');
          const day = String(followUpDate.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        })(),
        notes: followUpNotes,
      } : undefined;

      await onUpdateSession(session.id, sessionNotes, followUp || { date: '', notes: '' });

      // Update local state to reflect the changes
      setSessionNotes('');
      setFollowUpDate(null);
      setFollowUpNotes('');
      setSnackbarMessage('Session notes added successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Failed to add session notes:', error);
      setSnackbarMessage('Failed to add session notes. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Session Profile: {session.clientName}
        </Typography>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Profile Information</Typography>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => setIsEditing(!isEditing)}
              size="small"
            >
              {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </Button>
          </Box>

          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
            <TextField
              label="Name"
              value={editedSession.clientName}
              onChange={(e) => setEditedSession({ ...editedSession, clientName: e.target.value })}
              disabled={!isEditing}
              fullWidth
            />
            <TextField
              label="Email"
              value={editedSession.email || ''}
              onChange={(e) => setEditedSession({ ...editedSession, email: e.target.value })}
              disabled={!isEditing}
              fullWidth
            />
            <TextField
              label="Phone"
              value={editedSession.phone || ''}
              onChange={(e) => setEditedSession({ ...editedSession, phone: e.target.value })}
              disabled={!isEditing}
              fullWidth
            />
            <TextField
              label="Occupation"
              value={editedSession.occupation || ''}
              onChange={(e) => setEditedSession({ ...editedSession, occupation: e.target.value })}
              disabled={!isEditing}
              fullWidth
            />
            <TextField
              label="Age"
              type="number"
              value={editedSession.age || ''}
              onChange={(e) => {
                const value = e.target.value;
                const numValue = value === '' ? undefined : Number(value);
                setEditedSession({ ...editedSession, age: numValue });
              }}
              disabled={!isEditing}
              fullWidth
              InputProps={{
                inputProps: { min: 0, max: 150 }
              }}
            />
            <TextField
              label="Status"
              value={editedSession.status || 'Active'}
              onChange={(e) => setEditedSession({ ...editedSession, status: e.target.value as 'Active' | 'Completed' })}
              disabled={!isEditing}
              fullWidth
            />
          </Box>

          {isEditing && (
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" onClick={handleSave}>
                Save Profile
              </Button>
            </Box>
          )}
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Chief Complaints
          </Typography>
          <TextField
            multiline
            rows={3}
            value={chiefComplaints}
            onChange={(e) => setChiefComplaints(e.target.value)}
            fullWidth
            placeholder="Enter chief complaints..."
          />
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            History of Presenting Illness (HOPI)
          </Typography>
          <TextField
            multiline
            rows={3}
            value={hopi}
            onChange={(e) => setHopi(e.target.value)}
            fullWidth
            placeholder="Enter HOPI..."
          />
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Session Notes
          </Typography>
          <TextField
            multiline
            rows={4}
            value={sessionNotes}
            onChange={(e) => setSessionNotes(e.target.value)}
            fullWidth
            placeholder="Add session notes..."
          />
          <Box sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
            <DatePicker
              label="Follow-up Date"
              value={followUpDate}
              onChange={setFollowUpDate}
              slotProps={{ textField: { size: 'small' } }}
            />
            <TextField
              label="Follow-up Notes"
              value={followUpNotes}
              onChange={(e) => setFollowUpNotes(e.target.value)}
              size="small"
              fullWidth
            />
            <Button variant="contained" onClick={handleAddSessionNotes}>
              Add Notes
            </Button>
          </Box>
        </Paper>

        {session.followUp && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6">Follow-up</Typography>
              <Typography>Date: {session.followUp.date}</Typography>
              <Typography>Notes: {session.followUp.notes}</Typography>
            </CardContent>
          </Card>
        )}

        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Session History
          </Typography>
          <Card>
            <CardContent sx={{ position: 'relative' }}>
              {onDeleteSession && (
                <IconButton
                  onClick={() => setDeleteDialogOpen(true)}
                  sx={{ position: 'absolute', top: 8, right: 8, color: 'error.main' }}
                  size="small"
                  aria-label="delete-session"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
              <EventTag
                type="calendar"
              >
                {session.clientName}
              </EventTag>
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 1 }}>
                Date: {session.date} | Time: {session.time}
              </Typography>
              {session.notes && (
                <Typography variant="body2" color="text.secondary">
                  {session.notes}
                </Typography>
              )}
              {session.followUp && (
                <>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                    Follow-up: {session.followUp.date}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {session.followUp.notes}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Paper>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={() => setSnackbarOpen(false)}
        >
          <Alert severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)}>
            {snackbarMessage}
          </Alert>
        </Snackbar>

        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          aria-labelledby="delete-session-dialog-title"
        >
          <DialogTitle id="delete-session-dialog-title">
            Confirm Delete
          </DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this session? This cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (onDeleteSession) {
                  onDeleteSession(session.id);
                }
                setDeleteDialogOpen(false);
              }}
              color="error"
              variant="contained"
            >
              Delete Session
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default SessionDetailView;