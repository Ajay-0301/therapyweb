import mongoose, { Document, Schema } from 'mongoose';

export interface ICalendarClient extends Document {
  userId: mongoose.Types.ObjectId; // Reference to the user who owns this client
  name: string;
  email?: string;
  phone?: string;
  occupation?: string;
  age?: number;
  chiefComplaints?: string;
  hopi?: string; // History of Presenting Illness
  sessionCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const CalendarClientSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to user
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  occupation: { type: String },
  age: { type: Number },
  chiefComplaints: { type: String },
  hopi: { type: String },
  sessionCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<ICalendarClient>('CalendarClient', CalendarClientSchema);