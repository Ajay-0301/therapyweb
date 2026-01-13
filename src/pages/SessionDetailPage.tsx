import React, { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Box, Container, Typography } from '@mui/material';
import SessionDetailView from '../components/SessionDetailView';
import { useApp } from '../context/AppContext';
import { Session } from '../types';

const SessionDetailPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const location = useLocation();
  const {
    sessions,
    updateSession,
    updateSessionProfile,
    deleteSession,
  } = useApp();

  // Prefer session passed in location.state
  const locationSession = (location.state && (location.state as any).session) as Session | undefined;

  // Determine the session to show: prefer location.state.session, then sessions list
  const session = locationSession?.id === sessionId
    ? locationSession
    : sessions.find(s => s.id === sessionId);

  if (!session) {
    return (
      <Container>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4">Session not found</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <SessionDetailView
        session={session}
        onUpdateSession={updateSession}
        onUpdateSessionProfile={updateSessionProfile}
        onDeleteSession={deleteSession}
      />
    </Container>
  );
};

export default SessionDetailPage;