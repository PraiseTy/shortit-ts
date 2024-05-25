import express from 'express';
import supertest from 'supertest';
import mongoose, { Connection } from 'mongoose';
import { Server, createServer } from 'node:http';
import routes from '../routes/url';
import { testDatabaseConfig } from './setup/jest-setup';
import logger from '../logger';
import { errorHandler } from '../middleware/error-handler';

// eslint-disable-next-line max-len
const MONGO_URL = `mongodb://${testDatabaseConfig.user}:${testDatabaseConfig.password}@localhost:${testDatabaseConfig.port}/${testDatabaseConfig.database}?authSource=admin`;

export class TestFactory {
  private _app: express.Application;
  private _connection: Connection;
  private _server: Server;

  public get app(): supertest.SuperTest<supertest.Test> {
    return supertest(this._app) as unknown as supertest.SuperTest<supertest.Test>;
  }

  public async init(): Promise<void> {
    await this.startup();
  }

  public async close(): Promise<void> {
    await this._connection.close();
    this._server.close();
  }

  private async startup() {
    try {
      const connection = await mongoose.connect(MONGO_URL);
      this._connection = connection.connection;
      this._app = express();
      this._app.use(express.json());
      this._app.use(express.urlencoded({ extended: true }));
      this._app.use('/', routes);
      this._app.use(errorHandler);
      this._server = createServer(this._app).listen(3010);
    } catch (error) {
      logger.error(error);
      throw new Error(`Error starting up the server: ${error}`);
    }
  }
}
