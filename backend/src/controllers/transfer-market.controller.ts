import { Request, Response } from 'express';
import TransferMarketService from '../services/transfer-market.service';
import { successResponse } from '../utils/api-response';
import { handleControllerError } from '../utils/safe-controller';

export const listPlayersForSell = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  try {
    const result = await TransferMarketService.listTeamPlayersForSell(userId);
    return successResponse(res, result, 'Listed team players for sale');
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const togglePlayerMarketStatus = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { teamPlayerId, askingPrice, inTransferMarket } = req.body;

  try {
    const result = await TransferMarketService.toggleSellStatus(
      userId,
      teamPlayerId,
      askingPrice,
      inTransferMarket
    );
    return successResponse(res, result, 'Transfer status updated');
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const buyPlayer = async (req: Request, res: Response) => {
  const buyerId = req.user?.userId;
  const { teamPlayerId } = req.body;

  try {
    const result = await TransferMarketService.buyPlayer(buyerId, teamPlayerId);
    return successResponse(res, result, 'Player purchased successfully');
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const filterTransferMarket = async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  const playerName = req.query.playerName as string | undefined;
  const teamName = req.query.teamName as string | undefined;
  const min = req.query.min ? Number(req.query.min) : undefined;
  const max = req.query.max ? Number(req.query.max) : undefined;
  const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;

  try {
    const result = await TransferMarketService.filterTransferMarket(
      {
        playerName,
        teamName,
        min,
        max,
        page,
      },
      userId
    );

    return successResponse(res, result, 'Filtered transfer market results');
  } catch (error) {
    handleControllerError(res, error);
  }
};

