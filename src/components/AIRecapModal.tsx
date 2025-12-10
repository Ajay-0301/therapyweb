import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { AISummary } from '../types';

interface AIRecapModalProps {
  open: boolean;
  onClose: () => void;
  summary: AISummary | null;
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    maxWidth: 600,
  },
}));

const Section = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const AIRecapModal: React.FC<AIRecapModalProps> = ({ open, onClose, summary }) => {
  if (!summary) return null;

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h5" component="div">
          AI Session Summary
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Generated on {new Date(summary.generatedDate).toLocaleDateString()}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Section>
          <Typography variant="h6" gutterBottom>
            Overall Progress
          </Typography>
          <Typography variant="body1">{summary.overallProgress}</Typography>
        </Section>

        <Section>
          <Typography variant="h6" gutterBottom>
            Emotional Patterns
          </Typography>
          {summary.emotionalPatterns.map((pattern, index) => (
            <Typography key={index} variant="body1" sx={{ mb: 1 }}>
              • {pattern}
            </Typography>
          ))}
        </Section>

        <Section>
          <Typography variant="h6" gutterBottom>
            Recurring Themes
          </Typography>
          {summary.recurringThemes.map((theme, index) => (
            <Typography key={index} variant="body1" sx={{ mb: 1 }}>
              • {theme}
            </Typography>
          ))}
        </Section>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            // TODO: Implement export functionality
            console.log('Export functionality to be implemented');
          }}
        >
          Export as PDF
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default AIRecapModal;