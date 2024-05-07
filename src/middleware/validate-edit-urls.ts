import { body } from 'express-validator';

const validateEditUrl = [
  body('url')
    .optional()
    .isURL({ protocols: ['http', 'https'], require_tld: true, require_protocol: false })
    .withMessage('Invalid URL Format'),

  body('customName')
    .optional()
    .isLength({ min: 5 })
    .withMessage('Custom name must be at least five letters')
];

export default validateEditUrl;
