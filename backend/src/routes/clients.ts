import express from 'express';
import Client from '../models/Client';
import { authMiddleware } from '../middleware/auth';

interface AuthRequest extends express.Request {
  user?: any;
}

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all clients
router.get('/', async (req: AuthRequest, res) => {
  try {
    const clients = await Client.find({ userId: req.user!.id });
    const clientsWithId = clients.map(client => ({ ...client.toObject(), id: client.id }));
    res.json(clientsWithId);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get client by ID
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const client = await Client.findOne({ id: req.params.id, userId: req.user!.id });
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.json({ ...client.toObject(), id: client.id });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create client
router.post('/', async (req: AuthRequest, res) => {
  try {
    const clientData = { ...req.body, userId: req.user!.id };
    const client = new Client(clientData);
    await client.save();
    res.status(201).json({ ...client.toObject(), id: client.id });
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) { // Duplicate key error
      res.status(400).json({ message: 'Client ID already exists' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

// Update client
router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const client = await Client.findOneAndUpdate({ id: req.params.id, userId: req.user!.id }, req.body, { new: true });
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.json({ ...client.toObject(), id: client.id });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete client
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const client = await Client.findOneAndDelete({ id: req.params.id, userId: req.user!.id });
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.json({ message: 'Client deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;