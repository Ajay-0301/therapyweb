import mongoose, { Document, Schema } from 'mongoose';

export interface ISession extends Document {
  userId: mongoose.Types.ObjectId; // Reference to the user who owns this session
  clientId?: string; // Custom client ID (string)
  clientName: string;
  date: string;
  time: string;
  duration: number; // in minutes
  notes?: string;
  chiefComplaints?: string;
  hopi?: string;
  followUp?: {
    date: string;
    notes: string;
  };
  sessionNumber?: number;
  isFromCalendarModal?: boolean;
  email?: string;
  phone?: string;
  occupation?: string;
  age?: number;
  status?: 'Active' | 'Completed';
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to user
  clientId: { type: String }, // Custom client ID as string
  clientName: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  duration: { type: Number, required: true },
  notes: { type: String },
  chiefComplaints: { type: String },
  hopi: { type: String },
  followUp: {
    date: { type: String },
    notes: { type: String }
  },
  sessionNumber: { type: Number },
  isFromCalendarModal: { type: Boolean, default: false },
  email: { type: String },
  phone: { type: String },
  occupation: { type: String },
  age: { type: Number },
  status: { type: String, enum: ['Active', 'Completed'] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<ISession>('Session', SessionSchema);