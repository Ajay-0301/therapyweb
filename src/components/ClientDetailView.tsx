import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material';
import { Client, Session } from '../types';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface ClientDetailViewProps {
  client: Client;
  sessions: Session[];
  onUpdateClient: (updatedClient: Client) => void;
  onUpdateSession: (sessionId: string, notes: string, followUp: { date: string; notes: string }) => void;
  onAddSession: (session: Omit<Session, 'id'>) => void;
}

const ClientDetailView: React.FC<ClientDetailViewProps> = ({
  client,
  sessions,
  onUpdateClient,
  onUpdateSession,
  onAddSession,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedClient, setEditedClient] = useState(client);
  const [sessionNotes, setSessionNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState<Date | null>(null);
  const [followUpNotes, setFollowUpNotes] = useState('');
  const [showOnlyFollowUp, setShowOnlyFollowUp] = useState(false);
  const navigate = useNavigate();

  const handleSave = () => {
    onUpdateClient(editedClient);
    setIsEditing(false);
  };

  // Keep local editedClient in sync when parent prop changes (e.g. after update)
  useEffect(() => {
    setEditedClient(client);
  }, [client]);

  const handleChangeSessionCount = (delta: number) => {
    const current = editedClient.sessionCount ?? sessions.filter(s => s.clientId === client.id).length;
    const next = Math.max(0, current + delta);
    const updated = { ...editedClient, sessionCount: next };
    setEditedClient(updated);
    onUpdateClient(updated);
  };

  const handleSessionNotesSave = () => {
    if (!followUpDate) {
      alert('Please select a follow-up date');
      return;
    }

    // Create a new session with today's date
    const today = new Date();
    const newSession: Omit<Session, 'id'> = {
      clientId: client.id,
      clientName: client.name,
      date: today.toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      duration: 60, // default duration
      notes: sessionNotes,
      followUp: {
        date: followUpDate.toISOString().split('T')[0],
        notes: followUpNotes
      }
    };

    // Call parent's onAddSession with all client details preserved
    onUpdateClient({
      ...editedClient, // Use editedClient instead of client to preserve all entered details
      lastSession: today.toISOString().split('T')[0],
      upcomingSession: followUpDate.toISOString().split('T')[0]
    });

    // Add the new session
    onAddSession(newSession);

    // Clear only the session form fields, not the client details
    setSessionNotes('');
    setFollowUpDate(null);
    setFollowUpNotes('');
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Client Basic Information */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h4" gutterBottom>
            Client Profile
          </Typography>
          {isEditing ? (
            <IconButton onClick={handleSave}>
              <SaveIcon />
            </IconButton>
          ) : (
            <IconButton onClick={() => setIsEditing(true)}>
              <EditIcon />
            </IconButton>
          )}
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ flex: '1 1 300px' }}>
            <TextField
              label="Name"
              fullWidth
              value={editedClient.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedClient({ ...editedClient, name: e.target.value })}
              disabled={!isEditing}
            />
          </Box>
          <Box sx={{ flex: '1 1 300px' }}>
            <TextField
              label="Age"
              fullWidth
              type="number"
              value={editedClient.age}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedClient({ ...editedClient, age: Number(e.target.value) })}
              disabled={!isEditing}
            />
          </Box>
          <Box sx={{ flex: '1 1 300px' }}>
            <TextField
              label="Occupation"
              fullWidth
              value={editedClient.occupation || ''}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditedClient({ ...editedClient, occupation: e.target.value })}
              disabled={!isEditing}
            />
          </Box>
        </Box>

        <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6">Status:</Typography>
          <Button
            variant={editedClient.status === 'Active' ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => {
              const updated: Client = { ...editedClient, status: 'Active' as Client['status'] };
              setEditedClient(updated);
              // Persist immediately so dashboard and lists reflect change
              onUpdateClient(updated);
            }}
            sx={{ minWidth: 100 }}
          >
            Active
          </Button>
          <Button
            variant={editedClient.status === 'Completed' ? 'contained' : 'outlined'}
            color="secondary"
            onClick={() => {
              const updated: Client = { ...editedClient, status: 'Completed' as Client['status'], upcomingSession: undefined };
              setEditedClient(updated);
              // Persist immediately so dashboard count updates
              onUpdateClient(updated);
            }}
            sx={{ minWidth: 100 }}
          >
            Completed
          </Button>
        </Box>

        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Sessions
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Typography>
              Count: {editedClient.sessionCount ?? sessions.filter(session => session.clientId === client.id).length}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleChangeSessionCount(-1)}
              aria-label="decrease-session-count"
            >
              -
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => handleChangeSessionCount(1)}
              aria-label="increase-session-count"
            >
              +
            </Button>
            {editedClient.upcomingSession && (
              <Typography
                sx={{ ml: 2, cursor: 'pointer', color: 'success.main', textDecoration: 'underline' }}
                onClick={() => {
                  // Show only follow-up date in Session History and navigate to calendar with date param
                  setShowOnlyFollowUp(true);
                  const dateStr = editedClient.upcomingSession;
                  if (dateStr) {
                    navigate(`/calendar?date=${dateStr}`);
                  }
                }}
              >
                Next Session: {new Date(editedClient.upcomingSession).toLocaleDateString()}
              </Typography>
            )}
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            Use + to record a session attended. Click the Next Session date to view only the follow-up date in history.
          </Typography>
        </Paper>
      </Paper>

      {/* Chief Complaints */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Chief Complaints
        </Typography>
        <TextField
          multiline
          rows={4}
          fullWidth
          value={editedClient.chiefComplaints || ''}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditedClient({ ...editedClient, chiefComplaints: e.target.value })}
          disabled={!isEditing}
          placeholder="Enter chief complaints..."
        />
      </Paper>

      {/* History of Presenting Illness */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          History of Presenting Illness (HOPI)
        </Typography>
        <TextField
          multiline
          rows={6}
          fullWidth
          value={editedClient.hopi || ''}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditedClient({ ...editedClient, hopi: e.target.value })}
          disabled={!isEditing}
          placeholder="Enter history of presenting illness..."
        />
      </Paper>

      {/* Session Notes and Follow-up */}
      {editedClient.status === 'Active' ? (
        <>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Session Notes
            </Typography>
            <TextField
              multiline
              rows={8}
              fullWidth
              value={sessionNotes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSessionNotes(e.target.value)}
              placeholder="Enter today's session notes..."
            />
          </Paper>

          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Follow-up Session Details
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Next Session Date"
                  value={followUpDate}
                  onChange={(newValue) => setFollowUpDate(newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
              <TextField
                multiline
                rows={4}
                fullWidth
                label="Follow-up Notes"
                value={followUpNotes}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFollowUpNotes(e.target.value)}
                placeholder="Enter notes for next session..."
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSessionNotesSave}
                sx={{ alignSelf: 'flex-end' }}
              >
                Save Session & Follow-up Details
              </Button>
            </Box>
          </Paper>
        </>
      ) : (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" color="secondary" gutterBottom>
            Case Completed
          </Typography>
          <Typography variant="body1" color="text.secondary">
            This case has been marked as completed. No further sessions can be scheduled.
          </Typography>
        </Paper>
      )}

      {/* Session History */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Session History
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {showOnlyFollowUp ? (
            <Box>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1">
                    Follow-up Date: {editedClient.upcomingSession ? new Date(editedClient.upcomingSession).toLocaleDateString() : 'None'}
                  </Typography>
                </CardContent>
              </Card>
              <Button sx={{ mt: 1 }} size="small" onClick={() => setShowOnlyFollowUp(false)}>Show Full History</Button>
            </Box>
          ) : (
            sessions.map((session) => (
              <Box key={session.id} sx={{ mb: 2 }}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
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
                        <Typography variant="body2">
                          Follow-up: {session.followUp.date}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {session.followUp.notes}
                        </Typography>
                      </>
                    )}
                  </CardContent>
                </Card>
              </Box>
            ))
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default ClientDetailView;