import express from 'express';
import CalendarClient from '../models/CalendarClient';
import { authMiddleware } from '../middleware/auth';

interface AuthRequest extends express.Request {
  user?: any;
}

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all calendar clients
router.get('/', async (req: AuthRequest, res) => {
  try {
    const clients = await CalendarClient.find({ userId: req.user!.id });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get calendar client by ID
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const client = await CalendarClient.findOne({ _id: req.params.id, userId: req.user!.id });
    if (!client) {
      return res.status(404).json({ message: 'Calendar client not found' });
    }
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create calendar client
router.post('/', async (req: AuthRequest, res) => {
  try {
    const clientData = { ...req.body, userId: req.user!.id };
    const client = new CalendarClient(clientData);
    await client.save();
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update calendar client
router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const client = await CalendarClient.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!.id },
      req.body,
      { new: true }
    );
    if (!client) {
      return res.status(404).json({ message: 'Calendar client not found' });
    }
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete calendar client
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const client = await CalendarClient.findOneAndDelete({ _id: req.params.id, userId: req.user!.id });
    if (!client) {
      return res.status(404).json({ message: 'Calendar client not found' });
    }
    res.json({ message: 'Calendar client deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;