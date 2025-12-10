import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { AppContext } from '../context/AppContext';
import { Session } from '../types';
import AddSessionModal from '../components/AddSessionModal';
import {
  ChevronLeft,
  ChevronRight,
  Add as AddIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const CalendarHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(3),
}));

// CalendarGrid styling was defined but not used; calendar cells are styled inline where needed.

const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  const { clients, sessions, addSession } = context;
  const navigate = useNavigate();
  const location = useLocation();

  // If navigated with a ?date=YYYY-MM-DD parameter, select that date and set the current month
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const dateParam = params.get('date');
    if (dateParam) {
      const dt = new Date(dateParam);
      if (!isNaN(dt.getTime())) {
        setSelectedDate(new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()));
        setCurrentDate(new Date(dt.getFullYear(), dt.getMonth(), 1));
      }
    }
  }, [location.search]);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  const renderCalendarDays = () => {
    const days = [];
    const today = new Date();

    // Previous month days
    const prevMonthDays = firstDayOfMonth;
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const daysInPrevMonth = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0).getDate();

    for (let i = prevMonthDays - 1; i >= 0; i--) {
      days.push(
        <Box key={`prev-${i}`}>
          <Paper className="calendar-cell different-month" elevation={0}>
            <Typography color="textSecondary">
              {daysInPrevMonth - i}
            </Typography>
          </Paper>
        </Box>
      );
    }

    // Current month days
      for (let day = 1; day <= daysInMonth; day++) {
      const isToday = 
        day === today.getDate() &&
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getFullYear() === today.getFullYear();
      // sessions that have followUp on this day
      const followUpSessionsForDay = sessions && sessions.filter((session: Session) => {
        if (!session.followUp?.date) return false;
        const followUpDate = new Date(session.followUp.date);
        return (
          followUpDate.getDate() === day &&
          followUpDate.getMonth() === currentDate.getMonth() &&
          followUpDate.getFullYear() === currentDate.getFullYear()
        );
      });

      days.push(
        <Box key={day}>
          <Paper 
            className={`calendar-cell ${isToday ? 'today' : ''} ${followUpSessionsForDay && followUpSessionsForDay.length ? 'followup' : ''}`}
            elevation={0}
            onClick={() => {
              // If exactly one follow-up is scheduled on this day, navigate directly to that client's details
              if (followUpSessionsForDay && followUpSessionsForDay.length === 1) {
                navigate(`/clients/${followUpSessionsForDay[0].clientId}`);
                return;
              }
              setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
            }}
            sx={followUpSessionsForDay && followUpSessionsForDay.length ? { backgroundColor: 'success.light', color: 'success.contrastText' } : undefined}
          >
            <Typography>{day}</Typography>
            {/* Regular sessions */}
            {sessions && sessions.filter((session: Session) => {
              const sessionDate = new Date(session.date);
              return (
                sessionDate.getDate() === day &&
                sessionDate.getMonth() === currentDate.getMonth() &&
                sessionDate.getFullYear() === currentDate.getFullYear()
              );
            }).map((session: Session) => (
              <Typography 
                key={session.id} 
                variant="caption" 
                color="primary" 
                sx={{ 
                  display: 'block',
                  cursor: 'pointer',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/clients/${session.clientId}`);
                }}
              >
                {session.time} - {session.clientName} ({session.duration}m)
              </Typography>
            ))}
            {/* Follow-up sessions */}
            {sessions && sessions.filter((session: Session) => {
              if (!session.followUp?.date) return false;
              const followUpDate = new Date(session.followUp.date);
              return (
                followUpDate.getDate() === day &&
                followUpDate.getMonth() === currentDate.getMonth() &&
                followUpDate.getFullYear() === currentDate.getFullYear()
              );
            }).map((session: Session) => (
              <Box
                key={`followup-${session.id}`}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  mt: 0.5
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: 'success.main'
                  }}
                />
                <Typography 
                  variant="caption" 
                  color="success.main" 
                  sx={{ 
                    display: 'block',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    '&:hover': {
                      textDecoration: 'underline',
                      color: 'success.dark'
                    }
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    const client = clients.find(c => c.id === session.clientId);
                    if (client) {
                      // Store the complete client object in context (preserve all fields)
                      if (context.setSelectedClient) {
                        context.setSelectedClient({
                          ...client,
                          upcomingSession: session.followUp?.date || client.upcomingSession
                        });
                      }
                      // Navigate to client details and pass the full client in location.state
                      navigate(`/clients/${session.clientId}`, {
                        state: { fromCalendar: true, followUpDate: session.followUp?.date, client }
                      });
                    }
                  }}
                >
                  Follow-up: {session.clientName}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Box>
      );
    }

    return days;
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <CalendarHeader>
          <Typography variant="h4" component="h1">
            Calendar
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setIsAddModalOpen(true)}
          >
            New Session
          </Button>
        </CalendarHeader>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <IconButton onClick={handlePreviousMonth}>
              <ChevronLeft />
            </IconButton>
            <Typography variant="h5">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </Typography>
            <IconButton onClick={handleNextMonth}>
              <ChevronRight />
            </IconButton>
          </Box>

          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)',
            mb: 2
          }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <Box key={day}>
                <Typography
                  align="center"
                  sx={{ fontWeight: 'bold' }}
                >
                  {day}
                </Typography>
              </Box>
            ))}
          </Box>

          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 0.5
          }}>
            {renderCalendarDays()}
            {/* Show a snackbar when navigating to client details */}
          </Box>
        </Paper>

        {selectedDate && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Sessions for {selectedDate.toLocaleDateString()}
            </Typography>
            <List>
              {(() => {
                const selectedDateStr = selectedDate.toISOString().split('T')[0];
                const regularSessions = sessions.filter(s => s.date === selectedDateStr);
                const followUpSessions = sessions.filter(s => s.followUp?.date === selectedDateStr);
                
                if (regularSessions.length === 0 && followUpSessions.length === 0) {
                  return (
                    <ListItem>
                      <ListItemText
                        primary="No sessions scheduled"
                        secondary="Click 'New Session' to add one"
                      />
                    </ListItem>
                  );
                }

                return (
                  <>
                    {regularSessions.map((session: Session) => (
                      <React.Fragment key={session.id}>
                        <ListItem>
                          <ListItemText
                            primary={`${session.time} - ${session.clientName}`}
                            secondary={`Duration: ${session.duration} minutes`}
                          />
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    ))}
                    {followUpSessions.map((session: Session) => (
                      <React.Fragment key={`followup-${session.id}`}>
                        <ListItem>
                          <ListItemText
                            primary={`Follow-up: ${session.clientName}`}
                            secondary={session.followUp?.notes}
                            sx={{
                              '& .MuiListItemText-primary': {
                                color: 'success.main',
                                fontWeight: 'bold'
                              }
                            }}
                          />
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    ))}
                  </>
                );
              })()}
            </List>
          </Paper>
        )}
      </Box>

      <AddSessionModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addSession}
        clients={clients || []}
      />
    </Container>
  );
};

export default CalendarPage;