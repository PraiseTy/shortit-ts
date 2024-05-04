import express from 'express';
import { createShortUrls, getAllUrls, getUrl, editUrl, deleteUrl } from '../controllers/url';
import { validateUrl, validateId, validateRequest } from '../middleware/validate-url';
import validateEditUrl from '../middleware/validate-edit-urls';

const router = express.Router();

router.post('/shorten', validateUrl, validateRequest, createShortUrls);
router.get('/urls', getAllUrls);
router.get('/urls/:id', validateId, validateRequest, getUrl);
router.put('/urls/:id', validateId, validateEditUrl, validateRequest, editUrl);
router.delete('/urls/:id', validateId, validateRequest, deleteUrl);

export default router;
