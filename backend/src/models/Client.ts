import mongoose, { Document, Schema } from 'mongoose';

export interface IClient extends Document {
  id: string; // Custom client ID provided by user
  userId: mongoose.Types.ObjectId; // Reference to the user who owns this client
  name: string;
  age: number;
  status: 'Active' | 'Completed';
  email?: string;
  phone?: string;
  lastSession?: string;
  upcomingSession?: string;
  occupation?: string;
  chiefComplaints?: string;
  hopi?: string; // History of Presenting Illness
  gender?: string;
  maritalStatus?: string;
  sessionCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true }, // Custom client ID
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to user
  name: { type: String, required: true },
  age: { type: Number, required: true },
  status: { type: String, enum: ['Active', 'Completed'], default: 'Active' },
  email: { type: String },
  phone: { type: String },
  lastSession: { type: String },
  upcomingSession: { type: String },
  occupation: { type: String },
  chiefComplaints: { type: String },
  hopi: { type: String },
  gender: { type: String },
  maritalStatus: { type: String },
  sessionCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IClient>('Client', ClientSchema);