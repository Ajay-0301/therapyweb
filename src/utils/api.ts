// This file contains API functions for the backend
import { User, Client, Session, Attachment, AISummary, CalendarClient } from '../types';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const getAuthToken = () => localStorage.getItem('token');

const apiRequest = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  if (!response.ok) {
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || `API Error: ${response.statusText}`);
    } catch (parseError) {
      throw new Error(`API Error: ${response.statusText}`);
    }
  }
  return response.json();
};

export const api = {
  auth: {
    login: async (email: string, password: string): Promise<User> => {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem('token', data.token);
      return data.user;
    },
    logout: async (): Promise<void> => {
      localStorage.removeItem('token');
    },
    register: async (email: string, password: string, name: string): Promise<User> => {
      const data = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
      });
      localStorage.setItem('token', data.token);
      return data.user;
    },
  },

  clients: {
    getAll: async (): Promise<Client[]> => {
      return apiRequest('/clients');
    },
    getById: async (id: string): Promise<Client> => {
      return apiRequest(`/clients/${id}`);
    },
    create: async (client: Omit<Client, 'id'>): Promise<Client> => {
      return apiRequest('/clients', {
        method: 'POST',
        body: JSON.stringify(client),
      });
    },
    update: async (id: string, client: Partial<Client>): Promise<Client> => {
      return apiRequest(`/clients/${id}`, {
        method: 'PUT',
        body: JSON.stringify(client),
      });
    },
    delete: async (id: string): Promise<void> => {
      return apiRequest(`/clients/${id}`, {
        method: 'DELETE',
      });
    },
  },

  sessions: {
    getAll: async (): Promise<Session[]> => {
      return apiRequest('/sessions');
    },
    getAllForClient: async (clientId: string): Promise<Session[]> => {
      return apiRequest(`/sessions/client/${clientId}`);
    },
    getById: async (id: string): Promise<Session> => {
      return apiRequest(`/sessions/${id}`);
    },
    create: async (session: Omit<Session, 'id'>): Promise<Session> => {
      return apiRequest('/sessions', {
        method: 'POST',
        body: JSON.stringify(session),
      });
    },
    update: async (id: string, session: Partial<Session>): Promise<Session> => {
      return apiRequest(`/sessions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(session),
      });
    },
    delete: async (id: string): Promise<void> => {
      return apiRequest(`/sessions/${id}`, {
        method: 'DELETE',
      });
    },
  },

  calendarClients: {
    getAll: async (): Promise<CalendarClient[]> => {
      return apiRequest('/calendar-clients');
    },
    getById: async (id: string): Promise<CalendarClient> => {
      return apiRequest(`/calendar-clients/${id}`);
    },
    create: async (client: Omit<CalendarClient, 'id'>): Promise<CalendarClient> => {
      return apiRequest('/calendar-clients', {
        method: 'POST',
        body: JSON.stringify(client),
      });
    },
    update: async (id: string, client: Partial<CalendarClient>): Promise<CalendarClient> => {
      return apiRequest(`/calendar-clients/${id}`, {
        method: 'PUT',
        body: JSON.stringify(client),
      });
    },
    delete: async (id: string): Promise<void> => {
      return apiRequest(`/calendar-clients/${id}`, {
        method: 'DELETE',
      });
    },
  },

  attachments: {
    upload: async (file: File, clientId: string, sessionId?: string): Promise<Attachment> => {
      // For now, placeholder
      throw new Error('Not implemented');
    },
    getAll: async (clientId: string): Promise<Attachment[]> => {
      throw new Error('Not implemented');
    },
    delete: async (id: string): Promise<void> => {
      throw new Error('Not implemented');
    },
  },

  settings: {
    get: async (): Promise<any> => {
      return apiRequest('/settings');
    },
    update: async (settings: any): Promise<any> => {
      return apiRequest('/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      });
    },
    export: async (): Promise<any> => {
      return apiRequest('/settings/export');
    },
    import: async (data: any): Promise<any> => {
      return apiRequest('/settings/import', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  },

  insights: {
    get: async (timeRange?: number): Promise<any> => {
      const params = timeRange ? `?timeRange=${timeRange}` : '';
      return apiRequest(`/insights${params}`);
    },
    getAnalytics: async (): Promise<any> => {
      return apiRequest('/insights/analytics');
    },
  },

  ai: {
    generateSessionSummary: async (sessionId: string): Promise<AISummary> => {
      throw new Error('Not implemented');
    },
    generateClientSummary: async (clientId: string): Promise<AISummary> => {
      throw new Error('Not implemented');
    },
  },
};