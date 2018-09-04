import os from 'os';
import fs from 'fs';
import { promisify } from 'util';
import nock from 'nock';
import downloadPage from '../src';

const readFileAsync = promisify(fs.readFile);

nock.disableNetConnect();

describe('HttpRequestPromise', () => {
  it('#get', async () => {
    const host = 'http://hexlet.io';
    const status = 200;
    const body = 'hello, world';
    nock(host).get('/courses').reply(status, body);
    const tempDir = os.tmpdir();
    const pathFile = `${tempDir}/hexlet-io-courses.html`;
    const response = await downloadPage('http://hexlet.io/courses', tempDir);
    expect(response.status).toBe(status);
    expect(response.data).toBe(body);
    const dataFile = await readFileAsync(pathFile, 'utf8');
    expect(response.data).toBe(dataFile);
  });
});
