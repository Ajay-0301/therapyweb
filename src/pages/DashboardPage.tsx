import React from 'react';
import { Box, Typography, Container, Card, CardContent } from '@mui/material';
import StatCard from '../components/StatCard';
import { useApp } from '../context/AppContext';
import {
  Group as GroupIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Event as EventIcon,
} from '@mui/icons-material';

const DashboardPage: React.FC = () => {
  const { clients, sessions } = useApp();

  // Calculate statistics
  const totalClients = clients.length;
  const activeClients = clients.filter(client => client.status === 'Active').length;
  const completedClients = clients.filter(client => client.status === 'Completed').length;
  const totalSessions = sessions.length;

  // Get upcoming sessions
  const today = new Date();
  const upcomingSessions = sessions
    .filter(session => session.followUp && new Date(session.followUp.date) >= today)
    .sort((a, b) => new Date(a.followUp!.date).getTime() - new Date(b.followUp!.date).getTime())
    .slice(0, 5);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
          Dashboard
        </Typography>

        <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }} gap={3}>
          <StatCard
            title="Total Clients"
            value={totalClients.toString()}
            icon={<GroupIcon fontSize="large" />}
          />
          <StatCard
            title="Active Cases"
            value={activeClients.toString()}
            icon={<PersonIcon fontSize="large" />}
          />
          <StatCard
            title="Completed Cases"
            value={completedClients.toString()}
            icon={<CheckCircleIcon fontSize="large" />}
          />
          <StatCard
            title="Total Sessions"
            value={totalSessions.toString()}
            icon={<EventIcon fontSize="large" />}
          />
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Recently Completed Cases
          </Typography>
          {clients.filter(client => client.status === 'Completed')
            .slice(0, 5)
            .map((client) => (
              <Card key={client.id} variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {client.name}
                  </Typography>
                  <Typography variant="body2" color="success.main" sx={{ mb: 1 }}>
                    Completed
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Sessions: {sessions.filter(s => s.clientId === client.id).length}
                  </Typography>
                </CardContent>
              </Card>
            ))}
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            AI Insights
          </Typography>
          <Typography variant="body1" color="text.secondary">
            AI-powered insights will be available once the backend integration is complete.
            This feature will provide valuable patterns and trends from your therapy sessions.
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Upcoming Sessions
          </Typography>
          {upcomingSessions.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {upcomingSessions.map((session) => {
                const client = clients.find(c => c.id === session.clientId);
                return (
                  <Card key={session.id} variant="outlined">
                    <CardContent>
                      <Typography variant="h6">{client?.name}</Typography>
                      <Typography variant="body1">
                        Date: {new Date(session.followUp!.date).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Time: {session.time}
                      </Typography>
                      {session.followUp?.notes && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Notes: {session.followUp.notes}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          ) : (
            <Typography variant="body1" color="text.secondary">
              No upcoming sessions scheduled.
            </Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default DashboardPage;