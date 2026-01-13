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
  clientId?: string; // optional, null for standalone sessions
  clientName: string;
  date: string;
  time: string;
  duration: number; // in minutes
  notes?: string;
  chiefComplaints?: string; // Store Chief Complaints from the session
  hopi?: string; // Store HOPI from the session
  followUp?: {
    date: string;
    notes: string;
  };
  // sessionNumber captures the client's session count at time of creation
  sessionNumber?: number;
  // flag to indicate a session created from the calendar modal
  isFromCalendarModal?: boolean;
  // Profile fields for standalone sessions
  email?: string;
  phone?: string;
  occupation?: string;
  age?: number;
  status?: 'Active' | 'Completed';
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