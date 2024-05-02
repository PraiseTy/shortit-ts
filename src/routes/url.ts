import express from 'express';
import { createShortUrls, getAllUrls, getUrl } from '../controllers/url';
import { validateUrl, validateUrlMiddleware } from '../middleware/validate-url';

const router = express.Router();

router.post('/shorten', validateUrl, validateUrlMiddleware, createShortUrls);
router.get('/urls', getAllUrls);
router.get('/urls/:id', getUrl);

export default router;
