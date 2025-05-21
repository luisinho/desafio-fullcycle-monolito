import { Request, Response, NextFunction } from 'express';
import { ConflictException } from '@shared/domain/validation/conflict.exception';
import { NotFoudException } from '@shared/domain/validation/not-found.exception';
import { ValidationException } from '@shared/domain/validation/validation.exception';

export function globalErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Response {
  if (err instanceof ValidationException) {
    return res.status(422).json({
      message: err.message,
      errors: err.errors,
    });
  } else if(err instanceof NotFoudException) {
    return res.status(404).json({
      message: err.message,      
    });
  } else if (err instanceof ConflictException) {
    return res.status(409).json({
      message: err.message,
    });
  }

  console.error(err);

  return res.status(500).json({
    message: 'Internal server error',
  });
}