import React from 'react';
import { Box, BoxProps } from '@mui/material';

interface EventCardProps extends BoxProps {
  type?: 'calendar-session' | 'client-session' | 'follow-up';
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
}

const EventCard: React.FC<EventCardProps> = ({ type = 'calendar-session', children, onClick, ...props }) => {
  // Determine background color based on event type
  let bgColor = 'primary.main'; // default: blue for client-session
  
  switch (type) {
    case 'calendar-session':
      bgColor = 'success.main'; // green for calendar
      break;
    case 'follow-up':
      bgColor = 'success.light'; // light green for follow-ups
      break;
    case 'client-session':
    default:
      bgColor = 'primary.main'; // blue for client
      break;
  }

  return (
    <Box
      sx={{
        // Unified styling for all event cards
        display: 'inline-block',
        bgcolor: bgColor,
        color: bgColor === 'success.light' ? 'text.primary' : 'primary.contrastText',
        px: 0.8,
        py: 0.4,
        borderRadius: 1,
        fontSize: '0.75rem',
        fontWeight: 600,
        lineHeight: 1.4,
        maxWidth: '95%',
        boxSizing: 'border-box',
        cursor: 'pointer',
        whiteSpace: 'normal',
        wordBreak: 'break-word',
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        overflow: 'hidden',
        transition: 'background-color 0.2s ease',
        '&:hover': {
          opacity: 0.9,
          transform: 'translateY(-1px)',
        },
        ...props.sx
      }}
      onClick={onClick}
      {...props}
    >
      {children}
    </Box>
  );
};

export default EventCard;
