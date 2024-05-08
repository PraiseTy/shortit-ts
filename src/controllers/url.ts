import { Request, Response } from 'express';
import Url from '../models/url';
import { BASE_URL, HTTP_ERRORS, generateShortId } from '../utils';
import logger from '../logger/index';
import { NotFoundError } from '../types/errors';

const createShortUrls = async (req: Request, res: Response) => {
  try {
    const { url, customName } = req.body;

    const existingLongUrl = await Url.findOne({
      $or: [{ originalUrl: url }, { customName }]
    });

    if (existingLongUrl && existingLongUrl.originalUrl === url) {
      return res
        .status(HTTP_ERRORS.BAD_REQUEST)
        .json({ message: 'Shortened url already exists', shortUrl: existingLongUrl.shortUrl });
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
      .json({ message: 'Url shortened successfully', data: { shortUrl: shortUrls } });
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
  const { id } = req.params;
  const url = await Url.findById(id);
  if (!url) {
    throw new NotFoundError('Url not found');
  }
  return res.status(HTTP_ERRORS.OK).json(url);
};

const editUrl = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { customName, url } = req.body;
    let shortUrls;
    const filter = { _id: id };

    if (customName) {
      const customNameWithDashes = customName.split(' ').join('-');
      shortUrls = `${BASE_URL}/${customNameWithDashes}`;
    }

    const updateUrls = await Url.findOneAndUpdate(filter, {
      customName,
      shortUrl: shortUrls,
      originalUrl: url
    });

    if (!updateUrls) {
      return res.status(HTTP_ERRORS.BAD_REQUEST).json({ error: 'Url cannot be found by Id' });
    }

    return res.status(HTTP_ERRORS.OK).json({
      message: 'Url updated successfully',
      data: {
        id,
        customName: updateUrls.customName,
        originalUrl: updateUrls.originalUrl,
        shortUrl: updateUrls.shortUrl,
        createdAt: updateUrls.createdAt
      }
    });
  } catch (error) {
    logger.error(`Error occurred while updating url: ${error}`);
    return res
      .status(HTTP_ERRORS.INTERNAL_SERVER_ERROR)
      .json({ error: 'There was a problem updating the url' });
  }
};

const deleteUrl = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const url = await Url.findOneAndDelete({ _id: id });

    if (!url) {
      return res.status(HTTP_ERRORS.BAD_REQUEST).json({ error: 'Url cannot be found with Id' });
    }
    return res.status(HTTP_ERRORS.OK).json({
      message: 'Url deleted successfully',
      data: {
        id,
        customName: url.customName,
        originalUrl: url.originalUrl,
        shortUrl: url.shortUrl,
        createdAt: url.createdAt
      }
    });
  } catch (error) {
    logger.error(`Error occurred while deleting url: ${error}`);
    return res
      .status(HTTP_ERRORS.INTERNAL_SERVER_ERROR)
      .json({ error: 'There was a problem deleting url' });
  }
};

export { createShortUrls, getAllUrls, getUrl, editUrl, deleteUrl };
