import { Request, Response, NextFunction } from 'express';
import { NotFoudException } from '../../modules/@shared/domain/validation/not-found.exception';
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
  } else if(err instanceof NotFoudException) {
    return res.status(400).json({
      msg: err.message,      
    });
  }

  console.error(err);

  return res.status(500).json({
    message: 'Internal server error',
  });
}