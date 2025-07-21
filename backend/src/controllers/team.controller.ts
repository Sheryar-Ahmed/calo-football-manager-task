import { Request, Response } from 'express';
import TeamService from '../services/team.service';
import { successResponse } from '../utils/api-response';
import { handleControllerError } from '../utils/safe-controller';

export const teamStatus = async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    try {
        const result = await TeamService.teamStatus(userId);
        return successResponse(res, result, 'Team Status successful');
    } catch (error) {
        handleControllerError(res, error);
    }
};

export const getUserTeam = async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    try {
        const result = await TeamService.userTeam(userId);
        return successResponse(res, result, "Team Players successful");
    } catch (error) {
        handleControllerError(res, error);
    }
}