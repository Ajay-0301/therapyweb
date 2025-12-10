import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  Psychology,
  Lightbulb,
  Timeline,
  CloudDownload,
  Assignment,
} from '@mui/icons-material';

const InsightsPage: React.FC = () => {
  const [isLoading] = useState(false);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            AI Insights
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<CloudDownload />}
            onClick={() => {/* TODO: Export functionality */}}
          >
            Export Report
          </Button>
        </Box>

        <Box sx={{ display: 'grid', gap: 3 }}>
          {/* Overview Card */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Practice Overview
            </Typography>
            {isLoading ? (
              <LinearProgress />
            ) : (
              <Box sx={{ 
                display: 'grid', 
                gap: 3,
                mt: 1,
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'repeat(3, 1fr)'
                }
              }}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <TrendingUp color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">Progress Tracking</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      AI analysis will show client progress trends and milestone achievements.
                    </Typography>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Psychology color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">Pattern Recognition</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      AI will identify recurring themes and behavioral patterns across sessions.
                    </Typography>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Lightbulb color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">Treatment Insights</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      AI will suggest evidence-based treatment approaches based on session data.
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            )}
          </Paper>

          {/* Analysis Section */}
          <Box sx={{ 
            display: 'grid', 
            gap: 3,
            gridTemplateColumns: {
              xs: '1fr',
              md: '2fr 1fr'
            }
          }}>
            {/* Session Analysis */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Recent Session Analysis
              </Typography>
              {isLoading ? (
                <LinearProgress />
              ) : (
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Assignment color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Session Summaries"
                      secondary="AI will automatically generate detailed session summaries."
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemIcon>
                      <Timeline color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Progress Metrics"
                      secondary="Track quantifiable improvements and milestone achievements."
                    />
                  </ListItem>
                </List>
              )}
            </Paper>

            {/* Tags and Themes */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Common Themes
              </Typography>
              {isLoading ? (
                <LinearProgress />
              ) : (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Chip label="Anxiety Management" color="primary" />
                  <Chip label="Depression" color="primary" />
                  <Chip label="Stress" color="primary" />
                  <Chip label="Relationships" color="primary" />
                  <Chip label="Work-Life Balance" color="primary" />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2, width: '100%' }}>
                    AI will identify and tag common themes from your sessions.
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default InsightsPage;