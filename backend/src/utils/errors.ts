import { CustomError } from './custom-error';

export class NotFoundError extends CustomError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

export class ConflictError extends CustomError {
  constructor(message = 'Resource already exists') {
    super(message, 409);
  }
}

export class ValidationError extends CustomError {
  constructor(message = 'Validation error') {
    super(message, 400);
  }
}