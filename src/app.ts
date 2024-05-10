import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import connectDb from './db/connect';
import urlRouter from './routes/url';
import logger from './logger/index';
import { errorHandler } from './middleware/error-handler';
import { NotFoundError } from './types/errors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded());

app.use('/api/v1/', urlRouter);

app.get('/', (_: Request, res: Response) => {
  res.json({ msg: 'Initial Commit' });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.all('*', (req: Request, res: Response) => {
  throw new NotFoundError('Route not found');
});

app.use(errorHandler);

const start = async () => {
  try {
    await connectDb(process.env.MONGO_URI || '');
    app.listen(port, () => logger.info(`Server is listening on port ${port}...`));
  } catch (error) {
    logger.error(error);
  }
};

start();
