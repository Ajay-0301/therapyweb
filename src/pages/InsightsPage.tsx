import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tabs,
  Tab,
  Avatar,
} from '@mui/material';
import {
  TrendingUp,
  Psychology,
  Lightbulb,
  Timeline,
  CloudDownload,
  Assignment,
  Assessment,
  Insights,
  BarChart,
  PieChart,
  ShowChart,
  Refresh,
} from '@mui/icons-material';

const InsightsPage: React.FC = () => {
  const [isLoading] = useState(false);
  const [timeRange, setTimeRange] = useState(0);

  const handleTimeRangeChange = (event: React.SyntheticEvent, newValue: number) => {
    setTimeRange(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <Insights />
            </Avatar>
            <Typography variant="h4" component="h1">
              AI Insights
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<Refresh />}
              onClick={() => {/* TODO: Refresh functionality */}}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<CloudDownload />}
              onClick={() => {/* TODO: Export functionality */}}
            >
              Export Report
            </Button>
          </Box>
        </Box>

        <Tabs value={timeRange} onChange={handleTimeRangeChange} sx={{ mb: 3 }}>
          <Tab label="Last 7 Days" />
          <Tab label="Last 30 Days" />
          <Tab label="Last 3 Months" />
          <Tab label="Last Year" />
        </Tabs>

        <Box sx={{ display: 'grid', gap: 3 }}>
          {/* Key Metrics */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)'
            },
            gap: 3,
            mb: 3
          }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" color="primary">Sessions</Typography>
                  <BarChart color="primary" />
                </Box>
                <Typography variant="h3" sx={{ mb: 1 }}>24</Typography>
                <Typography variant="body2" color="success.main">+12% from last period</Typography>
              </CardContent>
            </Card>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" color="primary">Active Clients</Typography>
                  <Psychology color="primary" />
                </Box>
                <Typography variant="h3" sx={{ mb: 1 }}>8</Typography>
                <Typography variant="body2" color="success.main">+2 new this period</Typography>
              </CardContent>
            </Card>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" color="primary">Avg. Session Time</Typography>
                  <Timeline color="primary" />
                </Box>
                <Typography variant="h3" sx={{ mb: 1 }}>52m</Typography>
                <Typography variant="body2" color="warning.main">+5m from average</Typography>
              </CardContent>
            </Card>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" color="primary">Completion Rate</Typography>
                  <TrendingUp color="primary" />
                </Box>
                <Typography variant="h3" sx={{ mb: 1 }}>87%</Typography>
                <Typography variant="body2" color="success.main">+3% improvement</Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Overview Card */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Assessment />
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
                <Card sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <TrendingUp sx={{ mr: 1 }} />
                      <Typography variant="h6">Progress Tracking</Typography>
                    </Box>
                    <Typography variant="body2">
                      AI analysis will show client progress trends and milestone achievements.
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="caption">Sample Progress</Typography>
                      <LinearProgress variant="determinate" value={75} sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.3)' }} />
                    </Box>
                  </CardContent>
                </Card>
                <Card sx={{ bgcolor: 'secondary.light', color: 'secondary.contrastText' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Psychology sx={{ mr: 1 }} />
                      <Typography variant="h6">Pattern Recognition</Typography>
                    </Box>
                    <Typography variant="body2">
                      AI will identify recurring themes and behavioral patterns across sessions.
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                      <Chip size="small" label="Anxiety" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'inherit' }} />
                      <Chip size="small" label="Stress" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'inherit' }} />
                    </Box>
                  </CardContent>
                </Card>
                <Card sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Lightbulb sx={{ mr: 1 }} />
                      <Typography variant="h6">Treatment Insights</Typography>
                    </Box>
                    <Typography variant="body2">
                      AI will suggest evidence-based treatment approaches based on session data.
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="caption">Recommended Approach</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>CBT + Mindfulness</Typography>
                    </Box>
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
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ShowChart />
                Recent Session Analysis
              </Typography>
              {isLoading ? (
                <LinearProgress />
              ) : (
                <Box sx={{ mt: 2 }}>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Assignment color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Session Summaries"
                        secondary="AI will automatically generate detailed session summaries with key insights and action items."
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <Timeline color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Progress Metrics"
                        secondary="Track quantifiable improvements: 87% of clients show measurable progress in anxiety reduction."
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <Psychology color="secondary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Emotional Pattern Analysis"
                        secondary="Identified positive correlation between mindfulness exercises and reduced stress levels."
                      />
                    </ListItem>
                  </List>
                  
                  {/* Sample Chart Placeholder */}
                  <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1, textAlign: 'center' }}>
                    <PieChart sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Interactive charts will display session analytics and progress trends
                    </Typography>
                  </Box>
                </Box>
              )}
            </Paper>

            {/* Tags and Themes */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Lightbulb />
                Common Themes & Insights
              </Typography>
              {isLoading ? (
                <LinearProgress />
              ) : (
                <Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                    <Chip label="Anxiety Management" color="primary" variant="outlined" />
                    <Chip label="Depression" color="secondary" variant="outlined" />
                    <Chip label="Stress" color="warning" variant="outlined" />
                    <Chip label="Relationships" color="info" variant="outlined" />
                    <Chip label="Work-Life Balance" color="success" variant="outlined" />
                    <Chip label="Trauma Recovery" color="error" variant="outlined" />
                    <Chip label="Self-Esteem" color="primary" />
                    <Chip label="Communication" color="secondary" />
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="h6" gutterBottom>
                    Key Insights
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="75% of sessions focus on anxiety-related concerns"
                        secondary="Most common presenting issue"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Average improvement: 23% after 6 sessions"
                        secondary="Based on self-reported measures"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="CBT most effective for anxiety cases"
                        secondary="92% success rate vs 78% average"
                      />
                    </ListItem>
                  </List>
                </Box>
              )}
            </Paper>
          </Box>

          {/* Recommendations Section */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Lightbulb color="warning" />
              AI Recommendations
            </Typography>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(2, 1fr)'
              },
              gap: 3
            }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Treatment Approaches
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Based on your practice patterns, consider incorporating more mindfulness-based interventions for anxiety cases.
                  </Typography>
                  <Button size="small" color="primary">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" color="secondary" gutterBottom>
                    Session Optimization
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Your 45-60 minute sessions show optimal outcomes. Consider standardizing session lengths.
                  </Typography>
                  <Button size="small" color="secondary">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default InsightsPage;