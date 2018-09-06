import os from 'os';
import fs from 'fs';
import nock from 'nock';
import downloadPage from '../src';

nock.disableNetConnect();

describe('Test function', () => {
  it('Download page and create html-file', async () => {
    const host = 'http://hexlet.io';
    const status = 200;
    const body = 'hello, world';
    nock(host).get('/courses').reply(status, body);
    const tempDir = os.tmpdir();
    const pathFile = `${tempDir}/hexlet-io-courses.html`;
    const response = await downloadPage('http://hexlet.io/courses', tempDir);
    expect(response.status).toBe(status);
    expect(response.data).toBe(body);
    const dataFile = await fs.promises.readFile(pathFile, 'utf8');
    expect(response.data).toBe(dataFile);
  });
  it('Download src-files and change html-file', async () => {
    const host = 'http://ru.hexlet.io';
    const status = 200;
    const body = [
      '<html><head></head><body><div>',
      '<img src="http://ru.hexlet.io/courses/assets/application1.css" />',
      '<link href="http://ru.hexlet.io/courses/assets/application3.css" sizes="96x96">',
      '<img src="http://google.com/learning/assets/application5.css">',
      '</div><div>',
      '<img src="http://ru.hexlet.io/courses/assets/application2.css" />',
      '<link href="http://ru.hexlet.io/courses/assets/application4.css" sizes="128x128">',
      '<script src="http://ru.hexlet.io/courses/assets/application6.css">',
      '</div></body></html>'].join('');
    const bodyLocalLinks = [
      '<html><head></head><body><div>',
      '<img src="ru-hexlet-io_files/courses-assets-application1.css" />',
      '<link href="ru-hexlet-io_files/courses-assets-application3.css" sizes="96x96">',
      '<img src="google-com_files/learning-assets-application5.css">',
      '</div><div>',
      '<img src="ru-hexlet-io_files/courses-assets-application2.css" />',
      '<link href="ru-hexlet-io_files/courses-assets-application4.css" sizes="128x128">',
      '<script src="ru-hexlet-io_files/courses-assets-application6.css">',
      '</div></body></html>'].join('');
    nock(host).get('/courses').reply(status, body);

    nock(host).get('/courses/assets/application1.css').reply(status, 'hello, world');
    nock(host).get('/courses/assets/application3.css').reply(status, 'hello, world');
    nock('http://google.com').get('/learning/assets/application5.css').reply(status, 'hello, world');
    nock(host).get('/courses/assets/application2.css').reply(status, 'hello, world');
    nock(host).get('/courses/assets/application4.css').reply(status, 'hello, world');
    nock(host).get('/courses/assets/application6.css').reply(status, 'hello, world');

    const tempDir = os.tmpdir();
    const pathFile = `${tempDir}/ru-hexlet-io-courses.html`;
    const response = await downloadPage('http://ru.hexlet.io/courses', tempDir);
    expect(response.status).toBe(status);
    expect(response.data).toBe(body);
    const dataFile = await fs.promises.readFile(pathFile, 'utf8');
    expect(response.data).toBe(dataFile);
    // expect(response.data).toBe(dataFile); //проверка на измененный файл
  });
});
