import { Router } from 'express';
import { getDatabaseStatus } from '../config/database.js';

const router = Router();

router.get('/', (req, res) => {
  const database = getDatabaseStatus();

  res.json({
    success: true,
    service: 'portfolio-api',
    status: database.connected ? 'ok' : 'degraded',
    database,
    timestamp: new Date().toISOString(),
  });
});

router.get('/ready', (req, res) => {
  const database = getDatabaseStatus();

  if (!database.connected) {
    return res.status(503).json({ success: false, status: 'not_ready', database });
  }

  return res.json({ success: true, status: 'ready', database });
});

export default router;
