import React, { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Box, Container, Typography, CircularProgress } from '@mui/material';
import ClientDetailView from '../components/ClientDetailView';
import { useApp } from '../context/AppContext';
import { Client } from '../types';

const ClientDetailPage: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const location = useLocation();
  const { 
    clients, 
    sessions, 
    updateClient, 
    updateSession, 
    addSession, 
    selectedClient,
    setSelectedClient 
  } = useApp();
  
  // Prefer client passed in location.state (from Calendar) so we have the full object
  const locationClient = (location.state && (location.state as any).client) as Client | undefined;

  // Determine the client to show: prefer location.state.client, then selectedClient, then clients list
  const client = locationClient?.id === clientId
    ? locationClient
    : selectedClient?.id === clientId
      ? selectedClient
      : clients.find(c => c.id === clientId);

  const clientSessions = sessions.filter(s => s.clientId === clientId);

  // If we received a client via location.state ensure context selectedClient is set
  useEffect(() => {
    if (locationClient) {
      setSelectedClient({
        ...locationClient,
        upcomingSession: (location.state as any).followUpDate || locationClient.upcomingSession
      });
    }
  }, [locationClient, location.state, setSelectedClient]);

  if (!client) {
    return (
      <Container>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4">Client not found</Typography>
        </Box>
      </Container>
    );
  }

  const handleUpdateClient = (updatedClient: Client) => {
    updateClient(updatedClient);
  };

  const handleUpdateSession = (
    sessionId: string,
    notes: string,
    followUp: { date: string; notes: string }
  ) => {
    updateSession(sessionId, notes, followUp);
  };

  return (
    <Container>
      <ClientDetailView
        client={client}
        sessions={clientSessions}
        onUpdateClient={handleUpdateClient}
        onUpdateSession={handleUpdateSession}
        onAddSession={addSession}
      />
    </Container>
  );
};

export default ClientDetailPage;