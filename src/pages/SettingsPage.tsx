import React, { useState, useEffect } from 'react';
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
import { useAuth } from '../context/AppContext';
import { api } from '../utils/api';
import { useApp } from '../context/AppContext';

const SettingsPage: React.FC<{ setDarkMode: (dark: boolean) => void }> = ({ setDarkMode }) => {
  const { logout } = useAuth();
  const { setPracticeName } = useApp();
  const [settings, setSettings] = useState({
    fullName: '',
    email: '',
    phone: '',
    practiceName: 'Thanya Therapy',
    licenseNumber: '',
    specialization: 'clinical-psychology',
    emailNotifications: true,
    darkMode: false,
    language: 'en',
    twoFactorEnabled: false,
    autoBackup: true,
    syncEnabled: true
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await api.settings.get();
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        setSettings({ ...data, darkMode: savedDarkMode });
        setDarkMode(savedDarkMode);
      } catch (error) {
        console.error('Error loading settings:', error);
        // Fallback to localStorage
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        setSettings(prev => ({ ...prev, darkMode: savedDarkMode }));
        setDarkMode(savedDarkMode);
      }
    };
    loadSettings();
  }, [setDarkMode]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSaveSettings = async () => {
    setIsUpdating(true);
    try {
      await api.settings.update(settings);
      setPracticeName(settings.practiceName);
      localStorage.setItem('darkMode', settings.darkMode.toString());
      setDarkMode(settings.darkMode);
      // Show success message
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsUpdating(false);
    }
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
                  value={settings.fullName}
                  onChange={(e) => setSettings(prev => ({ ...prev, fullName: e.target.value }))}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  value={settings.email}
                  onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                  margin="normal"
                  type="email"
                />
                <TextField
                  fullWidth
                  label="Phone"
                  variant="outlined"
                  value={settings.phone}
                  onChange={(e) => setSettings(prev => ({ ...prev, phone: e.target.value }))}
                  margin="normal"
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  label="Practice Name"
                  variant="outlined"
                  value={settings.practiceName}
                  onChange={(e) => setSettings(prev => ({ ...prev, practiceName: e.target.value }))}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="License Number"
                  variant="outlined"
                  value={settings.licenseNumber}
                  onChange={(e) => setSettings(prev => ({ ...prev, licenseNumber: e.target.value }))}
                  margin="normal"
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel>Specialization</InputLabel>
                  <Select
                    value={settings.specialization}
                    onChange={(e) => setSettings(prev => ({ ...prev, specialization: e.target.value }))}
                  >
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
                      checked={settings.emailNotifications}
                      onChange={(e) => setSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
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
                      checked={settings.darkMode}
                      onChange={(e) => {
                        const newDarkMode = e.target.checked;
                        setSettings(prev => ({ ...prev, darkMode: newDarkMode }));
                        setDarkMode(newDarkMode);
                        localStorage.setItem('darkMode', newDarkMode.toString());
                      }}
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
                      <Select
                        value={settings.language}
                        onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                      >
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
                      checked={settings.autoBackup}
                      onChange={(e) => setSettings(prev => ({ ...prev, autoBackup: e.target.checked }))}
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
                      checked={settings.syncEnabled}
                      onChange={(e) => setSettings(prev => ({ ...prev, syncEnabled: e.target.checked }))}
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
                  primary="Sign Out"
                  secondary="Sign out of your account and return to login"
                />
                <ListItemSecondaryAction>
                  <Button variant="outlined" color="error" onClick={logout}>
                    Sign Out
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
      </Box>
    </Container>
  );
};

export default SettingsPage;