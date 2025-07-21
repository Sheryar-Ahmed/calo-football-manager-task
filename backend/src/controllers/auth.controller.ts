import { Request, Response } from 'express';
import  AuthService  from '../services/auth.service';
import { successResponse } from '../utils/api-response';
import { handleControllerError } from '../utils/safe-controller';

export const loginOrRegister = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const result = await AuthService.loginOrRegister(email, password);
        return successResponse(res, result, 'Authentication successful');
    } catch (error) {
        handleControllerError(res, error);
    }
};

export const profile = async (req: Request, res: Response) =>{
    const userId = req.user?.userId;
    try {
        const result = await AuthService.profile(userId);
        return successResponse(res, result, 'Profile retrieval successful');
    } catch (error) {
        handleControllerError(res, error);
    }
}