import mongoose, { Document, Schema } from 'mongoose';

export interface IUserSettings extends Document {
  userId: mongoose.Types.ObjectId;
  // Profile settings
  fullName?: string;
  phone?: string;
  practiceName?: string;
  licenseNumber?: string;
  specialization?: string;
  // Preferences
  emailNotifications: boolean;
  darkMode: boolean;
  language: string;
  // Security
  twoFactorEnabled: boolean;
  // Data management
  autoBackup: boolean;
  syncEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSettingsSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  // Profile settings
  fullName: { type: String },
  phone: { type: String },
  practiceName: { type: String, default: 'Thanya Therapy' },
  licenseNumber: { type: String },
  specialization: { type: String, enum: ['clinical-psychology', 'counseling', 'family-therapy', 'cbt'], default: 'clinical-psychology' },
  // Preferences
  emailNotifications: { type: Boolean, default: true },
  darkMode: { type: Boolean, default: false },
  language: { type: String, default: 'en' },
  // Security
  twoFactorEnabled: { type: Boolean, default: false },
  // Data management
  autoBackup: { type: Boolean, default: true },
  syncEnabled: { type: Boolean, default: true },
}, {
  timestamps: true
});

export default mongoose.model<IUserSettings>('UserSettings', UserSettingsSchema);