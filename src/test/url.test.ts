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

    it('should return an empty array of urls', async () => {
      const response = await factory.app.get('/urls');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return an array of urls', async () => {
      const res1 = await factory.app.post('/shorten').send({ url: 'https://www.google.com' });
      expect(res1.status).toBe(201);
      const response = await factory.app.get('/urls');
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].originalUrl).toBe('https://www.google.com');
    });
  });

  describe('POST /urls', () => {
    it.todo('should save url and return a new shortened url');
    it.todo('should return an error if the request body is invalid');
    it.todo('should return the right message if original url already exists');
    it.todo('should return an error if custom name already exists');
  });

  describe('GET /urls/:id', () => {
    it.todo('should return a single url');
    it.todo('should return an error if the url does not exist');
  });

  describe('PUT /urls/:id', () => {
    it.todo('should update a single url');
    it.todo('should return an error if the url id does not exist');
    it.todo('should return an error if the request body is invalid');
    it.todo('should return an error if the custom name already exists');
  });

  describe('DELETE /urls/:id', () => {
    it.todo('should delete a single url');
    it.todo('should return an error if the url id does not exist');
    it.todo('should return an error if the url id is invalid');
  });
});
