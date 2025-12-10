import React from 'react';
import { Card, Typography, Box, Chip, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Client } from '../types';

interface ClientCardProps {
  client: Client;
  onClick: () => void;
}

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  transition: 'transform 0.2s, box-shadow 0.2s',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateX(4px)',
    boxShadow: theme.shadows[4],
  },
}));

const ClientAvatar = styled(Avatar)(({ theme }) => ({
  width: 56,
  height: 56,
  marginRight: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
}));

const StatusChip = styled(Chip)<{ status: 'Active' | 'Completed' }>(({ theme, status }) => ({
  backgroundColor: status === 'Active' ? theme.palette.primary.light : theme.palette.grey[300],
  color: status === 'Active' ? theme.palette.primary.dark : theme.palette.grey[700],
}));

const ClientCard: React.FC<ClientCardProps> = ({ client, onClick }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <StyledCard onClick={onClick}>
      <ClientAvatar>
        {getInitials(client.name)}
      </ClientAvatar>
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" component="div">
            {client.name}
          </Typography>
          <StatusChip
            label={client.status}
            status={client.status}
            size="small"
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            Age: {client.age}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Last Session: {client.lastSession || 'N/A'}
          </Typography>
        </Box>
      </Box>
    </StyledCard>
  );
};

export default ClientCard;