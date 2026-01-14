import React from 'react';
import { Box, Typography, Container, Card, CardContent, Chip, Avatar, Divider } from '@mui/material';
import StatCard from '../components/StatCard';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  Group as GroupIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Event as EventIcon,
  Schedule as ScheduleIcon,
  FollowTheSigns as FollowUpIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const WelcomeCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
  color: 'white',
  marginBottom: theme.spacing(4),
  borderRadius: theme.spacing(3),
  boxShadow: `0 8px 24px ${theme.palette.primary.main}30`,
}));

const SectionCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: `0 4px 12px ${theme.palette.grey[200]}`,
  border: `1px solid ${theme.palette.grey[100]}`,
}));

const UpcomingItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.grey[50],
    transform: 'translateX(2px)',
  },
  transition: 'all 0.2s ease',
}));

const DashboardPage: React.FC = () => {
  const { clients, sessions } = useApp();
  const navigate = useNavigate();

  // Calculate statistics
  const totalClients = clients.length;
  const activeClients = clients.filter(client => client.status === 'Active').length;
  const completedClients = clients.filter(client => client.status === 'Completed').length;
  const totalSessions = sessions.length;

  // Get upcoming sessions
  const today = new Date();
  const upcomingAppointments = sessions
    .filter(session => new Date(session.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const upcomingFollowUps = sessions
    .filter(session => session.followUp && new Date(session.followUp.date) >= today)
    .sort((a, b) => new Date(a.followUp!.date).getTime() - new Date(b.followUp!.date).getTime())
    .slice(0, 5);

  const handleClientClick = (clientId: string) => {
    navigate(`/clients/${clientId}`);
  };

  const handleSessionClick = (session: any) => {
    if (session.clientId) {
      navigate(`/clients/${session.clientId}`);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <WelcomeCard>
          <CardContent sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" component="h1" sx={{ mb: 1, fontWeight: 600 }}>
                  Welcome back, Therapist
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Here's what's happening with your practice today
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </WelcomeCard>

        <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }} gap={3} sx={{ mb: 4 }}>
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

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
          {/* Recent Activity */}
          <SectionCard>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ScheduleIcon color="primary" />
                Recent Activity
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {clients.filter(client => client.status === 'Completed')
                .slice(0, 3)
                .map((client) => (
                  <UpcomingItem key={client.id} onClick={() => handleClientClick(client.id)}>
                    <Avatar sx={{ mr: 2, bgcolor: 'success.main' }}>
                      <CheckCircleIcon fontSize="small" />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2">{client.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Case completed • {sessions.filter(s => s.clientId === client.id).length} sessions
                      </Typography>
                    </Box>
                    <Chip label="Completed" color="success" size="small" />
                  </UpcomingItem>
                ))}
              {clients.filter(client => client.status === 'Completed').length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No completed cases yet
                </Typography>
              )}
            </CardContent>
          </SectionCard>

          {/* Upcoming Appointments */}
          <SectionCard>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EventIcon color="primary" />
                Upcoming Appointments
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.slice(0, 3).map((session) => {
                  const isCalendarSession = !session.clientId;
                  return (
                    <UpcomingItem key={session.id} onClick={() => handleSessionClick(session)}>
                      <Avatar sx={{ mr: 2, bgcolor: isCalendarSession ? 'primary.main' : 'secondary.main' }}>
                        <EventIcon fontSize="small" />
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2">{session.clientName}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(session.date).toLocaleDateString()} at {session.time}
                        </Typography>
                      </Box>
                      <Chip
                        label={isCalendarSession ? 'Calendar' : 'Client'}
                        color={isCalendarSession ? 'primary' : 'secondary'}
                        size="small"
                        variant="outlined"
                      />
                    </UpcomingItem>
                  );
                })
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No upcoming appointments
                </Typography>
              )}
            </CardContent>
          </SectionCard>
        </Box>

        {/* Upcoming Follow-ups */}
        <SectionCard sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FollowUpIcon color="primary" />
              Upcoming Follow-ups
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {upcomingFollowUps.length > 0 ? (
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
                {upcomingFollowUps.slice(0, 6).map((session) => {
                  const isCalendarSession = !session.clientId;
                  return (
                    <Card key={session.id} variant="outlined" sx={{ cursor: 'pointer', '&:hover': { boxShadow: 2 } }} onClick={() => handleSessionClick(session)}>
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Avatar sx={{ mr: 1, width: 24, height: 24, bgcolor: isCalendarSession ? 'primary.main' : 'secondary.main' }}>
                            <FollowUpIcon fontSize="small" />
                          </Avatar>
                          <Typography variant="subtitle2" sx={{ fontSize: '0.875rem' }}>
                            {session.clientName}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                          {new Date(session.followUp!.date).toLocaleDateString()}
                        </Typography>
                        {session.followUp?.notes && (
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', mt: 0.5 }}>
                            {session.followUp.notes.length > 30 ? `${session.followUp.notes.substring(0, 30)}...` : session.followUp.notes}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                No upcoming follow-ups scheduled
              </Typography>
            )}
          </CardContent>
        </SectionCard>
      </Box>
    </Container>
  );
};

export default DashboardPage;