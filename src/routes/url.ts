import express from 'express';
import { createShortUrls, getAllUrls, getUrl } from '../controllers/url';
import { validateUrl, validateId, validateRequest } from '../middleware/validate-url';

const router = express.Router();

router.post('/shorten', validateUrl, validateRequest, createShortUrls);
router.get('/urls', getAllUrls);
router.get('/urls/:id', validateId, validateRequest, getUrl);

export default router;
