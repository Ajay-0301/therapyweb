import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Client, Session, CalendarClient } from '../types';
import { api } from '../utils/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

interface AppContextType {
  selectedClient: Client | null;
  setSelectedClient: (client: Client | null) => void;
  selectedSession: Session | null;
  setSelectedSession: (session: Session | null) => void;
  clients: Client[];
  sessions: Session[];
  allSessions: Session[];
  practiceName: string;
  setPracticeName: (name: string) => void;
  addClient: (client: Omit<Client, 'id'>) => Promise<void>;
  // returns created session id
  addSession: (session: Omit<Session, 'id'>) => Promise<string>;
  updateClient: (client: Client) => Promise<void>;
  incrementClientSessionCount: (clientId: string, delta?: number) => void;
  updateSession: (sessionId: string, notes: string, followUp: { date: string; notes: string }) => Promise<void>;
  updateSessionProfile: (session: Session) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);
export const AppContext = createContext<AppContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const user = await api.auth.login(email, password);
      setUser(user);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    api.auth.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [allSessions, setAllSessions] = useState<Session[]>([]);
  const [practiceName, setPracticeName] = useState<string>('Thanya Therapy');

  useEffect(() => {
    const loadClients = async () => {
      if (user) {
        try {
          const loadedClients = await api.clients.getAll();
          setClients(loadedClients);
        } catch (error) {
          console.error('Failed to load clients:', error);
        }
      } else {
        setClients([]);
      }
    };
    loadClients();
    // Clear selections when user changes
    setSelectedClient(null);
    setSelectedSession(null);
  }, [user]);

  useEffect(() => {
    const loadAllSessions = async () => {
      if (user) {
        try {
          const loadedSessions = await api.sessions.getAll();
          setAllSessions(loadedSessions);
        } catch (error) {
          console.error('Failed to load sessions:', error);
        }
      } else {
        setAllSessions([]);
      }
    };
    loadAllSessions();
  }, [user]);

  useEffect(() => {
    const loadSettings = async () => {
      if (user) {
        try {
          const settings = await api.settings.get();
          setPracticeName(settings.practiceName || 'Thanya Therapy');
        } catch (error) {
          console.error('Failed to load settings:', error);
          setPracticeName('Thanya Therapy');
        }
      }
    };
    loadSettings();
  }, [user]);

  useEffect(() => {
    const loadSessions = async () => {
      if (selectedClient) {
        try {
          const loadedSessions = await api.sessions.getAllForClient(selectedClient.id);
          setSessions(loadedSessions);
        } catch (error) {
          console.error('Failed to load sessions:', error);
        }
      } else {
        setSessions([]);
      }
    };
    loadSessions();
  }, [selectedClient]);

  const addClient = async (clientData: Omit<Client, 'id'>) => {
    try {
      const newClient = await api.clients.create(clientData);
      setClients(prevClients => [...prevClients, newClient]);
    } catch (error) {
      console.error('Failed to add client:', error);
      throw error;
    }
  };

  const incrementClientSessionCount = (clientId: string, delta: number = 1) => {
    setClients(prevClients =>
      prevClients.map(client =>
        client.id === clientId
          ? { ...client, sessionCount: (client.sessionCount || 0) + delta }
          : client
      )
    );
  };

  const updateClient = async (updatedClient: Client) => {
    try {
      await api.clients.update(updatedClient.id, updatedClient);
      // Preserve existing client data and merge with updates
      setClients(prevClients =>
        prevClients.map(client =>
          client.id === updatedClient.id
            ? {
                ...client, // Keep existing data
                ...updatedClient, // Apply updates
                // Preserve specific fields that should not be lost
                chiefComplaints: updatedClient.chiefComplaints || client.chiefComplaints,
                hopi: updatedClient.hopi || client.hopi,
                sessionCount: updatedClient.sessionCount || client.sessionCount,
                // Always keep the most recent session dates
                lastSession: updatedClient.lastSession || client.lastSession,
                upcomingSession: updatedClient.upcomingSession || client.upcomingSession
              }
            : client
        )
      );
      
      // Also update the selected client if it's the same one
      if (selectedClient?.id === updatedClient.id) {
        setSelectedClient(updatedClient);
      }
    } catch (error) {
      console.error('Failed to update client:', error);
      throw error;
    }
  };

  const addSession = async (sessionData: Omit<Session, 'id'>) => {
    try {
      // For calendar modal sessions, check if client exists in regular clients
      if (sessionData.isFromCalendarModal && !sessionData.clientId) {
        const existingClient = clients.find(c => c.name.toLowerCase() === sessionData.clientName.toLowerCase());
        if (!existingClient) {
          // Create a calendar client
          const calendarClientData: Omit<CalendarClient, 'id'> = {
            name: sessionData.clientName,
            email: sessionData.email,
            phone: sessionData.phone,
            occupation: sessionData.occupation,
            age: sessionData.age,
            sessionCount: 1,
          };
          await api.calendarClients.create(calendarClientData);
          // Note: We don't store the calendar client ID in the session since sessions can reference regular clients
        } else {
          // Use existing client
          sessionData.clientId = existingClient.id;
        }
      }

      const createdSession = await api.sessions.create(sessionData);
      
      // Find client and increment their sessionCount only if clientId exists
      const client = sessionData.clientId ? clients.find(c => c.id === sessionData.clientId) : null;
      const prevCount = client?.sessionCount || 0;
      const newCount = prevCount + 1;

      // Update client with new sessionCount and lastSession/upcomingSession
      if (client) {
        const updatedClient: Client = {
          ...client,
          sessionCount: newCount,
          lastSession: sessionData.date || client.lastSession,
          upcomingSession: sessionData.followUp?.date || client.upcomingSession
        };
        await updateClient(updatedClient);
      }

      setAllSessions(prev => [...prev, createdSession]);
      setSessions(prevSessions => [...prevSessions, createdSession]);
      return createdSession.id;
    } catch (error) {
      console.error('Failed to add session:', error);
      throw error;
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      await api.sessions.delete(sessionId);
      const sessionToDelete = sessions.find(s => s.id === sessionId);
      if (!sessionToDelete) return;

      // Remove session
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      setAllSessions(prev => prev.filter(s => s.id !== sessionId));

      // If session had a clientId, decrement client's sessionCount
      if (sessionToDelete.clientId) {
        const client = clients.find(c => c.id === sessionToDelete.clientId);
        if (client) {
          const updatedClient: Client = { ...client, sessionCount: Math.max(0, (client.sessionCount || 1) - 1) };
          await updateClient(updatedClient);
        }
      }
    } catch (error) {
      console.error('Failed to delete session:', error);
      throw error;
    }
  };

  const updateSession = async (sessionId: string, notes: string, followUp: { date: string; notes: string }) => {
    try {
      const sessionToUpdate = sessions.find(s => s.id === sessionId);
      if (!sessionToUpdate) return;

      const updatedData = { ...sessionToUpdate, notes, followUp };
      await api.sessions.update(sessionId, updatedData);

      setSessions(prevSessions =>
        prevSessions.map(session =>
          session.id === sessionId
            ? updatedData
            : session
        )
      );
      setAllSessions(prevSessions =>
        prevSessions.map(session =>
          session.id === sessionId
            ? updatedData
            : session
        )
      );
      
      // Update client's next session info
      if (followUp.date) {
        setClients(prevClients =>
          prevClients.map(client =>
            client.id === sessionToUpdate.clientId
              ? { ...client, upcomingSession: followUp.date }
              : client
          )
        );
      }
    } catch (error) {
      console.error('Failed to update session:', error);
      throw error;
    }
  };

  const updateSessionProfile = async (updatedSession: Session) => {
    try {
      await api.sessions.update(updatedSession.id, updatedSession);
      setSessions(prevSessions =>
        prevSessions.map(session =>
          session.id === updatedSession.id
            ? updatedSession
            : session
        )
      );
      setAllSessions(prevSessions =>
        prevSessions.map(session =>
          session.id === updatedSession.id
            ? updatedSession
            : session
        )
      );
    } catch (error) {
      console.error('Failed to update session profile:', error);
      throw error;
    }
  };

  return (
    <AppContext.Provider
      value={{
        selectedClient,
        setSelectedClient,
        selectedSession,
        setSelectedSession,
        clients,
        sessions,
        allSessions,
        practiceName,
        setPracticeName,
        addClient,
        addSession,
        deleteSession,
        updateClient,
        incrementClientSessionCount,
        updateSession,
        updateSessionProfile
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};