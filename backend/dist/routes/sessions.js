"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Session_1 = __importDefault(require("../models/Session"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Apply auth middleware to all routes
router.use(auth_1.authMiddleware);
// Get all sessions for the user
router.get('/', async (req, res) => {
    try {
        const sessions = await Session_1.default.find({ userId: req.user.id });
        const sessionsWithId = sessions.map(session => ({ ...session.toObject(), id: session._id.toString() }));
        res.json(sessionsWithId);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
// Get all sessions for a client
router.get('/client/:clientId', async (req, res) => {
    try {
        const sessions = await Session_1.default.find({ clientId: req.params.clientId, userId: req.user.id });
        const sessionsWithId = sessions.map(session => ({ ...session.toObject(), id: session._id.toString() }));
        res.json(sessionsWithId);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
// Get session by ID
router.get('/:id', async (req, res) => {
    try {
        const session = await Session_1.default.findOne({ _id: req.params.id, userId: req.user.id });
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }
        res.json({ ...session.toObject(), id: session._id.toString() });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
// Create session
router.post('/', async (req, res) => {
    try {
        const sessionData = { ...req.body, userId: req.user.id };
        console.log('Creating session with data:', sessionData);
        const session = new Session_1.default(sessionData);
        await session.save();
        console.log('Session saved:', session.toObject());
        res.status(201).json({ ...session.toObject(), id: session._id.toString() });
    }
    catch (error) {
        console.error('Error creating session:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Update session
router.put('/:id', async (req, res) => {
    try {
        console.log('Updating session', req.params.id, 'with data:', req.body);
        const session = await Session_1.default.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, req.body, { new: true });
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }
        console.log('Session updated:', session.toObject());
        res.json({ ...session.toObject(), id: session._id.toString() });
    }
    catch (error) {
        console.error('Error updating session:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Delete session
router.delete('/:id', async (req, res) => {
    try {
        const session = await Session_1.default.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }
        res.json({ message: 'Session deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = router;
