import { body } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import { BadRequestError } from '../types/errors';

const validateEditUrl = [
  body('url')
    .optional()
    .isURL({ protocols: ['http', 'https'], require_tld: true, require_protocol: false })
    .withMessage('Invalid URL Format'),

  body('customName')
    .optional()
    .isLength({ min: 5 })
    .withMessage('Custom name must be at least five letters'),
];

const validateEditRequest = (req: Request, _: Response, next: NextFunction) => {
  if (req.body && !req.body.customName && !req.body.url) {
    throw new BadRequestError('Request body should not be empty');
  }
  return next();
};

export { validateEditUrl, validateEditRequest };
