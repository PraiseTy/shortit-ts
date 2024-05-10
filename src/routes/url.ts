import express, { NextFunction, RequestHandler, Request, Response } from 'express';
import { createShortUrls, getAllUrls, getUrl, editUrl, deleteUrl } from '../controllers/url';
import { validateUrl, validateId, validateRequest } from '../middleware/validate-url';
import validateEditUrl from '../middleware/validate-edit-urls';

const router = express.Router();

const asyncMiddleware = (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post('/shorten', validateUrl, validateRequest, asyncMiddleware(createShortUrls));
router.get('/urls', getAllUrls);
router.get('/urls/:id', validateId, validateRequest, asyncMiddleware(getUrl));
router.put('/urls/:id', validateId, validateEditUrl, validateRequest, asyncMiddleware(editUrl));
router.delete('/urls/:id', validateId, validateRequest, asyncMiddleware(deleteUrl));

export default router;
