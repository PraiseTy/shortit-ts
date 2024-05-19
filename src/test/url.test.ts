import { TestFactory } from './factory';
import { HTTP_ERRORS } from '../utils';

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
      expect(response.status).toBe(HTTP_ERRORS.OK);
      expect(response.body).toEqual([]);
    });

    it('should return an array of urls', async () => {
      const res1 = await factory.app.post('/shorten').send({ url: 'https://www.google.com' });
      expect(res1.status).toBe(HTTP_ERRORS.CREATED);

      const response = await factory.app.get('/urls');
      expect(response.status).toBe(HTTP_ERRORS.OK);
      expect(response.body.length).toBe(1);
      expect(response.body[0].originalUrl).toBe('https://www.google.com');
    });
  });

  describe('POST /urls', () => {
    const factory: TestFactory = new TestFactory();

    beforeEach((done) => {
      factory.init().then(done);
    });

    afterEach((done) => {
      factory.close().then(done);
    });

    it('should save url and return a new shortened url', async () => {
      const response = await factory.app
        .post('/shorten')
        .send({ url: 'https://www.mail.google.com/mail/u/0/#inbox/FMfcgzGxTNvvQTsMtWlbcjkNvlmPkjnH' });

      expect(response.status).toBe(HTTP_ERRORS.CREATED);
      expect(response.body.message).toBe('Url shortened successfully');
      expect(response.body.data).toHaveProperty('shortUrl');
    });

    it('should return an error if the request body is invalid', async () => {
      const res1 = await factory.app.post('/shorten').send({});
      expect(res1.status).toBe(HTTP_ERRORS.BAD_REQUEST);
    });

    it('should return the right message if original url already exists', async () => {
      const res1 = await factory.app
        .post('/shorten')
        .send({ url: 'https://www.google.com/search?q=google+url+shortener' });
      expect(res1.status).toBe(HTTP_ERRORS.CREATED);

      const res2 = await factory.app
        .post('/shorten')
        .send({ url: 'https://www.google.com/search?q=google+url+shortener' });
      expect(res2.status).toBe(HTTP_ERRORS.BAD_REQUEST);
    });

    it('should return an error if custom name already exists', async () => {
      const res1 = await factory.app
        .post('/shorten')
        .send({ url: 'https://www.youtube.com/watch?v=xZLKALpvdBE', customName: 'praise' });
      expect(res1.status).toBe(HTTP_ERRORS.CREATED);

      const res2 = await factory.app
        .post('/shorten')
        .send({ url: 'https://www.youtube.com/watch22?v=xZLKALpvdBE', customName: 'praise' });
      expect(res2.status).toBe(HTTP_ERRORS.BAD_REQUEST);
    });
  });

  describe('GET /urls/:id', () => {
    const factory: TestFactory = new TestFactory();

    beforeEach((done) => {
      factory.init().then(done);
    });

    afterEach((done) => {
      factory.close().then(done);
    });

    it('should return a single url', async () => {
      const res1 = await factory.app.post('/shorten').send({ url: 'https://www.youtube.com/watchme?v=xZLKALpvdBE' });
      expect(res1.status).toBe(HTTP_ERRORS.CREATED);

      const urlId = res1.body.data.id;
      const res2 = await factory.app.get(`/urls/${urlId}`);

      expect(res2.status).toBe(HTTP_ERRORS.OK);
      expect(res2.body.originalUrl).toBe('https://www.youtube.com/watchme?v=xZLKALpvdBE');
      expect(res2.body).toHaveProperty('shortUrl');
    });

    it('should return an error if the url does not exist', async () => {
      const nonExistentId = '609c6a0f0ac8cd1e58fd6d87';
      const response = await factory.app.get(`/urls/${nonExistentId}`);
      expect(response.status).toBe(HTTP_ERRORS.NOT_FOUND);
    });
  });

  describe('PUT /urls/:id', () => {
    const factory: TestFactory = new TestFactory();

    beforeEach((done) => {
      factory.init().then(done);
    });

    afterEach((done) => {
      factory.close().then(done);
    });

    it('should update a single url', async () => {
      const resp = await factory.app.post('/shorten').send({ url: 'https://www.madeupwebsitefortest.com' });
      expect(resp.status).toBe(HTTP_ERRORS.CREATED);

      const urlId = resp.body.data.id;
      const res1 = await factory.app
        .put(`/urls/${urlId}`)
        .send({ url: 'https://gist.github.com/a3ae20d4747b7775f008071aa6587e90' });
      expect(res1.status).toBe(HTTP_ERRORS.OK);
      expect(res1.body.message).toBe('Url updated successfully');
      expect(res1.body.data.originalUrl).toBe('https://gist.github.com/a3ae20d4747b7775f008071aa6587e90');
    });

    it('should return an error if the url id does not exist', async () => {
      const nonExistentId = '609c6a0f0ac8cd1e58fd6d87';
      const response = await factory.app
        .put(`/urls/${nonExistentId}`)
        .send({ url: 'https://www.boredbutton.com/lorem/ipsum/dolor/sit/amet' });
      expect(response.status).toBe(HTTP_ERRORS.NOT_FOUND);
    });

    it('should return an error if the request body is invalid', async () => {
      const res1 = await factory.app
        .post('/shorten')
        .send({ url: 'https://www.testwebsite.com/lorem/ipsum/dolor/sit/amet', customName: 'why not' });
      expect(res1.status).toBe(HTTP_ERRORS.CREATED);

      const urlId = res1.body.data.id;
      const res2 = await factory.app.put(`/urls/${urlId}`).send({});
      expect(res2.status).toBe(HTTP_ERRORS.BAD_REQUEST);
    });

    it('should return an error if the custom name already exists', async () => {
      const resp = await factory.app
        .post('/shorten')
        .send({ url: 'https://www.madeupwebsitefortesting.com', customName: 'fast times' });
      expect(resp.status).toBe(HTTP_ERRORS.CREATED);

      const urlId = resp.body.data.id;
      const res2 = await factory.app
        .put(`/urls/${urlId}`)
        .send({ url: 'https://www.madeupwebsitefortestingtimestwo.com', customName: 'fast times' });
      expect(res2.status).toBe(HTTP_ERRORS.BAD_REQUEST);
    });
  });

  describe('DELETE /urls/:id', () => {
    const factory: TestFactory = new TestFactory();

    beforeEach((done) => {
      factory.init().then(done);
    });

    afterEach((done) => {
      factory.close().then(done);
    });

    it('should delete a single url', async () => {
      const res1 = await factory.app.post('/shorten').send({ url: 'https://www.youtube.com/watch/spicegirls/' });
      expect(res1.status).toBe(HTTP_ERRORS.CREATED);

      const urlId = res1.body.data.id;
      const res2 = await factory.app.delete(`/urls/${urlId}`);
      expect(res2.status).toBe(HTTP_ERRORS.OK);
      expect(res2.body.message).toBe('Url deleted successfully');
      expect(res2.body.data.originalUrl).toBe('https://www.youtube.com/watch/spicegirls/');
    });
    it('should return an error if the url id does not exist', async () => {
      const nonExistentId = '609c6a0f0ac8cd1e58fd6d87';
      const res1 = await factory.app.delete(`/urls/${nonExistentId}`);
      expect(res1.status).toBe(HTTP_ERRORS.NOT_FOUND);
    });

    it('should return an error if the url id is invalid', async () => {
      const invalidId = '609c6a0f0ac8cd1e58fd6d87ddddd';
      const res1 = await factory.app.delete(`/urls/${invalidId}`);
      expect(res1.status).toBe(HTTP_ERRORS.BAD_REQUEST);
    });
  });
});
