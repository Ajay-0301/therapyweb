"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserSettings_1 = __importDefault(require("../models/UserSettings"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Get user settings
router.get('/', auth_1.authMiddleware, async (req, res) => {
    try {
        const settings = await UserSettings_1.default.findOne({ userId: req.user.id });
        if (!settings) {
            // Return default settings if none exist
            return res.json({
                fullName: req.user.name,
                email: req.user.email,
                phone: '',
                practiceName: 'Thanya Therapy',
                licenseNumber: '',
                specialization: 'clinical-psychology',
                emailNotifications: true,
                darkMode: false,
                language: 'en',
                twoFactorEnabled: false,
                autoBackup: true,
                syncEnabled: true
            });
        }
        res.json({
            ...settings.toObject(),
            email: req.user.email // Include email from user model
        });
    }
    catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Update user settings
router.put('/', auth_1.authMiddleware, async (req, res) => {
    try {
        const { fullName, phone, practiceName, licenseNumber, specialization, emailNotifications, darkMode, language, twoFactorEnabled, autoBackup, syncEnabled } = req.body;
        const settings = await UserSettings_1.default.findOneAndUpdate({ userId: req.user.id }, {
            fullName,
            phone,
            practiceName,
            licenseNumber,
            specialization,
            emailNotifications,
            darkMode,
            language,
            twoFactorEnabled,
            autoBackup,
            syncEnabled
        }, { new: true, upsert: true });
        res.json(settings);
    }
    catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Export all data
router.get('/export', auth_1.authMiddleware, async (req, res) => {
    try {
        // This would export clients, sessions, and settings
        // For now, return a placeholder
        res.json({
            message: 'Export functionality will be implemented',
            data: {
                clients: [],
                sessions: [],
                settings: {}
            }
        });
    }
    catch (error) {
        console.error('Error exporting data:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Import data
router.post('/import', auth_1.authMiddleware, async (req, res) => {
    try {
        // This would import clients, sessions, and settings
        // For now, return a placeholder
        res.json({ message: 'Import functionality will be implemented' });
    }
    catch (error) {
        console.error('Error importing data:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = router;
