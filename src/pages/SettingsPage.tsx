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
} from '@mui/material';
import {
  Notifications,
  Security,
  Palette,
  Language,
  Backup,
  CloudSync,
} from '@mui/icons-material';

const SettingsPage: React.FC = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [syncEnabled, setSyncEnabled] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSaveSettings = async () => {
    setIsUpdating(true);
    // TODO: Implement settings update
    setTimeout(() => {
      setIsUpdating(false);
    }, 1000);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Settings
        </Typography>

        <Paper sx={{ mt: 3 }}>
          <List>
            {/* Profile Settings */}
            <ListItem>
              <ListItemText
                primary="Profile Settings"
                secondary="Update your personal information"
              />
            </ListItem>
            <ListItem sx={{ pl: 4 }}>
              <Box sx={{ width: '100%' }}>
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
                />
                <TextField
                  fullWidth
                  label="Practice Name"
                  variant="outlined"
                  defaultValue="Thanya Therapy"
                  margin="normal"
                />
              </Box>
            </ListItem>

            <Divider />

            {/* Notifications */}
            <ListItem>
              <ListItemIcon>
                <Notifications />
              </ListItemIcon>
              <ListItemText
                primary="Email Notifications"
                secondary="Receive email notifications for upcoming sessions"
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

            {/* Security */}
            <ListItem>
              <ListItemIcon>
                <Security />
              </ListItemIcon>
              <ListItemText
                primary="Two-Factor Authentication"
                secondary="Enable additional security for your account"
              />
              <ListItemSecondaryAction>
                <Button variant="outlined" color="primary">
                  Enable
                </Button>
              </ListItemSecondaryAction>
            </ListItem>

            <Divider />

            {/* Appearance */}
            <ListItem>
              <ListItemIcon>
                <Palette />
              </ListItemIcon>
              <ListItemText
                primary="Dark Mode"
                secondary="Switch between light and dark themes"
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

            {/* Language */}
            <ListItem>
              <ListItemIcon>
                <Language />
              </ListItemIcon>
              <ListItemText
                primary="Language"
                secondary="Choose your preferred language"
              />
              <ListItemSecondaryAction>
                <Button variant="text" color="primary">
                  English
                </Button>
              </ListItemSecondaryAction>
            </ListItem>

            <Divider />

            {/* Backup */}
            <ListItem>
              <ListItemIcon>
                <Backup />
              </ListItemIcon>
              <ListItemText
                primary="Auto-Backup"
                secondary="Automatically backup your data daily"
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

            {/* Cloud Sync */}
            <ListItem>
              <ListItemIcon>
                <CloudSync />
              </ListItemIcon>
              <ListItemText
                primary="Cloud Synchronization"
                secondary="Keep your data synchronized across devices"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={syncEnabled}
                  onChange={(e) => setSyncEnabled(e.target.checked)}
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Paper>

        <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
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
          Note: These settings will be fully functional once the backend is implemented.
          Currently showing UI demonstration only.
        </Alert>
      </Box>
    </Container>
  );
};

export default SettingsPage;