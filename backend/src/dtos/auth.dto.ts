import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { validationErrorResponse } from '../utils/api-response';

// LoginOrRegister DTO Schema
const loginOrRegisterSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid email format.',
    'any.required': 'Email is required.',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required.',
  }),
});

// Middleware for validating register
export const validateLoginOrRegister = (req: Request, res: Response, next: NextFunction) => {
  const { error } = loginOrRegisterSchema.validate(req.body);
  if (error) {
    return validationErrorResponse(res, error.details, error.details[0].message);
  }
  next();
};
