import os from 'os';
import nock from 'nock';
import downloadPage from '../src';

nock.disableNetConnect();

describe('HttpRequestPromise', () => {
  it('#get', async () => {
    const host = 'http://hexlet.io';
    const status = 200;
    const body = 'hello, world';
    nock(host).get('/courses').reply(status, body);
    const tempDir = os.tmpdir();
    const response = await downloadPage('http://hexlet.io/courses', tempDir);
    expect(response.status).toBe(status);
    expect(response.data).toBe(body);
  });
});
