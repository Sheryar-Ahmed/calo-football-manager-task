import express from 'express';
import { teamStatus, getUserTeam } from '../controllers/team.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

// GET /api/team/status – Check if team is ready
router.get('/status', authenticate, teamStatus);

// GET /api/team – Get user's full team data
router.get('/', authenticate, getUserTeam);

export default router;
