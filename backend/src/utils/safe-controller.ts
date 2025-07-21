import { Response } from 'express';
import { ConflictError, NotFoundError, ValidationError } from './errors';
import {
  validationErrorResponse,
  conflictResponse,
  notFoundResponse,
  errorResponse,
} from './api-response';

/**
 * Handles controller errors and sends appropriate response
 * @param res - Express response object
 * @param err - Error instance to handle
 */
export const handleControllerError = (res: Response, err: unknown): Response => {
  if (err instanceof ValidationError) {
    return validationErrorResponse(res, err.message);
  }

  if (err instanceof ConflictError) {
    return conflictResponse(res, err.message);
  }

  if (err instanceof NotFoundError) {
    return notFoundResponse(res, err.message);
  }

  console.error(`Error: ${err instanceof Error ? err.message : String(err)}`);
  return errorResponse(res, err instanceof Error ? err.message : 'Unknown error');
};
