"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Client_1 = __importDefault(require("../models/Client"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Apply auth middleware to all routes
router.use(auth_1.authMiddleware);
// Get all clients
router.get('/', async (req, res) => {
    try {
        const clients = await Client_1.default.find({ userId: req.user.id });
        const clientsWithId = clients.map(client => ({ ...client.toObject(), id: client.id }));
        res.json(clientsWithId);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
// Get client by ID
router.get('/:id', async (req, res) => {
    try {
        const client = await Client_1.default.findOne({ id: req.params.id, userId: req.user.id });
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.json({ ...client.toObject(), id: client.id });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
// Create client
router.post('/', async (req, res) => {
    try {
        const clientData = { ...req.body, userId: req.user.id };
        const client = new Client_1.default(clientData);
        await client.save();
        res.status(201).json({ ...client.toObject(), id: client.id });
    }
    catch (error) {
        if (error && typeof error === 'object' && 'code' in error && error.code === 11000) { // Duplicate key error
            res.status(400).json({ message: 'Client ID already exists' });
        }
        else {
            res.status(500).json({ message: 'Server error' });
        }
    }
});
// Update client
router.put('/:id', async (req, res) => {
    try {
        const client = await Client_1.default.findOneAndUpdate({ id: req.params.id, userId: req.user.id }, req.body, { new: true });
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.json({ ...client.toObject(), id: client.id });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
// Delete client
router.delete('/:id', async (req, res) => {
    try {
        const client = await Client_1.default.findOneAndDelete({ id: req.params.id, userId: req.user.id });
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.json({ message: 'Client deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = router;
