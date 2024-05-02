import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { HTTP_ERRORS } from '../constant';

const validateUrl = [
  body('url')
    .isURL({ protocols: ['http', 'https'], require_tld: true, require_protocol: false })
    .withMessage('Invalid URL Format')
];

const validateUrlMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HTTP_ERRORS.BAD_REQUEST).json({ errors: errors.array() });
  }
  return next();
};
export { validateUrl, validateUrlMiddleware };
