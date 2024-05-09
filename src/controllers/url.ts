import { Request, Response } from 'express';
import Url from '../models/url';
import { BASE_URL, HTTP_ERRORS, generateShortId } from '../utils';
import { BadRequestError, NotFoundError } from '../types/errors';

const createShortUrls = async (req: Request, res: Response) => {
  const { url, customName } = req.body;
  const query = customName ? { $or: [{ originalUrl: url }, { customName }] } : { originalUrl: url };

  const existingLongUrl = await Url.findOne(query);

  if (existingLongUrl && existingLongUrl.originalUrl === url) {
    throw new BadRequestError(`Shortened url already exists: ${existingLongUrl.shortUrl}`);
  }

  const shortId = generateShortId();
  let shortUrls = `${BASE_URL}/${shortId}`;

  if (customName) {
    const customNameWithDashes = customName.split(' ').join('-');
    shortUrls = `${BASE_URL}/${customNameWithDashes}`;

    if (existingLongUrl && customName === existingLongUrl.customName) {
      throw new BadRequestError('Custom name already exists');
    }
  }

  await Url.create({
    originalUrl: url,
    shortUrl: shortUrls,
    customName
  });
  return res.status(HTTP_ERRORS.CREATED).json({ message: 'Url shortened successfully', data: { shortUrl: shortUrls } });
};

const getAllUrls = async (_: Request, res: Response) => {
  const urls = await Url.find({});
  return res.status(HTTP_ERRORS.OK).json(urls);
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
    throw new NotFoundError('Url cannot be found by Id');
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
};

const deleteUrl = async (req: Request, res: Response) => {
  const { id } = req.params;
  const url = await Url.findOneAndDelete({ _id: id });

  if (!url) {
    throw new NotFoundError('Url cannot be found with Id');
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
};

export { createShortUrls, getAllUrls, getUrl, editUrl, deleteUrl };
