import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import logger from '../logging/logger';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded());

app.get('/', (req: Request, res: Response) => {
  res.json({ msg: 'Initial Commit' });
});

const start = () => {
  try {
    app.listen(port, () => logger.info(`Server is listening on port ${port}...`));
  } catch (error) {
    logger.error(error);
  }
};

start();
