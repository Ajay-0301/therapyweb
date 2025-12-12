import React, { useState, useContext } from 'react';
import {
  Container,
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Button,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import ClientCard from '../components/ClientCard';
import AddClientModal from '../components/AddClientModal';
import { AppContext } from '../context/AppContext';

const ClientsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  const { clients, addClient } = context;

  const handleFilterChange = (
    event: React.MouseEvent<HTMLElement>,
    newFilter: 'all' | 'active' | 'completed',
  ) => {
    if (newFilter !== null) {
      setFilter(newFilter);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Clients
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Client
          </Button>
        </Box>

        <Box sx={{ mb: 3 }}>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search clients..."
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <ToggleButtonGroup
            value={filter}
            exclusive
            onChange={handleFilterChange}
            aria-label="client filter"
          >
            <ToggleButton value="all" aria-label="all clients">
              All
            </ToggleButton>
            <ToggleButton value="active" aria-label="active clients">
              Active
            </ToggleButton>
            <ToggleButton value="completed" aria-label="completed clients">
              Completed
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
          {clients
            .filter((client) => {
              // Apply search filter - search by name or ID
              const searchLower = searchQuery.toLowerCase().trim();
              if (searchLower && !client.name.toLowerCase().includes(searchLower) && !client.id.toLowerCase().includes(searchLower)) {
                return false;
              }
              // Apply status filter
              if (filter !== 'all' && client.status.toLowerCase() !== filter) {
                return false;
              }
              return true;
            })
            .map((client) => (
              <ClientCard 
                key={client.id}
                client={client} 
                onClick={() => navigate(`/clients/${client.id}`, { state: { client } })}
              />
            ))}
          {clients.length === 0 && !searchQuery && (
            <Box sx={{ gridColumn: '1 / -1' }}>
              <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                No clients yet. Click "Add Client" to get started.
              </Typography>
            </Box>
          )}
          {clients.length > 0 && clients.filter((client) => {
            const searchLower = searchQuery.toLowerCase().trim();
            if (searchLower && !client.name.toLowerCase().includes(searchLower) && !client.id.toLowerCase().includes(searchLower)) {
              return false;
            }
            if (filter !== 'all' && client.status.toLowerCase() !== filter) {
              return false;
            }
            return true;
          }).length === 0 && searchQuery && (
            <Box sx={{ gridColumn: '1 / -1' }}>
              <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                No client found.
              </Typography>
            </Box>
          )}
        </Box>

        <AddClientModal
          open={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={(client) => {
            addClient({ ...client, status: 'Active' as const });
          }}
        />
      </Box>
    </Container>
  );
};

export default ClientsPage;