"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_1 = __importDefault(require("./routes/auth"));
const clients_1 = __importDefault(require("./routes/clients"));
const sessions_1 = __importDefault(require("./routes/sessions"));
const settings_1 = __importDefault(require("./routes/settings"));
const insights_1 = __importDefault(require("./routes/insights"));
const calendarClients_1 = __importDefault(require("./routes/calendarClients"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Database connection
mongoose_1.default.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/clients', clients_1.default);
app.use('/api/sessions', sessions_1.default);
app.use('/api/settings', settings_1.default);
app.use('/api/insights', insights_1.default);
app.use('/api/calendar-clients', calendarClients_1.default);
// For Vercel serverless functions
exports.default = app;
// For local development
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
