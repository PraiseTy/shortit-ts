import winston from 'winston';
import path from 'node:path';
import chalk from 'chalk';

interface ChalkMethods {
  (text: string): string;
}

const logDirectory = path.join((process.cwd(), 'logs'));

interface Colours {
  [key: string]: ChalkMethods;
}

const colors: Colours = {
  info: chalk.green,
  error: chalk.red,
  warn: chalk.yellow,
  debug: chalk.cyan
};

const logFormat = winston.format.printf(({ level, message, timestamp }) => {
  const coloredLevel = colors[level.toLowerCase()](level.toUpperCase());
  return `${timestamp} ${coloredLevel}: ${message}`;
});
const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(winston.format.timestamp(), logFormat),

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
