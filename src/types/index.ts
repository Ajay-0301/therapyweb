export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Client {
  id: string;
  name: string;
  age: number;
  status: 'Active' | 'Completed';
  sessionCount?: number;
  email?: string;
  phone?: string;
  lastSession?: string;
  upcomingSession?: string;
  occupation?: string;
  chiefComplaints?: string;
  hopi?: string; // History of Presenting Illness
}

export interface Session {
  id: string;
  clientId: string;
  clientName: string;
  date: string;
  time: string;
  duration: number; // in minutes
  notes?: string;
  followUp?: {
    date: string;
    notes: string;
  };
  // sessionNumber captures the client's session count at time of creation
  sessionNumber?: number;
  // flag to indicate a session created from the calendar modal
  isFromCalendarModal?: boolean;
}

export interface Attachment {
  id: string;
  clientId: string;
  sessionId?: string;
  fileName: string;
  fileType: string;
  uploadDate: string;
  url: string;
}

export interface AISummary {
  id: string;
  clientId: string;
  sessionId?: string;
  overallProgress: string;
  emotionalPatterns: string[];
  recurringThemes: string[];
  generatedDate: string;
}