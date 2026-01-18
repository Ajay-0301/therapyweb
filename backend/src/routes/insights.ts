import express from 'express';
import Session from '../models/Session';
import Client from '../models/Client';
import { authMiddleware } from '../middleware/auth';

interface AuthRequest extends express.Request {
  user?: any;
}

const router = express.Router();

// Get insights data
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const timeRange = req.query.timeRange || '30'; // days
    const days = parseInt(timeRange as string);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get sessions in time range for this user
    const sessions = await Session.find({
      userId: req.user!.id,
      createdAt: { $gte: startDate }
    });

    // Get all clients for this user
    const clients = await Client.find({ userId: req.user!.id });

    // Calculate metrics
    const totalSessions = sessions.length;
    const activeClients = new Set(sessions.map(s => s.clientId)).size;
    const totalClients = clients.length;

    // Calculate average session time (mock for now - would need duration field)
    const avgSessionTime = 52; // minutes

    // Calculate completion rate (mock for now)
    const completionRate = 87; // percentage

    // Get session trends (group by date)
    const sessionTrends = sessions.reduce((acc: any, session) => {
      const date = session.createdAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    // Get client progress data (mock AI analysis)
    const clientProgress = clients.slice(0, 5).map(client => ({
      id: client.id,
      name: client.name,
      progress: Math.floor(Math.random() * 100),
      lastSession: sessions
        .filter(s => s.clientId === client.id)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0]?.createdAt || null
    }));

    // Pattern recognition (mock)
    const patterns = ['Anxiety', 'Stress', 'Depression', 'Relationship Issues'];

    // Treatment insights (mock)
    const treatmentInsights = {
      recommendedApproach: 'CBT + Mindfulness',
      confidence: 85,
      alternatives: ['Pure CBT', 'Mindfulness-Based Therapy']
    };

    res.json({
      metrics: {
        totalSessions,
        activeClients,
        totalClients,
        avgSessionTime,
        completionRate
      },
      trends: sessionTrends,
      clientProgress,
      patterns,
      treatmentInsights,
      timeRange: days
    });
  } catch (error) {
    console.error('Error fetching insights:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get detailed analytics
router.get('/analytics', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const sessions = await Session.find({ userId: req.user!.id });
    const clients = await Client.find({ userId: req.user!.id });

    // More detailed analytics
    const sessionTypes = sessions.reduce((acc: any, session) => {
      const type = session.status || 'Unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const clientStatuses = clients.reduce((acc: any, client) => {
      acc[client.status] = (acc[client.status] || 0) + 1;
      return acc;
    }, {});

    res.json({
      sessionTypes,
      clientStatuses,
      totalSessions: sessions.length,
      totalClients: clients.length
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;