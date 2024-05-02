import { Request, Response } from 'express';
import { customAlphabet } from 'nanoid';
import Url from '../models/url';
import { BASE_URL, HTTP_ERRORS } from '../constant';
import logger from '../logger/index';

const createShortUrls = async (req: Request, res: Response) => {
  try {
    const { url, customName } = req.body;
    let shortUrls;
    const generateShortId = customAlphabet(
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
      5
    );

    if (!url) {
      return res.status(HTTP_ERRORS.BAD_REQUEST).json({ error: 'Original Url is required' });
    }
    const existingLongUrl = await Url.findOne({ originalUrl: url });
    if (existingLongUrl) {
      return res
        .status(200)
        .json({ message: 'Shortened url already exists', shorturl: existingLongUrl.shortUrl });
    }

    if (customName) {
      const trimmedName = customName.split(' ').join('');
      if (trimmedName.length < 5) {
        return res
          .status(HTTP_ERRORS.BAD_REQUEST)
          .json({ error: 'Custom name must be at least five letters' });
      }
      const customNamewithDashes = customName.split(' ').join('-');
      shortUrls = `${BASE_URL}/${customNamewithDashes}`;
      const existingCustomName = await Url.findOne({ customName });
      if (existingCustomName) {
        return res.status(HTTP_ERRORS.BAD_REQUEST).json({ error: 'Custom name already exists' });
      }
    } else {
      const shortId = generateShortId();
      shortUrls = `${BASE_URL}/${shortId}`;
    }

    await Url.create({
      originalUrl: url,
      shortUrl: shortUrls,
      customName
    });
    return res
      .status(HTTP_ERRORS.CREATED)
      .json({ message: 'Url shortened successfully', data: { shorturl: shortUrls } });
  } catch (error) {
    logger.error(`Error creating short url: ${error}`);
    return res.status(HTTP_ERRORS.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
  }
};

const getAllUrls = async (req: Request, res: Response) => {
  try {
    const urls = await Url.find({}, { __v: 0 }).lean();
    return res.status(HTTP_ERRORS.OK).json(urls);
  } catch (error) {
    logger.error(`Error retrieving all urls: ${error}`);
    return res
      .status(HTTP_ERRORS.INTERNAL_SERVER_ERROR)
      .json({ 'Error retrieving all urls: ': error });
  }
};

const getUrl = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const url = await Url.findById(id);
    if (!url) {
      return res.status(HTTP_ERRORS.NOT_FOUND).json({ error: 'Url not found' });
    }
    return res.status(HTTP_ERRORS.OK).json(url);
  } catch (error) {
    logger.error(`Error retrieving single url: ${error}`);
    return res
      .status(HTTP_ERRORS.INTERNAL_SERVER_ERROR)
      .json({ 'Error retrieving single url: ': error });
  }
};

export { createShortUrls, getAllUrls, getUrl };
