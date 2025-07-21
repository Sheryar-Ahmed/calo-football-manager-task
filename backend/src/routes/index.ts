import express from "express";

import AuthRoutes from './auth.routes';
import TeamRoutes from './team.routes';
import TransferMarketRoutes from './transfer-market.routes';

const router = express.Router();

router.use('/auth', AuthRoutes);
router.use('/team', TeamRoutes);
router.use('/transfer', TransferMarketRoutes);


export default router;