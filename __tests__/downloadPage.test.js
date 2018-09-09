import os from 'os';
import fs from 'fs';
import path from 'path';
import nock from 'nock';
// import httpAdapter from 'axios/lib/adapters/http';
import downloadPage from '../src';
/*
axios.defaults.adapter = httpAdapter;
const host = 'http://localhost';
const status = 200;
*/
nock.disableNetConnect();

describe('Test function', () => {
  it('Download page and create html-file', async () => {
    const host = 'http://hexlet.io';
    const status = 200;
    const body = 'hello, world';
    nock(host).get('/courses').reply(status, body);
    const tempDir = os.tmpdir();
    // const pathFile = `${tempDir}/hexlet-io-courses.html`;
    const response = await downloadPage('http://hexlet.io/courses', tempDir);
    expect(response.status).toBe(status);
    expect(response.data).toBe(body);
    // const dataFile = await fs.promises.readFile(pathFile, 'utf8');
    // expect(response.data).toBe(dataFile);
  });
  it('Download src-files and change html-file', async () => {
    const host = 'http://ru.hexlet.io';
    const status = 200;
    const tempDir = os.tmpdir();
    const body = [
      '<html><head></head><body><div>',
      '<img src="/courses/assets/application1.png" />',
      '<link href="http://google.com/courses/assets/application3.css" sizes="96x96">',
      '<img src="/learning/assets/application5.png">',
      '</div><div>',
      '<img src="http://jkiot.io/courses/assets/application2.png" />',
      '<link href="/courses/assets/application4.css" sizes="128x128">',
      '<script src="/courses/assets/application6.js">',
      '</div></body></html>'].join('');
    /*
    const bodyLocalLinks = [
      '<html><head></head><body><div>',
      `<img src="${tempDir}ru-hexlet-io_files/courses-assets-application1.png" />`,
      '<link href="http://google.com/courses/assets/application3.css" sizes="96x96">',
      `<script src="${tempDir}ru-hexlet-io_files/learning-assets-application5.js">`,
      '</div><div>',
      '<img src="http://jkiot.io/courses/assets/application2.png" />',
      `<link href="${tempDir}ru-hexlet-io_files/courses-assets-application4.css" sizes="128x128">`,
      `<script src="${tempDir}ru-hexlet-io_files/courses-assets-application6.js">`,
      '</div></body></html>'].join('');
    */
    nock(host).get('/courses').reply(status, body);
    nock(host).get('/courses/assets/application1.png').reply(status, 'hello, world');
    nock(host).get('/learning/assets/application5.png').reply(status, 'hello, world');
    nock(host).get('/courses/assets/application4.css').reply(status, 'hello, world');
    nock(host).get('/courses/assets/application6.js').reply(status, 'hello, world');
    nock('http://google.com').get('/courses/assets/application3.css').reply(status, 'hello, world');
    nock('http://jkiot.io').get('/courses/assets/application2.png').reply(status, 'hello, world');
    // const pathFile = `${tempDir}/ru-hexlet-io-courses.html`;
    const response = await downloadPage('http://ru.hexlet.io/courses', tempDir);
    expect(response.status).toBe(status);
    expect(response.data).toBe(body);
    // const dataFile = await fs.promises.readFile(pathFile, 'utf8');
    // expect(response.data).toBe(dataFile);
    // expect(response.data).toBe(dataFile); //проверка на измененный файл
  });
  it('Download Pictures', async () => {
    const pathPicture = path.resolve(__dirname, '___fixtures___/pictureTest.png');
    const picture = await fs.promises.readFile(pathPicture);
    const host = 'http://ru.hexlet.io';
    const status = 200;
    nock(host).get('/assets/imgs/logo.png').reply(status, picture);
    expect(1).toBe(1); // to be c
  });
});
