// This file contains placeholder API functions that will be implemented with the backend
import { User, Client, Session, Attachment, AISummary } from '../types';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const api = {
  auth: {
    login: async (email: string, password: string): Promise<User> => {
      throw new Error('Backend API not implemented yet');
    },
    logout: async (): Promise<void> => {
      throw new Error('Backend API not implemented yet');
    },
  },

  clients: {
    getAll: async (): Promise<Client[]> => {
      throw new Error('Backend API not implemented yet');
    },
    getById: async (id: string): Promise<Client> => {
      throw new Error('Backend API not implemented yet');
    },
    create: async (client: Omit<Client, 'id'>): Promise<Client> => {
      throw new Error('Backend API not implemented yet');
    },
    update: async (id: string, client: Partial<Client>): Promise<Client> => {
      throw new Error('Backend API not implemented yet');
    },
    delete: async (id: string): Promise<void> => {
      throw new Error('Backend API not implemented yet');
    },
  },

  sessions: {
    getAll: async (clientId: string): Promise<Session[]> => {
      throw new Error('Backend API not implemented yet');
    },
    getById: async (id: string): Promise<Session> => {
      throw new Error('Backend API not implemented yet');
    },
    create: async (session: Omit<Session, 'id'>): Promise<Session> => {
      throw new Error('Backend API not implemented yet');
    },
    update: async (id: string, session: Partial<Session>): Promise<Session> => {
      throw new Error('Backend API not implemented yet');
    },
    delete: async (id: string): Promise<void> => {
      throw new Error('Backend API not implemented yet');
    },
  },

  attachments: {
    upload: async (file: File, clientId: string, sessionId?: string): Promise<Attachment> => {
      throw new Error('Backend API not implemented yet');
    },
    getAll: async (clientId: string): Promise<Attachment[]> => {
      throw new Error('Backend API not implemented yet');
    },
    delete: async (id: string): Promise<void> => {
      throw new Error('Backend API not implemented yet');
    },
  },

  ai: {
    generateSessionSummary: async (sessionId: string): Promise<AISummary> => {
      throw new Error('Backend API not implemented yet');
    },
    generateClientSummary: async (clientId: string): Promise<AISummary> => {
      throw new Error('Backend API not implemented yet');
    },
  },
};