import React from 'react';
import { Card, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
}

const StyledCard = styled(Card)(({ theme }) => ({
  minWidth: 200,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(3),
  transition: 'transform 0.2s, box-shadow 0.2s',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const ValueTypography = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 600,
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(1),
}));

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <StyledCard>
      {icon && (
        <Box sx={{ mb: 2, color: 'primary.main' }}>
          {icon}
        </Box>
      )}
      <ValueTypography>
        {value}
      </ValueTypography>
      <Typography variant="body1" color="text.secondary">
        {title}
      </Typography>
    </StyledCard>
  );
};

export default StatCard;