import express from 'express';
import { validateLoginOrRegister } from '../dtos/auth.dto';
import { loginOrRegister, profile } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/login', validateLoginOrRegister, loginOrRegister);
router.get('/me', authenticate, profile)

export default router;
