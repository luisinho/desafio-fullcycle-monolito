import { Request, Response, NextFunction } from 'express';
import { ValidationException } from '../../modules/@shared/domain/validation/validation.exception';

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
  }

  console.error(err);

  return res.status(500).json({
    message: 'Internal server error',
  });
}