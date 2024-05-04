import { customAlphabet } from 'nanoid';

const BASE_URL = 'https://short-it';

const HTTP_ERRORS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

const generateShortId = customAlphabet(
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
  5
);

export { BASE_URL, HTTP_ERRORS, generateShortId };
