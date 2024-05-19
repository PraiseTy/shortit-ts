import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../types/errors';
import logger from '../logger';
import { HTTP_ERRORS } from '../utils';

// eslint-disable-next-line consistent-return, @typescript-eslint/no-unused-vars
export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof CustomError) {
    return res.status(error.statusCode).json({ errors: error.serializeErrors() });
  }

  logger.error(error.message);
  res.status(HTTP_ERRORS.INTERNAL_SERVER_ERROR).json({ errors: [{ message: 'Something went wrong' }] });
  // next();
};
