const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Connection error:', err));

// Session Schema (same as in your app)
const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  clientId: { type: String },
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

const Session = mongoose.model('Session', sessionSchema);

// Calendar Client Schema
const calendarClientSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  occupation: { type: String },
  age: { type: Number },
  sessionCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const CalendarClient = mongoose.model('CalendarClient', calendarClientSchema);

// Query and display calendar clients
async function showCalendarClients() {
  try {
    console.log('\n=== CALENDAR CLIENTS IN DATABASE ===\n');

    const calendarClients = await CalendarClient.find({}).sort({ createdAt: -1 });

    if (calendarClients.length === 0) {
      console.log('No calendar clients found in database.');
      return;
    }

    calendarClients.forEach((client, index) => {
      console.log(`Calendar Client ${index + 1}:`);
      console.log(`  ID: ${client._id}`);
      console.log(`  Name: ${client.name}`);
      console.log(`  Email: ${client.email || 'Not set'}`);
      console.log(`  Phone: ${client.phone || 'Not set'}`);
      console.log(`  Occupation: ${client.occupation || 'Not set'}`);
      console.log(`  Age: ${client.age || 'Not set'}`);
      console.log(`  Session Count: ${client.sessionCount || 0}`);
      console.log(`  Created: ${client.createdAt}`);
      console.log(`  Updated: ${client.updatedAt}`);
      console.log('  ---');
    });

  } catch (error) {
    console.error('Error querying calendar clients:', error);
  }
}

// Query and display sessions
async function showSessions() {
  try {
    console.log('\n=== SESSIONS IN DATABASE ===\n');

    const sessions = await Session.find({}).sort({ createdAt: -1 });

    if (sessions.length === 0) {
      console.log('No sessions found in database.');
      return;
    }

    sessions.forEach((session, index) => {
      console.log(`Session ${index + 1}:`);
      console.log(`  ID: ${session._id}`);
      console.log(`  Client: ${session.clientName} (${session.clientId})`);
      console.log(`  Date: ${session.date} at ${session.time}`);
      console.log(`  Duration: ${session.duration} minutes`);
      console.log(`  Status: ${session.status || 'Not set'}`);
      console.log(`  Notes: ${session.notes || 'No notes'}`);
      console.log(`  Chief Complaints: ${session.chiefComplaints || 'Not set'}`);
      console.log(`  HOPI: ${session.hopi || 'Not set'}`);

      if (session.followUp) {
        console.log(`  Follow-up Date: ${session.followUp.date || 'Not set'}`);
        console.log(`  Follow-up Notes: ${session.followUp.notes || 'No follow-up notes'}`);
      } else {
        console.log(`  Follow-up: Not set`);
      }

      console.log(`  Created: ${session.createdAt}`);
      console.log(`  Updated: ${session.updatedAt}`);
      console.log('  ---');
    });

  } catch (error) {
    console.error('Error querying database:', error);
  } finally {
    mongoose.connection.close();
  }
}

async function main() {
  await showCalendarClients();
  await showSessions();
}

main();