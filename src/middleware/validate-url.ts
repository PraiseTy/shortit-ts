import { body, validationResult, param } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { HTTP_ERRORS } from '../utils';

const validateUrl = [
  body('url')
    .notEmpty()
    .withMessage('Original Url is required')
    .isURL({ protocols: ['http', 'https'], require_tld: true, require_protocol: false })
    .withMessage('Invalid URL Format'),

  body('customName')
    .isLength({ min: 5 })
    .withMessage('Custom name must be at least five letters')
    .optional()
];

const validateId = param('id').isMongoId().withMessage('Url Id must be a valid MongoDB Id');

const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HTTP_ERRORS.BAD_REQUEST).json({ errors: errors.array() });
  }
  return next();
};

export { validateUrl, validateId, validateRequest };
