import React from 'react';
import { Box, BoxProps } from '@mui/material';

interface EventBadgeProps extends BoxProps {
  source?: 'calendar' | 'client';
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
}

const EventBadge: React.FC<EventBadgeProps> = ({ source = 'calendar', children, onClick, ...props }) => {
  // Determine color based on source
  const bgColor = source === 'calendar' ? 'success.main' : 'primary.main';
  const hoverColor = source === 'calendar' ? 'success.dark' : 'primary.dark';

  return (
    <Box
      sx={{
        display: 'block',
        bgcolor: bgColor,
        color: 'primary.contrastText',
        px: 0.6,
        py: 0.3,
        borderRadius: 0.5,
        fontSize: '0.65rem',
        fontWeight: 700,
        lineHeight: 1.3,
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'normal',
        wordBreak: 'break-word',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        '&:hover': {
          bgcolor: hoverColor
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

export default EventBadge;
