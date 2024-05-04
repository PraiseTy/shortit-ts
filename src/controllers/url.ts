import { Request, Response } from 'express';
import Url from '../models/url';
import { BASE_URL, HTTP_ERRORS, generateShortId } from '../utils';
import logger from '../logger/index';

const createShortUrls = async (req: Request, res: Response) => {
  try {
    const { url, customName } = req.body;

    const existingLongUrl = await Url.findOne({
      $or: [{ originalUrl: url }, { customName }]
    });

    if (existingLongUrl && existingLongUrl.originalUrl === url) {
      return res
        .status(HTTP_ERRORS.BAD_REQUEST)
        .json({ message: 'Shortened url already exists', shorturl: existingLongUrl.shortUrl });
    }

    const shortId = generateShortId();
    let shortUrls = `${BASE_URL}/${shortId}`;

    if (customName) {
      const customNameWithDashes = customName.split(' ').join('-');
      shortUrls = `${BASE_URL}/${customNameWithDashes}`;

      if (existingLongUrl && customName === existingLongUrl.customName) {
        return res.status(HTTP_ERRORS.BAD_REQUEST).json({ error: 'Custom name already exists' });
      }
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

const getAllUrls = async (_: Request, res: Response) => {
  try {
    const urls = await Url.find({});
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
