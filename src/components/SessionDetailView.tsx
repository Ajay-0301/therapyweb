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
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Delete as DeleteIcon } from '@mui/icons-material';
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

  const handleSave = () => {
    const updatedSession: Session = {
      ...editedSession,
      chiefComplaints,
      hopi,
    };
    onUpdateSessionProfile(updatedSession);
    setIsEditing(false);
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

  const handleAddSessionNotes = () => {
    if (!sessionNotes.trim()) return;

    const followUp = followUpDate && followUpNotes.trim() ? {
      date: (() => {
        const year = followUpDate.getFullYear();
        const month = String(followUpDate.getMonth() + 1).padStart(2, '0');
        const day = String(followUpDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      })(),
      notes: followUpNotes,
    } : undefined;

    onUpdateSession(session.id, sessionNotes, followUp || { date: '', notes: '' });    
    // Also update chiefComplaints and hopi with the session
    const updatedSession: Session = {
      ...session,
      chiefComplaints,
      hopi,
      notes: sessionNotes,
      followUp,
    };
    onUpdateSessionProfile(updatedSession);
        setSessionNotes('');
    setFollowUpDate(null);
    setFollowUpNotes('');
    setSnackbarOpen(true);
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
            <IconButton onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? <SaveIcon /> : <EditIcon />}
            </IconButton>
          </Box>

          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: '1fr 1fr' }}>
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
              onChange={(e) => setEditedSession({ ...editedSession, age: Number(e.target.value) || undefined })}
              disabled={!isEditing}
              fullWidth
              InputProps={{
                inputProps: { min: 0 }
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

        {onDeleteSession && (
          <Box sx={{ mt: 3 }}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => onDeleteSession(session.id)}
            >
              Delete Session
            </Button>
          </Box>
        )}

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
        >
          <Alert severity="success" onClose={() => setSnackbarOpen(false)}>
            Session notes added successfully!
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default SessionDetailView;