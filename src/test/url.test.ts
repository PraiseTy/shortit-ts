import { TestFactory } from './factory';

describe('Shortener', () => {
  describe('GET /urls', () => {
    const factory: TestFactory = new TestFactory();

    beforeEach((done) => {
      factory.init().then(done);
    });

    afterEach((done) => {
      factory.close().then(done);
    });

    it.todo('should return an empty array of urls');

    it.todo('should return an array of urls');
  });
});
