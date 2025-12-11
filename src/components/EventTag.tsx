import React from 'react';
import { Box, BoxProps } from '@mui/material';

interface EventTagProps extends BoxProps {
  type?: 'calendar' | 'client' | 'follow-up';
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
}

const EventTag: React.FC<EventTagProps> = ({ type = 'calendar', children, onClick, ...props }) => {
  // Determine background color based on type
  let bgColor = '#AED6F1'; // light blue for calendar-created sessions
  let textColor = '#ffffff';
  
  switch (type) {
    case 'calendar':
      bgColor = '#AED6F1'; // light blue for calendar sessions
      textColor = '#000000'; // black text for visibility on light blue
      break;
    case 'client':
      bgColor = '#7cd8a5'; // light green for client-created sessions
      textColor = '#ffffff';
      break;
    case 'follow-up':
      bgColor = '#90EE90'; // light green for follow-ups
      textColor = '#000000'; // black text
      break;
    default:
      bgColor = '#AED6F1';
      textColor = '#ffffff';
      break;
  }

  return (
    <Box
      sx={{
        // Unified pill-shaped event tag styling
        display: 'inline-block',
        bgcolor: bgColor,
        color: textColor,
        px: 0.75,
        py: 0.35,
        borderRadius: '12px', // pill-shaped
        fontSize: '0.7rem',
        fontWeight: 600,
        lineHeight: 1.3,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: '100%',
        boxSizing: 'border-box',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          opacity: 0.85,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
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

export default EventTag;
