/// <reference types="node" />
import winston from 'winston';
import path from 'node:path';

const logDirectory = path.join((process.cwd(), 'logs'));
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: path.join(logDirectory, 'error.log'),
      level: 'error'
    }),
    new winston.transports.File({ filename: path.join(logDirectory, 'combined.log') })
  ]
});

export default logger;
