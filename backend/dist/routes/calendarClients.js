"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CalendarClient_1 = __importDefault(require("../models/CalendarClient"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Apply auth middleware to all routes
router.use(auth_1.authMiddleware);
// Get all calendar clients
router.get('/', async (req, res) => {
    try {
        const clients = await CalendarClient_1.default.find({ userId: req.user.id });
        res.json(clients);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
// Get calendar client by ID
router.get('/:id', async (req, res) => {
    try {
        const client = await CalendarClient_1.default.findOne({ _id: req.params.id, userId: req.user.id });
        if (!client) {
            return res.status(404).json({ message: 'Calendar client not found' });
        }
        res.json(client);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
// Create calendar client
router.post('/', async (req, res) => {
    try {
        const clientData = { ...req.body, userId: req.user.id };
        const client = new CalendarClient_1.default(clientData);
        await client.save();
        res.status(201).json(client);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
// Update calendar client
router.put('/:id', async (req, res) => {
    try {
        const client = await CalendarClient_1.default.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, req.body, { new: true });
        if (!client) {
            return res.status(404).json({ message: 'Calendar client not found' });
        }
        res.json(client);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
// Delete calendar client
router.delete('/:id', async (req, res) => {
    try {
        const client = await CalendarClient_1.default.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!client) {
            return res.status(404).json({ message: 'Calendar client not found' });
        }
        res.json({ message: 'Calendar client deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = router;
