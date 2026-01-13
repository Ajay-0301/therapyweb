import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Button,
  TextField,
  Divider,
  Alert,
  Tabs,
  Tab,
  Card,
  CardContent,
  Avatar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Notifications,
  Security,
  Palette,
  Language,
  Backup,
  CloudSync,
  Person,
  Settings as SettingsIcon,
  DataUsage,
  PrivacyTip,
  Storage,
  Download,
  Upload,
} from '@mui/icons-material';

const SettingsPage: React.FC = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [syncEnabled, setSyncEnabled] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSaveSettings = async () => {
    setIsUpdating(true);
    // TODO: Implement settings update
    setTimeout(() => {
      setIsUpdating(false);
    }, 1000);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            <SettingsIcon />
          </Avatar>
          <Typography variant="h4" component="h1">
            Settings
          </Typography>
        </Box>

        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="Profile" />
          <Tab label="Preferences" />
          <Tab label="Data & Privacy" />
          <Tab label="Advanced" />
        </Tabs>

        {activeTab === 0 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Person />
              Profile Settings
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Update your personal and practice information
            </Typography>
            
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: {
                xs: '1fr',
                md: '1fr 1fr'
              },
              gap: 3
            }}>
              <Box>
                <TextField
                  fullWidth
                  label="Full Name"
                  variant="outlined"
                  defaultValue="Demo User"
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  defaultValue="demo@thanya.com"
                  margin="normal"
                  type="email"
                />
                <TextField
                  fullWidth
                  label="Phone"
                  variant="outlined"
                  defaultValue="+1 (555) 123-4567"
                  margin="normal"
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  label="Practice Name"
                  variant="outlined"
                  defaultValue="Thanya Therapy"
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="License Number"
                  variant="outlined"
                  defaultValue="PSY123456"
                  margin="normal"
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel>Specialization</InputLabel>
                  <Select defaultValue="clinical-psychology">
                    <MenuItem value="clinical-psychology">Clinical Psychology</MenuItem>
                    <MenuItem value="counseling">Counseling Psychology</MenuItem>
                    <MenuItem value="family-therapy">Family Therapy</MenuItem>
                    <MenuItem value="cbt">Cognitive Behavioral Therapy</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Paper>
        )}

        {activeTab === 1 && (
          <Box sx={{ display: 'grid', gap: 3 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Palette />
                Appearance & Notifications
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Notifications />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email Notifications"
                    secondary="Receive email notifications for upcoming sessions and reminders"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>

                <Divider />

                <ListItem>
                  <ListItemIcon>
                    <Palette />
                  </ListItemIcon>
                  <ListItemText
                    primary="Dark Mode"
                    secondary="Switch between light and dark themes for better visibility"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={darkMode}
                      onChange={(e) => setDarkMode(e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>

                <Divider />

                <ListItem>
                  <ListItemIcon>
                    <Language />
                  </ListItemIcon>
                  <ListItemText
                    primary="Language"
                    secondary="Choose your preferred interface language"
                  />
                  <ListItemSecondaryAction>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <Select defaultValue="en">
                        <MenuItem value="en">English</MenuItem>
                        <MenuItem value="es">Español</MenuItem>
                        <MenuItem value="fr">Français</MenuItem>
                      </Select>
                    </FormControl>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Security />
                Security Settings
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemText
                    primary="Two-Factor Authentication"
                    secondary="Add an extra layer of security to your account"
                  />
                  <ListItemSecondaryAction>
                    <Button variant="outlined" color="primary">
                      Enable 2FA
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>

                <Divider />

                <ListItem>
                  <ListItemText
                    primary="Change Password"
                    secondary="Update your account password regularly"
                  />
                  <ListItemSecondaryAction>
                    <Button variant="text" color="primary">
                      Change
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Paper>
          </Box>
        )}

        {activeTab === 2 && (
          <Box sx={{ display: 'grid', gap: 3 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <DataUsage />
                Data Management
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Download color="primary" />
                      <Typography variant="h6">Export Data</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Download all your client and session data in JSON format
                    </Typography>
                    <Button variant="outlined" startIcon={<Download />} fullWidth>
                      Export All Data
                    </Button>
                  </CardContent>
                </Card>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Upload color="secondary" />
                      <Typography variant="h6">Import Data</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Import client and session data from a backup file
                    </Typography>
                    <Button variant="outlined" startIcon={<Upload />} fullWidth>
                      Import Data
                    </Button>
                  </CardContent>
                </Card>
              </Box>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PrivacyTip />
                Privacy & Security
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Backup />
                  </ListItemIcon>
                  <ListItemText
                    primary="Auto-Backup"
                    secondary="Automatically backup your data daily to secure cloud storage"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={autoBackup}
                      onChange={(e) => setAutoBackup(e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>

                <Divider />

                <ListItem>
                  <ListItemIcon>
                    <CloudSync />
                  </ListItemIcon>
                  <ListItemText
                    primary="Cloud Synchronization"
                    secondary="Keep your data synchronized across all your devices"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={syncEnabled}
                      onChange={(e) => setSyncEnabled(e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>

                <Divider />

                <ListItem>
                  <ListItemText
                    primary="Data Retention"
                    secondary="Automatically delete old session data after 7 years"
                  />
                  <ListItemSecondaryAction>
                    <FormControl size="small" sx={{ minWidth: 100 }}>
                      <Select defaultValue="7">
                        <MenuItem value="1">1 year</MenuItem>
                        <MenuItem value="3">3 years</MenuItem>
                        <MenuItem value="5">5 years</MenuItem>
                        <MenuItem value="7">7 years</MenuItem>
                        <MenuItem value="never">Never</MenuItem>
                      </Select>
                    </FormControl>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Paper>
          </Box>
        )}

        {activeTab === 3 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Storage />
              Advanced Settings
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Advanced configuration options for power users
            </Typography>
            
            <List>
              <ListItem>
                <ListItemText
                  primary="API Access"
                  secondary="Manage API keys and third-party integrations"
                />
                <ListItemSecondaryAction>
                  <Button variant="outlined" color="primary">
                    Manage APIs
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>

              <Divider />

              <ListItem>
                <ListItemText
                  primary="System Diagnostics"
                  secondary="Run system health checks and performance tests"
                />
                <ListItemSecondaryAction>
                  <Button variant="outlined" color="secondary">
                    Run Diagnostics
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>

              <Divider />

              <ListItem>
                <ListItemText
                  primary="Reset to Defaults"
                  secondary="Reset all settings to their default values"
                />
                <ListItemSecondaryAction>
                  <Button variant="outlined" color="error">
                    Reset
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>
        )}

        <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            color="secondary"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveSettings}
            disabled={isUpdating}
          >
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>

        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body2">
            <strong>Note:</strong> These settings will be fully functional once the backend is implemented.
            Currently showing UI demonstration with sample data and interactions.
          </Typography>
        </Alert>
      </Box>
    </Container>
  );
};

export default SettingsPage;