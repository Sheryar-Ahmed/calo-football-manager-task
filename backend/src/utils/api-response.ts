import { Response } from 'express';
import { STATUS_CODES } from '../constants/status-codes';
import { MESSAGES } from '../constants/messages';

export const successResponse = <T>(res: Response, data: T, message: string = MESSAGES.SUCCESS, statusCode = STATUS_CODES.OK) => {
  return res.status(statusCode).json({ status: 'success', message, data });
};

export const createdResponse = <T>(res: Response, data: T, message: string = MESSAGES.RESOURCE_CREATED, statusCode = STATUS_CODES.CREATED) => {
  return res.status(statusCode).json({ status: 'success', message, data });
};

export const acceptedResponse = (res: Response, message: string = MESSAGES.REQUEST_ACCEPTED, statusCode = STATUS_CODES.ACCEPTED) => {
  return res.status(statusCode).json({ status: 'success', message });
};

export const noContentResponse = (res: Response, statusCode = STATUS_CODES.NO_CONTENT) => {
  return res.status(statusCode).send();
};

export const errorResponse = (res: Response, error: unknown, message: string = MESSAGES.ERROR_OCCURRED, statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR) => {
  return res.status(statusCode).json({ status: 'error', message, error });
};

export const validationErrorResponse = (res: Response, errors: unknown, message: string = MESSAGES.VALIDATION_FAILED, statusCode = STATUS_CODES.BAD_REQUEST) => {
  return res.status(statusCode).json({ status: 'fail', message, errors });
};

export const notFoundResponse = (res: Response, message: string = MESSAGES.RESOURCE_NOT_FOUND, statusCode = STATUS_CODES.NOT_FOUND) => {
  return res.status(statusCode).json({ status: 'fail', message });
};

export const unauthorizedResponse = (res: Response, message: string = MESSAGES.UNAUTHORIZED_ACCESS, statusCode = STATUS_CODES.UNAUTHORIZED) => {
  return res.status(statusCode).json({ status: 'fail', message });
};

export const forbiddenResponse = (res: Response, message: string = MESSAGES.FORBIDDEN, statusCode = STATUS_CODES.FORBIDDEN) => {
  return res.status(statusCode).json({ status: 'fail', message });
};

export const conflictResponse = (res: Response, message: string = MESSAGES.CONFLICT, statusCode = STATUS_CODES.CONFLICT) => {
  return res.status(statusCode).json({ status: 'fail', message });
};