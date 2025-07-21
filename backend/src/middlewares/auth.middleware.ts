import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { forbiddenResponse, unauthorizedResponse } from '../utils/api-response';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return unauthorizedResponse(res);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
    req.user = { userId: decoded.userId }; // typed!
    next();
  } catch (err) {
    return forbiddenResponse(res, "Invalid Token");
  }
};
