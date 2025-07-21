import { Router } from 'express';
import {
  listPlayersForSell,
  togglePlayerMarketStatus,
  buyPlayer,
  filterTransferMarket,
} from '../controllers/transfer-market.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/sell', authenticate, listPlayersForSell);
router.post('/sell', authenticate, togglePlayerMarketStatus);
router.post('/buy', authenticate, buyPlayer);
router.get('/market', authenticate, filterTransferMarket);

export default router;
