import React, { createContext, useContext, useState } from 'react';
import { User, Client, Session } from '../types';

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
  addClient: (client: Client) => void;
  // returns created session id
  addSession: (session: Omit<Session, 'id'>) => string;
  updateClient: (client: Client) => void;
  incrementClientSessionCount: (clientId: string, delta?: number) => void;
  updateSession: (sessionId: string, notes: string, followUp: { date: string; notes: string }) => void;
  updateSessionProfile: (session: Session) => void;
  deleteSession: (sessionId: string) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
export const AppContext = createContext<AppContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    if (email === 'demo@thanya.com' && password === 'demo123') {
      const demoUser: User = {
        id: 'demo-user',
        email: 'demo@thanya.com',
        name: 'Demo User'
      };
      setUser(demoUser);
      return;
    }
    throw new Error('Invalid credentials');
  };

  const logout = () => {
    setUser(null);
    // TODO: Implement actual logout with backend
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);

  const addClient = (clientData: Client) => {
    const newClient: Client = {
      ...clientData,
      sessionCount: clientData.sessionCount || 0,
    };
    setClients(prevClients => [...prevClients, newClient]);
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

  const updateClient = (updatedClient: Client) => {
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
  };

  const addSession = (sessionData: Omit<Session, 'id'>) => {
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
      setClients(prev => prev.map(c => c.id === client.id ? updatedClient : c));
      // If selectedClient matches, update it too
      if (selectedClient?.id === client.id) setSelectedClient(updatedClient);
    }

    const newSession: Session = {
      ...sessionData,
      id: `session-${Date.now()}`,
      sessionNumber: client ? newCount : undefined, // Only set sessionNumber if linked to client
      isFromCalendarModal: (sessionData as any).isFromCalendarModal || false,
    };

    setSessions(prevSessions => [...prevSessions, newSession]);
    return newSession.id;
  };

  const deleteSession = (sessionId: string) => {
    const sessionToDelete = sessions.find(s => s.id === sessionId);
    if (!sessionToDelete) return;

    // Remove session
    setSessions(prev => prev.filter(s => s.id !== sessionId));

    // If session had a clientId, decrement client's sessionCount
    if (sessionToDelete.clientId) {
      const client = clients.find(c => c.id === sessionToDelete.clientId);
      if (client) {
        const updatedClient: Client = { ...client, sessionCount: Math.max(0, (client.sessionCount || 1) - 1) };
        setClients(prev => prev.map(c => c.id === client.id ? updatedClient : c));
        if (selectedClient?.id === client.id) setSelectedClient(updatedClient);
      }
    }
  };

  const updateSession = (sessionId: string, notes: string, followUp: { date: string; notes: string }) => {
    setSessions(prevSessions =>
      prevSessions.map(session =>
        session.id === sessionId
          ? { 
              ...session, 
              notes, 
              followUp: {
                date: followUp.date,
                notes: followUp.notes
              }
            }
          : session
      )
    );
    
    // Update client's next session info
    const updatedSession = sessions.find(s => s.id === sessionId);
    if (updatedSession && followUp.date) {
      setClients(prevClients =>
        prevClients.map(client =>
          client.id === updatedSession.clientId
            ? { ...client, upcomingSession: followUp.date }
            : client
        )
      );
    }
  };

  const updateSessionProfile = (updatedSession: Session) => {
    setSessions(prevSessions =>
      prevSessions.map(session =>
        session.id === updatedSession.id
          ? updatedSession
          : session
      )
    );
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